/**
 * @fileoverview i6 Token Diagnostics, Inspection & Request Signing Wizard.
 * Runs completely in-browser utilizing Web Crypto API for Ed25519 signing and verification.
 */

// --- Constants & Config ---
export const ENV_URLS = {
    sandbox: "https://userz.sandbox.rs.infinity6.ai",
    staging: "https://userz.staging.rs.infinity6.ai",
    local: "http://localhost:9023",
};

export const GRANTS = {
    System: 1, // 0x01
    Admin:  2, // 0x02
    Write:  4, // 0x04
    Read:   8, // 0x08
    All:   15, // 0x0F
};

export function formatGrants(grantsNum) {
    if (typeof grantsNum !== "number") return "-";
    const labels = [];
    if (grantsNum & GRANTS.System) labels.push("System (1)");
    if (grantsNum & GRANTS.Admin)  labels.push("Admin (2)");
    if (grantsNum & GRANTS.Write)  labels.push("Write (4)");
    if (grantsNum & GRANTS.Read)   labels.push("Read (8)");
    return labels.length > 0 ? labels.join(", ") + ` [0x${grantsNum.toString(16).toUpperCase()}]` : `None (0)`;
}

// --- Base64URL & Hex Encoding Utilities ---
export function base64UrlEncode(bytes) {
    const bytesArray = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    let binary = "";
    const chunkSize = 8192;
    for (let i = 0; i < bytesArray.length; i += chunkSize) {
        binary += String.fromCharCode.apply(null, bytesArray.subarray(i, i + chunkSize));
    }
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function base64UrlDecodeToBytes(b64UrlSafe) {
    let base64 = (b64UrlSafe || "").replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
        base64 += "=";
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

export function base64UrlDecodeText(b64UrlSafe) {
    const bytes = base64UrlDecodeToBytes(b64UrlSafe);
    return new TextDecoder().decode(bytes);
}

export function bytesToHex(bytes) {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

export function hexToBytes(hex) {
    const cleanHex = hex.trim().toLowerCase();
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
    }
    return bytes;
}

export async function sha256Hex(data) {
    const bytes = typeof data === "string" ? new TextEncoder().encode(data) : (data || new Uint8Array(0));
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return bytesToHex(new Uint8Array(digest));
}

// --- Ed25519 Web Crypto Helpers ---
// RFC 8410 PKCS#8 prefix for Ed25519 private keys: 30 2e 02 01 00 30 05 06 03 2b 65 70 04 22 04 20 (16 bytes)
const PKCS8_ED25519_PREFIX = new Uint8Array([
    0x30, 0x2e, 0x02, 0x01, 0x00, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x04, 0x22, 0x04, 0x20
]);

/**
 * Imports an Ed25519 private key from Base64URL string (supports both 64-byte key and 32-byte seed).
 * @param {string} privKeyStr - Base64URL private key
 * @returns {Promise<CryptoKey>}
 */
export async function importEd25519PrivateKey(privKeyStr) {
    const raw = base64UrlDecodeToBytes(privKeyStr.trim());
    if (raw.length !== 32 && raw.length !== 64) {
        throw new Error(`Invalid Ed25519 private key length: expected 32 or 64 bytes, got ${raw.length}`);
    }

    const seed = raw.subarray(0, 32);
    const pkcs8 = new Uint8Array(PKCS8_ED25519_PREFIX.length + 32);
    pkcs8.set(PKCS8_ED25519_PREFIX, 0);
    pkcs8.set(seed, PKCS8_ED25519_PREFIX.length);

    return await crypto.subtle.importKey(
        "pkcs8",
        pkcs8,
        { name: "Ed25519" },
        true,
        ["sign"]
    );
}

/**
 * Extracts and returns the Base64URL public key JTI from a private key.
 * @param {CryptoKey} cryptoPrivateKey
 * @returns {Promise<string>}
 */
export async function getEd25519PublicKeyB64(cryptoPrivateKey) {
    const jwk = await crypto.subtle.exportKey("jwk", cryptoPrivateKey);
    return jwk.x || "";
}

// --- Canonical String & Token Serialization ---

/**
 * Canonicalizes query string according to i6 reqsign specifications.
 * - Strips `i6_sig`
 * - Sorts keys lexicographically
 * - Sorts values for each key
 * - Encodes with url.QueryEscape rules (space as '+')
 * @param {string} query
 * @returns {string}
 */
export function canonicalizeQuery(query) {
    query = (query || "").trim().replace(/^\?/, "");
    if (!query) return "";
    const params = new URLSearchParams(query);
    params.delete("i6_sig");

    const keys = Array.from(new Set(params.keys())).sort();
    const parts = [];
    for (const k of keys) {
        const vals = params.getAll(k).sort();
        const encK = encodeURIComponent(k).replace(/%20/g, "+");
        for (const v of vals) {
            parts.push(encK + "=" + encodeURIComponent(v).replace(/%20/g, "+"));
        }
    }
    return parts.join("&");
}

/**
 * Constructs the canonical HTTP request byte stream for Ed25519 signing.
 * @param {string} method - HTTP method
 * @param {string} path - Request URL path
 * @param {string} query - Query string
 * @param {Uint8Array|string|null} bodyBytes - Request body
 * @param {string} accessToken - Access token string
 * @param {number} exp - Epoch seconds expiration
 * @param {string} nonceHex - 32-char hex nonce
 * @param {boolean} unsignedBody - Flag to omit body hash
 * @returns {Promise<string>}
 */
export async function buildCanonicalString(method, path, query, bodyBytes, accessToken, exp, nonceHex, unsignedBody) {
    if (/[\r\n]/.test(method) || /[\r\n]/.test(path) || /[\r\n]/.test(query)) {
        throw new Error("canonicalization_error: path, method, or query contains illegal newline characters");
    }

    const normMethod = (method || "").trim().toUpperCase();
    if (!normMethod) throw new Error("canonicalization_error: method cannot be empty");

    let normPath = (path || "").trim();
    if (!normPath) normPath = "/";
    else if (normPath.length > 1 && normPath.endsWith("/")) normPath = normPath.slice(0, -1);

    const canonicalQuery = canonicalizeQuery(query);

    let normBodyHash = "";
    if (!unsignedBody) {
        normBodyHash = await sha256Hex(bodyBytes || new Uint8Array(0));
    }

    let tokenHash = "";
    if (accessToken) {
        tokenHash = await sha256Hex(accessToken);
    }

    const expStr = String(exp);
    const normNonce = (nonceHex || "00000000000000000000000000000000").toLowerCase();

    return [normMethod, normPath, canonicalQuery, normBodyHash, tokenHash, expStr, normNonce].join("\n");
}

/**
 * Signs an HTTP request canonical string with an Ed25519 private key and returns the composite wire token.
 * Format: `<envelope_89B_base64url>.<accessToken>`
 * @param {string} privKeyStr - Base64URL Ed25519 private key
 * @param {string} method - HTTP method
 * @param {string} path - URL path
 * @param {string} query - Query string
 * @param {Uint8Array|string|null} bodyBytes - Body content
 * @param {string} accessToken - Bound access token
 * @param {number} exp - Expiration in epoch seconds
 * @param {Uint8Array} nonceBytes - 16-byte nonce
 * @param {boolean} unsignedBody - Unsigned body flag
 * @returns {Promise<{ signatureHeader: string, canonicalString: string, envelopeB64: string }>}
 */
export async function signRequest(privKeyStr, method, path, query, bodyBytes, accessToken, exp, nonceBytes, unsignedBody) {
    const key = await importEd25519PrivateKey(privKeyStr);
    const nonceHex = bytesToHex(nonceBytes || new Uint8Array(16));

    const canonicalStr = await buildCanonicalString(
        method, path, query, bodyBytes, accessToken, exp, nonceHex, unsignedBody
    );

    const sigArrayBuffer = await crypto.subtle.sign("Ed25519", key, new TextEncoder().encode(canonicalStr));
    const sigBytes = new Uint8Array(sigArrayBuffer);

    // Fixed 89-byte envelope
    const buf = new Uint8Array(89);
    buf[0] = unsignedBody ? (2 | 0x80) : 2; // TypeSigEnvelope (2) | FlagUnsignedBody
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    view.setBigUint64(1, BigInt(exp), false); // BigEndian uint64
    buf.set(nonceBytes || new Uint8Array(16), 9);
    buf.set(sigBytes, 25);

    const envB64 = base64UrlEncode(buf);
    const signatureHeader = accessToken ? `${envB64}.${accessToken}` : envB64;

    return { signatureHeader, canonicalString: canonicalStr, envelopeB64: envB64 };
}

// --- Local Token Inspection & Diagnostics ---

/**
 * Recursively inspects and describes any i6 token locally without contacting any server.
 * @param {string} rawToken - Any input token string
 * @returns {Object} Described token structure
 */
export function describeToken(rawToken) {
    const str = (rawToken || "").trim();
    if (!str) {
        return { kind: "empty", checkable: false, summary: "Empty token input" };
    }

    const parts = str.split(".");

    // Case 1: Standard 3-part User JWT
    if (parts.length === 3) {
        try {
            const header = JSON.parse(base64UrlDecodeText(parts[0]));
            const payload = JSON.parse(base64UrlDecodeText(parts[1]));
            const expSec = typeof payload.exp === "number" ? payload.exp : null;
            const expMs = expSec ? (expSec > 1e11 ? expSec : expSec * 1000) : null;
            const isExpired = expMs ? Date.now() >= expMs : null;
            const timeRemainingSec = expMs ? Math.round((expMs - Date.now()) / 1000) : null;

            return {
                kind: "user_jwt",
                checkable: true,
                summary: `User Access Token JWT (${payload.email || payload.sub || payload.user_id || "authenticated"})`,
                header,
                payload,
                userId: payload.user_id || payload.sub || "",
                audience: payload.aud || "",
                expiresAt: expMs,
                isExpired,
                timeRemainingSeconds: timeRemainingSec,
                raw: str
            };
        } catch (_) {
            // Not a JSON JWT, continue checking
        }
    }

    // Case 2: Request Signature Composite Token (<envelope_89B>.<access_token>)
    if (parts.length >= 2) {
        try {
            const envBytes = base64UrlDecodeToBytes(parts[0]);
            if (envBytes.length === 89 && (envBytes[0] & 0x0f) === 2) {
                const view = new DataView(envBytes.buffer, envBytes.byteOffset, envBytes.byteLength);
                const exp = Number(view.getBigUint64(1, false));
                const nonce = envBytes.slice(9, 25);
                const sig = envBytes.slice(25, 89);
                const embeddedTokenStr = parts.slice(1).join(".");
                const isTimeWindowed = nonce.every(b => b === 0);
                const expMs = exp * 1000;
                const isExpired = Date.now() >= expMs;
                const timeRemainingSec = Math.round((expMs - Date.now()) / 1000);

                return {
                    kind: "request_signature",
                    checkable: true,
                    summary: `Request Signature (Type 2 Envelope + Embedded Token)`,
                    envelope: {
                        tokenType: 2,
                        unsignedBody: (envBytes[0] & 0x80) !== 0,
                        exp,
                        expDate: new Date(expMs).toISOString(),
                        isExpired,
                        timeRemainingSeconds: timeRemainingSec,
                        nonceHex: bytesToHex(nonce),
                        isTimeWindowed,
                        signatureHex: bytesToHex(sig)
                    },
                    embeddedTokenRaw: embeddedTokenStr,
                    embeddedToken: describeToken(embeddedTokenStr),
                    raw: str
                };
            }
        } catch (_) {
            // Not envelope, continue
        }
    }

    // Case 3: Single-part tokens (Refresh Assertion or Dataset Access Token)
    if (parts.length === 1) {
        try {
            const bytes = base64UrlDecodeToBytes(str);
            const tokType = bytes[0] & 0x0f;

            // 121 bytes = Standalone Refresh Assertion
            if (bytes.length === 121 && tokType === 3) {
                const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
                const exp = Number(view.getBigUint64(1, false));
                const nonce = bytes.slice(9, 25);
                const pubKey = bytes.slice(25, 57);
                const sig = bytes.slice(57, 121);
                const isTimeWindowed = nonce.every(b => b === 0);
                const expMs = exp * 1000;
                const isExpired = Date.now() >= expMs;
                const timeRemainingSec = Math.round((expMs - Date.now()) / 1000);

                return {
                    kind: "refresh_assertion",
                    checkable: false,
                    summary: "Standalone Dataset Refresh Assertion (Type 3)",
                    assertion: {
                        tokenType: 3,
                        unsignedBody: (bytes[0] & 0x80) !== 0,
                        exp,
                        expDate: new Date(expMs).toISOString(),
                        isExpired,
                        timeRemainingSeconds: timeRemainingSec,
                        nonceHex: bytesToHex(nonce),
                        isTimeWindowed,
                        pubKeyHex: bytesToHex(pubKey),
                        pubKeyB64: base64UrlEncode(pubKey),
                        signatureHex: bytesToHex(sig)
                    },
                    raw: str
                };
            }

            // Type 1 = Binary Dataset Access Token
            if (tokType === 1) {
                return {
                    kind: "dataset_access_token",
                    checkable: true,
                    summary: `Binary Dataset Access Token (Type 1, ${bytes.length} bytes)`,
                    byteLength: bytes.length,
                    typeByte: bytes[0],
                    raw: str
                };
            }
        } catch (_) {
            // Not base64
        }
    }

    return {
        kind: "unknown",
        checkable: false,
        summary: `Unrecognized credential format (${str.length} characters)`,
        raw: str
    };
}

// --- Server API Endpoints ---

/**
 * Sends a diagnostic check request to /api/userz/token/check
 * @param {string} userzUrl - Base URL of userz
 * @param {Object} req - Check request payload
 * @returns {Promise<Object>} Diagnostic result
 */
export async function checkToken(userzUrl, req) {
    const url = `${userzUrl.replace(/\/$/, "")}/api/userz/token/check`;
    const resp = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(req)
    });
    const data = await resp.json();
    return { ok: resp.ok, status: resp.status, data };
}

/**
 * Generates an RFC 7636 PKCE code verifier and S256 code challenge.
 * @returns {Promise<{ codeVerifier: string, codeChallenge: string }>}
 */
export async function generatePKCE() {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    const array = new Uint8Array(64);
    crypto.getRandomValues(array);
    let codeVerifier = "";
    for (let i = 0; i < array.length; i++) {
        codeVerifier += charset[array[i] % charset.length];
    }
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier));
    const codeChallenge = base64UrlEncode(new Uint8Array(digest));
    return { codeVerifier, codeChallenge };
}

/**
 * Performs password sign-in and code exchange directly in-page without redirects.
 * @param {string} userzUrl
 * @param {string} email
 * @param {string} password
 * @param {string} [app="default"]
 * @returns {Promise<Object>} Exchanged user token
 */
export async function loginPasswordPKCE(userzUrl, email, password, app = "default") {
    const { codeVerifier, codeChallenge } = await generatePKCE();

    // 1. Signin with password
    const signinUrl = `${userzUrl.replace(/\/$/, "")}/api/userz/auth/signin/password`;
    const signinResp = await fetch(signinUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email,
            password,
            code_challenge: codeChallenge,
            app
        })
    });

    if (!signinResp.ok) {
        const errText = await signinResp.text();
        throw new Error(`Sign-in failed (${signinResp.status}): ${errText}`);
    }
    const signinData = await signinResp.json();
    const code = signinData.code;

    // 2. Exchange code for user tokens
    const exchangeUrl = `${userzUrl.replace(/\/$/, "")}/api/userz/auth/exchange`;
    const exchangeResp = await fetch(exchangeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            code,
            code_verifier: codeVerifier
        })
    });

    if (!exchangeResp.ok) {
        const errText = await exchangeResp.text();
        throw new Error(`Token exchange failed (${exchangeResp.status}): ${errText}`);
    }

    return await exchangeResp.json();
}

/**
 * Creates a long-lived machine dataset refresh token and keypair via POST /api/userz/dataset-refresh-token/{dataset}
 * @param {string} userzUrl
 * @param {string} userAccessToken
 * @param {string} dataset
 * @param {Object} [options]
 * @returns {Promise<Object>} Refresh token details with priv_key
 */
export async function createDatasetRefreshToken(userzUrl, userAccessToken, dataset, options = {}) {
    const url = `${userzUrl.replace(/\/$/, "")}/api/userz/dataset-refresh-token/${encodeURIComponent(dataset)}`;
    const resp = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userAccessToken}`
        },
        body: JSON.stringify({
            solution: options.solution || "",
            grants: typeof options.grants === "number" ? options.grants : GRANTS.All,
            labels: options.labels || {},
            exp_seconds: options.expSeconds || 3153600000, // 100 years
            annotation: options.annotation || "Tokens Diagnostic Wizard Keypair"
        })
    });

    if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Create refresh token failed (${resp.status}): ${errText}`);
    }
    return await resp.json();
}

/**
 * Mints a short-lived dataset access token via POST /api/userz/dataset-access-token/{dataset}
 * @param {string} userzUrl
 * @param {string} userAccessToken
 * @param {string} dataset
 * @param {Object} [options]
 * @returns {Promise<Object>} Minted dataset access token
 */
export async function createDatasetAccessToken(userzUrl, userAccessToken, dataset, options = {}) {
    const url = `${userzUrl.replace(/\/$/, "")}/api/userz/dataset-access-token/${encodeURIComponent(dataset)}`;
    const resp = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userAccessToken}`
        },
        body: JSON.stringify({
            solution: options.solution || "",
            grants: typeof options.grants === "number" ? options.grants : GRANTS.All,
            labels: options.labels || {},
            client_pub_key: options.clientPubKey || "",
            exp_seconds: options.expSeconds || 3600
        })
    });

    if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Mint dataset access token failed (${resp.status}): ${errText}`);
    }
    return await resp.json();
}
