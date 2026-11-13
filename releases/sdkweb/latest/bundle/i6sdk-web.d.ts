/**
 * @fileoverview Authentication client using i6userz PKCE redirect flow.
 *
 * Flow Architecture:
 * 1. Login Initiation: {@link Auth#login} generates an RFC 7636 PKCE code verifier and S256 code
 *    challenge, persists `code_verifier` in sessionStorage, appends the target application URL (`callback`)
 *    as a query parameter to `config.userExchangeCallbackUrl`, and redirects the browser to `GET /api/userz/auth`.
 * 2. Identity Provider Authentication: The user signs in via Google or Email/Password on the i6userz UI.
 * 3. Authorization Code Redirect: i6userz redirects the browser to the intermediate exchange URL
 *    (`config.userExchangeCallbackUrl`) with a short-lived authorization `code` appended.
 * 4. Token Exchange: The exchange callback page invokes {@link Auth#handleCallback}, which retrieves
 *    the `code_verifier` from sessionStorage, calls the Tokens service to exchange them via `POST /api/userz/auth/exchange`
 *    for active tokens (access token JWT, refresh token, user ID, expiration), persists them, and redirects the browser
 *    to the original application URL.
 * 5. Profile Retrieval: {@link Auth#user} fetches user identity metadata via `GET /api/userz/auth/me`
 *    using Bearer token authentication.
 */
export type Services = import("../services/services.js").Services;
export type UserToken = import("../tokens/tokens.js").UserToken;
export type AuthPayload = {
    /**
     * - Authenticated user unique identifier UUID.
     */
    user_id: string;
    /**
     * - Redacted email address for display (e.g. "u***@infinity6.ai").
     */
    email_redacted?: string;
    /**
     * - List of linked identity providers (e.g. ["google", "password"]).
     */
    providers?: string[];
    /**
     * - Account creation timestamp in epoch milliseconds.
     */
    created_at?: number;
    /**
     * - User ID (legacy alias for user_id).
     */
    sub?: string;
    /**
     * - User display name (legacy alias).
     */
    display?: string;
    /**
     * - User email address (legacy alias).
     */
    email?: string;
};
/**
 * Authentication client for handling browser redirects, PKCE, and user profile retrieval with i6userz.
 * Configuration (callbackUrl, userExchangeCallbackUrl, app) is read directly from `i6sdk.config()`.
 */
declare class Auth {
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs an Auth client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * Retrieves the base URL for the i6userz authentication service from SDK configuration.
     * Resolution precedence:
     * 1. `config.servUrls["userz"]`
     * 2. `config.userzUrl`
     * 3. `config.baseUrl`
     * 4. Empty string fallback
     * @private
     * @returns {string} The base URL for userz.
     */
    private _getUserzUrl;
    /**
     * Resolves the session storage adapter for transient auth data (e.g. PKCE code verifier).
     * Checks SDK configuration for a custom session storage adapter or factory function,
     * falling back to the browser's global `sessionStorage`.
     * @private
     * @returns {import("../index.js").I6Storage|null} The active session storage adapter or null if unavailable.
     */
    private _getSessionStorage;
    /**
     * Navigates the browser window to a target URL.
     * @private
     * @param {string} url - Target URL.
     * @returns {void}
     */
    private _navigate;
    /**
     * Redirects the browser location to a callback URL.
     * @private
     * @param {string} url - Target redirect URL.
     * @returns {void}
     */
    private _redirect;
    /**
     * Validates whether a redirect URL is safe to prevent open redirect vulnerabilities.
     * A URL is considered safe if:
     * 1. It is a relative path starting with '/' (but not '//' or '/\\').
     * 2. It is an absolute URL whose origin matches window.location.origin or configured callback URLs.
     * @private
     * @param {string} url - The URL to validate.
     * @returns {boolean} True if the redirect target is safe, false otherwise.
     */
    private _isSafeRedirect;
    /**
     * Generates a cryptographically random standard PKCE code verifier (RFC 7636 §4.1).
     * Uses unreserved URL characters (`[A-Z]`, `[a-z]`, `[0-9]`, `-`, `.`, `_`, `~`).
     * @private
     * @param {number} [length=64] - The length of the code verifier (between 43 and 128 characters).
     * @returns {string} The generated code verifier string.
     */
    private _generateCodeVerifier;
    /**
     * Generates an RFC 7636 S256 PKCE code challenge from a code verifier.
     * Computes SHA-256 over the ASCII code verifier and base64url-encodes the digest without padding.
     * @private
     * @param {string} verifier - The plaintext code verifier.
     * @returns {Promise<string>} The base64url-encoded code challenge.
     * @throws {Error} If Web Crypto API (`crypto.subtle.digest`) is unavailable.
     */
    private _generateCodeChallenge;
    /**
     * Encodes a byte array as an unpadded base64url string (RFC 4648 §5).
     * Replaces '+' with '-', '/' with '_', and strips trailing '=' padding.
     * @private
     * @param {Uint8Array|ArrayBuffer} bytes - The bytes to encode.
     * @returns {string} The base64url-encoded string.
     * @throws {Error} If no base64 encoder (`btoa` or Node.js `Buffer`) is available.
     */
    private _base64UrlEncode;
    /**
     * Redirects the browser to the i6userz login page (`GET /api/userz/auth`) to initiate the PKCE login flow.
     *
     * Validates that `config.userExchangeCallbackUrl` is configured, clears any existing token,
     * generates a random PKCE `code_verifier` and S256 `code_challenge`, persists the `code_verifier`
     * in session storage only, and redirects the browser with `app`, `redirect`, and `code_challenge`
     * query parameters.
     *
     * @param {string} [callbackUrl] - The final destination URL to return to after login and token exchange complete.
     *   Defaults to `window.location.href`.
     * @returns {Promise<string>} The generated login URL.
     * @throws {string} If `config.userExchangeCallbackUrl` is not defined in the SDK configuration.
     */
    login(callbackUrl?: string): Promise<string>;
    /**
     * Processes the authorization code or checkout artifact ticket present in the URL query string,
     * exchanging it for tokens via the Tokens service, and redirecting to the post-exchange `callback` URL.
     *
     * Validates the CSRF `state` parameter against session storage, and retrieves the PKCE `code_verifier`
     * from session storage. Deletes both from session storage upon processing.
     *
     * Note: This method must be called explicitly by the exchange callback page
     * (configured via `config.userExchangeCallbackUrl`). It is not called automatically by `user()`.
     *
     * @returns {Promise<string|null>} The dataset string if an exchange occurred, or null if it was a noop (no auth/checkout code in URL).
     * @throws {Error} If state mismatch occurs, token exchange fails, or server returns an error.
     */
    handleCallback(): Promise<string | null>;
    /**
     * Retrieves the stored user token credentials from the Tokens service.
     *
     * @param {boolean} [refreshed] - Optional flag indicating whether to return
     *   a freshly refreshed token.
     * @returns {UserToken|null} The stored user token object, or null if no valid session exists.
     */
    getUserToken(refreshed?: boolean): UserToken | null;
    /**
     * Retrieves the active user access token JWT string for authorizing API requests.
     *
     * @returns {string|undefined} The signed EdDSA user access token JWT,
     *   or undefined if no user is authenticated.
     */
    getAccessToken(): string | undefined;
    /**
     * Retrieves a guaranteed-valid user access token JWT string, silently refreshing if expired.
     *
     * @param {number} [skewSeconds=30] - Safety margin in seconds before expiration.
     * @returns {Promise<string|null>} The valid user access token JWT, or null if unauthenticated.
     */
    getValidAccessToken(skewSeconds?: number): Promise<string | null>;
    /**
     * Refreshes the active user access token using the stored refresh token.
     *
     * @returns {Promise<UserToken|null>} The refreshed user token credentials, or null if failed.
     */
    refresh(): Promise<UserToken | null>;
    /**
     * Clears all stored authentication tokens and credentials via the Tokens service,
     * and clears any pending PKCE code verifier and CSRF state in session storage.
     * @returns {void}
     */
    clearTokens(): void;
    /**
     * Fetches the current authenticated user profile metadata (`GET /api/userz/auth/me`).
     * Sends a valid user access token in the `Authorization: Bearer <user_access_token>` header,
     * automatically performing a silent renewal if the access token has expired.
     * Does not redirect; use {@link Auth#requireUser} to automatically force a login redirect.
     *
     * Note: Expects tokens to already be present in storage. Call {@link Auth#handleCallback}
     * on the exchange page before attempting to fetch the user profile.
     *
     * @returns {Promise<AuthPayload|null>} The user profile data, or null if unauthenticated.
     * @throws {Error} If the network request fails or the userz service returns an error status.
     */
    user(): Promise<AuthPayload | null>;
    /**
     * Fetches the current user profile, automatically redirecting the browser to the login page
     * via {@link Auth#login} when the user is unauthenticated.
     *
     * @returns {Promise<AuthPayload|null>} The user profile data, or null when redirecting to login.
     */
    requireUser(): Promise<AuthPayload | null>;
    /**
     * Logs out the current user by revoking the session family server-side via `POST /api/userz/auth/logout`,
     * clearing stored credentials and session storage, and navigating to `backurl`.
     *
     * @param {string} [backurl] - The URL to return to after logging out.
     *   Defaults to `config.callbackUrl` or the current window URL (`window.location.href`).
     * @returns {Promise<void>}
     */
    logout(backurl?: string): Promise<void>;
}
export { Auth };
/**
 * @fileoverview Base64 URL safe encoding utilities.
 */
/**
 * Encodes a string or Uint8Array to a Base64 URL safe string.
 * @param {string|Uint8Array|ArrayBuffer} data
 * @returns {string}
 */
export declare function encodeUrlSafe(data: string | Uint8Array | ArrayBuffer): string;
/**
 * Decodes a Base64 URL safe string to a Uint8Array.
 * @param {string} b64UrlSafe
 * @returns {Uint8Array}
 */
export declare function decodeUrlSafeToBytes(b64UrlSafe: string): Uint8Array;
/**
 * Decodes a Base64 URL safe string to a UTF-8 string.
 * @param {string} b64UrlSafe
 * @returns {string}
 */
export declare function decodeUrlSafe(b64UrlSafe: string): string;
/**
 * @fileoverview Sqlite client for the SDK, running sqlite (sql.js, wasm) in the browser.
 *
 * Usage: get the file with the downloader, open it by its OPFS path and always close the
 * connection when done:
 *
 *   const ref = await downloader.update({ name, url })
 *   const conn = await sqlitez.open({ path: await fs.resolve(ref) })
 *   try {
 *     const rows = await conn.query({ query: 'SELECT * FROM t WHERE id = ?', params: [1] })
 *   } finally {
 *     await conn.close()
 *   }
 *
 * The database lives in memory: `update` changes the memory copy, the file is never written back.
 * Every method takes a single `opts` object with the real parameters inside it.
 */
export type SqliteValue = number | string | null | Uint8Array;
export type SqliteRow = Object<string, SqliteValue>;
/**
 * An open in-memory sqlite connection. Obtained from `sqlitez.open`.
 */
declare class SqliteConn {
    #private;
    /**
     * @private
     * @type {Object|null}
     */
    db;
    /**
     * @param {Object} db - The sql.js Database instance.
     */
    constructor(db: Object);
    /**
     * Closes the connection and frees its memory. Calling it more than once does nothing.
     * After `close`, every other method throws.
     * @returns {Promise<void>}
     */
    close(): Promise<void>;
    /**
     * Runs a query and returns its rows.
     * @param {Object} opts
     * @param {string} opts.query - required, the SQL; use `?` for values.
     * @param {SqliteValue[]} [opts.params] - values bound, in order, to the `?` of the query (never concatenate them).
     * @returns {Promise<SqliteRow[]>} The rows (empty array when none), each one an object by column name.
     * @throws {TypeError} If opts.query is missing.
     */
    query(opts: {
        query: string;
        params?: SqliteValue[];
    }): Promise<SqliteRow[]>;
    /**
     * Runs a statement that returns no data (INSERT, UPDATE, CREATE, ...). Only the memory copy changes.
     * @param {Object} opts
     * @param {string} opts.query - required, the SQL; use `?` for values.
     * @param {SqliteValue[]} [opts.params] - values bound, in order, to the `?` of the query.
     * @returns {Promise<void>}
     * @throws {TypeError} If opts.query is missing.
     */
    update(opts: {
        query: string;
        params?: SqliteValue[];
    }): Promise<void>;
    /**
     * Runs a query stored in the `namedqueries` table of the sqlite (columns `name` and `query`).
     * @param {Object} opts
     * @param {string} opts.name - required, the `name` of the stored query.
     * @param {SqliteValue[]} [opts.params] - values bound, in order, to the `?` of the stored query.
     * @returns {Promise<SqliteRow[]>} The rows of the stored query, like `query`.
     * @throws {TypeError} If opts.name is missing.
     */
    namedQuery(opts: {
        name: string;
        params?: SqliteValue[];
    }): Promise<SqliteRow[]>;
    /**
     * Like `namedQuery`, but with JSON in and JSON out: each value of `opts.params`
     * is bound as a JSON string to the positional `?1`, `?2`, ... of the stored query, in order (read them in SQL with
     * `json_extract(?1, '$.field')`, `json_each(?2)`, ...). The stored query must return a row with a column `ret`
     * holding a JSON string. That JSON is parsed and returned.
     * The stored query must have a placeholder for every value, otherwise sqlite rejects the bind ("column index out of range").
     * @param {Object} opts
     * @param {string} opts.name - required, the `name` of the stored query (see `namedQuery`).
     * @param {Array<*>} [opts.params] - JSON-serializable values, bound in order as `?1`, `?2`, ... Default: none.
     * @returns {Promise<*>} The parsed `ret` of the first row, or null if there is no row or `ret` is null.
     * @throws {TypeError} If opts.name is missing or opts.params is not an array.
     */
    namedJsonQuery(opts: {
        name: string;
        params?: Array<any>;
    }): Promise<any>;
    /**
     * Like `namedJsonQuery` (same JSON params bound as `?1`, `?2`, ...), but the `ret` column is returned as is,
     * without JSON.parse. Use it when the stored query returns plain text (e.g. for models); use `namedJsonQuery` when it returns JSON (e.g. for dash).
     * @param {Object} opts
     * @param {string} opts.name - required, the `name` of the stored query (see `namedQuery`).
     * @param {Array<*>} [opts.params] - JSON-serializable values, bound in order as `?1`, `?2`, ... Default: none.
     * @returns {Promise<string|null>} The `ret` of the first row as a string, or null if there is no row or `ret` is null.
     * @throws {TypeError} If opts.name is missing or opts.params is not an array.
     */
    namedStringQuery(opts: {
        name: string;
        params?: Array<any>;
    }): Promise<string | null>;
}
/**
 * Sqlitez client. Use the `sqlitez` singleton.
 */
declare class Sqlitez {
    /**
     * Opens a sqlite file of the browser file system into memory.
     * @param {Object} opts
     * @param {string} opts.path - required, OPFS path of the file (what `fs.resolve` returns for a downloaded file).
     * @returns {Promise<SqliteConn>} The connection. The caller must `close()` it.
     * @throws {TypeError} If opts.path is missing.
     */
    open(opts: {
        path: string;
    }): Promise<SqliteConn>;
}
/** Shared Sqlitez instance. */
declare const sqlitez: Sqlitez;
export { sqlitez };
/**
 * @fileoverview Gzip compression utilities.
 */
/**
 * Compresses data (string, Uint8Array, or ArrayBuffer) using gzip.
 * @param {string|Uint8Array|ArrayBuffer} data - The data to compress.
 * @returns {Promise<Uint8Array>} The gzipped bytes.
 */
export declare function gzip(data: string | Uint8Array | ArrayBuffer): Promise<Uint8Array>;
/**
 * Decompresses gzipped bytes to a UTF-8 string.
 * @param {Uint8Array|ArrayBuffer} compressedBytes - The gzipped data.
 * @returns {Promise<string>} The decompressed string.
 */
export declare function gunzipString(compressedBytes: Uint8Array | ArrayBuffer): Promise<string>;
/**
 * Decompresses gzipped bytes and returns raw Uint8Array.
 * @param {Uint8Array|ArrayBuffer} compressedBytes - The gzipped data.
 * @returns {Promise<Uint8Array>} The decompressed bytes.
 */
export declare function gunzip(compressedBytes: Uint8Array | ArrayBuffer): Promise<Uint8Array>;
/**
 * Gzips a string and encodes it as a Base64 URL safe string.
 * @param {string} str - The string to compress and encode.
 * @returns {Promise<string>} The Base64 URL safe string.
 */
export declare function gzipStringToBase64Url(str: string): Promise<string>;
/**
 * Decodes a Base64 URL safe string and decompresses it as a UTF-8 string.
 * @param {string} b64Str - The Base64 URL safe string.
 * @returns {Promise<string>} The decompressed string.
 */
export declare function gunzipStringFromBase64Url(b64Str: string): Promise<string>;
/**
 * Gzips a given JSON object or array.
 * @param {any} obj - The JSON serializable object to compress.
 * @returns {Promise<Uint8Array>} The gzipped bytes.
 */
export declare function gzipJson(obj: any): Promise<Uint8Array>;
/**
 * Decompresses a gzipped byte array into a JSON object.
 * @param {Uint8Array|ArrayBuffer} compressedBytes - The gzipped data.
 * @returns {Promise<any>} The parsed JSON object.
 */
export declare function gunzipJson(compressedBytes: Uint8Array | ArrayBuffer): Promise<any>;
/**
 * Gzips a JSON object and encodes it as a Base64 URL safe string.
 * @param {any} obj - The JSON serializable object.
 * @returns {Promise<string>} The Base64 URL safe encoded string of the gzipped JSON.
 */
export declare function gzipJsonToBase64Url(obj: any): Promise<string>;
/**
 * Decodes a Base64 URL safe string, gunzips it, and parses it as JSON.
 * @param {string} b64Str - The Base64 URL safe string containing gzipped JSON.
 * @returns {Promise<any>} The parsed JSON object.
 */
export declare function gunzipJsonFromBase64Url(b64Str: string): Promise<any>;
/**
 * @fileoverview Debug logging of the SDK. Set `window.I6_DEBUG = true` to see it in the console.
 */
/**
 * @param {string} prefix - Printed first, followed by ":" (e.g. "infer").
 * @returns {(...args: *) => void} A logger that prints only when `window.I6_DEBUG` is true.
 */
declare const debugLogger: (prefix: string) => (...args: any) => void;
export { debugLogger };
/**
 * @fileoverview Keeps a remote file cached in the browser's file system (see fs.js),
 * downloading it only when its etag changes.
 */
export type FileRef = import('../fs/fs.js').FileRef;
/**
 * Downloads remote files into the versioned file store. Use the `downloader` singleton.
 */
declare class Downloader {
    /**
     * Downloads the file by name if necessary (checking etag): sends a HEAD request, and
     * if the etag differs from the released version, streams the body into a new version
     * and releases it.
     * @param {Object} opts
     * @param {string} opts.name - required, name to store the file under (see fs.js)
     * @param {string} opts.url - required, URL of the file; must answer HEAD with an etag
     * @returns {Promise<FileRef>} the FileRef of the up-to-date file (basically to get the version)
     * @throws {TypeError} If name or url is missing.
     * @throws {Error} If the HEAD or GET request fails, or the HEAD response has no etag.
     *   When the server answered, the error has `status` (the HTTP status code).
    */
    update(opts: {
        name: string;
        url: string;
    }): Promise<FileRef>;
}
/** Shared Downloader instance. */
declare const downloader: Downloader;
export { downloader };
/**
 * @fileoverview Versioned file store on the browser's origin private file system (OPFS).
 *
 * Layout under `i6/fs`:
 *   {name}/version.txt          the released (current) version, if any
 *   {name}/v{version}/etag.txt  the etag the version was created for
 *   {name}/v{version}/blob.bin  the content (written by the caller, see `resolve`)
 *
 * Versions are ISO timestamps, so they sort in creation order.
 */
export type FileRef = {
    /**
     * - File name, a single OPFS directory name (e.g. "model").
     */
    name: string;
    /**
     * - Version id, an ISO timestamp (e.g. "2026-09-29T12:00:00.000Z").
     */
    version: string;
    /**
     * - Etag of the remote content this version was created for.
     */
    etag: string;
};
/**
 * Versioned file store. Use the `fs` singleton.
 *
 * A file is created as a new unreleased version, filled, then released to become the
 * current one; releasing removes the older versions.
 */
declare class FS {
    /**
     * Removes the versions older than version.txt, and the whole file if it is left empty.
     * Without version.txt no version is removed.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @returns {Promise<void>}
     */
    cleanFile(opts: {
        name: string;
    }): Promise<void>;
    /**
     * Cleans all files, see cleanFile.
     * @returns {Promise<void>}
     */
    clean(): Promise<void>;
    /**
     * Resolves a version of a file.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} [opts.version] - defaults to the content of version.txt
     * @returns {Promise<FileRef|null>} a new full FileRef, or null if it does not exist.
     */
    get(opts: {
        name: string;
        version?: string;
    }): Promise<FileRef | null>;
    /**
     * Creates a new version, unless the latest version already has this etag.
     * The new version is not released.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.etag - required
     * @param {Blob|BufferSource|string} [opts.data] - content, required when a new version is created
     * @returns {Promise<FileRef>} a new full FileRef.
     */
    create(opts: {
        name: string;
        etag: string;
        data?: Blob | BufferSource | string;
    }): Promise<FileRef>;
    /**
     * Returns the bin file path, full (with base). Does not check that it exists, see get.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.version - required
     * @returns {Promise<string>} e.g. "i6/fs/{name}/v{version}/blob.bin"
     */
    resolve(opts: {
        name: string;
        version: string;
    }): Promise<string>;
    /**
     * Reads the content (blob.bin) of a version.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.version - required
     * @returns {Promise<Uint8Array>} the bytes of the file.
     * @throws {DOMException} NotFoundError if the version or its blob does not exist.
     */
    read(opts: {
        name: string;
        version: string;
    }): Promise<Uint8Array>;
    /**
     * Makes a version the current one (version.txt), then cleans the older versions.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.version - required, must exist
     * @returns {Promise<FileRef>} a new full FileRef of the released version.
     */
    release(opts: {
        name: string;
        version: string;
    }): Promise<FileRef>;
    /**
     * Removes a version that was never released (e.g. its download failed). Does nothing if it does not exist.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.version - required, must not be the released one
     * @returns {Promise<void>}
     */
    discard(opts: {
        name: string;
        version: string;
    }): Promise<void>;
}
/** Shared FS instance. */
declare const fs: FS;
export { fs };
/**
 * @fileoverview Helpers shared by the services that run on files downloaded from i6 (infer, dash).
 */
export type FileRef = import("../fs/fs.js").FileRef;
/**
 * @typedef {import("../fs/fs.js").FileRef} FileRef
 */
/**
 * @param {Object<string, string>} partitions - Partitions, name -> value.
 * @returns {string} A stable key of the partitions, safe as part of a cache file name (e.g. "store_id%3Ds1-version%3Dv1").
 */
declare function partitionsKey(partitions: Record<string, string>): string;
/**
 * @param {*} partitions - Value to check.
 * @returns {boolean} True if it is an object (not an array) whose values are all strings.
 */
declare function isPartitions(partitions: any): boolean;
/**
 * Brings one remote file to the browser cache, downloading it only if its etag changed.
 * @param {string} name - Name of the cached file.
 * @param {string} url - URL of the file.
 * @returns {Promise<FileRef>} The cached file.
 */
declare function downloadFile(name: string, url: string): Promise<FileRef>;
export { partitionsKey, isPartitions, downloadFile };
/**
 * @fileoverview Compact variable-length bitmask operations, serialization, and deserialization.
 * Direct JavaScript port of commonz/bitmapz.
 */
/**
 * Combines all given values into a single bitmask using bitwise OR.
 * @param {...(number|bigint)} values - Bitmask values to combine.
 * @returns {number} The combined bitmask.
 */
declare function join(...values: (number | bigint)[]): number;
/**
 * Reports whether current contains all bits in expected.
 * If expected is empty, returns true.
 * @param {number|bigint} current - Bitmask to inspect.
 * @param {...(number|bigint)} expected - Required bits.
 * @returns {boolean} True if current contains all expected bits.
 */
declare function containsAll(current: number | bigint, ...expected: (number | bigint)[]): boolean;
/**
 * Reports whether current contains at least one of the bits in expected.
 * If expected is empty or current is 0, returns false.
 * @param {number|bigint} current - Bitmask to inspect.
 * @param {...(number|bigint)} expected - Expected bits.
 * @returns {boolean} True if current contains any expected bit.
 */
declare function containsAny(current: number | bigint, ...expected: (number | bigint)[]): boolean;
/**
 * Decomposes current into an array of individual set bits in ascending order.
 * If current is 0, returns an empty array.
 * @param {number|bigint} current - Bitmask to split.
 * @returns {number[]} Array of individual set bits.
 */
declare function split(current: number | bigint): number[];
/**
 * Adds or removes the given values from current based on enable.
 * @param {number|bigint} current - Starting bitmask.
 * @param {boolean} enable - True to set bits, false to clear them.
 * @param {...(number|bigint)} values - Bitmask flags to add or remove.
 * @returns {number} The updated bitmask.
 */
declare function set(current: number | bigint, enable: boolean, ...values: (number | bigint)[]): number;
/**
 * Encodes the bitmask v into a compact variable-length byte array (Uint8Array).
 * If v fits in 4 bits (0..15), it is serialized in 1 byte:
 * upper 4 bits are 0000, lower 4 bits store the value.
 * Otherwise, upper 4 bits specify the number of payload bytes (1..8),
 * lower 4 bits are 0000, followed by payload bytes in little-endian order.
 * @param {number|bigint} v - Bitmask value to serialize.
 * @returns {Uint8Array} The serialized bytes.
 */
declare function serialize(v: number | bigint): Uint8Array;
/**
 * Decodes a bitmask from data according to the variable-length encoding.
 * Throws an Error if data is empty, has an invalid length, invalid size,
 * or non-zero lower nibble when size > 0.
 * @param {Uint8Array} data - Binary encoded bitmask.
 * @returns {number|bigint} The decoded bitmask.
 */
declare function deserialize(data: Uint8Array): number | bigint;
declare const bitmapz: Readonly<{
    join: typeof join;
    containsAll: typeof containsAll;
    containsAny: typeof containsAny;
    split: typeof split;
    set: typeof set;
    serialize: typeof serialize;
    deserialize: typeof deserialize;
}>;
export { bitmapz, join, containsAll, containsAny, split, set, serialize, deserialize };
/**
 * @typedef {import("../services/services.js").Services} Services
 */
export type Services = import("../services/services.js").Services;
export type ServiceOptions = import("../invoker/invoker.js").ServiceOptions;
export type i6JsonEmbedded<T> = T;
export type Grant = 1 | 2 | 4 | 8 | number;
export type apiDszCreateCustomerPortalParams = {
    /**
     * - [Go: lakedsz.Dataset] Dataset of the customer
     */
    dataset: string;
};
export type apiDszCreateCustomerPortalReq = {
    params: apiDszCreateCustomerPortalParams;
    payload: apiDszCreateCustomerPortalReqPayload;
};
export type apiDszCreateCustomerPortalReqPayload = {
    /**
     * - [Go: string] Locale for the portal interface, defaults to en-US if empty (e.g. pt-BR, en-US)
     */
    locale: string;
    /**
     * - [Go: string] URL where the user is redirected when leaving the portal
     */
    return_url: string;
};
export type apiDszCreateCustomerPortalResp = {
    payload: apiDszCreateCustomerPortalRespPayload;
};
export type apiDszCreateCustomerPortalRespPayload = {
    /**
     * - [Go: string] URL of the Stripe customer portal session
     */
    url: string;
};
export type apiDszCreateIngestionTokenParams = {
    /**
     * - [Go: lakedsz.Dataset] Dataset to create the ingestion token for.
     */
    dataset: string;
};
export type apiDszCreateIngestionTokenReq = {
    params: apiDszCreateIngestionTokenParams;
    payload: apiDszCreateIngestionTokenReqPayload;
};
export type apiDszCreateIngestionTokenReqPayload = {
    /**
     * - [Go: string] Optional note or annotation identifying the purpose of this token.
     */
    annotation: string;
};
export type apiDszCreateIngestionTokenResp = {
    payload: apiDszCreateIngestionTokenRespPayload;
};
export type apiDszCreateIngestionTokenRespPayload = {
    /**
     * - [Go: string] Note identifying the purpose of the token.
     */
    annotation: string;
    /**
     * - [Go: string] Token audience.
     */
    audience: string;
    /**
     * - [Go: string] Sales channel the token is restricted to.
     */
    channel: string;
    /**
     * - [Go: lakedsz.Dataset] Dataset identifier.
     */
    dataset: string;
    /**
     * - [Go: int64] Token expiration date.
     */
    expiration_date: number;
    /**
     * - Permissions granted by the token.
     */
    grants: Array<apiDszCreateIngestionTokenRespPayloadGrantsElement>;
    /**
     * - [Go: string] Token id.
     */
    id: string;
    /**
     * - [Go: string] Token unique id (JWT id).
     */
    jti: string;
    /**
     * - [Go: string] Token value.
     */
    token: string;
};
export type apiDszCreateIngestionTokenRespPayloadGrantsElement = string;
export type apiDszCreateRecsysTokenParams = {
    /**
     * - [Go: lakedsz.Dataset] Dataset to create the recommendation system token for.
     */
    dataset: string;
};
export type apiDszCreateRecsysTokenReq = {
    params: apiDszCreateRecsysTokenParams;
    payload: apiDszCreateRecsysTokenReqPayload;
};
export type apiDszCreateRecsysTokenReqPayload = {
    /**
     * - [Go: string] Optional note or annotation identifying the purpose of this token.
     */
    annotation: string;
    /**
     * - [Go: string] Sales/distribution channel this recommendation token is restricted to (e.g. retail).
     */
    channel: string;
};
export type apiDszCreateRecsysTokenResp = {
    payload: apiDszCreateRecsysTokenRespPayload;
};
export type apiDszCreateRecsysTokenRespPayload = {
    /**
     * - [Go: string] Note identifying the purpose of the token.
     */
    annotation: string;
    /**
     * - [Go: string] Token audience.
     */
    audience: string;
    /**
     * - [Go: string] Sales channel the token is restricted to.
     */
    channel: string;
    /**
     * - [Go: lakedsz.Dataset] Dataset identifier.
     */
    dataset: string;
    /**
     * - [Go: int64] Token expiration date.
     */
    expiration_date: number;
    /**
     * - Permissions granted by the token.
     */
    grants: Array<apiDszCreateRecsysTokenRespPayloadGrantsElement>;
    /**
     * - [Go: string] Token id.
     */
    id: string;
    /**
     * - [Go: string] Token unique id (JWT id).
     */
    jti: string;
    /**
     * - [Go: string] Token value.
     */
    token: string;
};
export type apiDszCreateRecsysTokenRespPayloadGrantsElement = string;
export type apiDszCreateStoreParams = {
    /**
     * - [Go: lakedsz.Dataset] Dataset containing the store config to create.
     */
    dataset: string;
};
export type apiDszCreateStoreReq = {
    params: apiDszCreateStoreParams;
    payload: apiDszCreateStoreReqPayload;
};
export type apiDszCreateStoreReqPayload = {
    /**
     * - Store configuration object details.
     */
    store: apiDszCreateStoreReqPayloadStore;
};
export type apiDszCreateStoreReqPayloadStore = {
    /**
     * - [Go: storeid.StoreId] Unique identifier of the store.
     */
    id: string;
    /**
     * - [Go: string] Human-readable name of the store.
     */
    name: string;
    /**
     * - Solution domains associated with this store.
     */
    solution_domains: Array<apiDszCreateStoreReqPayloadStoreSolutionDomainsElement>;
};
export type apiDszCreateStoreReqPayloadStoreSolutionDomainsElement = string;
export type apiDszCreateStoreResp = object;
export type apiDszDatasetSolutionsParams = {
    /**
     * - [Go: lakedsz.Dataset] Dataset identifier to list active solutions for.
     */
    dataset: string;
};
export type apiDszDatasetSolutionsReq = {
    params: apiDszDatasetSolutionsParams;
};
export type apiDszDatasetSolutionsResp = {
    payload: apiDszDatasetSolutionsRespPayload;
};
export type apiDszDatasetSolutionsRespPayload = {
    /**
     * - [Go: lakedsz.Dataset] Dataset identifier.
     */
    dataset: string;
    /**
     * - Active solutions associated with this dataset.
     */
    solutions: Array<apiDszDatasetSolutionsRespPayloadSolutionsElement>;
};
export type apiDszDatasetSolutionsRespPayloadSolutionsElement = string;
export type apiDszDeleteTokenParams = {
    /**
     * - [Go: lakedsz.Dataset] The dataset whose token should be deleted.
     */
    dataset: string;
};
export type apiDszDeleteTokenQuery = {
    /**
     * - [Go: string] The token identifier (jti) to be deleted/revoked.
     */
    token: string;
};
export type apiDszDeleteTokenReq = {
    params: apiDszDeleteTokenParams;
    query: apiDszDeleteTokenQuery;
};
export type apiDszDeleteTokenResp = object;
export type apiDszDomainGetParams = {
    /**
     * - [Go: lakedsz.Dataset] Dataset identifier containing the store.
     */
    dataset: string;
};
export type apiDszDomainGetQuery = {
    /**
     * - [Go: storeid.StoreId] Store identifier to query solutions and domains for.
     */
    store_id: string;
};
export type apiDszDomainGetReq = {
    params: apiDszDomainGetParams;
    query: apiDszDomainGetQuery;
};
export type apiDszDomainGetResp = {
    payload: apiDszDomainGetRespPayload;
};
export type apiDszDomainGetRespPayload = {
    /**
     * - [Go: lakedsz.Dataset] Dataset identifier.
     */
    dataset: string;
    /**
     * - List of solution and domain configurations mapping to this store.
     */
    solutions: Array<apiDszDomainGetRespPayloadSolutionsElement>;
    /**
     * - [Go: storeid.StoreId] Store identifier.
     */
    store_id: string;
};
export type apiDszDomainGetRespPayloadSolutionsElement = {
    /**
     * - [Go: domain.Domain] Domain associated with the solution (e.g. relevance_fashion).
     */
    domain: string;
    /**
     * - [Go: solution.Solution] Solution type, such as relevance.
     */
    solution: string;
};
export type apiDszGetSubscriptionParams = {
    /**
     * - [Go: lakedsz.Dataset] Dataset of the subscription
     */
    dataset: string;
    /**
     * - [Go: solution.Solution] Solution (product) of the subscription
     */
    solution: string;
};
export type apiDszGetSubscriptionReq = {
    params: apiDszGetSubscriptionParams;
};
export type apiDszGetSubscriptionResp = {
    payload: apiDszGetSubscriptionRespPayload;
};
export type apiDszGetSubscriptionRespPayload = {
    /**
     * - [Go: time.Time] When the subscription will be or was canceled, in UTC; null when there is no cancellation
     */
    cancel_at: dszTime;
    /**
     * - [Go: bool] Whether the subscription will be canceled at the end of the current period
     */
    cancel_at_period_end: boolean;
    /**
     * - [Go: time.Time] When the subscription was created, in UTC
     */
    created_at: dszTime;
    /**
     * - [Go: time.Time] End of the current period, in UTC
     */
    current_period_end_at: dszTime;
    /**
     * - [Go: time.Time] Start of the current period, in UTC
     */
    current_period_start_at: dszTime;
    /**
     * - [Go: time.Time] When the next invoice is scheduled, in UTC; null if none
     */
    next_invoice_at: dszTime;
    /**
     * - [Go: string] Lookup key of the base price in Stripe, like relevance_growth_base_monthly
     */
    plan_key: string;
    /**
     * - [Go: string] Status of the subscription in Stripe, without translation: active, trialing, past_due, unpaid, incomplete, canceled, incomplete_expired or paused
     */
    status: string;
    /**
     * - [Go: time.Time] When the subscription trial ends, in UTC; null if there is no trial
     */
    trial_end_at: dszTime;
    /**
     * - [Go: time.Time] When the subscription trial started, in UTC; null if there is no trial
     */
    trial_start_at: dszTime;
};
export type apiDszListDatasetsParams = {
    /**
     * - [Go: string] User identifier (id).
     */
    userId: string;
};
export type apiDszListDatasetsReq = {
    params: apiDszListDatasetsParams;
};
export type apiDszListDatasetsResp = {
    payload: apiDszListDatasetsRespPayload;
};
export type apiDszListDatasetsRespPayload = {
    /**
     * - List of datasets available to the user.
     */
    datasets: Array<apiDszListDatasetsRespPayloadDatasetsElement>;
};
export type apiDszListDatasetsRespPayloadDatasetsElement = {
    /**
     * - [Go: grants.Grant] Compact grant bitmask held by the user on this dataset.
     */
    grants: Grant;
    /**
     * - [Go: string] Unique identifier of the dataset.
     */
    id: string;
    /**
     * - [Go: string] Human-readable name of the dataset.
     */
    name: string;
};
export type apiDszListIngestionTokensParams = {
    /**
     * - [Go: lakedsz.Dataset] Dataset whose ingestion tokens should be listed.
     */
    dataset: string;
};
export type apiDszListIngestionTokensReq = {
    params: apiDszListIngestionTokensParams;
};
export type apiDszListIngestionTokensResp = {
    payload: apiDszListIngestionTokensRespPayload;
};
export type apiDszListIngestionTokensRespPayload = {
    /**
     * - List of ingestion tokens configured for this dataset.
     */
    tokens: Array<apiDszListIngestionTokensRespPayloadTokensElement>;
};
export type apiDszListIngestionTokensRespPayloadTokensElement = {
    /**
     * - [Go: string] Note identifying the purpose of the token.
     */
    annotation: string;
    /**
     * - [Go: string] Token audience.
     */
    audience: string;
    /**
     * - [Go: string] Sales channel the token is restricted to.
     */
    channel: string;
    /**
     * - [Go: lakedsz.Dataset] Dataset identifier.
     */
    dataset: string;
    /**
     * - [Go: int64] Token expiration date.
     */
    expiration_date: number;
    /**
     * - Permissions granted by the token.
     */
    grants: Array<apiDszListIngestionTokensRespPayloadTokensElementGrantsElement>;
    /**
     * - [Go: string] Token id.
     */
    id: string;
    /**
     * - [Go: string] Token unique id (JWT id).
     */
    jti: string;
    /**
     * - [Go: string] Token value.
     */
    token: string;
};
export type apiDszListIngestionTokensRespPayloadTokensElementGrantsElement = string;
export type apiDszListPaymentsParams = {
    /**
     * - [Go: lakedsz.Dataset] Dataset of the payments
     */
    dataset: string;
};
export type apiDszListPaymentsReq = {
    params: apiDszListPaymentsParams;
};
export type apiDszListPaymentsResp = {
    payload: apiDszListPaymentsRespPayload;
};
export type apiDszListPaymentsRespPayload = {
    /**
     * - Payments in the order of Stripe, newest first
     */
    payments: Array<apiDszListPaymentsRespPayloadPaymentsElement>;
};
export type apiDszListPaymentsRespPayloadPaymentsElement = {
    /**
     * - [Go: int64] Amount due, in the minor unit of the currency (cents)
     */
    amount_due: number;
    /**
     * - [Go: int64] Amount paid, in the minor unit of the currency (cents)
     */
    amount_paid: number;
    /**
     * - [Go: time.Time] When the invoice was created, in UTC
     */
    created: dszTime;
    /**
     * - [Go: string] Three-letter currency code, like brl
     */
    currency: string;
    /**
     * - [Go: string] Id of the invoice in Stripe
     */
    id: string;
    /**
     * - [Go: string] Pdf of the invoice
     */
    invoice_pdf_url: string;
    /**
     * - Line items of the invoice
     */
    lines: Array<apiDszListPaymentsRespPayloadPaymentsElementLinesElement>;
    /**
     * - [Go: string] Number of the invoice
     */
    number: string;
    /**
     * - [Go: time.Time] End of the billing period, in UTC
     */
    period_end: dszTime;
    /**
     * - [Go: time.Time] Start of the billing period, in UTC
     */
    period_start: dszTime;
    /**
     * - [Go: string] Pdf of the receipt
     */
    receipt_pdf_url: string;
    /**
     * - [Go: string] Status of the invoice in Stripe, without translation: draft, open, paid, uncollectible or void
     */
    status: string;
};
export type apiDszListPaymentsRespPayloadPaymentsElementLinesElement = {
    /**
     * - [Go: int64] Amount of the line item in minor unit
     */
    amount: number;
    /**
     * - [Go: string] Description of the line item
     */
    description: string;
    /**
     * - [Go: string] Id of the line item in Stripe
     */
    id: string;
    /**
     * - [Go: solution.Solution] Solution (product) of the line item
     */
    solution: string;
};
export type apiDszListPlansParams = {
    /**
     * - [Go: solution.Solution] Solution (product) to list plans from
     */
    solution: string;
};
export type apiDszListPlansReq = {
    params: apiDszListPlansParams;
};
export type apiDszListPlansResp = {
    payload: apiDszListPlansRespPayload;
};
export type apiDszListPlansRespPayload = {
    /**
     * - Allowed plans, each one found in Stripe
     */
    plans: Array<apiDszListPlansRespPayloadPlansElement>;
};
export type apiDszListPlansRespPayloadPlansElement = {
    /**
     * - [Go: int64] Same as lic_amount, kept for compatibility
     */
    amount: number;
    /**
     * - [Go: string] Three-letter currency code, like brl
     */
    currency: string;
    /**
     * - [Go: string] Price description set in Stripe (the price nickname), to show to the user
     */
    description: string;
    /**
     * - [Go: string] Billing frequency of the plan, like monthly
     */
    frequency: string;
    /**
     * - [Go: int64] Requests included per period of the plan. null means unlimited; absent means not informed
     */
    included_requests: number;
    /**
     * - [Go: string] Plan key (base of the Stripe lookup keys {key}_lic and {key}_req), used to switch to the plan
     */
    key: string;
    /**
     * - [Go: int64] License price in the minor unit of the currency (cents)
     */
    lic_amount: number;
    /**
     * - [Go: string] Name of the plan, like 2027
     */
    name: string;
    /**
     * - [Go: int64] Request count price in the minor unit of the currency (cents)
     */
    req_amount: number;
    /**
     * - [Go: string] Price of each request above included_requests, in cents with decimal places, as Stripe unit_amount_decimal (like 0.0294). "0" means no extra charge; absent means not configured
     */
    req_amount_decimal: string;
    /**
     * - [Go: string] Tier of the plan, like growth
     */
    tier: string;
};
export type apiDszListRecsysTokensParams = {
    /**
     * - [Go: lakedsz.Dataset] Dataset whose recommendation system tokens should be listed.
     */
    dataset: string;
};
export type apiDszListRecsysTokensReq = {
    params: apiDszListRecsysTokensParams;
};
export type apiDszListRecsysTokensResp = {
    payload: apiDszListRecsysTokensRespPayload;
};
export type apiDszListRecsysTokensRespPayload = {
    /**
     * - List of recommendation system tokens configured for this dataset.
     */
    tokens: Array<apiDszListRecsysTokensRespPayloadTokensElement>;
};
export type apiDszListRecsysTokensRespPayloadTokensElement = {
    /**
     * - [Go: string] Note identifying the purpose of the token.
     */
    annotation: string;
    /**
     * - [Go: string] Token audience.
     */
    audience: string;
    /**
     * - [Go: string] Sales channel the token is restricted to.
     */
    channel: string;
    /**
     * - [Go: lakedsz.Dataset] Dataset identifier.
     */
    dataset: string;
    /**
     * - [Go: int64] Token expiration date.
     */
    expiration_date: number;
    /**
     * - Permissions granted by the token.
     */
    grants: Array<apiDszListRecsysTokensRespPayloadTokensElementGrantsElement>;
    /**
     * - [Go: string] Token id.
     */
    id: string;
    /**
     * - [Go: string] Token unique id (JWT id).
     */
    jti: string;
    /**
     * - [Go: string] Token value.
     */
    token: string;
};
export type apiDszListRecsysTokensRespPayloadTokensElementGrantsElement = string;
export type apiDszListStoresParams = {
    /**
     * - [Go: lakedsz.Dataset] Dataset to list stores from.
     */
    dataset: string;
};
export type apiDszListStoresReq = {
    params: apiDszListStoresParams;
};
export type apiDszListStoresResp = {
    payload: apiDszListStoresRespPayload;
};
export type apiDszListStoresRespPayload = {
    /**
     * - [Go: lakedsz.Dataset] Dataset identifier.
     */
    dataset: string;
    /**
     * - List of store configurations.
     */
    stores: Array<apiDszListStoresRespPayloadStoresElement>;
};
export type apiDszListStoresRespPayloadStoresElement = {
    /**
     * - [Go: storeid.StoreId] Unique identifier of the store.
     */
    id: string;
    /**
     * - [Go: string] Human-readable name of the store.
     */
    name: string;
    /**
     * - Solution domains associated with this store.
     */
    solution_domains: Array<apiDszListStoresRespPayloadStoresElementSolutionDomainsElement>;
};
export type apiDszListStoresRespPayloadStoresElementSolutionDomainsElement = string;
export type apiDszModelGetParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset to generate signed URLs for.
     */
    dataset: string;
    /**
     * - [Go: string] Model name
     */
    model_name: string;
};
export type apiDszModelGetReq = {
    params: apiDszModelGetParams;
    payload: apiDszModelGetReqPayload;
};
export type apiDszModelGetReqPayload = {
    /**
     * - Model partition key/value pairs
     */
    model_partitions: Record<apiDszModelGetReqPayloadModelPartitionsKey, apiDszModelGetReqPayloadModelPartitionsValue>;
    /**
     * - [Go: string] Model version
     */
    model_version: string;
};
export type apiDszModelGetReqPayloadModelPartitionsKey = string;
export type apiDszModelGetReqPayloadModelPartitionsValue = string;
export type apiDszModelGetResp = {
    payload: apiDszModelGetRespPayload;
};
export type apiDszModelGetRespPayload = {
    /**
     * - Signed URLs
     */
    urls: Array<apiDszModelGetRespPayloadUrlsElement>;
};
export type apiDszModelGetRespPayloadUrlsElement = {
    /**
     * - [Go: string] File Name
     */
    name: string;
    /**
     * - [Go: string] signed URL.
     */
    url: string;
};
export type apiDszResultLastBatchSummaryParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset.
     */
    dataset: string;
};
export type apiDszResultLastBatchSummaryQuery = {
    /**
     * - [Go: storeid.StoreId] Store ID to query.
     */
    store_id: string;
    /**
     * - [Go: laketbnamez.TableName] Table of the batch in question.
     */
    table: string;
};
export type apiDszResultLastBatchSummaryReq = {
    params: apiDszResultLastBatchSummaryParams;
    query: apiDszResultLastBatchSummaryQuery;
};
export type apiDszResultLastBatchSummaryResp = {
    payload: apiDszResultLastBatchSummaryRespPayload;
};
export type apiDszResultLastBatchSummaryRespPayload = {
    /**
     * - Summary of the batch data loaded into the store datalake.
     */
    data: apiDszResultLastBatchSummaryRespPayloadData;
};
export type apiDszResultLastBatchSummaryRespPayloadData = {
    /**
     * - Summaries of distinct and null counts per column.
     */
    column_summaries: Array<apiDszResultLastBatchSummaryRespPayloadDataColumnSummariesElement>;
    /**
     * - [Go: string] Batch ingestion date.
     */
    ingested_at: string;
    /**
     * - [Go: int] Number of rows in the batch.
     */
    row_count: number;
    /**
     * - [Go: string] Store identifier.
     */
    store_id: string;
};
export type apiDszResultLastBatchSummaryRespPayloadDataColumnSummariesElement = {
    /**
     * - [Go: string] Name of the column.
     */
    column_name: string;
    /**
     * - [Go: int] Number of distinct values in the column.
     */
    distinct_count: number;
    /**
     * - [Go: int] Number of null values in the column.
     */
    null_count: number;
};
export type apiDszResultRelevanceFashionCatalogParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset.
     */
    dataset: string;
};
export type apiDszResultRelevanceFashionCatalogQuery = {
    /**
     * - [Go: storeid.StoreId] Store ID to query.
     */
    store_id: string;
};
export type apiDszResultRelevanceFashionCatalogReq = {
    params: apiDszResultRelevanceFashionCatalogParams;
    query: apiDszResultRelevanceFashionCatalogQuery;
};
export type apiDszResultRelevanceFashionCatalogResp = {
    payload: apiDszResultRelevanceFashionCatalogRespPayload;
};
export type apiDszResultRelevanceFashionCatalogRespPayload = {
    /**
     * - Store simple catalog loaded from the datalake file.
     */
    data: Array<apiDszResultRelevanceFashionCatalogRespPayloadDataElement>;
};
export type apiDszResultRelevanceFashionCatalogRespPayloadDataElement = {
    /**
     * - [Go: string] SKU description.
     */
    sku_ds: string;
    /**
     * - [Go: string] SKU identifier.
     */
    sku_id: string;
    /**
     * - [Go: storeid.StoreId] Store identifier.
     */
    store_id: string;
};
export type apiDszSignedUrlParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset to generate signed URLs for.
     */
    dataset: string;
};
export type apiDszSignedUrlReq = {
    params: apiDszSignedUrlParams;
    payload: apiDszSignedUrlReqPayload;
};
export type apiDszSignedUrlReqPayload = {
    /**
     * - List of paths and HTTP methods to generate signed URLs for.
     */
    paths: Array<apiDszSignedUrlReqPayloadPathsElement>;
};
export type apiDszSignedUrlReqPayloadPathsElement = {
    /**
     * - [Go: fszsignmethod.SignMethod] HTTP method (e.g. GET, PUT) for the signed URL.
     */
    method: string;
    /**
     * - [Go: laketbpathz.Path] File path within the dataset.
     */
    path: string;
};
export type apiDszSignedUrlResp = {
    payload: apiDszSignedUrlRespPayload;
};
export type apiDszSignedUrlRespPayload = {
    /**
     * - Signed URLs
     */
    urls: Array<apiDszSignedUrlRespPayloadUrlsElement>;
};
export type apiDszSignedUrlRespPayloadUrlsElement = {
    /**
     * - [Go: string] signed URL.
     */
    url: string;
};
export type apiDszStoreDisplayCreateParams = {
    /**
     * - [Go: lakedsz.Dataset] Dataset containing the store.
     */
    dataset: string;
};
export type apiDszStoreDisplayCreateReq = {
    params: apiDszStoreDisplayCreateParams;
    payload: apiDszStoreDisplayCreateReqPayload;
};
export type apiDszStoreDisplayCreateReqPayload = {
    /**
     * - Store display configuration details.
     */
    display: apiDszStoreDisplayCreateReqPayloadDisplay;
    /**
     * - [Go: storeid.StoreId] Unique identifier of the store.
     */
    store_id: string;
};
export type apiDszStoreDisplayCreateReqPayloadDisplay = {
    /**
     * - [Go: storedisplayid.StoreDisplayId] Unique identifier of the store display.
     */
    id: string;
    /**
     * - [Go: string] Name of the recommendation/relevance model associated with this display.
     */
    model_name: string;
    /**
     * - [Go: string] Human-readable name of the store display.
     */
    name: string;
};
export type apiDszStoreDisplayCreateResp = {
    payload: apiDszStoreDisplayCreateRespPayload;
};
export type apiDszStoreDisplayCreateRespPayload = {
    /**
     * - Created store display configuration details.
     */
    display: apiDszStoreDisplayCreateRespPayloadDisplay;
};
export type apiDszStoreDisplayCreateRespPayloadDisplay = {
    /**
     * - [Go: storedisplayid.StoreDisplayId] Unique identifier of the store display.
     */
    id: string;
    /**
     * - [Go: string] Human-readable name of the store display.
     */
    name: string;
};
export type apiDszStoreDisplayListParams = {
    /**
     * - [Go: lakedsz.Dataset] Dataset containing the store displays to list.
     */
    dataset: string;
};
export type apiDszStoreDisplayListQuery = {
    /**
     * - [Go: storeid.StoreId] Store identifier whose displays should be listed.
     */
    store_id: string;
};
export type apiDszStoreDisplayListReq = {
    params: apiDszStoreDisplayListParams;
    query: apiDszStoreDisplayListQuery;
};
export type apiDszStoreDisplayListResp = {
    payload: apiDszStoreDisplayListRespPayload;
};
export type apiDszStoreDisplayListRespPayload = {
    /**
     * - [Go: lakedsz.Dataset] Dataset identifier.
     */
    dataset: string;
    /**
     * - List of store display configurations.
     */
    displays: Array<apiDszStoreDisplayListRespPayloadDisplaysElement>;
    /**
     * - [Go: storeid.StoreId] Store identifier.
     */
    store_id: string;
};
export type apiDszStoreDisplayListRespPayloadDisplaysElement = {
    /**
     * - [Go: storedisplayid.StoreDisplayId] Unique identifier of the store display.
     */
    id: string;
    /**
     * - [Go: string] Human-readable name of the store display.
     */
    name: string;
};
export type apiDszStripeCheckoutReq = {
    payload: apiDszStripeCheckoutReqPayload;
};
export type apiDszStripeCheckoutReqPayload = {
    /**
     * - [Go: string] Base64 state token with the metadata of the checkout; the service parses it
     */
    campaign_state: string;
    /**
     * - [Go: string] Url to go after a canceled checkout
     */
    cancel_url: string;
    /**
     * - [Go: string] Dataset name
     */
    dataset_name: string;
    /**
     * - [Go: string] Document of the buyer
     */
    document: string;
    /**
     * - [Go: string] Email of the buyer used in Stripe
     */
    payment_email: string;
    /**
     * - [Go: string] Phone of the buyer
     */
    payment_phone: string;
    /**
     * - [Go: string] Plan key to buy, like relevance_growth_monthly_2027; the service gets the prices {plan}_lic and {plan}_req from the Stripe prices api and sends both to the checkout
     */
    plan: string;
    /**
     * - [Go: string] Url to go after a successful checkout
     */
    success_url: string;
    /**
     * - [Go: string] Optional exchange callback URL for redeeming checkout artifact ticket
     */
    user_exchange_callback_url: string;
};
export type apiDszStripeCheckoutResp = {
    payload: apiDszStripeCheckoutRespPayload;
};
export type apiDszStripeCheckoutRespPayload = {
    /**
     * - [Go: lakedsz.Dataset] Dataset that is going to be created after the payment; its id starts with ds
     */
    dataset: string;
    /**
     * - [Go: string] Checkout session id
     */
    id: string;
    /**
     * - [Go: string] Checkout session url
     */
    url: string;
};
export type apiDszTableGetParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset.
     */
    dataset: string;
    /**
     * - [Go: string] Path to the file without schema.
     */
    path: string;
};
export type apiDszTableGetReq = {
    params: apiDszTableGetParams;
};
export type apiDszTableGetResp = {
    headers: apiDszTableGetRespHeaders;
};
export type apiDszTableGetRespHeaders = {
    /**
     * - [Go: string] Redirect URL for the file.
     */
    location: string;
};
export type apiDszTableListParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset to list tables from.
     */
    dataset: string;
};
export type apiDszTableListQuery = {
    /**
     * - [Go: string] Pagination cursor.
     */
    from_cursor: string;
    /**
     * - [Go: int] Limit the number of results.
     */
    limist: number;
    /**
     * - [Go: laketbpathz.Path] Path to list.
     */
    path: string;
    /**
     * - [Go: bool] Whether to list recursively.
     */
    recursive: boolean;
    /**
     * - [Go: fszsignmethod.SignMethod] Whether to return signed URLs.
     */
    sign_method: string;
    /**
     * - [Go: bool] Whether to include file stats.
     */
    stat: boolean;
};
export type apiDszTableListReq = {
    params: apiDszTableListParams;
    query: apiDszTableListQuery;
};
export type apiDszTableListResp = {
    payload: apiDszTableListRespPayload;
};
export type apiDszTableListRespPayload = {
    /**
     * - Files and tables found.
     */
    files: Array<apiDszTableListRespPayloadFilesElement>;
    /**
     * - [Go: string] Cursor for the next page of results.
     */
    next_cursor: string;
};
export type apiDszTableListRespPayloadFilesElement = {
    /**
     * - [Go: laketbpathz.Path] The path of the file or table.
     */
    path: string;
    /**
     * - [Go: string] The presigned download/access URL for the file, if sign method was requested.
     */
    signed_url: string;
    /**
     * - [Go: fsz.FileStat] The metadata and stats of the file (size, modified time, etc.), if requested.
     */
    stat: dszFileStat;
};
export type apiDszUpdatePaymentAutoRenewParams = {
    /**
     * - [Go: lakedsz.Dataset] Dataset of the payment
     */
    dataset: string;
    /**
     * - [Go: solution.Solution] Solution (product) of the payment
     */
    solution: string;
};
export type apiDszUpdatePaymentAutoRenewReq = {
    params: apiDszUpdatePaymentAutoRenewParams;
    payload: apiDszUpdatePaymentAutoRenewReqPayload;
};
export type apiDszUpdatePaymentAutoRenewReqPayload = {
    /**
     * - [Go: bool] True to enable auto renew, false to turn it off
     */
    auto_renew: boolean;
};
export type apiDszUpdatePaymentAutoRenewResp = object;
export type apiDszUpdateSubscriptionPlanParams = {
    /**
     * - [Go: lakedsz.Dataset] Dataset of the subscription
     */
    dataset: string;
    /**
     * - [Go: solution.Solution] Solution (product) of the subscription
     */
    solution: string;
};
export type apiDszUpdateSubscriptionPlanReq = {
    params: apiDszUpdateSubscriptionPlanParams;
    payload: apiDszUpdateSubscriptionPlanReqPayload;
};
export type apiDszUpdateSubscriptionPlanReqPayload = {
    /**
     * - [Go: string] Lookup key of the new Stripe price
     */
    plan: string;
};
export type apiDszUpdateSubscriptionPlanResp = object;
export type apiIngestzEventRelevanceFashionCatalogParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset that receives the stream data.
     */
    dataset: string;
};
export type apiIngestzEventRelevanceFashionCatalogReq = {
    params: apiIngestzEventRelevanceFashionCatalogParams;
    payload: apiIngestzEventRelevanceFashionCatalogReqPayload;
};
export type apiIngestzEventRelevanceFashionCatalogReqPayload = {
    /**
     * - [Go: string] Catalog entry id.
     */
    id: string;
    /**
     * - [Go: bool] Whether the SKU is inactive.
     */
    inactive: boolean;
    /**
     * - [Go: string] Product identifier.
     */
    product_id: string;
    /**
     * - [Go: string] SKU description.
     */
    sku_ds: string;
    /**
     * - [Go: string] SKU identifier.
     */
    sku_id: string;
    /**
     * - [Go: string] Store identifier.
     */
    store_id: string;
};
export type apiIngestzEventRelevanceFashionCatalogResp = object;
export type apiIngestzEventRelevanceFashionEventParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset that receives the stream data.
     */
    dataset: string;
};
export type apiIngestzEventRelevanceFashionEventReq = {
    params: apiIngestzEventRelevanceFashionEventParams;
    payload: apiIngestzEventRelevanceFashionEventReqPayload;
};
export type apiIngestzEventRelevanceFashionEventReqPayload = {
    /**
     * - AddToCart event payload. SkuId is required; price must be non-negative.
     */
    add_to_cart: apiIngestzEventRelevanceFashionEventReqPayloadAddToCart;
    /**
     * - Click event payload. SkuId is required; price must be non-negative.
     */
    click: apiIngestzEventRelevanceFashionEventReqPayloadClick;
    /**
     * - [Go: time.Time] Timestamp of event creation (required).
     */
    created_at: dszTime;
    /**
     * - [Go: bigquery.NullString] Optional display identifier.
     */
    display_id: string;
    /**
     * - [Go: string] Unique identifier for the event (required).
     */
    id: string;
    /**
     * - Purchase event payload. OrderId is required and skus must not be empty.
     */
    purchase: apiIngestzEventRelevanceFashionEventReqPayloadPurchase;
    /**
     * - Recraw event payload representing raw recommendations. RecId, ModelId, and Payload are required.
     */
    recraw: apiIngestzEventRelevanceFashionEventReqPayloadRecraw;
    /**
     * - Recshow event payload representing displayed recommendations. RecId and Payload are required.
     */
    recshow: apiIngestzEventRelevanceFashionEventReqPayloadRecshow;
    /**
     * - RemoveFromCart event payload. SkuId is required; price must be non-negative.
     */
    remove_from_cart: apiIngestzEventRelevanceFashionEventReqPayloadRemoveFromCart;
    /**
     * - Search event payload. Text is required.
     */
    search: apiIngestzEventRelevanceFashionEventReqPayloadSearch;
    /**
     * - [Go: string] Identifier of the user session (required).
     */
    session_id: string;
    /**
     * - [Go: string] Identifier of the store (required).
     */
    store_id: string;
    /**
     * - [Go: bigquery.NullString] Optional user identifier.
     */
    user_id: string;
};
export type apiIngestzEventRelevanceFashionEventReqPayloadAddToCart = {
    /**
     * - [Go: float64] Price of the added SKU (non-negative).
     */
    price: number;
    /**
     * - [Go: string] SKU identifier (required).
     */
    sku_id: string;
};
export type apiIngestzEventRelevanceFashionEventReqPayloadClick = {
    /**
     * - [Go: float64] Price of the clicked SKU (non-negative).
     */
    price: number;
    /**
     * - [Go: string] SKU identifier (required).
     */
    sku_id: string;
};
export type apiIngestzEventRelevanceFashionEventReqPayloadPurchase = {
    /**
     * - [Go: string] Order identifier (required).
     */
    order_id: string;
    /**
     * - List of purchased SKUs (must not be empty).
     */
    skus: Array<apiIngestzEventRelevanceFashionEventReqPayloadPurchaseSkusElement>;
};
export type apiIngestzEventRelevanceFashionEventReqPayloadPurchaseSkusElement = {
    /**
     * - [Go: int64] Quantity of the purchased item (must be greater than 0).
     */
    qtty: number;
    /**
     * - [Go: string] SKU identifier (required).
     */
    sku_id: string;
    /**
     * - [Go: float64] Unit price of the item (non-negative).
     */
    unit_price: number;
};
export type apiIngestzEventRelevanceFashionEventReqPayloadRecraw = {
    /**
     * - [Go: string] Model identifier (required).
     */
    model_id: string;
    /**
     * - [Go: string] Model version string.
     */
    model_version: string;
    /**
     * - [Go: string] Raw recommendation payload (required).
     */
    payload: string;
    /**
     * - [Go: string] Recommendation identifier (required).
     */
    rec_id: string;
};
export type apiIngestzEventRelevanceFashionEventReqPayloadRecshow = {
    /**
     * - [Go: string] Model identifier.
     */
    model_id: string;
    /**
     * - [Go: string] Model version string.
     */
    model_version: string;
    /**
     * - [Go: string] Displayed recommendation payload (required).
     */
    payload: string;
    /**
     * - [Go: string] Recommendation identifier (required).
     */
    rec_id: string;
};
export type apiIngestzEventRelevanceFashionEventReqPayloadRemoveFromCart = {
    /**
     * - [Go: float64] Price of the removed SKU (non-negative).
     */
    price: number;
    /**
     * - [Go: string] SKU identifier (required).
     */
    sku_id: string;
};
export type apiIngestzEventRelevanceFashionEventReqPayloadSearch = {
    /**
     * - [Go: string] Search query text (required).
     */
    text: string;
};
export type apiIngestzEventRelevanceFashionEventResp = object;
export type apiIngestzGetUrlParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset that receives the uploaded files.
     */
    dataset: string;
};
export type apiIngestzGetUrlReq = {
    params: apiIngestzGetUrlParams;
    payload: apiIngestzGetUrlReqPayload;
};
export type apiIngestzGetUrlReqPayload = {
    /**
     * - [Go: int] Number of presigned upload URLs to generate.
     */
    amount: number;
    /**
     * - Partition key/value pairs that select the table partition the files are ingested into.
     */
    partitions: Record<apiIngestzGetUrlReqPayloadPartitionsKey, apiIngestzGetUrlReqPayloadPartitionsValue>;
    /**
     * - [Go: laketbnamez.TableName] Name of the table, inside the dataset, that receives the uploaded files.
     */
    table: string;
};
export type apiIngestzGetUrlReqPayloadPartitionsKey = string;
export type apiIngestzGetUrlReqPayloadPartitionsValue = string;
export type apiIngestzGetUrlResp = {
    payload: apiIngestzGetUrlRespPayload;
};
export type apiIngestzGetUrlRespPayload = {
    /**
     * - [Go: string] Ingestion token that identifies this ingestion and ties the uploaded files together.
     */
    ingest_id: string;
    /**
     * - Presigned PUT URLs, one per requested file; upload each file to its URL.
     */
    uploads: Array<apiIngestzGetUrlRespPayloadUploadsElement>;
};
export type apiIngestzGetUrlRespPayloadUploadsElement = string;
export type apiPipezGetParams = {
    /**
     * - [Go: lakedsz.Dataset] Dataset identifier.
     */
    dataset: string;
    /**
     * - [Go: string] Pipeline id.
     */
    id: string;
};
export type apiPipezGetReq = {
    params: apiPipezGetParams;
};
export type apiPipezGetResp = {
    payload: apiPipezGetRespPayload;
};
export type apiPipezGetRespPayload = {
    /**
     * - Pipeline and its states.
     */
    pipeline: apiPipezGetRespPayloadPipeline;
};
export type apiPipezGetRespPayloadPipeline = {
    /**
     * - [Go: string] Key identifying runs that cannot overlap.
     */
    concurrent_id: string;
    /**
     * - [Go: string] Dataset identifier.
     */
    dataset: string;
    /**
     * - [Go: string] Pipeline id.
     */
    id: string;
    /**
     * - [Go: string] Pipeline name.
     */
    name: string;
    /**
     * - [Go: solutiondomain.SolutionDomain] Solution domain of the pipeline.
     */
    solution_domain: string;
    /**
     * - Pipeline states, one per status change.
     */
    states: Array<apiPipezGetRespPayloadPipelineStatesElement>;
};
export type apiPipezGetRespPayloadPipelineStatesElement = {
    /**
     * - [Go: string] State creation time.
     */
    created_at: string;
    /**
     * - Params of the run at this state.
     */
    params: Record<apiPipezGetRespPayloadPipelineStatesElementParamsKey, apiPipezGetRespPayloadPipelineStatesElementParamsValue>;
    /**
     * - [Go: string] State status.
     */
    status: string;
};
export type apiPipezGetRespPayloadPipelineStatesElementParamsKey = string;
export type apiPipezGetRespPayloadPipelineStatesElementParamsValue = any;
export type apiPipezListParams = {
    /**
     * - [Go: lakedsz.Dataset] Dataset identifier.
     */
    dataset: string;
};
export type apiPipezListQuery = {
    /**
     * - [Go: string] Cursor to fetch the next page.
     */
    cursor: string;
    /**
     * - [Go: int] Maximum number of results.
     */
    limit: number;
    /**
     * - [Go: string] Filter by pipeline name.
     */
    name: string;
    /**
     * - [Go: solutiondomain.SolutionDomain] Filter by solution domain.
     */
    solution_domain: string;
    /**
     * - [Go: string] Filter by pipeline status.
     */
    status: string;
};
export type apiPipezListReq = {
    params: apiPipezListParams;
    query: apiPipezListQuery;
};
export type apiPipezListResp = {
    payload: apiPipezListRespPayload;
};
export type apiPipezListRespPayload = {
    /**
     * - [Go: string] Cursor for the next page.
     */
    cursor: string;
    /**
     * - List of pipelines.
     */
    pipelines: Array<apiPipezListRespPayloadPipelinesElement>;
};
export type apiPipezListRespPayloadPipelinesElement = {
    /**
     * - [Go: string] Key identifying runs that cannot overlap.
     */
    concurrent_id: string;
    /**
     * - [Go: string] Dataset identifier.
     */
    dataset: string;
    /**
     * - [Go: string] Pipeline id.
     */
    id: string;
    /**
     * - [Go: string] Pipeline name.
     */
    name: string;
    /**
     * - [Go: solutiondomain.SolutionDomain] Solution domain of the pipeline.
     */
    solution_domain: string;
    /**
     * - Pipeline states, one per status change.
     */
    states: Array<apiPipezListRespPayloadPipelinesElementStatesElement>;
};
export type apiPipezListRespPayloadPipelinesElementStatesElement = {
    /**
     * - [Go: string] State creation time.
     */
    created_at: string;
    /**
     * - Params of the run at this state.
     */
    params: Record<apiPipezListRespPayloadPipelinesElementStatesElementParamsKey, apiPipezListRespPayloadPipelinesElementStatesElementParamsValue>;
    /**
     * - [Go: string] State status.
     */
    status: string;
};
export type apiPipezListRespPayloadPipelinesElementStatesElementParamsKey = string;
export type apiPipezListRespPayloadPipelinesElementStatesElementParamsValue = any;
export type apiPipezSchedulerActivateRelevanceFashionRelevanceFashionMainParams = {
    /**
     * - [Go: lakedsz.Dataset] Dataset identifier.
     */
    dataset: string;
};
export type apiPipezSchedulerActivateRelevanceFashionRelevanceFashionMainReq = {
    params: apiPipezSchedulerActivateRelevanceFashionRelevanceFashionMainParams;
    payload: apiPipezSchedulerActivateRelevanceFashionRelevanceFashionMainReqPayload;
};
export type apiPipezSchedulerActivateRelevanceFashionRelevanceFashionMainReqPayload = object;
export type apiPipezSchedulerActivateRelevanceFashionRelevanceFashionMainResp = object;
export type apiPipezSchedulerDeactivateRelevanceFashionRelevanceFashionMainParams = {
    /**
     * - [Go: lakedsz.Dataset] Dataset identifier.
     */
    dataset: string;
};
export type apiPipezSchedulerDeactivateRelevanceFashionRelevanceFashionMainReq = {
    params: apiPipezSchedulerDeactivateRelevanceFashionRelevanceFashionMainParams;
    payload: apiPipezSchedulerDeactivateRelevanceFashionRelevanceFashionMainReqPayload;
};
export type apiPipezSchedulerDeactivateRelevanceFashionRelevanceFashionMainReqPayload = object;
export type apiPipezSchedulerDeactivateRelevanceFashionRelevanceFashionMainResp = object;
export type apiPipezStartRelevanceFashionRelevanceFashionBatchIngestParams = {
    /**
     * - [Go: lakedsz.Dataset] Dataset identifier.
     */
    dataset: string;
};
export type apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReq = {
    params: apiPipezStartRelevanceFashionRelevanceFashionBatchIngestParams;
    payload: apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayload;
};
export type apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayload = {
    params: apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayloadParams;
};
export type apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayloadParams = {
    /**
     * - [Go: string] Batch ingestion id.
     */
    ingest_id: string;
    /**
     * - [Go: laketbnamez.TableName] Table that received the batch.
     */
    table: string;
};
export type apiPipezStartRelevanceFashionRelevanceFashionBatchIngestResp = {
    payload: apiPipezStartRelevanceFashionRelevanceFashionBatchIngestRespPayload;
};
export type apiPipezStartRelevanceFashionRelevanceFashionBatchIngestRespPayload = {
    /**
     * - [Go: string] Pipeline id.
     */
    id: string;
};
export type apiPipezStartRelevanceFashionRelevanceFashionMainParams = {
    /**
     * - [Go: lakedsz.Dataset] Dataset identifier.
     */
    dataset: string;
};
export type apiPipezStartRelevanceFashionRelevanceFashionMainReq = {
    params: apiPipezStartRelevanceFashionRelevanceFashionMainParams;
    payload: apiPipezStartRelevanceFashionRelevanceFashionMainReqPayload;
};
export type apiPipezStartRelevanceFashionRelevanceFashionMainReqPayload = object;
export type apiPipezStartRelevanceFashionRelevanceFashionMainResp = {
    payload: apiPipezStartRelevanceFashionRelevanceFashionMainRespPayload;
};
export type apiPipezStartRelevanceFashionRelevanceFashionMainRespPayload = {
    /**
     * - [Go: string] Pipeline id.
     */
    id: string;
};
export type apiSampleFractionParams = {
    /**
     * - [Go: float64] Fraction Denominator
     */
    denominator: number;
    /**
     * - [Go: float64] Fraction Numerator
     */
    numerator: number;
};
export type apiSampleFractionQuery = {
    /**
     * - [Go: int] Fraction max precision
     */
    precision: number;
    smsg: apiSampleFractionQuerySmsg;
};
export type apiSampleFractionQuerySmsg = {
    /**
     * - [Go: string] message string
     */
    message: string;
};
export type apiSampleFractionReq = {
    params: apiSampleFractionParams;
    query: apiSampleFractionQuery;
    headers: apiSampleFractionReqHeaders;
    payload: apiSampleFractionReqPayload;
};
export type apiSampleFractionReqHeaders = {
    /**
     * - [Go: string] Sample of Trace Id
     */
    x_i6_trace_id: string;
};
export type apiSampleFractionReqPayload = {
    messages: Array<apiSampleFractionReqPayloadMessagesElement>;
    /**
     * - [Go: string] Sample reason of this fraction
     */
    reason: string;
};
export type apiSampleFractionReqPayloadMessagesElement = {
    /**
     * - [Go: string] message string
     */
    message: string;
};
export type apiSampleFractionResp = {
    headers: apiSampleFractionRespHeaders;
    payload: apiSampleFractionRespPayload;
};
export type apiSampleFractionRespHeaders = {
    x_i6_smsg: apiSampleFractionRespHeadersXI6Smsg;
    /**
     * - [Go: string] Sample of any trace message
     */
    x_i6_trace_message: string;
};
export type apiSampleFractionRespHeadersXI6Smsg = {
    /**
     * - [Go: string] message string
     */
    message: string;
};
export type apiSampleFractionRespPayload = {
    /**
     * - [Go: string] Human Fraction Representation
     */
    display: string;
    /**
     * - Output Messages
     */
    messages: Array<apiSampleFractionRespPayloadMessagesElement>;
    /**
     * - [Go: string] Fraction Result
     */
    result: string;
};
export type apiSampleFractionRespPayloadMessagesElement = string;
export type apiTfzModelMetadataParams = {
    /**
     * - [Go: string] Model name.
     */
    model_name: string;
    /**
     * - [Go: string] Model version.
     */
    version: string;
};
export type apiTfzModelMetadataReq = {
    params: apiTfzModelMetadataParams;
};
export type apiTfzModelMetadataResp = {
    payload: apiTfzModelMetadataRespPayload;
};
export type apiTfzModelMetadataRespPayload = {
    /**
     * - Model input tensors.
     */
    inputs: Array<apiTfzModelMetadataRespPayloadInputsElement>;
    /**
     * - Model output tensors.
     */
    outputs: Array<apiTfzModelMetadataRespPayloadOutputsElement>;
};
export type apiTfzModelMetadataRespPayloadInputsElement = {
    /**
     * - [Go: string] Tensor data type.
     */
    dtype: string;
    /**
     * - [Go: int] Tensor index.
     */
    index: number;
    /**
     * - [Go: string] Tensor name.
     */
    name: string;
    /**
     * - Tensor dimensions.
     */
    shape: Array<apiTfzModelMetadataRespPayloadInputsElementShapeElement>;
};
export type apiTfzModelMetadataRespPayloadInputsElementShapeElement = number;
export type apiTfzModelMetadataRespPayloadOutputsElement = {
    /**
     * - [Go: string] Tensor data type.
     */
    dtype: string;
    /**
     * - [Go: int] Tensor index.
     */
    index: number;
    /**
     * - [Go: string] Tensor name.
     */
    name: string;
    /**
     * - Tensor dimensions.
     */
    shape: Array<apiTfzModelMetadataRespPayloadOutputsElementShapeElement>;
};
export type apiTfzModelMetadataRespPayloadOutputsElementShapeElement = number;
export type apiTfzModelPredictParams = {
    /**
     * - [Go: string] Dataset identifier.
     */
    dataset: string;
    /**
     * - [Go: string] Model name.
     */
    model_name: string;
    /**
     * - [Go: string] Model version.
     */
    version: string;
};
export type apiTfzModelPredictReq = {
    params: apiTfzModelPredictParams;
    payload: apiTfzModelPredictReqPayload;
};
export type apiTfzModelPredictReqPayload = {
    /**
     * - [Go: string] Model inputs.
     */
    inputs: string;
    /**
     * - Model partition key/value pairs.
     */
    model_partitions: Record<apiTfzModelPredictReqPayloadModelPartitionsKey, apiTfzModelPredictReqPayloadModelPartitionsValue>;
};
export type apiTfzModelPredictReqPayloadModelPartitionsKey = string;
export type apiTfzModelPredictReqPayloadModelPartitionsValue = string;
export type apiTfzModelPredictResp = {
    payload: apiTfzModelPredictRespPayload;
};
export type apiTfzModelPredictRespPayload = {
    /**
     * - [Go: string] Model outputs.
     */
    outputs: string;
};
export type apiUserAuthDeviceCodeReq = {
    payload: apiUserAuthDeviceCodeReqPayload;
};
export type apiUserAuthDeviceCodeReqPayload = {
    /**
     * - [Go: string] Client application identifier (e.g. i6-cli).
     */
    app: string;
};
export type apiUserAuthDeviceCodeResp = {
    payload: apiUserAuthDeviceCodeRespPayload;
};
export type apiUserAuthDeviceCodeRespPayload = {
    /**
     * - [Go: string] High-entropy secret device code polled by CLI.
     */
    device_code: string;
    /**
     * - [Go: int64] Lifetime of the device code in seconds (typically 900).
     */
    expires_in_sec: number;
    /**
     * - [Go: int] Recommended polling frequency in seconds.
     */
    interval_sec: number;
    /**
     * - [Go: string] Short human-friendly code (e.g. WDJB-MJHT).
     */
    user_code: string;
    /**
     * - [Go: string] URL where the user completes authorization.
     */
    verification_uri: string;
    /**
     * - [Go: string] Verification URL pre-filled with the user_code.
     */
    verification_uri_complete: string;
};
export type apiUserAuthDeviceTokenReq = {
    payload: apiUserAuthDeviceTokenReqPayload;
};
export type apiUserAuthDeviceTokenReqPayload = {
    /**
     * - [Go: string] Secret device code returned by /auth/device/code.
     */
    device_code: string;
};
export type apiUserAuthDeviceTokenResp = {
    payload: apiUserAuthDeviceTokenRespPayload;
};
export type apiUserAuthDeviceTokenRespPayload = {
    /**
     * - [Go: int64] Access token expiration epoch millis.
     */
    expires_at: number;
    /**
     * - [Go: int64] User refresh token expiration epoch millis (30 days).
     */
    refresh_token_expires_at: number;
    /**
     * - [Go: string] Status of the device code: pending | authorized | denied | expired.
     */
    status: string;
    /**
     * - [Go: string] Signed user access token JWT (when authorized).
     */
    user_access_token: string;
    /**
     * - [Go: string] Authenticated user UUID.
     */
    user_id: string;
    /**
     * - [Go: string] Opaque user refresh token session (when authorized).
     */
    user_refresh_token: string;
};
export type apiUserAuthExchangeReq = {
    payload: apiUserAuthExchangeReqPayload;
};
export type apiUserAuthExchangeReqPayload = {
    /**
     * - [Go: string] Short-lived authorization code.
     */
    code: string;
    /**
     * - [Go: string] RFC 7636 PKCE S256 code verifier.
     */
    code_verifier: string;
    /**
     * - [Go: string] Encrypted client state / session metadata.
     */
    ext: string;
};
export type apiUserAuthExchangeResp = {
    payload: apiUserAuthExchangeRespPayload;
};
export type apiUserAuthExchangeRespPayload = {
    /**
     * - [Go: int64] Access token expiration epoch millis.
     */
    expires_at: number;
    /**
     * - [Go: int64] User refresh token expiration epoch millis (30 days).
     */
    refresh_token_expires_at: number;
    /**
     * - [Go: string] Signed user access token JWT.
     */
    user_access_token: string;
    /**
     * - [Go: string] Authenticated user UUID.
     */
    user_id: string;
    /**
     * - [Go: string] Opaque user refresh token.
     */
    user_refresh_token: string;
};
export type apiUserAuthGoogleReq = {
    payload: apiUserAuthGoogleReqPayload;
};
export type apiUserAuthGoogleReqPayload = {
    /**
     * - [Go: string] Client application identifier.
     */
    app: string;
    /**
     * - [Go: string] RFC 7636 S256 PKCE code challenge.
     */
    code_challenge: string;
    /**
     * - [Go: string] Google OAuth ID token or credential string.
     */
    id_token: string;
};
export type apiUserAuthGoogleResp = {
    payload: apiUserAuthGoogleRespPayload;
};
export type apiUserAuthGoogleRespPayload = {
    /**
     * - [Go: string] Single-use PKCE authorization code.
     */
    code: string;
};
export type apiUserAuthLogoutReq = {
    payload: apiUserAuthLogoutReqPayload;
};
export type apiUserAuthLogoutReqPayload = {
    /**
     * - [Go: string] Opaque user refresh token in format <jti>.<secret>.
     */
    refresh_token: string;
};
export type apiUserAuthLogoutResp = {
    payload: apiUserAuthLogoutRespPayload;
};
export type apiUserAuthLogoutRespPayload = {
    /**
     * - [Go: bool] Indicates successful session revocation.
     */
    success: boolean;
};
export type apiUserAuthMeReq = {
    headers: apiUserAuthMeReqHeaders;
};
export type apiUserAuthMeReqHeaders = {
    /**
     * - [Go: string] User Bearer JWT access token.
     */
    authorization: string;
};
export type apiUserAuthMeResp = {
    payload: apiUserAuthMeRespPayload;
};
export type apiUserAuthMeRespPayload = {
    /**
     * - [Go: int64] Account creation timestamp in epoch milliseconds.
     */
    created_at: number;
    /**
     * - [Go: string] Redacted email address for display.
     */
    email_redacted: string;
    /**
     * - List of linked identity providers.
     */
    providers: Array<apiUserAuthMeRespPayloadProvidersElement>;
    /**
     * - [Go: string] User unique identifier.
     */
    user_id: string;
};
export type apiUserAuthMeRespPayloadProvidersElement = string;
export type apiUserAuthPasswordResetReq = {
    payload: apiUserAuthPasswordResetReqPayload;
};
export type apiUserAuthPasswordResetReqPayload = {
    /**
     * - [Go: string] Account email address to send password reset.
     */
    email: string;
};
export type apiUserAuthPasswordResetResp = {
    payload: apiUserAuthPasswordResetRespPayload;
};
export type apiUserAuthPasswordResetRespPayload = {
    /**
     * - [Go: string] Email address where reset was sent.
     */
    email: string;
    /**
     * - [Go: string] Password reset dispatch status.
     */
    status: string;
};
export type apiUserAuthPasswordSigninReq = {
    payload: apiUserAuthPasswordSigninReqPayload;
};
export type apiUserAuthPasswordSigninReqPayload = {
    /**
     * - [Go: string] Client application identifier.
     */
    app: string;
    /**
     * - [Go: string] RFC 7636 S256 PKCE code challenge.
     */
    code_challenge: string;
    /**
     * - [Go: string] User email address.
     */
    email: string;
    /**
     * - [Go: string] User account password.
     */
    password: string;
};
export type apiUserAuthPasswordSigninResp = {
    payload: apiUserAuthPasswordSigninRespPayload;
};
export type apiUserAuthPasswordSigninRespPayload = {
    /**
     * - [Go: string] Single-use PKCE authorization code.
     */
    code: string;
};
export type apiUserAuthPasswordSignupReq = {
    payload: apiUserAuthPasswordSignupReqPayload;
};
export type apiUserAuthPasswordSignupReqPayload = {
    /**
     * - [Go: string] Client application identifier.
     */
    app: string;
    /**
     * - [Go: string] Optional PKCE code challenge.
     */
    code_challenge: string;
    /**
     * - [Go: string] User email address to register.
     */
    email: string;
    /**
     * - [Go: string] Password for the new account.
     */
    password: string;
};
export type apiUserAuthPasswordSignupResp = {
    payload: apiUserAuthPasswordSignupRespPayload;
};
export type apiUserAuthPasswordSignupRespPayload = {
    /**
     * - [Go: string] Registered email address.
     */
    email: string;
    /**
     * - [Go: string] Signup workflow status (e.g. 'verification_email_sent').
     */
    status: string;
};
export type apiUserAuthRefreshReq = {
    payload: apiUserAuthRefreshReqPayload;
};
export type apiUserAuthRefreshReqPayload = {
    /**
     * - [Go: string] Opaque user refresh token in format <jti>.<secret>.
     */
    refresh_token: string;
};
export type apiUserAuthRefreshResp = {
    payload: apiUserAuthRefreshRespPayload;
};
export type apiUserAuthRefreshRespPayload = {
    /**
     * - [Go: int64] Access token expiration epoch millis (1 hour).
     */
    expires_at: number;
    /**
     * - [Go: int64] User refresh token expiration epoch millis (30 days).
     */
    refresh_token_expires_at: number;
    /**
     * - [Go: string] Fresh signed user access token JWT.
     */
    user_access_token: string;
    /**
     * - [Go: string] Authenticated user UUID.
     */
    user_id: string;
    /**
     * - [Go: string] Rotated opaque user refresh token with new secret.
     */
    user_refresh_token: string;
};
export type apiUserDatasetTokenAccessAttenuateReq = {
    headers: apiUserDatasetTokenAccessAttenuateReqHeaders;
    payload: apiUserDatasetTokenAccessAttenuateReqPayload;
};
export type apiUserDatasetTokenAccessAttenuateReqHeaders = {
    /**
     * - [Go: string] Parent Bearer dataset access token.
     */
    authorization: string;
};
export type apiUserDatasetTokenAccessAttenuateReqPayload = {
    /**
     * - [Go: int64] Requested lifetime in seconds (capped at parent exp).
     */
    exp_seconds: number;
    /**
     * - Additional restrictive label constraints.
     */
    newlabels: Record<apiUserDatasetTokenAccessAttenuateReqPayloadNewlabelsKey, apiUserDatasetTokenAccessAttenuateReqPayloadNewlabelsValue>;
    /**
     * - [Go: grants.Grant] Reduced uint8 grant bitmask.
     */
    subgrants: Grant;
    /**
     * - [Go: solution.Solution] Narrowed solution domain.
     */
    subsolution: string;
};
export type apiUserDatasetTokenAccessAttenuateReqPayloadNewlabelsKey = string;
export type apiUserDatasetTokenAccessAttenuateReqPayloadNewlabelsValue = string;
export type apiUserDatasetTokenAccessAttenuateResp = {
    payload: apiUserDatasetTokenAccessAttenuateRespPayload;
};
export type apiUserDatasetTokenAccessAttenuateRespPayload = {
    /**
     * - [Go: string] Attenuated Base64URL dataset access token.
     */
    access_token: string;
    /**
     * - [Go: lakedsz.Dataset] Target dataset ID.
     */
    dataset: string;
    /**
     * - [Go: int64] Expiration epoch milliseconds.
     */
    expires_at: number;
    /**
     * - [Go: grants.Grant] Effective uint8 grant bitmask.
     */
    grants: Grant;
    /**
     * - Effective metadata labels.
     */
    labels: Record<apiUserDatasetTokenAccessAttenuateRespPayloadLabelsKey, apiUserDatasetTokenAccessAttenuateRespPayloadLabelsValue>;
    /**
     * - [Go: solution.Solution] Effective solution domain.
     */
    solution: string;
};
export type apiUserDatasetTokenAccessAttenuateRespPayloadLabelsKey = string;
export type apiUserDatasetTokenAccessAttenuateRespPayloadLabelsValue = string;
export type apiUserDatasetTokenAccessCreateParams = {
    /**
     * - [Go: lakedsz.Dataset] Target dataset ID.
     */
    dataset: string;
};
export type apiUserDatasetTokenAccessCreateReq = {
    params: apiUserDatasetTokenAccessCreateParams;
    headers: apiUserDatasetTokenAccessCreateReqHeaders;
    payload: apiUserDatasetTokenAccessCreateReqPayload;
};
export type apiUserDatasetTokenAccessCreateReqHeaders = {
    /**
     * - [Go: string] User Bearer JWT access token.
     */
    authorization: string;
};
export type apiUserDatasetTokenAccessCreateReqPayload = {
    /**
     * - [Go: string] Base64URL client public key for PoP binding (empty for unbound bearer).
     */
    client_pub_key: string;
    /**
     * - [Go: int64] Requested lifetime in seconds.
     */
    exp_seconds: number;
    /**
     * - [Go: grants.Grant] Compact uint8 grant bitmask.
     */
    grants: Grant;
    /**
     * - Contextual metadata labels.
     */
    labels: Record<apiUserDatasetTokenAccessCreateReqPayloadLabelsKey, apiUserDatasetTokenAccessCreateReqPayloadLabelsValue>;
    /**
     * - [Go: solution.Solution] Target solution domain restriction (empty for all).
     */
    solution: string;
};
export type apiUserDatasetTokenAccessCreateReqPayloadLabelsKey = string;
export type apiUserDatasetTokenAccessCreateReqPayloadLabelsValue = string;
export type apiUserDatasetTokenAccessCreateResp = {
    payload: apiUserDatasetTokenAccessCreateRespPayload;
};
export type apiUserDatasetTokenAccessCreateRespPayload = {
    /**
     * - [Go: string] Binary-packed Base64URL dataset access token.
     */
    access_token: string;
    /**
     * - [Go: lakedsz.Dataset] Target dataset ID.
     */
    dataset: string;
    /**
     * - [Go: int64] Expiration epoch milliseconds.
     */
    expires_at: number;
    /**
     * - [Go: grants.Grant] Effective uint8 grant bitmask.
     */
    grants: Grant;
    /**
     * - Contextual metadata labels.
     */
    labels: Record<apiUserDatasetTokenAccessCreateRespPayloadLabelsKey, apiUserDatasetTokenAccessCreateRespPayloadLabelsValue>;
    /**
     * - [Go: solution.Solution] Solution domain restriction.
     */
    solution: string;
};
export type apiUserDatasetTokenAccessCreateRespPayloadLabelsKey = string;
export type apiUserDatasetTokenAccessCreateRespPayloadLabelsValue = string;
export type apiUserDatasetTokenRefreshCreateParams = {
    /**
     * - [Go: lakedsz.Dataset] Target dataset ID.
     */
    dataset: string;
};
export type apiUserDatasetTokenRefreshCreateReq = {
    params: apiUserDatasetTokenRefreshCreateParams;
    headers: apiUserDatasetTokenRefreshCreateReqHeaders;
    payload: apiUserDatasetTokenRefreshCreateReqPayload;
};
export type apiUserDatasetTokenRefreshCreateReqHeaders = {
    /**
     * - [Go: string] User Bearer JWT access token.
     */
    authorization: string;
};
export type apiUserDatasetTokenRefreshCreateReqPayload = {
    /**
     * - [Go: string] Human-friendly purpose note.
     */
    annotation: string;
    /**
     * - [Go: int64] Lifetime in seconds (optional, defaults to 100 years).
     */
    exp_seconds: number;
    /**
     * - [Go: grants.Grant] Compact uint8 grant bitmask (optional, defaults to caller's registered grants on dataset; limited to registered grants).
     */
    grants: Grant;
    /**
     * - Contextual metadata labels.
     */
    labels: Record<apiUserDatasetTokenRefreshCreateReqPayloadLabelsKey, apiUserDatasetTokenRefreshCreateReqPayloadLabelsValue>;
    /**
     * - [Go: solution.Solution] Solution domain restriction (empty for all).
     */
    solution: string;
};
export type apiUserDatasetTokenRefreshCreateReqPayloadLabelsKey = string;
export type apiUserDatasetTokenRefreshCreateReqPayloadLabelsValue = string;
export type apiUserDatasetTokenRefreshCreateResp = {
    payload: apiUserDatasetTokenRefreshCreateRespPayload;
};
export type apiUserDatasetTokenRefreshCreateRespPayload = {
    /**
     * - [Go: string] Human-friendly purpose note.
     */
    annotation: string;
    /**
     * - [Go: lakedsz.Dataset] Target dataset ID.
     */
    dataset: string;
    /**
     * - [Go: int64] Expiration epoch milliseconds.
     */
    expires_at: number;
    /**
     * - [Go: grants.Grant] Effective uint8 grant bitmask.
     */
    grants: Grant;
    /**
     * - [Go: string] Credential JTI (Base64URL Ed25519 public key).
     */
    jti: string;
    /**
     * - Contextual metadata labels.
     */
    labels: Record<apiUserDatasetTokenRefreshCreateRespPayloadLabelsKey, apiUserDatasetTokenRefreshCreateRespPayloadLabelsValue>;
    /**
     * - [Go: string] Base64URL Ed25519 private key (returned once only).
     */
    priv_key: string;
    /**
     * - [Go: solution.Solution] Solution domain restriction.
     */
    solution: string;
};
export type apiUserDatasetTokenRefreshCreateRespPayloadLabelsKey = string;
export type apiUserDatasetTokenRefreshCreateRespPayloadLabelsValue = string;
export type apiUserDatasetTokenRefreshDeleteParams = {
    /**
     * - [Go: lakedsz.Dataset] Target dataset ID.
     */
    dataset: string;
    /**
     * - [Go: string] Token JTI (public key identifier) to revoke.
     */
    jti: string;
};
export type apiUserDatasetTokenRefreshDeleteReq = {
    params: apiUserDatasetTokenRefreshDeleteParams;
    headers: apiUserDatasetTokenRefreshDeleteReqHeaders;
};
export type apiUserDatasetTokenRefreshDeleteReqHeaders = {
    /**
     * - [Go: string] User Bearer JWT access token.
     */
    authorization: string;
};
export type apiUserDatasetTokenRefreshDeleteResp = object;
export type apiUserDatasetTokenRefreshListParams = {
    /**
     * - [Go: lakedsz.Dataset] Target dataset ID.
     */
    dataset: string;
};
export type apiUserDatasetTokenRefreshListReq = {
    params: apiUserDatasetTokenRefreshListParams;
    headers: apiUserDatasetTokenRefreshListReqHeaders;
};
export type apiUserDatasetTokenRefreshListReqHeaders = {
    /**
     * - [Go: string] User Bearer JWT access token.
     */
    authorization: string;
};
export type apiUserDatasetTokenRefreshListResp = {
    payload: apiUserDatasetTokenRefreshListRespPayload;
};
export type apiUserDatasetTokenRefreshListRespPayload = {
    /**
     * - List of refresh token records.
     */
    tokens: Array<apiUserDatasetTokenRefreshListRespPayloadTokensElement>;
};
export type apiUserDatasetTokenRefreshListRespPayloadTokensElement = {
    /**
     * - [Go: string] Description note.
     */
    annotation: string;
    /**
     * - [Go: int64] Creation timestamp in millis.
     */
    created_at: number;
    /**
     * - [Go: string] User ID who created the token.
     */
    created_by: string;
    /**
     * - [Go: lakedsz.Dataset] Target dataset ID.
     */
    dataset: string;
    /**
     * - [Go: int64] Expiration timestamp in millis.
     */
    expires_at: number;
    /**
     * - [Go: grants.Grant] Grants bitmask.
     */
    grants: Grant;
    /**
     * - [Go: string] Token JTI.
     */
    jti: string;
    /**
     * - Metadata labels.
     */
    labels: Record<apiUserDatasetTokenRefreshListRespPayloadTokensElementLabelsKey, apiUserDatasetTokenRefreshListRespPayloadTokensElementLabelsValue>;
    /**
     * - [Go: int64] Epoch milliseconds when token was last refreshed (0 = never used).
     */
    last_used_at: number;
    /**
     * - [Go: bool] Revocation status flag.
     */
    revoked: boolean;
    /**
     * - [Go: solution.Solution] Solution domain restriction.
     */
    solution: string;
};
export type apiUserDatasetTokenRefreshListRespPayloadTokensElementLabelsKey = string;
export type apiUserDatasetTokenRefreshListRespPayloadTokensElementLabelsValue = string;
export type apiUserDatasetTokenRefreshReq = {
    headers: apiUserDatasetTokenRefreshReqHeaders;
    payload: apiUserDatasetTokenRefreshReqPayload;
};
export type apiUserDatasetTokenRefreshReqHeaders = {
    /**
     * - [Go: string] Standalone 121-byte RefreshAssertion Ed25519 signature.
     */
    x_i6_signature: string;
};
export type apiUserDatasetTokenRefreshReqPayload = {
    /**
     * - [Go: lakedsz.Dataset] Target dataset ID.
     */
    dataset: string;
    /**
     * - [Go: int64] Requested lifetime in seconds.
     */
    exp_seconds: number;
    /**
     * - Additional restrictive label constraints.
     */
    newlabels: Record<apiUserDatasetTokenRefreshReqPayloadNewlabelsKey, apiUserDatasetTokenRefreshReqPayloadNewlabelsValue>;
    /**
     * - [Go: grants.Grant] Optional reduced grant bitmask.
     */
    subgrants: Grant;
    /**
     * - [Go: solution.Solution] Optional sub-solution restriction.
     */
    subsolution: string;
};
export type apiUserDatasetTokenRefreshReqPayloadNewlabelsKey = string;
export type apiUserDatasetTokenRefreshReqPayloadNewlabelsValue = string;
export type apiUserDatasetTokenRefreshResp = {
    payload: apiUserDatasetTokenRefreshRespPayload;
};
export type apiUserDatasetTokenRefreshRespPayload = {
    /**
     * - [Go: string] Binary-packed Base64URL dataset access token.
     */
    access_token: string;
    /**
     * - [Go: lakedsz.Dataset] Target dataset ID.
     */
    dataset: string;
    /**
     * - [Go: int64] Expiration epoch milliseconds.
     */
    expires_at: number;
    /**
     * - [Go: grants.Grant] Effective uint8 grant bitmask.
     */
    grants: Grant;
    /**
     * - Effective metadata labels.
     */
    labels: Record<apiUserDatasetTokenRefreshRespPayloadLabelsKey, apiUserDatasetTokenRefreshRespPayloadLabelsValue>;
    /**
     * - [Go: solution.Solution] Effective solution domain.
     */
    solution: string;
};
export type apiUserDatasetTokenRefreshRespPayloadLabelsKey = string;
export type apiUserDatasetTokenRefreshRespPayloadLabelsValue = string;
export type dszFileStat = {
    /**
     * - missing summary
     */
    url: string;
    /**
     * - missing summary
     */
    content_type: string;
    /**
     * - missing summary
     */
    md5: string;
    /**
     * - missing summary
     */
    size: string;
    /**
     * - missing summary
     */
    etag: string;
    /**
     * - missing summary
     */
    created_at: dszTime;
    /**
     * - missing summary
     */
    updated_at: dszTime;
};
export type dszTime = string;
export type sdkFuncProductRelevanceFashionDashAttachedRevenueInput = {
    /**
     * - [Go: lakedsz.Dataset] Dataset identifier.
     */
    dataset: string;
    /**
     * - Query params.
     */
    params: sdkFuncProductRelevanceFashionDashAttachedRevenueInputParams;
};
export type sdkFuncProductRelevanceFashionDashAttachedRevenueInputParams = {
    /**
     * - [Go: string] Last year-month of the period.
     */
    max_year_month: string;
    /**
     * - [Go: string] First year-month of the period.
     */
    min_year_month: string;
};
export type sdkFuncProductRelevanceFashionDashAttachedRevenueOutput = {
    /**
     * - Result rows.
     */
    rows: Array<sdkFuncProductRelevanceFashionDashAttachedRevenueOutputRowsElement>;
};
export type sdkFuncProductRelevanceFashionDashAttachedRevenueOutputRowsElement = {
    /**
     * - [Go: float64] Purchases attached to recommendations.
     */
    attached_purchases: number;
    /**
     * - [Go: float64] Revenue attached to recommendations.
     */
    attached_revenue: number;
    /**
     * - [Go: float64] SKUs attached to recommendations.
     */
    attached_skus: number;
    /**
     * - [Go: float64] Average ticket value.
     */
    avg_ticket: number;
};
export type sdkFuncProductRelevanceFashionDashAttachedRevenuePartitions = {
    /**
     * - [Go: string] Store identifier.
     */
    store_id: string;
};
export type sdkFuncProductRelevanceFashionDashAttachedRevenueReq = {
    input: sdkFuncProductRelevanceFashionDashAttachedRevenueInput;
    partitions: sdkFuncProductRelevanceFashionDashAttachedRevenuePartitions;
};
export type sdkFuncProductRelevanceFashionDashAttachedRevenueResp = {
    output: sdkFuncProductRelevanceFashionDashAttachedRevenueOutput;
};
export type sdkFuncProductRelevanceFashionDashCoverageInput = {
    /**
     * - [Go: lakedsz.Dataset] Dataset identifier.
     */
    dataset: string;
    /**
     * - Query params.
     */
    params: sdkFuncProductRelevanceFashionDashCoverageInputParams;
};
export type sdkFuncProductRelevanceFashionDashCoverageInputParams = {
    /**
     * - [Go: string] Last year-month of the period.
     */
    max_year_month: string;
    /**
     * - [Go: string] First year-month of the period.
     */
    min_year_month: string;
};
export type sdkFuncProductRelevanceFashionDashCoverageOutput = {
    /**
     * - Result rows.
     */
    rows: Array<sdkFuncProductRelevanceFashionDashCoverageOutputRowsElement>;
};
export type sdkFuncProductRelevanceFashionDashCoverageOutputRowsElement = {
    /**
     * - [Go: float64] Coverage of the bottom 90% items.
     */
    bottom_90_coverage: number;
    /**
     * - [Go: float64] Coverage of the long tail items.
     */
    long_tail_coverage: number;
    /**
     * - [Go: float64] Share of recommendable items that were recommended.
     */
    recomendation_coverage: number;
    /**
     * - [Go: float64] Number of items eligible to be recommended.
     */
    recommendable_items: number;
    /**
     * - [Go: float64] Number of distinct items recommended.
     */
    recommended_items: number;
    /**
     * - [Go: float64] Coverage of the top 1% items.
     */
    top_1_coverage: number;
    /**
     * - [Go: float64] Coverage of the items between top 1% and top 5%.
     */
    top_1_to_5_coverage: number;
    /**
     * - [Go: float64] Coverage of the items between top 5% and top 10%.
     */
    top_5_to_10_coverage: number;
};
export type sdkFuncProductRelevanceFashionDashCoveragePartitions = {
    /**
     * - [Go: string] Store identifier.
     */
    store_id: string;
};
export type sdkFuncProductRelevanceFashionDashCoverageReq = {
    input: sdkFuncProductRelevanceFashionDashCoverageInput;
    partitions: sdkFuncProductRelevanceFashionDashCoveragePartitions;
};
export type sdkFuncProductRelevanceFashionDashCoverageResp = {
    output: sdkFuncProductRelevanceFashionDashCoverageOutput;
};
export type sdkFuncProductRelevanceFashionDashFunnelInput = {
    /**
     * - [Go: lakedsz.Dataset] Dataset identifier.
     */
    dataset: string;
    /**
     * - Query params.
     */
    params: sdkFuncProductRelevanceFashionDashFunnelInputParams;
};
export type sdkFuncProductRelevanceFashionDashFunnelInputParams = {
    /**
     * - [Go: string] Last year-month of the period.
     */
    max_year_month: string;
    /**
     * - [Go: string] First year-month of the period.
     */
    min_year_month: string;
};
export type sdkFuncProductRelevanceFashionDashFunnelOutput = {
    /**
     * - Result rows.
     */
    rows: Array<sdkFuncProductRelevanceFashionDashFunnelOutputRowsElement>;
};
export type sdkFuncProductRelevanceFashionDashFunnelOutputRowsElement = {
    /**
     * - [Go: string] Event type.
     */
    event_type: string;
    /**
     * - [Go: string] Whether the event came from a recommendation.
     */
    from_rec: string;
    /**
     * - [Go: string] Number of events.
     */
    qt_events: string;
};
export type sdkFuncProductRelevanceFashionDashFunnelPartitions = {
    /**
     * - [Go: string] Store identifier.
     */
    store_id: string;
};
export type sdkFuncProductRelevanceFashionDashFunnelReq = {
    input: sdkFuncProductRelevanceFashionDashFunnelInput;
    partitions: sdkFuncProductRelevanceFashionDashFunnelPartitions;
};
export type sdkFuncProductRelevanceFashionDashFunnelResp = {
    output: sdkFuncProductRelevanceFashionDashFunnelOutput;
};
export type sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryInput = {
    /**
     * - [Go: lakedsz.Dataset] Dataset identifier.
     */
    dataset: string;
    /**
     * - Query params.
     */
    params: sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryInputParams;
};
export type sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryInputParams = {
    /**
     * - [Go: string] Last year-month of the period.
     */
    max_year_month: string;
    /**
     * - [Go: string] First year-month of the period.
     */
    min_year_month: string;
};
export type sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryOutput = {
    /**
     * - Result rows.
     */
    rows: Array<sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryOutputRowsElement>;
};
export type sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryOutputRowsElement = {
    /**
     * - [Go: float64] Number of cart adds.
     */
    cart_adds: number;
    /**
     * - [Go: float64] Number of clicks.
     */
    clicks: number;
    /**
     * - [Go: float64] Conversion rate.
     */
    conversion_rate: number;
    /**
     * - [Go: float64] Participation share.
     */
    participation: number;
    /**
     * - [Go: float64] Number of purchases.
     */
    purchases: number;
    /**
     * - [Go: float64] Number of recommendations.
     */
    recomendations: number;
    /**
     * - [Go: float64] Revenue.
     */
    revenue: number;
    /**
     * - [Go: string] Showcase category.
     */
    showcase_category: string;
};
export type sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryPartitions = {
    /**
     * - [Go: string] Store identifier.
     */
    store_id: string;
};
export type sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryReq = {
    input: sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryInput;
    partitions: sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryPartitions;
};
export type sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryResp = {
    output: sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryOutput;
};
export type sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuInput = {
    /**
     * - [Go: lakedsz.Dataset] Dataset identifier.
     */
    dataset: string;
    /**
     * - Query params.
     */
    params: sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuInputParams;
};
export type sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuInputParams = {
    /**
     * - [Go: string] Last year-month of the period.
     */
    max_year_month: string;
    /**
     * - [Go: string] First year-month of the period.
     */
    min_year_month: string;
};
export type sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuOutput = {
    /**
     * - Result rows.
     */
    rows: Array<sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuOutputRowsElement>;
};
export type sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuOutputRowsElement = {
    /**
     * - [Go: float64] Number of cart adds.
     */
    cart_adds: number;
    /**
     * - [Go: float64] Number of clicks.
     */
    clicks: number;
    /**
     * - [Go: float64] Conversion rate.
     */
    conversion_rate: number;
    /**
     * - [Go: string] SKU description.
     */
    description: string;
    /**
     * - [Go: float64] Engagement rate.
     */
    engagement_rate: number;
    /**
     * - [Go: float64] Participation share.
     */
    participation: number;
    /**
     * - [Go: float64] Number of purchases.
     */
    purchases: number;
    /**
     * - [Go: float64] Number of recommendations.
     */
    recomendations: number;
    /**
     * - [Go: float64] Revenue.
     */
    revenue: number;
    /**
     * - [Go: string] Showcase category.
     */
    showcase_category: string;
    /**
     * - [Go: string] SKU identifier.
     */
    sku_id: string;
};
export type sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuPartitions = {
    /**
     * - [Go: string] Store identifier.
     */
    store_id: string;
};
export type sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuReq = {
    input: sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuInput;
    partitions: sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuPartitions;
};
export type sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuResp = {
    output: sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuOutput;
};
export type sdkFuncProductRelevanceFashionDashListShowcaseCategoriesInput = {
    /**
     * - [Go: lakedsz.Dataset] Dataset identifier.
     */
    dataset: string;
};
export type sdkFuncProductRelevanceFashionDashListShowcaseCategoriesOutput = {
    /**
     * - Result rows.
     */
    rows: Array<sdkFuncProductRelevanceFashionDashListShowcaseCategoriesOutputRowsElement>;
};
export type sdkFuncProductRelevanceFashionDashListShowcaseCategoriesOutputRowsElement = {
    /**
     * - [Go: string] Showcase category.
     */
    showcase_category: string;
};
export type sdkFuncProductRelevanceFashionDashListShowcaseCategoriesPartitions = {
    /**
     * - [Go: string] Store identifier.
     */
    store_id: string;
};
export type sdkFuncProductRelevanceFashionDashListShowcaseCategoriesReq = {
    input: sdkFuncProductRelevanceFashionDashListShowcaseCategoriesInput;
    partitions: sdkFuncProductRelevanceFashionDashListShowcaseCategoriesPartitions;
};
export type sdkFuncProductRelevanceFashionDashListShowcaseCategoriesResp = {
    output: sdkFuncProductRelevanceFashionDashListShowcaseCategoriesOutput;
};
export type sdkFuncProductRelevanceFashionFbtInput = {
    /**
     * - [Go: lakedsz.Dataset] Dataset identifier.
     */
    dataset: string;
    /**
     * - [Go: string] Session identifier.
     */
    session_id: string;
    /**
     * - SKUs to find matches for.
     */
    skus: Array<sdkFuncProductRelevanceFashionFbtInputSkusElement>;
    /**
     * - [Go: string] User identifier.
     */
    user_id: string;
};
export type sdkFuncProductRelevanceFashionFbtInputSkusElement = {
    /**
     * - [Go: string] SKU identifier.
     */
    sku_id: string;
};
export type sdkFuncProductRelevanceFashionFbtOutput = {
    /**
     * - Inference results.
     */
    results: Array<sdkFuncProductRelevanceFashionFbtOutputResultsElement>;
};
export type sdkFuncProductRelevanceFashionFbtOutputResultsElement = {
    /**
     * - [Go: float64] Result rating.
     */
    rating: number;
    /**
     * - Matching SKUs.
     */
    skus: Array<sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElement>;
};
export type sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElement = {
    /**
     * - [Go: string] SKU identifier.
     */
    sku_id: string;
};
export type sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElementEnriched = {
    /**
     * - Id of the sku. Required; the only field sent to i6 (in the recshow event)
     */
    sku_id: string;
    /**
     * - Model rating, higher is more relevant. The default selectResults sets the rating of the result the sku was picked from
     */
    rating: number;
    /**
     * - Optional: any data your selectResults attaches to the sku (e.g. name, price, image). Returned to you as is, never sent to i6. The default selectResults does not set it
     */
    enriched: any;
};
export type sdkFuncProductRelevanceFashionFbtPartitions = {
    /**
     * - [Go: string] Store identifier.
     */
    store_id: string;
};
export type sdkFuncProductRelevanceFashionFbtReq = {
    input: sdkFuncProductRelevanceFashionFbtInput;
    partitions: sdkFuncProductRelevanceFashionFbtPartitions;
};
export type sdkFuncProductRelevanceFashionFbtResp = {
    output: sdkFuncProductRelevanceFashionFbtOutput;
};
export type sdkFuncProductRelevanceFashionFbtSelected = {
    /**
     * - Skus to show, in the order selectResults returned them
     */
    results: Array<sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElementEnriched>;
};
/**
 * @typedef {import("../invoker/invoker.js").ServiceOptions} ServiceOptions
 */
/**
 * @template T
 * @typedef {T} i6JsonEmbedded
 */
/**
 * [Go: grants.Grant] Compact permission bitmask: 1=System, 2=Admin, 4=Write, 8=Read, 15=All. Combine using bitwise OR (|) or bitmapz.join(...).
 * @typedef {1 | 2 | 4 | 8 | number} Grant
 */
/**
 * apiDszCreateCustomerPortal params
 * @typedef {object} apiDszCreateCustomerPortalParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset of the customer
 */
/**
 * apiDszCreateCustomerPortal Request
 * @typedef {object} apiDszCreateCustomerPortalReq
 * @property {apiDszCreateCustomerPortalParams} params
 * @property {apiDszCreateCustomerPortalReqPayload} payload
 */
/**
 * apiDszCreateCustomerPortal reqPayload
 * @typedef {object} apiDszCreateCustomerPortalReqPayload
 * @property {string} locale - [Go: string] Locale for the portal interface, defaults to en-US if empty (e.g. pt-BR, en-US)
 * @property {string} return_url - [Go: string] URL where the user is redirected when leaving the portal
 */
/**
 * apiDszCreateCustomerPortal Response
 * @typedef {object} apiDszCreateCustomerPortalResp
 * @property {apiDszCreateCustomerPortalRespPayload} payload
 */
/**
 * apiDszCreateCustomerPortal respPayload
 * @typedef {object} apiDszCreateCustomerPortalRespPayload
 * @property {string} url - [Go: string] URL of the Stripe customer portal session
 */
/**
 * apiDszCreateIngestionToken params
 * @typedef {object} apiDszCreateIngestionTokenParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset to create the ingestion token for.
 */
/**
 * apiDszCreateIngestionToken Request
 * @typedef {object} apiDszCreateIngestionTokenReq
 * @property {apiDszCreateIngestionTokenParams} params
 * @property {apiDszCreateIngestionTokenReqPayload} payload
 */
/**
 * apiDszCreateIngestionToken reqPayload
 * @typedef {object} apiDszCreateIngestionTokenReqPayload
 * @property {string} annotation - [Go: string] Optional note or annotation identifying the purpose of this token.
 */
/**
 * apiDszCreateIngestionToken Response
 * @typedef {object} apiDszCreateIngestionTokenResp
 * @property {apiDszCreateIngestionTokenRespPayload} payload
 */
/**
 * apiDszCreateIngestionToken respPayload
 * @typedef {object} apiDszCreateIngestionTokenRespPayload
 * @property {string} annotation - [Go: string] Note identifying the purpose of the token.
 * @property {string} audience - [Go: string] Token audience.
 * @property {string} channel - [Go: string] Sales channel the token is restricted to.
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset identifier.
 * @property {number} expiration_date - [Go: int64] Token expiration date.
 * @property {Array<apiDszCreateIngestionTokenRespPayloadGrantsElement>} grants - Permissions granted by the token.
 * @property {string} id - [Go: string] Token id.
 * @property {string} jti - [Go: string] Token unique id (JWT id).
 * @property {string} token - [Go: string] Token value.
 */
/**
 * [Go: string]
 * @typedef {string} apiDszCreateIngestionTokenRespPayloadGrantsElement
 */
/**
 * apiDszCreateRecsysToken params
 * @typedef {object} apiDszCreateRecsysTokenParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset to create the recommendation system token for.
 */
/**
 * apiDszCreateRecsysToken Request
 * @typedef {object} apiDszCreateRecsysTokenReq
 * @property {apiDszCreateRecsysTokenParams} params
 * @property {apiDszCreateRecsysTokenReqPayload} payload
 */
/**
 * apiDszCreateRecsysToken reqPayload
 * @typedef {object} apiDszCreateRecsysTokenReqPayload
 * @property {string} annotation - [Go: string] Optional note or annotation identifying the purpose of this token.
 * @property {string} channel - [Go: string] Sales/distribution channel this recommendation token is restricted to (e.g. retail).
 */
/**
 * apiDszCreateRecsysToken Response
 * @typedef {object} apiDszCreateRecsysTokenResp
 * @property {apiDszCreateRecsysTokenRespPayload} payload
 */
/**
 * apiDszCreateRecsysToken respPayload
 * @typedef {object} apiDszCreateRecsysTokenRespPayload
 * @property {string} annotation - [Go: string] Note identifying the purpose of the token.
 * @property {string} audience - [Go: string] Token audience.
 * @property {string} channel - [Go: string] Sales channel the token is restricted to.
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset identifier.
 * @property {number} expiration_date - [Go: int64] Token expiration date.
 * @property {Array<apiDszCreateRecsysTokenRespPayloadGrantsElement>} grants - Permissions granted by the token.
 * @property {string} id - [Go: string] Token id.
 * @property {string} jti - [Go: string] Token unique id (JWT id).
 * @property {string} token - [Go: string] Token value.
 */
/**
 * [Go: string]
 * @typedef {string} apiDszCreateRecsysTokenRespPayloadGrantsElement
 */
/**
 * apiDszCreateStore params
 * @typedef {object} apiDszCreateStoreParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset containing the store config to create.
 */
/**
 * apiDszCreateStore Request
 * @typedef {object} apiDszCreateStoreReq
 * @property {apiDszCreateStoreParams} params
 * @property {apiDszCreateStoreReqPayload} payload
 */
/**
 * apiDszCreateStore reqPayload
 * @typedef {object} apiDszCreateStoreReqPayload
 * @property {apiDszCreateStoreReqPayloadStore} store - Store configuration object details.
 */
/**
 * Store configuration object details.
 * @typedef {object} apiDszCreateStoreReqPayloadStore
 * @property {string} id - [Go: storeid.StoreId] Unique identifier of the store.
 * @property {string} name - [Go: string] Human-readable name of the store.
 * @property {Array<apiDszCreateStoreReqPayloadStoreSolutionDomainsElement>} solution_domains - Solution domains associated with this store.
 */
/**
 * [Go: solutiondomain.SolutionDomain] Solution domain association.
 * @typedef {string} apiDszCreateStoreReqPayloadStoreSolutionDomainsElement
 */
/**
 * apiDszCreateStore Response
 * @typedef {object} apiDszCreateStoreResp
 */
/**
 * apiDszDatasetSolutions params
 * @typedef {object} apiDszDatasetSolutionsParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset identifier to list active solutions for.
 */
/**
 * apiDszDatasetSolutions Request
 * @typedef {object} apiDszDatasetSolutionsReq
 * @property {apiDszDatasetSolutionsParams} params
 */
/**
 * apiDszDatasetSolutions Response
 * @typedef {object} apiDszDatasetSolutionsResp
 * @property {apiDszDatasetSolutionsRespPayload} payload
 */
/**
 * apiDszDatasetSolutions respPayload
 * @typedef {object} apiDszDatasetSolutionsRespPayload
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset identifier.
 * @property {Array<apiDszDatasetSolutionsRespPayloadSolutionsElement>} solutions - Active solutions associated with this dataset.
 */
/**
 * [Go: solution.Solution]
 * @typedef {string} apiDszDatasetSolutionsRespPayloadSolutionsElement
 */
/**
 * apiDszDeleteToken params
 * @typedef {object} apiDszDeleteTokenParams
 * @property {string} dataset - [Go: lakedsz.Dataset] The dataset whose token should be deleted.
 */
/**
 * apiDszDeleteToken query
 * @typedef {object} apiDszDeleteTokenQuery
 * @property {string} token - [Go: string] The token identifier (jti) to be deleted/revoked.
 */
/**
 * apiDszDeleteToken Request
 * @typedef {object} apiDszDeleteTokenReq
 * @property {apiDszDeleteTokenParams} params
 * @property {apiDszDeleteTokenQuery} query
 */
/**
 * apiDszDeleteToken Response
 * @typedef {object} apiDszDeleteTokenResp
 */
/**
 * apiDszDomainGet params
 * @typedef {object} apiDszDomainGetParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset identifier containing the store.
 */
/**
 * apiDszDomainGet query
 * @typedef {object} apiDszDomainGetQuery
 * @property {string} store_id - [Go: storeid.StoreId] Store identifier to query solutions and domains for.
 */
/**
 * apiDszDomainGet Request
 * @typedef {object} apiDszDomainGetReq
 * @property {apiDszDomainGetParams} params
 * @property {apiDszDomainGetQuery} query
 */
/**
 * apiDszDomainGet Response
 * @typedef {object} apiDszDomainGetResp
 * @property {apiDszDomainGetRespPayload} payload
 */
/**
 * apiDszDomainGet respPayload
 * @typedef {object} apiDszDomainGetRespPayload
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset identifier.
 * @property {Array<apiDszDomainGetRespPayloadSolutionsElement>} solutions - List of solution and domain configurations mapping to this store.
 * @property {string} store_id - [Go: storeid.StoreId] Store identifier.
 */
/**
 * Solution and domain configuration mapping for a store.
 * @typedef {object} apiDszDomainGetRespPayloadSolutionsElement
 * @property {string} domain - [Go: domain.Domain] Domain associated with the solution (e.g. relevance_fashion).
 * @property {string} solution - [Go: solution.Solution] Solution type, such as relevance.
 */
/**
 * apiDszGetSubscription params
 * @typedef {object} apiDszGetSubscriptionParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset of the subscription
 * @property {string} solution - [Go: solution.Solution] Solution (product) of the subscription
 */
/**
 * apiDszGetSubscription Request
 * @typedef {object} apiDszGetSubscriptionReq
 * @property {apiDszGetSubscriptionParams} params
 */
/**
 * apiDszGetSubscription Response
 * @typedef {object} apiDszGetSubscriptionResp
 * @property {apiDszGetSubscriptionRespPayload} payload
 */
/**
 * apiDszGetSubscription respPayload
 * @typedef {object} apiDszGetSubscriptionRespPayload
 * @property {dszTime} cancel_at - [Go: time.Time] When the subscription will be or was canceled, in UTC; null when there is no cancellation
 * @property {boolean} cancel_at_period_end - [Go: bool] Whether the subscription will be canceled at the end of the current period
 * @property {dszTime} created_at - [Go: time.Time] When the subscription was created, in UTC
 * @property {dszTime} current_period_end_at - [Go: time.Time] End of the current period, in UTC
 * @property {dszTime} current_period_start_at - [Go: time.Time] Start of the current period, in UTC
 * @property {dszTime} next_invoice_at - [Go: time.Time] When the next invoice is scheduled, in UTC; null if none
 * @property {string} plan_key - [Go: string] Lookup key of the base price in Stripe, like relevance_growth_base_monthly
 * @property {string} status - [Go: string] Status of the subscription in Stripe, without translation: active, trialing, past_due, unpaid, incomplete, canceled, incomplete_expired or paused
 * @property {dszTime} trial_end_at - [Go: time.Time] When the subscription trial ends, in UTC; null if there is no trial
 * @property {dszTime} trial_start_at - [Go: time.Time] When the subscription trial started, in UTC; null if there is no trial
 */
/**
 * apiDszListDatasets params
 * @typedef {object} apiDszListDatasetsParams
 * @property {string} userId - [Go: string] User identifier (id).
 */
/**
 * apiDszListDatasets Request
 * @typedef {object} apiDszListDatasetsReq
 * @property {apiDszListDatasetsParams} params
 */
/**
 * apiDszListDatasets Response
 * @typedef {object} apiDszListDatasetsResp
 * @property {apiDszListDatasetsRespPayload} payload
 */
/**
 * apiDszListDatasets respPayload
 * @typedef {object} apiDszListDatasetsRespPayload
 * @property {Array<apiDszListDatasetsRespPayloadDatasetsElement>} datasets - List of datasets available to the user.
 */
/**
 * Dataset object.
 * @typedef {object} apiDszListDatasetsRespPayloadDatasetsElement
 * @property {Grant} grants - [Go: grants.Grant] Compact grant bitmask held by the user on this dataset.
 * @property {string} id - [Go: string] Unique identifier of the dataset.
 * @property {string} name - [Go: string] Human-readable name of the dataset.
 */
/**
 * apiDszListIngestionTokens params
 * @typedef {object} apiDszListIngestionTokensParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset whose ingestion tokens should be listed.
 */
/**
 * apiDszListIngestionTokens Request
 * @typedef {object} apiDszListIngestionTokensReq
 * @property {apiDszListIngestionTokensParams} params
 */
/**
 * apiDszListIngestionTokens Response
 * @typedef {object} apiDszListIngestionTokensResp
 * @property {apiDszListIngestionTokensRespPayload} payload
 */
/**
 * apiDszListIngestionTokens respPayload
 * @typedef {object} apiDszListIngestionTokensRespPayload
 * @property {Array<apiDszListIngestionTokensRespPayloadTokensElement>} tokens - List of ingestion tokens configured for this dataset.
 */
/**
 * @typedef {object} apiDszListIngestionTokensRespPayloadTokensElement
 * @property {string} annotation - [Go: string] Note identifying the purpose of the token.
 * @property {string} audience - [Go: string] Token audience.
 * @property {string} channel - [Go: string] Sales channel the token is restricted to.
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset identifier.
 * @property {number} expiration_date - [Go: int64] Token expiration date.
 * @property {Array<apiDszListIngestionTokensRespPayloadTokensElementGrantsElement>} grants - Permissions granted by the token.
 * @property {string} id - [Go: string] Token id.
 * @property {string} jti - [Go: string] Token unique id (JWT id).
 * @property {string} token - [Go: string] Token value.
 */
/**
 * [Go: string]
 * @typedef {string} apiDszListIngestionTokensRespPayloadTokensElementGrantsElement
 */
/**
 * apiDszListPayments params
 * @typedef {object} apiDszListPaymentsParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset of the payments
 */
/**
 * apiDszListPayments Request
 * @typedef {object} apiDszListPaymentsReq
 * @property {apiDszListPaymentsParams} params
 */
/**
 * apiDszListPayments Response
 * @typedef {object} apiDszListPaymentsResp
 * @property {apiDszListPaymentsRespPayload} payload
 */
/**
 * apiDszListPayments respPayload
 * @typedef {object} apiDszListPaymentsRespPayload
 * @property {Array<apiDszListPaymentsRespPayloadPaymentsElement>} payments - Payments in the order of Stripe, newest first
 */
/**
 * @typedef {object} apiDszListPaymentsRespPayloadPaymentsElement
 * @property {number} amount_due - [Go: int64] Amount due, in the minor unit of the currency (cents)
 * @property {number} amount_paid - [Go: int64] Amount paid, in the minor unit of the currency (cents)
 * @property {dszTime} created - [Go: time.Time] When the invoice was created, in UTC
 * @property {string} currency - [Go: string] Three-letter currency code, like brl
 * @property {string} id - [Go: string] Id of the invoice in Stripe
 * @property {string} invoice_pdf_url - [Go: string] Pdf of the invoice
 * @property {Array<apiDszListPaymentsRespPayloadPaymentsElementLinesElement>} lines - Line items of the invoice
 * @property {string} number - [Go: string] Number of the invoice
 * @property {dszTime} period_end - [Go: time.Time] End of the billing period, in UTC
 * @property {dszTime} period_start - [Go: time.Time] Start of the billing period, in UTC
 * @property {string} receipt_pdf_url - [Go: string] Pdf of the receipt
 * @property {string} status - [Go: string] Status of the invoice in Stripe, without translation: draft, open, paid, uncollectible or void
 */
/**
 * @typedef {object} apiDszListPaymentsRespPayloadPaymentsElementLinesElement
 * @property {number} amount - [Go: int64] Amount of the line item in minor unit
 * @property {string} description - [Go: string] Description of the line item
 * @property {string} id - [Go: string] Id of the line item in Stripe
 * @property {string} solution - [Go: solution.Solution] Solution (product) of the line item
 */
/**
 * apiDszListPlans params
 * @typedef {object} apiDszListPlansParams
 * @property {string} solution - [Go: solution.Solution] Solution (product) to list plans from
 */
/**
 * apiDszListPlans Request
 * @typedef {object} apiDszListPlansReq
 * @property {apiDszListPlansParams} params
 */
/**
 * apiDszListPlans Response
 * @typedef {object} apiDszListPlansResp
 * @property {apiDszListPlansRespPayload} payload
 */
/**
 * apiDszListPlans respPayload
 * @typedef {object} apiDszListPlansRespPayload
 * @property {Array<apiDszListPlansRespPayloadPlansElement>} plans - Allowed plans, each one found in Stripe
 */
/**
 * @typedef {object} apiDszListPlansRespPayloadPlansElement
 * @property {number} amount - [Go: int64] Same as lic_amount, kept for compatibility
 * @property {string} currency - [Go: string] Three-letter currency code, like brl
 * @property {string} description - [Go: string] Price description set in Stripe (the price nickname), to show to the user
 * @property {string} frequency - [Go: string] Billing frequency of the plan, like monthly
 * @property {number} included_requests - [Go: int64] Requests included per period of the plan. null means unlimited; absent means not informed
 * @property {string} key - [Go: string] Plan key (base of the Stripe lookup keys {key}_lic and {key}_req), used to switch to the plan
 * @property {number} lic_amount - [Go: int64] License price in the minor unit of the currency (cents)
 * @property {string} name - [Go: string] Name of the plan, like 2027
 * @property {number} req_amount - [Go: int64] Request count price in the minor unit of the currency (cents)
 * @property {string} req_amount_decimal - [Go: string] Price of each request above included_requests, in cents with decimal places, as Stripe unit_amount_decimal (like 0.0294). "0" means no extra charge; absent means not configured
 * @property {string} tier - [Go: string] Tier of the plan, like growth
 */
/**
 * apiDszListRecsysTokens params
 * @typedef {object} apiDszListRecsysTokensParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset whose recommendation system tokens should be listed.
 */
/**
 * apiDszListRecsysTokens Request
 * @typedef {object} apiDszListRecsysTokensReq
 * @property {apiDszListRecsysTokensParams} params
 */
/**
 * apiDszListRecsysTokens Response
 * @typedef {object} apiDszListRecsysTokensResp
 * @property {apiDszListRecsysTokensRespPayload} payload
 */
/**
 * apiDszListRecsysTokens respPayload
 * @typedef {object} apiDszListRecsysTokensRespPayload
 * @property {Array<apiDszListRecsysTokensRespPayloadTokensElement>} tokens - List of recommendation system tokens configured for this dataset.
 */
/**
 * @typedef {object} apiDszListRecsysTokensRespPayloadTokensElement
 * @property {string} annotation - [Go: string] Note identifying the purpose of the token.
 * @property {string} audience - [Go: string] Token audience.
 * @property {string} channel - [Go: string] Sales channel the token is restricted to.
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset identifier.
 * @property {number} expiration_date - [Go: int64] Token expiration date.
 * @property {Array<apiDszListRecsysTokensRespPayloadTokensElementGrantsElement>} grants - Permissions granted by the token.
 * @property {string} id - [Go: string] Token id.
 * @property {string} jti - [Go: string] Token unique id (JWT id).
 * @property {string} token - [Go: string] Token value.
 */
/**
 * [Go: string]
 * @typedef {string} apiDszListRecsysTokensRespPayloadTokensElementGrantsElement
 */
/**
 * apiDszListStores params
 * @typedef {object} apiDszListStoresParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset to list stores from.
 */
/**
 * apiDszListStores Request
 * @typedef {object} apiDszListStoresReq
 * @property {apiDszListStoresParams} params
 */
/**
 * apiDszListStores Response
 * @typedef {object} apiDszListStoresResp
 * @property {apiDszListStoresRespPayload} payload
 */
/**
 * apiDszListStores respPayload
 * @typedef {object} apiDszListStoresRespPayload
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset identifier.
 * @property {Array<apiDszListStoresRespPayloadStoresElement>} stores - List of store configurations.
 */
/**
 * Store configuration object details.
 * @typedef {object} apiDszListStoresRespPayloadStoresElement
 * @property {string} id - [Go: storeid.StoreId] Unique identifier of the store.
 * @property {string} name - [Go: string] Human-readable name of the store.
 * @property {Array<apiDszListStoresRespPayloadStoresElementSolutionDomainsElement>} solution_domains - Solution domains associated with this store.
 */
/**
 * [Go: solutiondomain.SolutionDomain] Solution domain association.
 * @typedef {string} apiDszListStoresRespPayloadStoresElementSolutionDomainsElement
 */
/**
 * apiDszModelGet params
 * @typedef {object} apiDszModelGetParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset to generate signed URLs for.
 * @property {string} model_name - [Go: string] Model name
 */
/**
 * apiDszModelGet Request
 * @typedef {object} apiDszModelGetReq
 * @property {apiDszModelGetParams} params
 * @property {apiDszModelGetReqPayload} payload
 */
/**
 * apiDszModelGet reqPayload
 * @typedef {object} apiDszModelGetReqPayload
 * @property {Record<apiDszModelGetReqPayloadModelPartitionsKey, apiDszModelGetReqPayloadModelPartitionsValue>} model_partitions - Model partition key/value pairs
 * @property {string} model_version - [Go: string] Model version
 */
/**
 * [Go: string]
 * @typedef {string} apiDszModelGetReqPayloadModelPartitionsKey
 */
/**
 * [Go: string]
 * @typedef {string} apiDszModelGetReqPayloadModelPartitionsValue
 */
/**
 * apiDszModelGet Response
 * @typedef {object} apiDszModelGetResp
 * @property {apiDszModelGetRespPayload} payload
 */
/**
 * apiDszModelGet respPayload
 * @typedef {object} apiDszModelGetRespPayload
 * @property {Array<apiDszModelGetRespPayloadUrlsElement>} urls - Signed URLs
 */
/**
 * File associated with a model, along with its presigned access URL.
 * @typedef {object} apiDszModelGetRespPayloadUrlsElement
 * @property {string} name - [Go: string] File Name
 * @property {string} url - [Go: string] signed URL.
 */
/**
 * apiDszResultLastBatchSummary params
 * @typedef {object} apiDszResultLastBatchSummaryParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset.
 */
/**
 * apiDszResultLastBatchSummary query
 * @typedef {object} apiDszResultLastBatchSummaryQuery
 * @property {string} store_id - [Go: storeid.StoreId] Store ID to query.
 * @property {string} table - [Go: laketbnamez.TableName] Table of the batch in question.
 */
/**
 * apiDszResultLastBatchSummary Request
 * @typedef {object} apiDszResultLastBatchSummaryReq
 * @property {apiDszResultLastBatchSummaryParams} params
 * @property {apiDszResultLastBatchSummaryQuery} query
 */
/**
 * apiDszResultLastBatchSummary Response
 * @typedef {object} apiDszResultLastBatchSummaryResp
 * @property {apiDszResultLastBatchSummaryRespPayload} payload
 */
/**
 * apiDszResultLastBatchSummary respPayload
 * @typedef {object} apiDszResultLastBatchSummaryRespPayload
 * @property {apiDszResultLastBatchSummaryRespPayloadData} data - Summary of the batch data loaded into the store datalake.
 */
/**
 * Summary of the batch data loaded into the store datalake.
 * @typedef {object} apiDszResultLastBatchSummaryRespPayloadData
 * @property {Array<apiDszResultLastBatchSummaryRespPayloadDataColumnSummariesElement>} column_summaries - Summaries of distinct and null counts per column.
 * @property {string} ingested_at - [Go: string] Batch ingestion date.
 * @property {number} row_count - [Go: int] Number of rows in the batch.
 * @property {string} store_id - [Go: string] Store identifier.
 */
/**
 * @typedef {object} apiDszResultLastBatchSummaryRespPayloadDataColumnSummariesElement
 * @property {string} column_name - [Go: string] Name of the column.
 * @property {number} distinct_count - [Go: int] Number of distinct values in the column.
 * @property {number} null_count - [Go: int] Number of null values in the column.
 */
/**
 * apiDszResultRelevanceFashionCatalog params
 * @typedef {object} apiDszResultRelevanceFashionCatalogParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset.
 */
/**
 * apiDszResultRelevanceFashionCatalog query
 * @typedef {object} apiDszResultRelevanceFashionCatalogQuery
 * @property {string} store_id - [Go: storeid.StoreId] Store ID to query.
 */
/**
 * apiDszResultRelevanceFashionCatalog Request
 * @typedef {object} apiDszResultRelevanceFashionCatalogReq
 * @property {apiDszResultRelevanceFashionCatalogParams} params
 * @property {apiDszResultRelevanceFashionCatalogQuery} query
 */
/**
 * apiDszResultRelevanceFashionCatalog Response
 * @typedef {object} apiDszResultRelevanceFashionCatalogResp
 * @property {apiDszResultRelevanceFashionCatalogRespPayload} payload
 */
/**
 * apiDszResultRelevanceFashionCatalog respPayload
 * @typedef {object} apiDszResultRelevanceFashionCatalogRespPayload
 * @property {Array<apiDszResultRelevanceFashionCatalogRespPayloadDataElement>} data - Store simple catalog loaded from the datalake file.
 */
/**
 * @typedef {object} apiDszResultRelevanceFashionCatalogRespPayloadDataElement
 * @property {string} sku_ds - [Go: string] SKU description.
 * @property {string} sku_id - [Go: string] SKU identifier.
 * @property {string} store_id - [Go: storeid.StoreId] Store identifier.
 */
/**
 * apiDszSignedUrl params
 * @typedef {object} apiDszSignedUrlParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset to generate signed URLs for.
 */
/**
 * apiDszSignedUrl Request
 * @typedef {object} apiDszSignedUrlReq
 * @property {apiDszSignedUrlParams} params
 * @property {apiDszSignedUrlReqPayload} payload
 */
/**
 * apiDszSignedUrl reqPayload
 * @typedef {object} apiDszSignedUrlReqPayload
 * @property {Array<apiDszSignedUrlReqPayloadPathsElement>} paths - List of paths and HTTP methods to generate signed URLs for.
 */
/**
 * Path and HTTP method specification for a signed URL.
 * @typedef {object} apiDszSignedUrlReqPayloadPathsElement
 * @property {string} method - [Go: fszsignmethod.SignMethod] HTTP method (e.g. GET, PUT) for the signed URL.
 * @property {string} path - [Go: laketbpathz.Path] File path within the dataset.
 */
/**
 * apiDszSignedUrl Response
 * @typedef {object} apiDszSignedUrlResp
 * @property {apiDszSignedUrlRespPayload} payload
 */
/**
 * apiDszSignedUrl respPayload
 * @typedef {object} apiDszSignedUrlRespPayload
 * @property {Array<apiDszSignedUrlRespPayloadUrlsElement>} urls - Signed URLs
 */
/**
 * @typedef {object} apiDszSignedUrlRespPayloadUrlsElement
 * @property {string} url - [Go: string] signed URL.
 */
/**
 * apiDszStoreDisplayCreate params
 * @typedef {object} apiDszStoreDisplayCreateParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset containing the store.
 */
/**
 * apiDszStoreDisplayCreate Request
 * @typedef {object} apiDszStoreDisplayCreateReq
 * @property {apiDszStoreDisplayCreateParams} params
 * @property {apiDszStoreDisplayCreateReqPayload} payload
 */
/**
 * apiDszStoreDisplayCreate reqPayload
 * @typedef {object} apiDszStoreDisplayCreateReqPayload
 * @property {apiDszStoreDisplayCreateReqPayloadDisplay} display - Store display configuration details.
 * @property {string} store_id - [Go: storeid.StoreId] Unique identifier of the store.
 */
/**
 * Store display configuration details.
 * @typedef {object} apiDszStoreDisplayCreateReqPayloadDisplay
 * @property {string} id - [Go: storedisplayid.StoreDisplayId] Unique identifier of the store display.
 * @property {string} model_name - [Go: string] Name of the recommendation/relevance model associated with this display.
 * @property {string} name - [Go: string] Human-readable name of the store display.
 */
/**
 * apiDszStoreDisplayCreate Response
 * @typedef {object} apiDszStoreDisplayCreateResp
 * @property {apiDszStoreDisplayCreateRespPayload} payload
 */
/**
 * apiDszStoreDisplayCreate respPayload
 * @typedef {object} apiDszStoreDisplayCreateRespPayload
 * @property {apiDszStoreDisplayCreateRespPayloadDisplay} display - Created store display configuration details.
 */
/**
 * Created store display configuration details.
 * @typedef {object} apiDszStoreDisplayCreateRespPayloadDisplay
 * @property {string} id - [Go: storedisplayid.StoreDisplayId] Unique identifier of the store display.
 * @property {string} name - [Go: string] Human-readable name of the store display.
 */
/**
 * apiDszStoreDisplayList params
 * @typedef {object} apiDszStoreDisplayListParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset containing the store displays to list.
 */
/**
 * apiDszStoreDisplayList query
 * @typedef {object} apiDszStoreDisplayListQuery
 * @property {string} store_id - [Go: storeid.StoreId] Store identifier whose displays should be listed.
 */
/**
 * apiDszStoreDisplayList Request
 * @typedef {object} apiDszStoreDisplayListReq
 * @property {apiDszStoreDisplayListParams} params
 * @property {apiDszStoreDisplayListQuery} query
 */
/**
 * apiDszStoreDisplayList Response
 * @typedef {object} apiDszStoreDisplayListResp
 * @property {apiDszStoreDisplayListRespPayload} payload
 */
/**
 * apiDszStoreDisplayList respPayload
 * @typedef {object} apiDszStoreDisplayListRespPayload
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset identifier.
 * @property {Array<apiDszStoreDisplayListRespPayloadDisplaysElement>} displays - List of store display configurations.
 * @property {string} store_id - [Go: storeid.StoreId] Store identifier.
 */
/**
 * Store display configuration details.
 * @typedef {object} apiDszStoreDisplayListRespPayloadDisplaysElement
 * @property {string} id - [Go: storedisplayid.StoreDisplayId] Unique identifier of the store display.
 * @property {string} name - [Go: string] Human-readable name of the store display.
 */
/**
 * apiDszStripeCheckout Request
 * @typedef {object} apiDszStripeCheckoutReq
 * @property {apiDszStripeCheckoutReqPayload} payload
 */
/**
 * apiDszStripeCheckout reqPayload
 * @typedef {object} apiDszStripeCheckoutReqPayload
 * @property {string} campaign_state - [Go: string] Base64 state token with the metadata of the checkout; the service parses it
 * @property {string} cancel_url - [Go: string] Url to go after a canceled checkout
 * @property {string} dataset_name - [Go: string] Dataset name
 * @property {string} document - [Go: string] Document of the buyer
 * @property {string} payment_email - [Go: string] Email of the buyer used in Stripe
 * @property {string} payment_phone - [Go: string] Phone of the buyer
 * @property {string} plan - [Go: string] Plan key to buy, like relevance_growth_monthly_2027; the service gets the prices {plan}_lic and {plan}_req from the Stripe prices api and sends both to the checkout
 * @property {string} success_url - [Go: string] Url to go after a successful checkout
 * @property {string} user_exchange_callback_url - [Go: string] Optional exchange callback URL for redeeming checkout artifact ticket
 */
/**
 * apiDszStripeCheckout Response
 * @typedef {object} apiDszStripeCheckoutResp
 * @property {apiDszStripeCheckoutRespPayload} payload
 */
/**
 * apiDszStripeCheckout respPayload
 * @typedef {object} apiDszStripeCheckoutRespPayload
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset that is going to be created after the payment; its id starts with ds
 * @property {string} id - [Go: string] Checkout session id
 * @property {string} url - [Go: string] Checkout session url
 */
/**
 * apiDszTableGet params
 * @typedef {object} apiDszTableGetParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset.
 * @property {string} path - [Go: string] Path to the file without schema.
 */
/**
 * apiDszTableGet Request
 * @typedef {object} apiDszTableGetReq
 * @property {apiDszTableGetParams} params
 */
/**
 * apiDszTableGet Response
 * @typedef {object} apiDszTableGetResp
 * @property {apiDszTableGetRespHeaders} headers
 */
/**
 * apiDszTableGet respHeaders
 * @typedef {object} apiDszTableGetRespHeaders
 * @property {string} location - [Go: string] Redirect URL for the file.
 */
/**
 * apiDszTableList params
 * @typedef {object} apiDszTableListParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset to list tables from.
 */
/**
 * apiDszTableList query
 * @typedef {object} apiDszTableListQuery
 * @property {string} from_cursor - [Go: string] Pagination cursor.
 * @property {number} limist - [Go: int] Limit the number of results.
 * @property {string} path - [Go: laketbpathz.Path] Path to list.
 * @property {boolean} recursive - [Go: bool] Whether to list recursively.
 * @property {string} sign_method - [Go: fszsignmethod.SignMethod] Whether to return signed URLs.
 * @property {boolean} stat - [Go: bool] Whether to include file stats.
 */
/**
 * apiDszTableList Request
 * @typedef {object} apiDszTableListReq
 * @property {apiDszTableListParams} params
 * @property {apiDszTableListQuery} query
 */
/**
 * apiDszTableList Response
 * @typedef {object} apiDszTableListResp
 * @property {apiDszTableListRespPayload} payload
 */
/**
 * apiDszTableList respPayload
 * @typedef {object} apiDszTableListRespPayload
 * @property {Array<apiDszTableListRespPayloadFilesElement>} files - Files and tables found.
 * @property {string} next_cursor - [Go: string] Cursor for the next page of results.
 */
/**
 * File entry
 * @typedef {object} apiDszTableListRespPayloadFilesElement
 * @property {string} path - [Go: laketbpathz.Path] The path of the file or table.
 * @property {string} signed_url - [Go: string] The presigned download/access URL for the file, if sign method was requested.
 * @property {dszFileStat} stat - [Go: fsz.FileStat] The metadata and stats of the file (size, modified time, etc.), if requested.
 */
/**
 * apiDszUpdatePaymentAutoRenew params
 * @typedef {object} apiDszUpdatePaymentAutoRenewParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset of the payment
 * @property {string} solution - [Go: solution.Solution] Solution (product) of the payment
 */
/**
 * apiDszUpdatePaymentAutoRenew Request
 * @typedef {object} apiDszUpdatePaymentAutoRenewReq
 * @property {apiDszUpdatePaymentAutoRenewParams} params
 * @property {apiDszUpdatePaymentAutoRenewReqPayload} payload
 */
/**
 * apiDszUpdatePaymentAutoRenew reqPayload
 * @typedef {object} apiDszUpdatePaymentAutoRenewReqPayload
 * @property {boolean} auto_renew - [Go: bool] True to enable auto renew, false to turn it off
 */
/**
 * apiDszUpdatePaymentAutoRenew Response
 * @typedef {object} apiDszUpdatePaymentAutoRenewResp
 */
/**
 * apiDszUpdateSubscriptionPlan params
 * @typedef {object} apiDszUpdateSubscriptionPlanParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset of the subscription
 * @property {string} solution - [Go: solution.Solution] Solution (product) of the subscription
 */
/**
 * apiDszUpdateSubscriptionPlan Request
 * @typedef {object} apiDszUpdateSubscriptionPlanReq
 * @property {apiDszUpdateSubscriptionPlanParams} params
 * @property {apiDszUpdateSubscriptionPlanReqPayload} payload
 */
/**
 * apiDszUpdateSubscriptionPlan reqPayload
 * @typedef {object} apiDszUpdateSubscriptionPlanReqPayload
 * @property {string} plan - [Go: string] Lookup key of the new Stripe price
 */
/**
 * apiDszUpdateSubscriptionPlan Response
 * @typedef {object} apiDszUpdateSubscriptionPlanResp
 */
/**
 * apiIngestzEventRelevanceFashionCatalog params
 * @typedef {object} apiIngestzEventRelevanceFashionCatalogParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset that receives the stream data.
 */
/**
 * apiIngestzEventRelevanceFashionCatalog Request
 * @typedef {object} apiIngestzEventRelevanceFashionCatalogReq
 * @property {apiIngestzEventRelevanceFashionCatalogParams} params
 * @property {apiIngestzEventRelevanceFashionCatalogReqPayload} payload
 */
/**
 * apiIngestzEventRelevanceFashionCatalog reqPayload
 * @typedef {object} apiIngestzEventRelevanceFashionCatalogReqPayload
 * @property {string} id - [Go: string] Catalog entry id.
 * @property {boolean} inactive - [Go: bool] Whether the SKU is inactive.
 * @property {string} product_id - [Go: string] Product identifier.
 * @property {string} sku_ds - [Go: string] SKU description.
 * @property {string} sku_id - [Go: string] SKU identifier.
 * @property {string} store_id - [Go: string] Store identifier.
 */
/**
 * apiIngestzEventRelevanceFashionCatalog Response
 * @typedef {object} apiIngestzEventRelevanceFashionCatalogResp
 */
/**
 * apiIngestzEventRelevanceFashionEvent params
 * @typedef {object} apiIngestzEventRelevanceFashionEventParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset that receives the stream data.
 */
/**
 * apiIngestzEventRelevanceFashionEvent Request
 * @typedef {object} apiIngestzEventRelevanceFashionEventReq
 * @property {apiIngestzEventRelevanceFashionEventParams} params
 * @property {apiIngestzEventRelevanceFashionEventReqPayload} payload
 */
/**
 * apiIngestzEventRelevanceFashionEvent reqPayload
 * @typedef {object} apiIngestzEventRelevanceFashionEventReqPayload
 * @property {apiIngestzEventRelevanceFashionEventReqPayloadAddToCart} add_to_cart - AddToCart event payload. SkuId is required; price must be non-negative.
 * @property {apiIngestzEventRelevanceFashionEventReqPayloadClick} click - Click event payload. SkuId is required; price must be non-negative.
 * @property {dszTime} created_at - [Go: time.Time] Timestamp of event creation (required).
 * @property {string} display_id - [Go: bigquery.NullString] Optional display identifier.
 * @property {string} id - [Go: string] Unique identifier for the event (required).
 * @property {apiIngestzEventRelevanceFashionEventReqPayloadPurchase} purchase - Purchase event payload. OrderId is required and skus must not be empty.
 * @property {apiIngestzEventRelevanceFashionEventReqPayloadRecraw} recraw - Recraw event payload representing raw recommendations. RecId, ModelId, and Payload are required.
 * @property {apiIngestzEventRelevanceFashionEventReqPayloadRecshow} recshow - Recshow event payload representing displayed recommendations. RecId and Payload are required.
 * @property {apiIngestzEventRelevanceFashionEventReqPayloadRemoveFromCart} remove_from_cart - RemoveFromCart event payload. SkuId is required; price must be non-negative.
 * @property {apiIngestzEventRelevanceFashionEventReqPayloadSearch} search - Search event payload. Text is required.
 * @property {string} session_id - [Go: string] Identifier of the user session (required).
 * @property {string} store_id - [Go: string] Identifier of the store (required).
 * @property {string} user_id - [Go: bigquery.NullString] Optional user identifier.
 */
/**
 * AddToCart event payload. SkuId is required; price must be non-negative.
 * @typedef {object} apiIngestzEventRelevanceFashionEventReqPayloadAddToCart
 * @property {number} price - [Go: float64] Price of the added SKU (non-negative).
 * @property {string} sku_id - [Go: string] SKU identifier (required).
 */
/**
 * Click event payload. SkuId is required; price must be non-negative.
 * @typedef {object} apiIngestzEventRelevanceFashionEventReqPayloadClick
 * @property {number} price - [Go: float64] Price of the clicked SKU (non-negative).
 * @property {string} sku_id - [Go: string] SKU identifier (required).
 */
/**
 * Purchase event payload. OrderId is required and skus must not be empty.
 * @typedef {object} apiIngestzEventRelevanceFashionEventReqPayloadPurchase
 * @property {string} order_id - [Go: string] Order identifier (required).
 * @property {Array<apiIngestzEventRelevanceFashionEventReqPayloadPurchaseSkusElement>} skus - List of purchased SKUs (must not be empty).
 */
/**
 * PurchaseSku represents an individual item in a purchase. SkuId is required, unit_price must be non-negative, and qtty must be greater than 0.
 * @typedef {object} apiIngestzEventRelevanceFashionEventReqPayloadPurchaseSkusElement
 * @property {number} qtty - [Go: int64] Quantity of the purchased item (must be greater than 0).
 * @property {string} sku_id - [Go: string] SKU identifier (required).
 * @property {number} unit_price - [Go: float64] Unit price of the item (non-negative).
 */
/**
 * Recraw event payload representing raw recommendations. RecId, ModelId, and Payload are required.
 * @typedef {object} apiIngestzEventRelevanceFashionEventReqPayloadRecraw
 * @property {string} model_id - [Go: string] Model identifier (required).
 * @property {string} model_version - [Go: string] Model version string.
 * @property {string} payload - [Go: string] Raw recommendation payload (required).
 * @property {string} rec_id - [Go: string] Recommendation identifier (required).
 */
/**
 * Recshow event payload representing displayed recommendations. RecId and Payload are required.
 * @typedef {object} apiIngestzEventRelevanceFashionEventReqPayloadRecshow
 * @property {string} model_id - [Go: string] Model identifier.
 * @property {string} model_version - [Go: string] Model version string.
 * @property {string} payload - [Go: string] Displayed recommendation payload (required).
 * @property {string} rec_id - [Go: string] Recommendation identifier (required).
 */
/**
 * RemoveFromCart event payload. SkuId is required; price must be non-negative.
 * @typedef {object} apiIngestzEventRelevanceFashionEventReqPayloadRemoveFromCart
 * @property {number} price - [Go: float64] Price of the removed SKU (non-negative).
 * @property {string} sku_id - [Go: string] SKU identifier (required).
 */
/**
 * Search event payload. Text is required.
 * @typedef {object} apiIngestzEventRelevanceFashionEventReqPayloadSearch
 * @property {string} text - [Go: string] Search query text (required).
 */
/**
 * apiIngestzEventRelevanceFashionEvent Response
 * @typedef {object} apiIngestzEventRelevanceFashionEventResp
 */
/**
 * apiIngestzGetUrl params
 * @typedef {object} apiIngestzGetUrlParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset that receives the uploaded files.
 */
/**
 * apiIngestzGetUrl Request
 * @typedef {object} apiIngestzGetUrlReq
 * @property {apiIngestzGetUrlParams} params
 * @property {apiIngestzGetUrlReqPayload} payload
 */
/**
 * apiIngestzGetUrl reqPayload
 * @typedef {object} apiIngestzGetUrlReqPayload
 * @property {number} amount - [Go: int] Number of presigned upload URLs to generate.
 * @property {Record<apiIngestzGetUrlReqPayloadPartitionsKey, apiIngestzGetUrlReqPayloadPartitionsValue>} partitions - Partition key/value pairs that select the table partition the files are ingested into.
 * @property {string} table - [Go: laketbnamez.TableName] Name of the table, inside the dataset, that receives the uploaded files.
 */
/**
 * [Go: string]
 * @typedef {string} apiIngestzGetUrlReqPayloadPartitionsKey
 */
/**
 * [Go: string]
 * @typedef {string} apiIngestzGetUrlReqPayloadPartitionsValue
 */
/**
 * apiIngestzGetUrl Response
 * @typedef {object} apiIngestzGetUrlResp
 * @property {apiIngestzGetUrlRespPayload} payload
 */
/**
 * apiIngestzGetUrl respPayload
 * @typedef {object} apiIngestzGetUrlRespPayload
 * @property {string} ingest_id - [Go: string] Ingestion token that identifies this ingestion and ties the uploaded files together.
 * @property {Array<apiIngestzGetUrlRespPayloadUploadsElement>} uploads - Presigned PUT URLs, one per requested file; upload each file to its URL.
 */
/**
 * [Go: string]
 * @typedef {string} apiIngestzGetUrlRespPayloadUploadsElement
 */
/**
 * apiPipezGet params
 * @typedef {object} apiPipezGetParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset identifier.
 * @property {string} id - [Go: string] Pipeline id.
 */
/**
 * apiPipezGet Request
 * @typedef {object} apiPipezGetReq
 * @property {apiPipezGetParams} params
 */
/**
 * apiPipezGet Response
 * @typedef {object} apiPipezGetResp
 * @property {apiPipezGetRespPayload} payload
 */
/**
 * apiPipezGet respPayload
 * @typedef {object} apiPipezGetRespPayload
 * @property {apiPipezGetRespPayloadPipeline} pipeline - Pipeline and its states.
 */
/**
 * Pipeline and its states.
 * @typedef {object} apiPipezGetRespPayloadPipeline
 * @property {string} concurrent_id - [Go: string] Key identifying runs that cannot overlap.
 * @property {string} dataset - [Go: string] Dataset identifier.
 * @property {string} id - [Go: string] Pipeline id.
 * @property {string} name - [Go: string] Pipeline name.
 * @property {string} solution_domain - [Go: solutiondomain.SolutionDomain] Solution domain of the pipeline.
 * @property {Array<apiPipezGetRespPayloadPipelineStatesElement>} states - Pipeline states, one per status change.
 */
/**
 * @typedef {object} apiPipezGetRespPayloadPipelineStatesElement
 * @property {string} created_at - [Go: string] State creation time.
 * @property {Record<apiPipezGetRespPayloadPipelineStatesElementParamsKey, apiPipezGetRespPayloadPipelineStatesElementParamsValue>} params - Params of the run at this state.
 * @property {string} status - [Go: string] State status.
 */
/**
 * [Go: string]
 * @typedef {string} apiPipezGetRespPayloadPipelineStatesElementParamsKey
 */
/**
 * [Go: any]
 * @typedef {any} apiPipezGetRespPayloadPipelineStatesElementParamsValue
 */
/**
 * apiPipezList params
 * @typedef {object} apiPipezListParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset identifier.
 */
/**
 * apiPipezList query
 * @typedef {object} apiPipezListQuery
 * @property {string} cursor - [Go: string] Cursor to fetch the next page.
 * @property {number} limit - [Go: int] Maximum number of results.
 * @property {string} name - [Go: string] Filter by pipeline name.
 * @property {string} solution_domain - [Go: solutiondomain.SolutionDomain] Filter by solution domain.
 * @property {string} status - [Go: string] Filter by pipeline status.
 */
/**
 * apiPipezList Request
 * @typedef {object} apiPipezListReq
 * @property {apiPipezListParams} params
 * @property {apiPipezListQuery} query
 */
/**
 * apiPipezList Response
 * @typedef {object} apiPipezListResp
 * @property {apiPipezListRespPayload} payload
 */
/**
 * apiPipezList respPayload
 * @typedef {object} apiPipezListRespPayload
 * @property {string} cursor - [Go: string] Cursor for the next page.
 * @property {Array<apiPipezListRespPayloadPipelinesElement>} pipelines - List of pipelines.
 */
/**
 * @typedef {object} apiPipezListRespPayloadPipelinesElement
 * @property {string} concurrent_id - [Go: string] Key identifying runs that cannot overlap.
 * @property {string} dataset - [Go: string] Dataset identifier.
 * @property {string} id - [Go: string] Pipeline id.
 * @property {string} name - [Go: string] Pipeline name.
 * @property {string} solution_domain - [Go: solutiondomain.SolutionDomain] Solution domain of the pipeline.
 * @property {Array<apiPipezListRespPayloadPipelinesElementStatesElement>} states - Pipeline states, one per status change.
 */
/**
 * @typedef {object} apiPipezListRespPayloadPipelinesElementStatesElement
 * @property {string} created_at - [Go: string] State creation time.
 * @property {Record<apiPipezListRespPayloadPipelinesElementStatesElementParamsKey, apiPipezListRespPayloadPipelinesElementStatesElementParamsValue>} params - Params of the run at this state.
 * @property {string} status - [Go: string] State status.
 */
/**
 * [Go: string]
 * @typedef {string} apiPipezListRespPayloadPipelinesElementStatesElementParamsKey
 */
/**
 * [Go: any]
 * @typedef {any} apiPipezListRespPayloadPipelinesElementStatesElementParamsValue
 */
/**
 * apiPipezSchedulerActivateRelevanceFashionRelevanceFashionMain params
 * @typedef {object} apiPipezSchedulerActivateRelevanceFashionRelevanceFashionMainParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset identifier.
 */
/**
 * apiPipezSchedulerActivateRelevanceFashionRelevanceFashionMain Request
 * @typedef {object} apiPipezSchedulerActivateRelevanceFashionRelevanceFashionMainReq
 * @property {apiPipezSchedulerActivateRelevanceFashionRelevanceFashionMainParams} params
 * @property {apiPipezSchedulerActivateRelevanceFashionRelevanceFashionMainReqPayload} payload
 */
/**
 * apiPipezSchedulerActivateRelevanceFashionRelevanceFashionMain reqPayload
 * @typedef {object} apiPipezSchedulerActivateRelevanceFashionRelevanceFashionMainReqPayload
 */
/**
 * apiPipezSchedulerActivateRelevanceFashionRelevanceFashionMain Response
 * @typedef {object} apiPipezSchedulerActivateRelevanceFashionRelevanceFashionMainResp
 */
/**
 * apiPipezSchedulerDeactivateRelevanceFashionRelevanceFashionMain params
 * @typedef {object} apiPipezSchedulerDeactivateRelevanceFashionRelevanceFashionMainParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset identifier.
 */
/**
 * apiPipezSchedulerDeactivateRelevanceFashionRelevanceFashionMain Request
 * @typedef {object} apiPipezSchedulerDeactivateRelevanceFashionRelevanceFashionMainReq
 * @property {apiPipezSchedulerDeactivateRelevanceFashionRelevanceFashionMainParams} params
 * @property {apiPipezSchedulerDeactivateRelevanceFashionRelevanceFashionMainReqPayload} payload
 */
/**
 * apiPipezSchedulerDeactivateRelevanceFashionRelevanceFashionMain reqPayload
 * @typedef {object} apiPipezSchedulerDeactivateRelevanceFashionRelevanceFashionMainReqPayload
 */
/**
 * apiPipezSchedulerDeactivateRelevanceFashionRelevanceFashionMain Response
 * @typedef {object} apiPipezSchedulerDeactivateRelevanceFashionRelevanceFashionMainResp
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionBatchIngest params
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionBatchIngestParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset identifier.
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionBatchIngest Request
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReq
 * @property {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestParams} params
 * @property {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayload} payload
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionBatchIngest reqPayload
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayload
 * @property {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayloadParams} params
 */
/**
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayloadParams
 * @property {string} ingest_id - [Go: string] Batch ingestion id.
 * @property {string} table - [Go: laketbnamez.TableName] Table that received the batch.
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionBatchIngest Response
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionBatchIngestResp
 * @property {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestRespPayload} payload
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionBatchIngest respPayload
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionBatchIngestRespPayload
 * @property {string} id - [Go: string] Pipeline id.
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionMain params
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionMainParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset identifier.
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionMain Request
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionMainReq
 * @property {apiPipezStartRelevanceFashionRelevanceFashionMainParams} params
 * @property {apiPipezStartRelevanceFashionRelevanceFashionMainReqPayload} payload
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionMain reqPayload
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionMainReqPayload
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionMain Response
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionMainResp
 * @property {apiPipezStartRelevanceFashionRelevanceFashionMainRespPayload} payload
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionMain respPayload
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionMainRespPayload
 * @property {string} id - [Go: string] Pipeline id.
 */
/**
 * apiSampleFraction params
 * @typedef {object} apiSampleFractionParams
 * @property {number} denominator - [Go: float64] Fraction Denominator
 * @property {number} numerator - [Go: float64] Fraction Numerator
 */
/**
 * apiSampleFraction query
 * @typedef {object} apiSampleFractionQuery
 * @property {number} precision - [Go: int] Fraction max precision
 * @property {apiSampleFractionQuerySmsg} smsg
 */
/**
 * @typedef {object} apiSampleFractionQuerySmsg
 * @property {string} message - [Go: string] message string
 */
/**
 * apiSampleFraction Request
 * @typedef {object} apiSampleFractionReq
 * @property {apiSampleFractionParams} params
 * @property {apiSampleFractionQuery} query
 * @property {apiSampleFractionReqHeaders} headers
 * @property {apiSampleFractionReqPayload} payload
 */
/**
 * apiSampleFraction reqHeaders
 * @typedef {object} apiSampleFractionReqHeaders
 * @property {string} x_i6_trace_id - [Go: string] Sample of Trace Id
 */
/**
 * apiSampleFraction reqPayload
 * @typedef {object} apiSampleFractionReqPayload
 * @property {Array<apiSampleFractionReqPayloadMessagesElement>} messages
 * @property {string} reason - [Go: string] Sample reason of this fraction
 */
/**
 * message
 * @typedef {object} apiSampleFractionReqPayloadMessagesElement
 * @property {string} message - [Go: string] message string
 */
/**
 * apiSampleFraction Response
 * @typedef {object} apiSampleFractionResp
 * @property {apiSampleFractionRespHeaders} headers
 * @property {apiSampleFractionRespPayload} payload
 */
/**
 * apiSampleFraction respHeaders
 * @typedef {object} apiSampleFractionRespHeaders
 * @property {apiSampleFractionRespHeadersXI6Smsg} x_i6_smsg
 * @property {string} x_i6_trace_message - [Go: string] Sample of any trace message
 */
/**
 * @typedef {object} apiSampleFractionRespHeadersXI6Smsg
 * @property {string} message - [Go: string] message string
 */
/**
 * apiSampleFraction respPayload
 * @typedef {object} apiSampleFractionRespPayload
 * @property {string} display - [Go: string] Human Fraction Representation
 * @property {Array<apiSampleFractionRespPayloadMessagesElement>} messages - Output Messages
 * @property {string} result - [Go: string] Fraction Result
 */
/**
 * [Go: string]
 * @typedef {string} apiSampleFractionRespPayloadMessagesElement
 */
/**
 * apiTfzModelMetadata params
 * @typedef {object} apiTfzModelMetadataParams
 * @property {string} model_name - [Go: string] Model name.
 * @property {string} version - [Go: string] Model version.
 */
/**
 * apiTfzModelMetadata Request
 * @typedef {object} apiTfzModelMetadataReq
 * @property {apiTfzModelMetadataParams} params
 */
/**
 * apiTfzModelMetadata Response
 * @typedef {object} apiTfzModelMetadataResp
 * @property {apiTfzModelMetadataRespPayload} payload
 */
/**
 * apiTfzModelMetadata respPayload
 * @typedef {object} apiTfzModelMetadataRespPayload
 * @property {Array<apiTfzModelMetadataRespPayloadInputsElement>} inputs - Model input tensors.
 * @property {Array<apiTfzModelMetadataRespPayloadOutputsElement>} outputs - Model output tensors.
 */
/**
 * @typedef {object} apiTfzModelMetadataRespPayloadInputsElement
 * @property {string} dtype - [Go: string] Tensor data type.
 * @property {number} index - [Go: int] Tensor index.
 * @property {string} name - [Go: string] Tensor name.
 * @property {Array<apiTfzModelMetadataRespPayloadInputsElementShapeElement>} shape - Tensor dimensions.
 */
/**
 * [Go: int]
 * @typedef {number} apiTfzModelMetadataRespPayloadInputsElementShapeElement
 */
/**
 * @typedef {object} apiTfzModelMetadataRespPayloadOutputsElement
 * @property {string} dtype - [Go: string] Tensor data type.
 * @property {number} index - [Go: int] Tensor index.
 * @property {string} name - [Go: string] Tensor name.
 * @property {Array<apiTfzModelMetadataRespPayloadOutputsElementShapeElement>} shape - Tensor dimensions.
 */
/**
 * [Go: int]
 * @typedef {number} apiTfzModelMetadataRespPayloadOutputsElementShapeElement
 */
/**
 * apiTfzModelPredict params
 * @typedef {object} apiTfzModelPredictParams
 * @property {string} dataset - [Go: string] Dataset identifier.
 * @property {string} model_name - [Go: string] Model name.
 * @property {string} version - [Go: string] Model version.
 */
/**
 * apiTfzModelPredict Request
 * @typedef {object} apiTfzModelPredictReq
 * @property {apiTfzModelPredictParams} params
 * @property {apiTfzModelPredictReqPayload} payload
 */
/**
 * apiTfzModelPredict reqPayload
 * @typedef {object} apiTfzModelPredictReqPayload
 * @property {string} inputs - [Go: string] Model inputs.
 * @property {Record<apiTfzModelPredictReqPayloadModelPartitionsKey, apiTfzModelPredictReqPayloadModelPartitionsValue>} model_partitions - Model partition key/value pairs.
 */
/**
 * [Go: string]
 * @typedef {string} apiTfzModelPredictReqPayloadModelPartitionsKey
 */
/**
 * [Go: string]
 * @typedef {string} apiTfzModelPredictReqPayloadModelPartitionsValue
 */
/**
 * apiTfzModelPredict Response
 * @typedef {object} apiTfzModelPredictResp
 * @property {apiTfzModelPredictRespPayload} payload
 */
/**
 * apiTfzModelPredict respPayload
 * @typedef {object} apiTfzModelPredictRespPayload
 * @property {string} outputs - [Go: string] Model outputs.
 */
/**
 * apiUserAuthDeviceCode Request
 * @typedef {object} apiUserAuthDeviceCodeReq
 * @property {apiUserAuthDeviceCodeReqPayload} payload
 */
/**
 * apiUserAuthDeviceCode reqPayload
 * @typedef {object} apiUserAuthDeviceCodeReqPayload
 * @property {string} app - [Go: string] Client application identifier (e.g. i6-cli).
 */
/**
 * apiUserAuthDeviceCode Response
 * @typedef {object} apiUserAuthDeviceCodeResp
 * @property {apiUserAuthDeviceCodeRespPayload} payload
 */
/**
 * apiUserAuthDeviceCode respPayload
 * @typedef {object} apiUserAuthDeviceCodeRespPayload
 * @property {string} device_code - [Go: string] High-entropy secret device code polled by CLI.
 * @property {number} expires_in_sec - [Go: int64] Lifetime of the device code in seconds (typically 900).
 * @property {number} interval_sec - [Go: int] Recommended polling frequency in seconds.
 * @property {string} user_code - [Go: string] Short human-friendly code (e.g. WDJB-MJHT).
 * @property {string} verification_uri - [Go: string] URL where the user completes authorization.
 * @property {string} verification_uri_complete - [Go: string] Verification URL pre-filled with the user_code.
 */
/**
 * apiUserAuthDeviceToken Request
 * @typedef {object} apiUserAuthDeviceTokenReq
 * @property {apiUserAuthDeviceTokenReqPayload} payload
 */
/**
 * apiUserAuthDeviceToken reqPayload
 * @typedef {object} apiUserAuthDeviceTokenReqPayload
 * @property {string} device_code - [Go: string] Secret device code returned by /auth/device/code.
 */
/**
 * apiUserAuthDeviceToken Response
 * @typedef {object} apiUserAuthDeviceTokenResp
 * @property {apiUserAuthDeviceTokenRespPayload} payload
 */
/**
 * apiUserAuthDeviceToken respPayload
 * @typedef {object} apiUserAuthDeviceTokenRespPayload
 * @property {number} expires_at - [Go: int64] Access token expiration epoch millis.
 * @property {number} refresh_token_expires_at - [Go: int64] User refresh token expiration epoch millis (30 days).
 * @property {string} status - [Go: string] Status of the device code: pending | authorized | denied | expired.
 * @property {string} user_access_token - [Go: string] Signed user access token JWT (when authorized).
 * @property {string} user_id - [Go: string] Authenticated user UUID.
 * @property {string} user_refresh_token - [Go: string] Opaque user refresh token session (when authorized).
 */
/**
 * apiUserAuthExchange Request
 * @typedef {object} apiUserAuthExchangeReq
 * @property {apiUserAuthExchangeReqPayload} payload
 */
/**
 * apiUserAuthExchange reqPayload
 * @typedef {object} apiUserAuthExchangeReqPayload
 * @property {string} code - [Go: string] Short-lived authorization code.
 * @property {string} code_verifier - [Go: string] RFC 7636 PKCE S256 code verifier.
 * @property {string} ext - [Go: string] Encrypted client state / session metadata.
 */
/**
 * apiUserAuthExchange Response
 * @typedef {object} apiUserAuthExchangeResp
 * @property {apiUserAuthExchangeRespPayload} payload
 */
/**
 * apiUserAuthExchange respPayload
 * @typedef {object} apiUserAuthExchangeRespPayload
 * @property {number} expires_at - [Go: int64] Access token expiration epoch millis.
 * @property {number} refresh_token_expires_at - [Go: int64] User refresh token expiration epoch millis (30 days).
 * @property {string} user_access_token - [Go: string] Signed user access token JWT.
 * @property {string} user_id - [Go: string] Authenticated user UUID.
 * @property {string} user_refresh_token - [Go: string] Opaque user refresh token.
 */
/**
 * apiUserAuthGoogle Request
 * @typedef {object} apiUserAuthGoogleReq
 * @property {apiUserAuthGoogleReqPayload} payload
 */
/**
 * apiUserAuthGoogle reqPayload
 * @typedef {object} apiUserAuthGoogleReqPayload
 * @property {string} app - [Go: string] Client application identifier.
 * @property {string} code_challenge - [Go: string] RFC 7636 S256 PKCE code challenge.
 * @property {string} id_token - [Go: string] Google OAuth ID token or credential string.
 */
/**
 * apiUserAuthGoogle Response
 * @typedef {object} apiUserAuthGoogleResp
 * @property {apiUserAuthGoogleRespPayload} payload
 */
/**
 * apiUserAuthGoogle respPayload
 * @typedef {object} apiUserAuthGoogleRespPayload
 * @property {string} code - [Go: string] Single-use PKCE authorization code.
 */
/**
 * apiUserAuthLogout Request
 * @typedef {object} apiUserAuthLogoutReq
 * @property {apiUserAuthLogoutReqPayload} payload
 */
/**
 * apiUserAuthLogout reqPayload
 * @typedef {object} apiUserAuthLogoutReqPayload
 * @property {string} refresh_token - [Go: string] Opaque user refresh token in format <jti>.<secret>.
 */
/**
 * apiUserAuthLogout Response
 * @typedef {object} apiUserAuthLogoutResp
 * @property {apiUserAuthLogoutRespPayload} payload
 */
/**
 * apiUserAuthLogout respPayload
 * @typedef {object} apiUserAuthLogoutRespPayload
 * @property {boolean} success - [Go: bool] Indicates successful session revocation.
 */
/**
 * apiUserAuthMe Request
 * @typedef {object} apiUserAuthMeReq
 * @property {apiUserAuthMeReqHeaders} headers
 */
/**
 * apiUserAuthMe reqHeaders
 * @typedef {object} apiUserAuthMeReqHeaders
 * @property {string} authorization - [Go: string] User Bearer JWT access token.
 */
/**
 * apiUserAuthMe Response
 * @typedef {object} apiUserAuthMeResp
 * @property {apiUserAuthMeRespPayload} payload
 */
/**
 * apiUserAuthMe respPayload
 * @typedef {object} apiUserAuthMeRespPayload
 * @property {number} created_at - [Go: int64] Account creation timestamp in epoch milliseconds.
 * @property {string} email_redacted - [Go: string] Redacted email address for display.
 * @property {Array<apiUserAuthMeRespPayloadProvidersElement>} providers - List of linked identity providers.
 * @property {string} user_id - [Go: string] User unique identifier.
 */
/**
 * [Go: string]
 * @typedef {string} apiUserAuthMeRespPayloadProvidersElement
 */
/**
 * apiUserAuthPasswordReset Request
 * @typedef {object} apiUserAuthPasswordResetReq
 * @property {apiUserAuthPasswordResetReqPayload} payload
 */
/**
 * apiUserAuthPasswordReset reqPayload
 * @typedef {object} apiUserAuthPasswordResetReqPayload
 * @property {string} email - [Go: string] Account email address to send password reset.
 */
/**
 * apiUserAuthPasswordReset Response
 * @typedef {object} apiUserAuthPasswordResetResp
 * @property {apiUserAuthPasswordResetRespPayload} payload
 */
/**
 * apiUserAuthPasswordReset respPayload
 * @typedef {object} apiUserAuthPasswordResetRespPayload
 * @property {string} email - [Go: string] Email address where reset was sent.
 * @property {string} status - [Go: string] Password reset dispatch status.
 */
/**
 * apiUserAuthPasswordSignin Request
 * @typedef {object} apiUserAuthPasswordSigninReq
 * @property {apiUserAuthPasswordSigninReqPayload} payload
 */
/**
 * apiUserAuthPasswordSignin reqPayload
 * @typedef {object} apiUserAuthPasswordSigninReqPayload
 * @property {string} app - [Go: string] Client application identifier.
 * @property {string} code_challenge - [Go: string] RFC 7636 S256 PKCE code challenge.
 * @property {string} email - [Go: string] User email address.
 * @property {string} password - [Go: string] User account password.
 */
/**
 * apiUserAuthPasswordSignin Response
 * @typedef {object} apiUserAuthPasswordSigninResp
 * @property {apiUserAuthPasswordSigninRespPayload} payload
 */
/**
 * apiUserAuthPasswordSignin respPayload
 * @typedef {object} apiUserAuthPasswordSigninRespPayload
 * @property {string} code - [Go: string] Single-use PKCE authorization code.
 */
/**
 * apiUserAuthPasswordSignup Request
 * @typedef {object} apiUserAuthPasswordSignupReq
 * @property {apiUserAuthPasswordSignupReqPayload} payload
 */
/**
 * apiUserAuthPasswordSignup reqPayload
 * @typedef {object} apiUserAuthPasswordSignupReqPayload
 * @property {string} app - [Go: string] Client application identifier.
 * @property {string} code_challenge - [Go: string] Optional PKCE code challenge.
 * @property {string} email - [Go: string] User email address to register.
 * @property {string} password - [Go: string] Password for the new account.
 */
/**
 * apiUserAuthPasswordSignup Response
 * @typedef {object} apiUserAuthPasswordSignupResp
 * @property {apiUserAuthPasswordSignupRespPayload} payload
 */
/**
 * apiUserAuthPasswordSignup respPayload
 * @typedef {object} apiUserAuthPasswordSignupRespPayload
 * @property {string} email - [Go: string] Registered email address.
 * @property {string} status - [Go: string] Signup workflow status (e.g. 'verification_email_sent').
 */
/**
 * apiUserAuthRefresh Request
 * @typedef {object} apiUserAuthRefreshReq
 * @property {apiUserAuthRefreshReqPayload} payload
 */
/**
 * apiUserAuthRefresh reqPayload
 * @typedef {object} apiUserAuthRefreshReqPayload
 * @property {string} refresh_token - [Go: string] Opaque user refresh token in format <jti>.<secret>.
 */
/**
 * apiUserAuthRefresh Response
 * @typedef {object} apiUserAuthRefreshResp
 * @property {apiUserAuthRefreshRespPayload} payload
 */
/**
 * apiUserAuthRefresh respPayload
 * @typedef {object} apiUserAuthRefreshRespPayload
 * @property {number} expires_at - [Go: int64] Access token expiration epoch millis (1 hour).
 * @property {number} refresh_token_expires_at - [Go: int64] User refresh token expiration epoch millis (30 days).
 * @property {string} user_access_token - [Go: string] Fresh signed user access token JWT.
 * @property {string} user_id - [Go: string] Authenticated user UUID.
 * @property {string} user_refresh_token - [Go: string] Rotated opaque user refresh token with new secret.
 */
/**
 * apiUserDatasetTokenAccessAttenuate Request
 * @typedef {object} apiUserDatasetTokenAccessAttenuateReq
 * @property {apiUserDatasetTokenAccessAttenuateReqHeaders} headers
 * @property {apiUserDatasetTokenAccessAttenuateReqPayload} payload
 */
/**
 * apiUserDatasetTokenAccessAttenuate reqHeaders
 * @typedef {object} apiUserDatasetTokenAccessAttenuateReqHeaders
 * @property {string} authorization - [Go: string] Parent Bearer dataset access token.
 */
/**
 * apiUserDatasetTokenAccessAttenuate reqPayload
 * @typedef {object} apiUserDatasetTokenAccessAttenuateReqPayload
 * @property {number} exp_seconds - [Go: int64] Requested lifetime in seconds (capped at parent exp).
 * @property {Record<apiUserDatasetTokenAccessAttenuateReqPayloadNewlabelsKey, apiUserDatasetTokenAccessAttenuateReqPayloadNewlabelsValue>} newlabels - Additional restrictive label constraints.
 * @property {Grant} subgrants - [Go: grants.Grant] Reduced uint8 grant bitmask.
 * @property {string} subsolution - [Go: solution.Solution] Narrowed solution domain.
 */
/**
 * [Go: string]
 * @typedef {string} apiUserDatasetTokenAccessAttenuateReqPayloadNewlabelsKey
 */
/**
 * [Go: string]
 * @typedef {string} apiUserDatasetTokenAccessAttenuateReqPayloadNewlabelsValue
 */
/**
 * apiUserDatasetTokenAccessAttenuate Response
 * @typedef {object} apiUserDatasetTokenAccessAttenuateResp
 * @property {apiUserDatasetTokenAccessAttenuateRespPayload} payload
 */
/**
 * apiUserDatasetTokenAccessAttenuate respPayload
 * @typedef {object} apiUserDatasetTokenAccessAttenuateRespPayload
 * @property {string} access_token - [Go: string] Attenuated Base64URL dataset access token.
 * @property {string} dataset - [Go: lakedsz.Dataset] Target dataset ID.
 * @property {number} expires_at - [Go: int64] Expiration epoch milliseconds.
 * @property {Grant} grants - [Go: grants.Grant] Effective uint8 grant bitmask.
 * @property {Record<apiUserDatasetTokenAccessAttenuateRespPayloadLabelsKey, apiUserDatasetTokenAccessAttenuateRespPayloadLabelsValue>} labels - Effective metadata labels.
 * @property {string} solution - [Go: solution.Solution] Effective solution domain.
 */
/**
 * [Go: string]
 * @typedef {string} apiUserDatasetTokenAccessAttenuateRespPayloadLabelsKey
 */
/**
 * [Go: string]
 * @typedef {string} apiUserDatasetTokenAccessAttenuateRespPayloadLabelsValue
 */
/**
 * apiUserDatasetTokenAccessCreate params
 * @typedef {object} apiUserDatasetTokenAccessCreateParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Target dataset ID.
 */
/**
 * apiUserDatasetTokenAccessCreate Request
 * @typedef {object} apiUserDatasetTokenAccessCreateReq
 * @property {apiUserDatasetTokenAccessCreateParams} params
 * @property {apiUserDatasetTokenAccessCreateReqHeaders} headers
 * @property {apiUserDatasetTokenAccessCreateReqPayload} payload
 */
/**
 * apiUserDatasetTokenAccessCreate reqHeaders
 * @typedef {object} apiUserDatasetTokenAccessCreateReqHeaders
 * @property {string} authorization - [Go: string] User Bearer JWT access token.
 */
/**
 * apiUserDatasetTokenAccessCreate reqPayload
 * @typedef {object} apiUserDatasetTokenAccessCreateReqPayload
 * @property {string} client_pub_key - [Go: string] Base64URL client public key for PoP binding (empty for unbound bearer).
 * @property {number} exp_seconds - [Go: int64] Requested lifetime in seconds.
 * @property {Grant} grants - [Go: grants.Grant] Compact uint8 grant bitmask.
 * @property {Record<apiUserDatasetTokenAccessCreateReqPayloadLabelsKey, apiUserDatasetTokenAccessCreateReqPayloadLabelsValue>} labels - Contextual metadata labels.
 * @property {string} solution - [Go: solution.Solution] Target solution domain restriction (empty for all).
 */
/**
 * [Go: string]
 * @typedef {string} apiUserDatasetTokenAccessCreateReqPayloadLabelsKey
 */
/**
 * [Go: string]
 * @typedef {string} apiUserDatasetTokenAccessCreateReqPayloadLabelsValue
 */
/**
 * apiUserDatasetTokenAccessCreate Response
 * @typedef {object} apiUserDatasetTokenAccessCreateResp
 * @property {apiUserDatasetTokenAccessCreateRespPayload} payload
 */
/**
 * apiUserDatasetTokenAccessCreate respPayload
 * @typedef {object} apiUserDatasetTokenAccessCreateRespPayload
 * @property {string} access_token - [Go: string] Binary-packed Base64URL dataset access token.
 * @property {string} dataset - [Go: lakedsz.Dataset] Target dataset ID.
 * @property {number} expires_at - [Go: int64] Expiration epoch milliseconds.
 * @property {Grant} grants - [Go: grants.Grant] Effective uint8 grant bitmask.
 * @property {Record<apiUserDatasetTokenAccessCreateRespPayloadLabelsKey, apiUserDatasetTokenAccessCreateRespPayloadLabelsValue>} labels - Contextual metadata labels.
 * @property {string} solution - [Go: solution.Solution] Solution domain restriction.
 */
/**
 * [Go: string]
 * @typedef {string} apiUserDatasetTokenAccessCreateRespPayloadLabelsKey
 */
/**
 * [Go: string]
 * @typedef {string} apiUserDatasetTokenAccessCreateRespPayloadLabelsValue
 */
/**
 * apiUserDatasetTokenRefreshCreate params
 * @typedef {object} apiUserDatasetTokenRefreshCreateParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Target dataset ID.
 */
/**
 * apiUserDatasetTokenRefreshCreate Request
 * @typedef {object} apiUserDatasetTokenRefreshCreateReq
 * @property {apiUserDatasetTokenRefreshCreateParams} params
 * @property {apiUserDatasetTokenRefreshCreateReqHeaders} headers
 * @property {apiUserDatasetTokenRefreshCreateReqPayload} payload
 */
/**
 * apiUserDatasetTokenRefreshCreate reqHeaders
 * @typedef {object} apiUserDatasetTokenRefreshCreateReqHeaders
 * @property {string} authorization - [Go: string] User Bearer JWT access token.
 */
/**
 * apiUserDatasetTokenRefreshCreate reqPayload
 * @typedef {object} apiUserDatasetTokenRefreshCreateReqPayload
 * @property {string} annotation - [Go: string] Human-friendly purpose note.
 * @property {number} exp_seconds - [Go: int64] Lifetime in seconds (optional, defaults to 100 years).
 * @property {Grant} grants - [Go: grants.Grant] Compact uint8 grant bitmask (optional, defaults to caller's registered grants on dataset; limited to registered grants).
 * @property {Record<apiUserDatasetTokenRefreshCreateReqPayloadLabelsKey, apiUserDatasetTokenRefreshCreateReqPayloadLabelsValue>} labels - Contextual metadata labels.
 * @property {string} solution - [Go: solution.Solution] Solution domain restriction (empty for all).
 */
/**
 * [Go: string]
 * @typedef {string} apiUserDatasetTokenRefreshCreateReqPayloadLabelsKey
 */
/**
 * [Go: string]
 * @typedef {string} apiUserDatasetTokenRefreshCreateReqPayloadLabelsValue
 */
/**
 * apiUserDatasetTokenRefreshCreate Response
 * @typedef {object} apiUserDatasetTokenRefreshCreateResp
 * @property {apiUserDatasetTokenRefreshCreateRespPayload} payload
 */
/**
 * apiUserDatasetTokenRefreshCreate respPayload
 * @typedef {object} apiUserDatasetTokenRefreshCreateRespPayload
 * @property {string} annotation - [Go: string] Human-friendly purpose note.
 * @property {string} dataset - [Go: lakedsz.Dataset] Target dataset ID.
 * @property {number} expires_at - [Go: int64] Expiration epoch milliseconds.
 * @property {Grant} grants - [Go: grants.Grant] Effective uint8 grant bitmask.
 * @property {string} jti - [Go: string] Credential JTI (Base64URL Ed25519 public key).
 * @property {Record<apiUserDatasetTokenRefreshCreateRespPayloadLabelsKey, apiUserDatasetTokenRefreshCreateRespPayloadLabelsValue>} labels - Contextual metadata labels.
 * @property {string} priv_key - [Go: string] Base64URL Ed25519 private key (returned once only).
 * @property {string} solution - [Go: solution.Solution] Solution domain restriction.
 */
/**
 * [Go: string]
 * @typedef {string} apiUserDatasetTokenRefreshCreateRespPayloadLabelsKey
 */
/**
 * [Go: string]
 * @typedef {string} apiUserDatasetTokenRefreshCreateRespPayloadLabelsValue
 */
/**
 * apiUserDatasetTokenRefreshDelete params
 * @typedef {object} apiUserDatasetTokenRefreshDeleteParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Target dataset ID.
 * @property {string} jti - [Go: string] Token JTI (public key identifier) to revoke.
 */
/**
 * apiUserDatasetTokenRefreshDelete Request
 * @typedef {object} apiUserDatasetTokenRefreshDeleteReq
 * @property {apiUserDatasetTokenRefreshDeleteParams} params
 * @property {apiUserDatasetTokenRefreshDeleteReqHeaders} headers
 */
/**
 * apiUserDatasetTokenRefreshDelete reqHeaders
 * @typedef {object} apiUserDatasetTokenRefreshDeleteReqHeaders
 * @property {string} authorization - [Go: string] User Bearer JWT access token.
 */
/**
 * apiUserDatasetTokenRefreshDelete Response
 * @typedef {object} apiUserDatasetTokenRefreshDeleteResp
 */
/**
 * apiUserDatasetTokenRefreshList params
 * @typedef {object} apiUserDatasetTokenRefreshListParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Target dataset ID.
 */
/**
 * apiUserDatasetTokenRefreshList Request
 * @typedef {object} apiUserDatasetTokenRefreshListReq
 * @property {apiUserDatasetTokenRefreshListParams} params
 * @property {apiUserDatasetTokenRefreshListReqHeaders} headers
 */
/**
 * apiUserDatasetTokenRefreshList reqHeaders
 * @typedef {object} apiUserDatasetTokenRefreshListReqHeaders
 * @property {string} authorization - [Go: string] User Bearer JWT access token.
 */
/**
 * apiUserDatasetTokenRefreshList Response
 * @typedef {object} apiUserDatasetTokenRefreshListResp
 * @property {apiUserDatasetTokenRefreshListRespPayload} payload
 */
/**
 * apiUserDatasetTokenRefreshList respPayload
 * @typedef {object} apiUserDatasetTokenRefreshListRespPayload
 * @property {Array<apiUserDatasetTokenRefreshListRespPayloadTokensElement>} tokens - List of refresh token records.
 */
/**
 * @typedef {object} apiUserDatasetTokenRefreshListRespPayloadTokensElement
 * @property {string} annotation - [Go: string] Description note.
 * @property {number} created_at - [Go: int64] Creation timestamp in millis.
 * @property {string} created_by - [Go: string] User ID who created the token.
 * @property {string} dataset - [Go: lakedsz.Dataset] Target dataset ID.
 * @property {number} expires_at - [Go: int64] Expiration timestamp in millis.
 * @property {Grant} grants - [Go: grants.Grant] Grants bitmask.
 * @property {string} jti - [Go: string] Token JTI.
 * @property {Record<apiUserDatasetTokenRefreshListRespPayloadTokensElementLabelsKey, apiUserDatasetTokenRefreshListRespPayloadTokensElementLabelsValue>} labels - Metadata labels.
 * @property {number} last_used_at - [Go: int64] Epoch milliseconds when token was last refreshed (0 = never used).
 * @property {boolean} revoked - [Go: bool] Revocation status flag.
 * @property {string} solution - [Go: solution.Solution] Solution domain restriction.
 */
/**
 * [Go: string]
 * @typedef {string} apiUserDatasetTokenRefreshListRespPayloadTokensElementLabelsKey
 */
/**
 * [Go: string]
 * @typedef {string} apiUserDatasetTokenRefreshListRespPayloadTokensElementLabelsValue
 */
/**
 * apiUserDatasetTokenRefresh Request
 * @typedef {object} apiUserDatasetTokenRefreshReq
 * @property {apiUserDatasetTokenRefreshReqHeaders} headers
 * @property {apiUserDatasetTokenRefreshReqPayload} payload
 */
/**
 * apiUserDatasetTokenRefresh reqHeaders
 * @typedef {object} apiUserDatasetTokenRefreshReqHeaders
 * @property {string} x_i6_signature - [Go: string] Standalone 121-byte RefreshAssertion Ed25519 signature.
 */
/**
 * apiUserDatasetTokenRefresh reqPayload
 * @typedef {object} apiUserDatasetTokenRefreshReqPayload
 * @property {string} dataset - [Go: lakedsz.Dataset] Target dataset ID.
 * @property {number} exp_seconds - [Go: int64] Requested lifetime in seconds.
 * @property {Record<apiUserDatasetTokenRefreshReqPayloadNewlabelsKey, apiUserDatasetTokenRefreshReqPayloadNewlabelsValue>} newlabels - Additional restrictive label constraints.
 * @property {Grant} subgrants - [Go: grants.Grant] Optional reduced grant bitmask.
 * @property {string} subsolution - [Go: solution.Solution] Optional sub-solution restriction.
 */
/**
 * [Go: string]
 * @typedef {string} apiUserDatasetTokenRefreshReqPayloadNewlabelsKey
 */
/**
 * [Go: string]
 * @typedef {string} apiUserDatasetTokenRefreshReqPayloadNewlabelsValue
 */
/**
 * apiUserDatasetTokenRefresh Response
 * @typedef {object} apiUserDatasetTokenRefreshResp
 * @property {apiUserDatasetTokenRefreshRespPayload} payload
 */
/**
 * apiUserDatasetTokenRefresh respPayload
 * @typedef {object} apiUserDatasetTokenRefreshRespPayload
 * @property {string} access_token - [Go: string] Binary-packed Base64URL dataset access token.
 * @property {string} dataset - [Go: lakedsz.Dataset] Target dataset ID.
 * @property {number} expires_at - [Go: int64] Expiration epoch milliseconds.
 * @property {Grant} grants - [Go: grants.Grant] Effective uint8 grant bitmask.
 * @property {Record<apiUserDatasetTokenRefreshRespPayloadLabelsKey, apiUserDatasetTokenRefreshRespPayloadLabelsValue>} labels - Effective metadata labels.
 * @property {string} solution - [Go: solution.Solution] Effective solution domain.
 */
/**
 * [Go: string]
 * @typedef {string} apiUserDatasetTokenRefreshRespPayloadLabelsKey
 */
/**
 * [Go: string]
 * @typedef {string} apiUserDatasetTokenRefreshRespPayloadLabelsValue
 */
/**
 * @typedef {object} dszFileStat
 * @property {string} url - missing summary
 * @property {string} content_type - missing summary
 * @property {string} md5 - missing summary
 * @property {string} size - missing summary
 * @property {string} etag - missing summary
 * @property {dszTime} created_at - missing summary
 * @property {dszTime} updated_at - missing summary
 */
/**
 * Missing Summary
 * @typedef {string} dszTime
 */
/**
 * sdkFuncProductRelevanceFashionDashAttachedRevenue input
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenueInput
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset identifier.
 * @property {sdkFuncProductRelevanceFashionDashAttachedRevenueInputParams} params - Query params.
 */
/**
 * Query params.
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenueInputParams
 * @property {string} max_year_month - [Go: string] Last year-month of the period.
 * @property {string} min_year_month - [Go: string] First year-month of the period.
 */
/**
 * sdkFuncProductRelevanceFashionDashAttachedRevenue output
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenueOutput
 * @property {Array<sdkFuncProductRelevanceFashionDashAttachedRevenueOutputRowsElement>} rows - Result rows.
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenueOutputRowsElement
 * @property {number} attached_purchases - [Go: float64] Purchases attached to recommendations.
 * @property {number} attached_revenue - [Go: float64] Revenue attached to recommendations.
 * @property {number} attached_skus - [Go: float64] SKUs attached to recommendations.
 * @property {number} avg_ticket - [Go: float64] Average ticket value.
 */
/**
 * sdkFuncProductRelevanceFashionDashAttachedRevenue partitions
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenuePartitions
 * @property {string} store_id - [Go: string] Store identifier.
 */
/**
 * sdkFuncProductRelevanceFashionDashAttachedRevenue Request
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenueReq
 * @property {sdkFuncProductRelevanceFashionDashAttachedRevenueInput} input
 * @property {sdkFuncProductRelevanceFashionDashAttachedRevenuePartitions} partitions
 */
/**
 * sdkFuncProductRelevanceFashionDashAttachedRevenue Response
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenueResp
 * @property {sdkFuncProductRelevanceFashionDashAttachedRevenueOutput} output
 */
/**
 * sdkFuncProductRelevanceFashionDashCoverage input
 * @typedef {object} sdkFuncProductRelevanceFashionDashCoverageInput
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset identifier.
 * @property {sdkFuncProductRelevanceFashionDashCoverageInputParams} params - Query params.
 */
/**
 * Query params.
 * @typedef {object} sdkFuncProductRelevanceFashionDashCoverageInputParams
 * @property {string} max_year_month - [Go: string] Last year-month of the period.
 * @property {string} min_year_month - [Go: string] First year-month of the period.
 */
/**
 * sdkFuncProductRelevanceFashionDashCoverage output
 * @typedef {object} sdkFuncProductRelevanceFashionDashCoverageOutput
 * @property {Array<sdkFuncProductRelevanceFashionDashCoverageOutputRowsElement>} rows - Result rows.
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionDashCoverageOutputRowsElement
 * @property {number} bottom_90_coverage - [Go: float64] Coverage of the bottom 90% items.
 * @property {number} long_tail_coverage - [Go: float64] Coverage of the long tail items.
 * @property {number} recomendation_coverage - [Go: float64] Share of recommendable items that were recommended.
 * @property {number} recommendable_items - [Go: float64] Number of items eligible to be recommended.
 * @property {number} recommended_items - [Go: float64] Number of distinct items recommended.
 * @property {number} top_1_coverage - [Go: float64] Coverage of the top 1% items.
 * @property {number} top_1_to_5_coverage - [Go: float64] Coverage of the items between top 1% and top 5%.
 * @property {number} top_5_to_10_coverage - [Go: float64] Coverage of the items between top 5% and top 10%.
 */
/**
 * sdkFuncProductRelevanceFashionDashCoverage partitions
 * @typedef {object} sdkFuncProductRelevanceFashionDashCoveragePartitions
 * @property {string} store_id - [Go: string] Store identifier.
 */
/**
 * sdkFuncProductRelevanceFashionDashCoverage Request
 * @typedef {object} sdkFuncProductRelevanceFashionDashCoverageReq
 * @property {sdkFuncProductRelevanceFashionDashCoverageInput} input
 * @property {sdkFuncProductRelevanceFashionDashCoveragePartitions} partitions
 */
/**
 * sdkFuncProductRelevanceFashionDashCoverage Response
 * @typedef {object} sdkFuncProductRelevanceFashionDashCoverageResp
 * @property {sdkFuncProductRelevanceFashionDashCoverageOutput} output
 */
/**
 * sdkFuncProductRelevanceFashionDashFunnel input
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelInput
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset identifier.
 * @property {sdkFuncProductRelevanceFashionDashFunnelInputParams} params - Query params.
 */
/**
 * Query params.
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelInputParams
 * @property {string} max_year_month - [Go: string] Last year-month of the period.
 * @property {string} min_year_month - [Go: string] First year-month of the period.
 */
/**
 * sdkFuncProductRelevanceFashionDashFunnel output
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelOutput
 * @property {Array<sdkFuncProductRelevanceFashionDashFunnelOutputRowsElement>} rows - Result rows.
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelOutputRowsElement
 * @property {string} event_type - [Go: string] Event type.
 * @property {string} from_rec - [Go: string] Whether the event came from a recommendation.
 * @property {string} qt_events - [Go: string] Number of events.
 */
/**
 * sdkFuncProductRelevanceFashionDashFunnel partitions
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelPartitions
 * @property {string} store_id - [Go: string] Store identifier.
 */
/**
 * sdkFuncProductRelevanceFashionDashFunnel Request
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelReq
 * @property {sdkFuncProductRelevanceFashionDashFunnelInput} input
 * @property {sdkFuncProductRelevanceFashionDashFunnelPartitions} partitions
 */
/**
 * sdkFuncProductRelevanceFashionDashFunnel Response
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelResp
 * @property {sdkFuncProductRelevanceFashionDashFunnelOutput} output
 */
/**
 * sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategory input
 * @typedef {object} sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryInput
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset identifier.
 * @property {sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryInputParams} params - Query params.
 */
/**
 * Query params.
 * @typedef {object} sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryInputParams
 * @property {string} max_year_month - [Go: string] Last year-month of the period.
 * @property {string} min_year_month - [Go: string] First year-month of the period.
 */
/**
 * sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategory output
 * @typedef {object} sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryOutput
 * @property {Array<sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryOutputRowsElement>} rows - Result rows.
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryOutputRowsElement
 * @property {number} cart_adds - [Go: float64] Number of cart adds.
 * @property {number} clicks - [Go: float64] Number of clicks.
 * @property {number} conversion_rate - [Go: float64] Conversion rate.
 * @property {number} participation - [Go: float64] Participation share.
 * @property {number} purchases - [Go: float64] Number of purchases.
 * @property {number} recomendations - [Go: float64] Number of recommendations.
 * @property {number} revenue - [Go: float64] Revenue.
 * @property {string} showcase_category - [Go: string] Showcase category.
 */
/**
 * sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategory partitions
 * @typedef {object} sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryPartitions
 * @property {string} store_id - [Go: string] Store identifier.
 */
/**
 * sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategory Request
 * @typedef {object} sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryReq
 * @property {sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryInput} input
 * @property {sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryPartitions} partitions
 */
/**
 * sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategory Response
 * @typedef {object} sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryResp
 * @property {sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryOutput} output
 */
/**
 * sdkFuncProductRelevanceFashionDashImpactedMetricsBySku input
 * @typedef {object} sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuInput
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset identifier.
 * @property {sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuInputParams} params - Query params.
 */
/**
 * Query params.
 * @typedef {object} sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuInputParams
 * @property {string} max_year_month - [Go: string] Last year-month of the period.
 * @property {string} min_year_month - [Go: string] First year-month of the period.
 */
/**
 * sdkFuncProductRelevanceFashionDashImpactedMetricsBySku output
 * @typedef {object} sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuOutput
 * @property {Array<sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuOutputRowsElement>} rows - Result rows.
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuOutputRowsElement
 * @property {number} cart_adds - [Go: float64] Number of cart adds.
 * @property {number} clicks - [Go: float64] Number of clicks.
 * @property {number} conversion_rate - [Go: float64] Conversion rate.
 * @property {string} description - [Go: string] SKU description.
 * @property {number} engagement_rate - [Go: float64] Engagement rate.
 * @property {number} participation - [Go: float64] Participation share.
 * @property {number} purchases - [Go: float64] Number of purchases.
 * @property {number} recomendations - [Go: float64] Number of recommendations.
 * @property {number} revenue - [Go: float64] Revenue.
 * @property {string} showcase_category - [Go: string] Showcase category.
 * @property {string} sku_id - [Go: string] SKU identifier.
 */
/**
 * sdkFuncProductRelevanceFashionDashImpactedMetricsBySku partitions
 * @typedef {object} sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuPartitions
 * @property {string} store_id - [Go: string] Store identifier.
 */
/**
 * sdkFuncProductRelevanceFashionDashImpactedMetricsBySku Request
 * @typedef {object} sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuReq
 * @property {sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuInput} input
 * @property {sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuPartitions} partitions
 */
/**
 * sdkFuncProductRelevanceFashionDashImpactedMetricsBySku Response
 * @typedef {object} sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuResp
 * @property {sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuOutput} output
 */
/**
 * sdkFuncProductRelevanceFashionDashListShowcaseCategories input
 * @typedef {object} sdkFuncProductRelevanceFashionDashListShowcaseCategoriesInput
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset identifier.
 */
/**
 * sdkFuncProductRelevanceFashionDashListShowcaseCategories output
 * @typedef {object} sdkFuncProductRelevanceFashionDashListShowcaseCategoriesOutput
 * @property {Array<sdkFuncProductRelevanceFashionDashListShowcaseCategoriesOutputRowsElement>} rows - Result rows.
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionDashListShowcaseCategoriesOutputRowsElement
 * @property {string} showcase_category - [Go: string] Showcase category.
 */
/**
 * sdkFuncProductRelevanceFashionDashListShowcaseCategories partitions
 * @typedef {object} sdkFuncProductRelevanceFashionDashListShowcaseCategoriesPartitions
 * @property {string} store_id - [Go: string] Store identifier.
 */
/**
 * sdkFuncProductRelevanceFashionDashListShowcaseCategories Request
 * @typedef {object} sdkFuncProductRelevanceFashionDashListShowcaseCategoriesReq
 * @property {sdkFuncProductRelevanceFashionDashListShowcaseCategoriesInput} input
 * @property {sdkFuncProductRelevanceFashionDashListShowcaseCategoriesPartitions} partitions
 */
/**
 * sdkFuncProductRelevanceFashionDashListShowcaseCategories Response
 * @typedef {object} sdkFuncProductRelevanceFashionDashListShowcaseCategoriesResp
 * @property {sdkFuncProductRelevanceFashionDashListShowcaseCategoriesOutput} output
 */
/**
 * sdkFuncProductRelevanceFashionFbt input
 * @typedef {object} sdkFuncProductRelevanceFashionFbtInput
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset identifier.
 * @property {string} session_id - [Go: string] Session identifier.
 * @property {Array<sdkFuncProductRelevanceFashionFbtInputSkusElement>} skus - SKUs to find matches for.
 * @property {string} user_id - [Go: string] User identifier.
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionFbtInputSkusElement
 * @property {string} sku_id - [Go: string] SKU identifier.
 */
/**
 * sdkFuncProductRelevanceFashionFbt output
 * @typedef {object} sdkFuncProductRelevanceFashionFbtOutput
 * @property {Array<sdkFuncProductRelevanceFashionFbtOutputResultsElement>} results - Inference results.
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionFbtOutputResultsElement
 * @property {number} rating - [Go: float64] Result rating.
 * @property {Array<sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElement>} skus - Matching SKUs.
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElement
 * @property {string} sku_id - [Go: string] SKU identifier.
 */
/**
 * One recommended sku to show, as picked by selectResults
 * @typedef {object} sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElementEnriched
 * @property {string} sku_id - Id of the sku. Required; the only field sent to i6 (in the recshow event)
 * @property {number} rating - Model rating, higher is more relevant. The default selectResults sets the rating of the result the sku was picked from
 * @property {*} enriched - Optional: any data your selectResults attaches to the sku (e.g. name, price, image). Returned to you as is, never sent to i6. The default selectResults does not set it
 */
/**
 * sdkFuncProductRelevanceFashionFbt partitions
 * @typedef {object} sdkFuncProductRelevanceFashionFbtPartitions
 * @property {string} store_id - [Go: string] Store identifier.
 */
/**
 * sdkFuncProductRelevanceFashionFbt Request
 * @typedef {object} sdkFuncProductRelevanceFashionFbtReq
 * @property {sdkFuncProductRelevanceFashionFbtInput} input
 * @property {sdkFuncProductRelevanceFashionFbtPartitions} partitions
 */
/**
 * sdkFuncProductRelevanceFashionFbt Response
 * @typedef {object} sdkFuncProductRelevanceFashionFbtResp
 * @property {sdkFuncProductRelevanceFashionFbtOutput} output
 */
/**
 * sdkFuncProductRelevanceFashionFbt Selected: the skus to show, as returned by selectResults
 * @typedef {object} sdkFuncProductRelevanceFashionFbtSelected
 * @property {Array<sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElementEnriched>} results - Skus to show, in the order selectResults returned them
 */
declare class Apis {
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs an Ingest client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * Create Ingestion Token
     *
     * Creates a write token for data ingestion into a specific dataset.
     *
     * @param {apiDszCreateIngestionTokenReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszCreateIngestionTokenResp>>}
     */
    dszCreateIngestionToken(req: apiDszCreateIngestionTokenReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszCreateIngestionTokenResp>>;
    /**
     * Create Recsys Token
     *
     * Creates a read/recommendation token for the recommendation system associated with a specific dataset.
     *
     * @param {apiDszCreateRecsysTokenReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszCreateRecsysTokenResp>>}
     */
    dszCreateRecsysToken(req: apiDszCreateRecsysTokenReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszCreateRecsysTokenResp>>;
    /**
     * Delete Token
     *
     * Deletes (revokes) a specific token (e.g. ingestion or recsys token) associated with a dataset.
     *
     * @param {apiDszDeleteTokenReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszDeleteTokenResp>>}
     */
    dszDeleteToken(req: apiDszDeleteTokenReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszDeleteTokenResp>>;
    /**
     * List Plans
     *
     * Lists the plans a subscription of a solution can be switched to, with the price data from Stripe.
     *
     * @param {apiDszListPlansReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszListPlansResp>>}
     */
    dszListPlans(req: apiDszListPlansReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszListPlansResp>>;
    /**
     * PKCE Authorization Code Exchange
     *
     * Exchanges a PKCE authorization code and verifier for user access and refresh tokens.
     *
     * @param {apiUserAuthExchangeReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthExchangeResp>>}
     */
    userAuthExchange(req: apiUserAuthExchangeReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiUserAuthExchangeResp>>;
    /**
     * Get Dataset Table File
     *
     * Get table file by redirecting to its signed URL.
     *
     * @param {apiDszTableGetReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszTableGetResp>>}
     */
    dszTableGet(req: apiDszTableGetReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszTableGetResp>>;
    /**
     * Get Model Metadata
     *
     * Gets the input and output tensors of a model version.
     *
     * @param {apiTfzModelMetadataReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiTfzModelMetadataResp>>}
     */
    tfzModelMetadata(req: apiTfzModelMetadataReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiTfzModelMetadataResp>>;
    /**
     * List Payments
     *
     * Lists the Stripe payments (invoices) of a dataset. The list is empty for datasets without a Stripe customer.
     *
     * @param {apiDszListPaymentsReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszListPaymentsResp>>}
     */
    dszListPayments(req: apiDszListPaymentsReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszListPaymentsResp>>;
    /**
     * Device Token Polling & Exchange
     *
     * Polled by CLI clients to check status and exchange an authorized device code for active user tokens.
     *
     * @param {apiUserAuthDeviceTokenReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthDeviceTokenResp>>}
     */
    userAuthDeviceToken(req: apiUserAuthDeviceTokenReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiUserAuthDeviceTokenResp>>;
    /**
     * Human User Session Logout
     *
     * Revokes an active human user session by marking the refresh token and its token family as revoked in userzsession.
     *
     * @param {apiUserAuthLogoutReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthLogoutResp>>}
     */
    userAuthLogout(req: apiUserAuthLogoutReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiUserAuthLogoutResp>>;
    /**
     * Refresh Dataset Access Token
     *
     * Refreshes and attenuates a dataset access token using an Ed25519 signature assertion.
     *
     * @param {apiUserDatasetTokenRefreshReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserDatasetTokenRefreshResp>>}
     */
    userDatasetTokenRefresh(req: apiUserDatasetTokenRefreshReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiUserDatasetTokenRefreshResp>>;
    /**
     * Revoke Dataset Refresh Token
     *
     * Instantly revokes a machine dataset refresh token by JTI.
     *
     * @param {apiUserDatasetTokenRefreshDeleteReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserDatasetTokenRefreshDeleteResp>>}
     */
    userDatasetTokenRefreshDelete(req: apiUserDatasetTokenRefreshDeleteReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiUserDatasetTokenRefreshDeleteResp>>;
    /**
     * Load Table File as JSON
     *
     * Load a table file from the datalake as JSON and return it.
     *
     * @param {apiDszResultRelevanceFashionCatalogReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszResultRelevanceFashionCatalogResp>>}
     */
    dszResultRelevanceFashionCatalog(req: apiDszResultRelevanceFashionCatalogReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszResultRelevanceFashionCatalogResp>>;
    /**
     * Get Pipeline
     *
     * Gets a pipeline of a dataset by its id.
     *
     * @param {apiPipezGetReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiPipezGetResp>>}
     */
    pipezGet(req: apiPipezGetReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiPipezGetResp>>;
    /**
     * Model Predict
     *
     * Runs a prediction of a dataset model version on the inference service (tfinfer), sending the model inputs and the model partitions and returning the model outputs.
     *
     * @param {apiTfzModelPredictReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiTfzModelPredictResp>>}
     */
    tfzModelPredict(req: apiTfzModelPredictReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiTfzModelPredictResp>>;
    /**
     * Create Customer Portal
     *
     * Creates a Stripe billing portal session URL where the user can manage cards, auto-renew, and plans.
     *
     * @param {apiDszCreateCustomerPortalReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszCreateCustomerPortalResp>>}
     */
    dszCreateCustomerPortal(req: apiDszCreateCustomerPortalReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszCreateCustomerPortalResp>>;
    /**
     * Event Ingestion
     *
     * Ingests events data into a target dataset table.
     *
     * @param {apiIngestzEventRelevanceFashionEventReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiIngestzEventRelevanceFashionEventResp>>}
     */
    ingestzEventRelevanceFashionEvent(req: apiIngestzEventRelevanceFashionEventReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiIngestzEventRelevanceFashionEventResp>>;
    /**
     * Get Dataset Signed URLs
     *
     * Generates presigned URLs for accessing or mutating files in the specified dataset.
     *
     * @param {apiDszSignedUrlReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszSignedUrlResp>>}
     */
    dszSignedUrl(req: apiDszSignedUrlReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszSignedUrlResp>>;
    /**
     * Load Table File as JSON
     *
     * Load a table file from the datalake as JSON and return it.
     *
     * @param {apiDszResultLastBatchSummaryReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszResultLastBatchSummaryResp>>}
     */
    dszResultLastBatchSummary(req: apiDszResultLastBatchSummaryReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszResultLastBatchSummaryResp>>;
    /**
     * Activate Pipeline Scheduler
     *
     * Activates a scheduler for a pipeline on a dataset.
     *
     * @param {apiPipezSchedulerActivateRelevanceFashionRelevanceFashionMainReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiPipezSchedulerActivateRelevanceFashionRelevanceFashionMainResp>>}
     */
    pipezSchedulerActivateRelevanceFashionRelevanceFashionMain(req: apiPipezSchedulerActivateRelevanceFashionRelevanceFashionMainReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiPipezSchedulerActivateRelevanceFashionRelevanceFashionMainResp>>;
    /**
     * List Ingestion Tokens
     *
     * Lists all active data ingestion tokens for a specific dataset.
     *
     * @param {apiDszListIngestionTokensReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszListIngestionTokensResp>>}
     */
    dszListIngestionTokens(req: apiDszListIngestionTokensReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszListIngestionTokensResp>>;
    /**
     * Update Subscription Plan
     *
     * Updates the plan (price) of the Stripe subscription for a dataset product/solution.
     *
     * @param {apiDszUpdateSubscriptionPlanReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszUpdateSubscriptionPlanResp>>}
     */
    dszUpdateSubscriptionPlan(req: apiDszUpdateSubscriptionPlanReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszUpdateSubscriptionPlanResp>>;
    /**
     * Current User Profile
     *
     * Retrieves current authenticated user identity profile metadata.
     *
     * @param {apiUserAuthMeReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthMeResp>>}
     */
    userAuthMe(req: apiUserAuthMeReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiUserAuthMeResp>>;
    /**
     * Create Dataset Access Token
     *
     * Mints a short-lived dataset access token for an authenticated user.
     *
     * @param {apiUserDatasetTokenAccessCreateReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserDatasetTokenAccessCreateResp>>}
     */
    userDatasetTokenAccessCreate(req: apiUserDatasetTokenAccessCreateReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiUserDatasetTokenAccessCreateResp>>;
    /**
     * List Pipelines
     *
     * Lists the pipelines of a dataset, optionally filtered, with cursor pagination.
     *
     * @param {apiPipezListReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiPipezListResp>>}
     */
    pipezList(req: apiPipezListReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiPipezListResp>>;
    /**
     * List Store Displays
     *
     * Lists all active store displays configured for a store under a specific dataset.
     *
     * @param {apiDszStoreDisplayListReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszStoreDisplayListResp>>}
     */
    dszStoreDisplayList(req: apiDszStoreDisplayListReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszStoreDisplayListResp>>;
    /**
     * Get Solution Domain
     *
     * Retrieves the active solutions and their corresponding domains for a given store in a dataset.
     *
     * @param {apiDszDomainGetReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszDomainGetResp>>}
     */
    dszDomainGet(req: apiDszDomainGetReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszDomainGetResp>>;
    /**
     * List Recsys Tokens
     *
     * Lists all active recommendation system tokens for a specific dataset.
     *
     * @param {apiDszListRecsysTokensReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszListRecsysTokensResp>>}
     */
    dszListRecsysTokens(req: apiDszListRecsysTokensReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszListRecsysTokensResp>>;
    /**
     * Get Model Signed URLs
     *
     * Generates presigned URLs for accessing model files in the specified dataset.
     *
     * @param {apiDszModelGetReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszModelGetResp>>}
     */
    dszModelGet(req: apiDszModelGetReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszModelGetResp>>;
    /**
     * Create Stripe Checkout
     *
     * Creates a Stripe checkout session for a subscription and returns its id and url.
     *
     * @param {apiDszStripeCheckoutReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszStripeCheckoutResp>>}
     */
    dszStripeCheckout(req: apiDszStripeCheckoutReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszStripeCheckoutResp>>;
    /**
     * Update Payment Auto Renew
     *
     * Turns auto renew on or off for the Stripe subscription of a dataset product/solution.
     *
     * @param {apiDszUpdatePaymentAutoRenewReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszUpdatePaymentAutoRenewResp>>}
     */
    dszUpdatePaymentAutoRenew(req: apiDszUpdatePaymentAutoRenewReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszUpdatePaymentAutoRenewResp>>;
    /**
     * Google Sign-In Credential Exchange
     *
     * Verifies a Google OAuth ID token via Identity Platform and mints a single-use PKCE code.
     *
     * @param {apiUserAuthGoogleReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthGoogleResp>>}
     */
    userAuthGoogle(req: apiUserAuthGoogleReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiUserAuthGoogleResp>>;
    /**
     * List Dataset Tables
     *
     * Lists files and tables in the specified dataset.
     *
     * @param {apiDszTableListReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszTableListResp>>}
     */
    dszTableList(req: apiDszTableListReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszTableListResp>>;
    /**
     * Human User Session Refresh
     *
     * Exchanges a human user refresh token for fresh access and rotated refresh tokens.
     *
     * @param {apiUserAuthRefreshReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthRefreshResp>>}
     */
    userAuthRefresh(req: apiUserAuthRefreshReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiUserAuthRefreshResp>>;
    /**
     * Attenuate Dataset Access Token
     *
     * Derives an in-flight attenuated child access token with dropped privileges from an active access token.
     *
     * @param {apiUserDatasetTokenAccessAttenuateReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserDatasetTokenAccessAttenuateResp>>}
     */
    userDatasetTokenAccessAttenuate(req: apiUserDatasetTokenAccessAttenuateReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiUserDatasetTokenAccessAttenuateResp>>;
    /**
     * Start Pipeline
     *
     * Starts a pipeline on a dataset with the given params and returns its id.
     *
     * @param {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiPipezStartRelevanceFashionRelevanceFashionBatchIngestResp>>}
     */
    pipezStartRelevanceFashionRelevanceFashionBatchIngest(req: apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiPipezStartRelevanceFashionRelevanceFashionBatchIngestResp>>;
    /**
     * Start Pipeline
     *
     * Starts a pipeline on a dataset with the given params and returns its id.
     *
     * @param {apiPipezStartRelevanceFashionRelevanceFashionMainReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiPipezStartRelevanceFashionRelevanceFashionMainResp>>}
     */
    pipezStartRelevanceFashionRelevanceFashionMain(req: apiPipezStartRelevanceFashionRelevanceFashionMainReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiPipezStartRelevanceFashionRelevanceFashionMainResp>>;
    /**
     * Deactivate Pipeline Scheduler
     *
     * Deactivates a scheduler for a pipeline on a dataset.
     *
     * @param {apiPipezSchedulerDeactivateRelevanceFashionRelevanceFashionMainReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiPipezSchedulerDeactivateRelevanceFashionRelevanceFashionMainResp>>}
     */
    pipezSchedulerDeactivateRelevanceFashionRelevanceFashionMain(req: apiPipezSchedulerDeactivateRelevanceFashionRelevanceFashionMainReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiPipezSchedulerDeactivateRelevanceFashionRelevanceFashionMainResp>>;
    /**
     * Create Store
     *
     * Creates a store configuration under a specific dataset.
     *
     * @param {apiDszCreateStoreReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszCreateStoreResp>>}
     */
    dszCreateStore(req: apiDszCreateStoreReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszCreateStoreResp>>;
    /**
     * List Stores
     *
     * Lists all stores configured under a specific dataset.
     *
     * @param {apiDszListStoresReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszListStoresResp>>}
     */
    dszListStores(req: apiDszListStoresReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszListStoresResp>>;
    /**
     * Get Subscription
     *
     * Gets the plan and the status of the Stripe subscription of a dataset product/solution. The payload is empty for contracts without Stripe.
     *
     * @param {apiDszGetSubscriptionReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszGetSubscriptionResp>>}
     */
    dszGetSubscription(req: apiDszGetSubscriptionReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszGetSubscriptionResp>>;
    /**
     * Password Reset Email Dispatch
     *
     * Dispatches an out-of-band password reset email via Identity Platform.
     *
     * @param {apiUserAuthPasswordResetReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthPasswordResetResp>>}
     */
    userAuthPasswordReset(req: apiUserAuthPasswordResetReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiUserAuthPasswordResetResp>>;
    /**
     * Create Dataset Refresh Token
     *
     * Provisions a long-lived machine dataset refresh token with an Ed25519 keypair.
     *
     * @param {apiUserDatasetTokenRefreshCreateReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserDatasetTokenRefreshCreateResp>>}
     */
    userDatasetTokenRefreshCreate(req: apiUserDatasetTokenRefreshCreateReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiUserDatasetTokenRefreshCreateResp>>;
    /**
     * Event Ingestion
     *
     * Ingests events data into a target dataset table.
     *
     * @param {apiIngestzEventRelevanceFashionCatalogReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiIngestzEventRelevanceFashionCatalogResp>>}
     */
    ingestzEventRelevanceFashionCatalog(req: apiIngestzEventRelevanceFashionCatalogReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiIngestzEventRelevanceFashionCatalogResp>>;
    /**
     * List Datasets
     *
     * Lists all datasets available to the user.
     *
     * @param {apiDszListDatasetsReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszListDatasetsResp>>}
     */
    dszListDatasets(req: apiDszListDatasetsReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszListDatasetsResp>>;
    /**
     * List Active Dataset Solutions
     *
     * Lists all active solutions configured for a specific dataset.
     *
     * @param {apiDszDatasetSolutionsReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszDatasetSolutionsResp>>}
     */
    dszDatasetSolutions(req: apiDszDatasetSolutionsReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszDatasetSolutionsResp>>;
    /**
     * Device Authorization Code Initiation
     *
     * Initiates an RFC 8628 device authorization flow for CLI and remote headless SSH sessions.
     *
     * @param {apiUserAuthDeviceCodeReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthDeviceCodeResp>>}
     */
    userAuthDeviceCode(req: apiUserAuthDeviceCodeReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiUserAuthDeviceCodeResp>>;
    /**
     * Email and Password Sign-In
     *
     * Authenticates an email and password against Identity Platform, enforcing confirmed emails and minting a PKCE code.
     *
     * @param {apiUserAuthPasswordSigninReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthPasswordSigninResp>>}
     */
    userAuthPasswordSignin(req: apiUserAuthPasswordSigninReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiUserAuthPasswordSigninResp>>;
    /**
     * Email and Password Sign-Up
     *
     * Registers a new user with Identity Platform and dispatches a verification email.
     *
     * @param {apiUserAuthPasswordSignupReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthPasswordSignupResp>>}
     */
    userAuthPasswordSignup(req: apiUserAuthPasswordSignupReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiUserAuthPasswordSignupResp>>;
    /**
     * List Dataset Refresh Tokens
     *
     * Lists all active machine refresh tokens provisioned for a dataset.
     *
     * @param {apiUserDatasetTokenRefreshListReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserDatasetTokenRefreshListResp>>}
     */
    userDatasetTokenRefreshList(req: apiUserDatasetTokenRefreshListReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiUserDatasetTokenRefreshListResp>>;
    /**
     * Sample Fraction
     *
     * Sample API that performs a fraction operation
     *
     * @param {apiSampleFractionReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiSampleFractionResp>>}
     */
    sampleFraction(req: apiSampleFractionReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiSampleFractionResp>>;
    /**
     * Get Ingestion Upload URLs
     *
     * Generates presigned PUT URLs and an ingestion token for uploading files into a target dataset table and partitions.
     *
     * @param {apiIngestzGetUrlReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiIngestzGetUrlResp>>}
     */
    ingestzGetUrl(req: apiIngestzGetUrlReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiIngestzGetUrlResp>>;
    /**
     * Create Store Display
     *
     * Creates a store display configuration mapping for a store under a specific dataset.
     *
     * @param {apiDszStoreDisplayCreateReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszStoreDisplayCreateResp>>}
     */
    dszStoreDisplayCreate(req: apiDszStoreDisplayCreateReq, opts?: ServiceOptions): Promise<import("../invoker/invoker.js").Resp<apiDszStoreDisplayCreateResp>>;
}
export { Apis };
declare class SdkFuncs {
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs an SdkFuncs instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * Get Metrics by SKU
     *
     * Gets the metrics impacted by recommendations by SKU for a store and period.
     *
     * @param {sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuOutput>}
     */
    productRelevanceFashionDashImpactedMetricsBySkuV1(req: sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuReq, opts?: ServiceOptions): Promise<sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuOutput>;
    /**
     * Get Coverage
     *
     * Gets the recommendation coverage of the catalog for a store and period.
     *
     * @param {sdkFuncProductRelevanceFashionDashCoverageReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<sdkFuncProductRelevanceFashionDashCoverageOutput>}
     */
    productRelevanceFashionDashCoverageV1(req: sdkFuncProductRelevanceFashionDashCoverageReq, opts?: ServiceOptions): Promise<sdkFuncProductRelevanceFashionDashCoverageOutput>;
    /**
     * Get Bought Together
     *
     * Infers the SKUs frequently bought together with the given SKUs for a store.
     *
     * @param {sdkFuncProductRelevanceFashionFbtReq} req
     * @param {(req: sdkFuncProductRelevanceFashionFbtReq, results: sdkFuncProductRelevanceFashionFbtOutput) => Promise<sdkFuncProductRelevanceFashionFbtSelected>} [selectResults] - picks which of the recommended skus are shown and may attach your own data to each in enriched; default: for each result, in order, the first sku not in req.input.skus (the cart) and not already picked, with the rating of that result; no duplicates, and results with no such sku are skipped
     * @param {ServiceOptions} [opts]
     * @returns {Promise<sdkFuncProductRelevanceFashionFbtSelected>}
     */
    productRelevanceFashionFbtV1(req: sdkFuncProductRelevanceFashionFbtReq, selectResults?: (req: sdkFuncProductRelevanceFashionFbtReq, results: sdkFuncProductRelevanceFashionFbtOutput) => Promise<sdkFuncProductRelevanceFashionFbtSelected>, opts?: ServiceOptions): Promise<sdkFuncProductRelevanceFashionFbtSelected>;
    /**
     * Get Funnel
     *
     * Gets the event counts of the recommendation funnel for a store and period.
     *
     * @param {sdkFuncProductRelevanceFashionDashFunnelReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<sdkFuncProductRelevanceFashionDashFunnelOutput>}
     */
    productRelevanceFashionDashFunnelV1(req: sdkFuncProductRelevanceFashionDashFunnelReq, opts?: ServiceOptions): Promise<sdkFuncProductRelevanceFashionDashFunnelOutput>;
    /**
     * Get Attached Revenue
     *
     * Gets the revenue attached to recommendations for a store and period.
     *
     * @param {sdkFuncProductRelevanceFashionDashAttachedRevenueReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<sdkFuncProductRelevanceFashionDashAttachedRevenueOutput>}
     */
    productRelevanceFashionDashAttachedRevenueV1(req: sdkFuncProductRelevanceFashionDashAttachedRevenueReq, opts?: ServiceOptions): Promise<sdkFuncProductRelevanceFashionDashAttachedRevenueOutput>;
    /**
     * List Showcase Categories
     *
     * Lists the showcase categories of a store.
     *
     * @param {sdkFuncProductRelevanceFashionDashListShowcaseCategoriesReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<sdkFuncProductRelevanceFashionDashListShowcaseCategoriesOutput>}
     */
    productRelevanceFashionDashListShowcaseCategoriesV1(req: sdkFuncProductRelevanceFashionDashListShowcaseCategoriesReq, opts?: ServiceOptions): Promise<sdkFuncProductRelevanceFashionDashListShowcaseCategoriesOutput>;
    /**
     * Get Metrics by Category
     *
     * Gets the metrics impacted by recommendations by showcase category for a store and period.
     *
     * @param {sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryOutput>}
     */
    productRelevanceFashionDashImpactedMetricsByShowcaseCategoryV1(req: sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryReq, opts?: ServiceOptions): Promise<sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryOutput>;
}
export { SdkFuncs };
/**
 * @fileoverview Token management client for i6 SDK.
 * Manages storage, retrieval, exchange, and silent renewal of authentication (user) and authorization (dataset) tokens.
 */
export type Services = import("../services/services.js").Services;
export type UserToken = {
    /**
     * - Signed EdDSA user access token JWT.
     */
    user_access_token: string;
    /**
     * - Opaque user refresh token used for session extension.
     */
    user_refresh_token: string;
    /**
     * - Authenticated user unique identifier UUID.
     */
    user_id: string;
    /**
     * - Access token expiration timestamp in epoch milliseconds.
     */
    expires_at: number;
    /**
     * - Refresh token expiration timestamp in epoch milliseconds.
     */
    refresh_token_expires_at?: number;
};
export type CheckoutRedeemResult = UserToken & {
    dataset: string;
};
export type DatasetToken = {
    /**
     * - Binary packed and signed dataset access token string.
     */
    access_token: string;
    /**
     * - Target dataset ID.
     */
    dataset: string;
    /**
     * - Solution domain restriction.
     */
    solution?: string;
    /**
     * - Compact uint8 grant bitmask held over dataset.
     */
    grants: number;
    /**
     * - Access token expiration timestamp in epoch milliseconds.
     */
    expires_at: number;
    /**
     * - Contextual metadata labels.
     */
    labels?: Record<string, string>;
};
/**
 * Client for managing authentication tokens, local storage persistence, token exchanges,
 * automatic user session renewal, and dataset access token derivation.
 */
declare class Tokens {
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * In-flight user refresh promise to prevent duplicate refresh calls during concurrent operations.
     * @private
     * @type {Promise<UserToken|null>|null}
     */
    _refreshPromise;
    /**
     * In-flight dataset token request promises by dataset ID to deduplicate concurrent requests.
     * @private
     * @type {Map<string, Promise<DatasetToken|null>>}
     */
    _datasetTokenPromises;
    /**
     * Constructs a Tokens client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * Retrieves the base URL for the i6userz authentication service from SDK configuration.
     * Resolution precedence:
     * 1. `config.servUrls["userz"]`
     * 2. `config.userzUrl`
     * 3. `config.baseUrl`
     * 4. Empty string fallback
     * @private
     * @returns {string} The base URL for userz.
     */
    private _getUserzUrl;
    /**
     * Resolves the storage adapter for token persistence.
     * Checks SDK configuration for a custom storage adapter or factory function,
     * falling back to the browser's global `localStorage`.
     * @private
     * @returns {import("../index.js").I6Storage|null} The active storage adapter or null if unavailable.
     */
    private _getStorage;
    /**
     * Checks whether the given user access token is expired or will expire within the given skew window.
     *
     * @param {UserToken|null} [token] - The token object to inspect. If omitted, inspects stored token.
     * @param {number} [skewSeconds=30] - Safety margin in seconds before actual expiration timestamp.
     * @returns {boolean} True if the access token is missing, expired, or expiring within skewSeconds.
     */
    isAccessTokenExpired(token?: UserToken | null, skewSeconds?: number): boolean;
    /**
     * Checks whether the user refresh token is expired.
     *
     * @param {UserToken|null} [token] - The token object to inspect. If omitted, inspects stored token.
     * @returns {boolean} True if the refresh token is missing or its expiration timestamp has elapsed.
     */
    isRefreshTokenExpired(token?: UserToken | null): boolean;
    /**
     * Retrieves the stored user token credentials from storage.
     *
     * @param {boolean} [refreshed] - Optional flag indicating whether to return
     *   a freshly refreshed token.
     * @returns {UserToken|null} The stored user token object containing access and
     *   refresh tokens, or null if no valid session exists in storage.
     */
    getUserToken(refreshed?: boolean): UserToken | null;
    /**
     * Stores user token credentials in storage under `'i6_user_user_token'`.
     *
     * @param {UserToken} token - The user token credentials to store.
     * @returns {void}
     */
    setUserToken(token: UserToken): void;
    /**
     * Retrieves the current user access token directly from storage without expiration checks or refresh attempts.
     * Use {@link Tokens#getValidAccessToken} when fresh/valid credentials are required.
     *
     * @returns {string|undefined} The signed EdDSA user access token JWT,
     *   or undefined if no user is authenticated.
     */
    getAccessToken(): string | undefined;
    /**
     * Clears stored user token credentials from storage.
     * @returns {void}
     */
    clearUserToken(): void;
    /**
     * Exchanges an authorization code and PKCE code verifier for user token credentials
     * via `POST /api/userz/auth/exchange`, and persists them in localStorage.
     * Automatically clears any existing dataset tokens before storing new session credentials.
     *
     * @param {string} code - The authorization code returned by i6userz auth.
     * @param {string} codeVerifier - The PKCE code verifier matching the login challenge.
     * @returns {Promise<UserToken>} The exchanged user token credentials.
     * @throws {Error} If the token exchange request fails or the server returns an error status.
     */
    exchange(code: string, codeVerifier: string): Promise<UserToken>;
    /**
     * Redeems a checkout artifact ticket via `POST /api/decsuite/auth/checkoutredeem`,
     * persists the resulting user token credentials in localStorage (without dataset),
     * and returns the user token credentials along with the target dataset ID.
     * Automatically clears any existing dataset tokens before storing new session credentials.
     *
     * @param {string} checkoutCode - The encrypted checkout ticket issued by checkoutcallback.
     * @returns {Promise<CheckoutRedeemResult>} The redeemed user token credentials and dataset ID.
     * @throws {Error} If the redemption request fails or the server returns an error status.
     */
    redeemCheckout(checkoutCode: string): Promise<CheckoutRedeemResult>;
    /**
     * Refreshes the user access token using the stored user refresh token via `POST /api/userz/auth/refresh`.
     * Enforces token family rotation by storing the newly rotated refresh token and fresh access token.
     * If session renewal is revoked or family reuse is detected, wipes the stored user session.
     * Concurrent refresh calls are deduplicated using an in-flight promise cache.
     *
     * @returns {Promise<UserToken|null>} The newly refreshed user token credentials or null if renewal failed.
     */
    refresh(): Promise<UserToken | null>;
    /**
     * Revokes the active user session server-side via `POST /api/userz/auth/logout`.
     * Sends the stored `user_refresh_token` to revoke the entire session token family in userzsession.
     * Clears local tokens regardless of server response to guarantee client session cleanup.
     *
     * @returns {Promise<boolean>} True if revocation completed and tokens were cleared.
     */
    logout(): Promise<boolean>;
    /**
     * Retrieves a guaranteed-valid user access token JWT string.
     *
     * If the stored access token is still valid (not expired within `skewSeconds`), it is returned immediately.
     * If the access token is expired or close to expiring, an automatic silent refresh is performed
     * using the user refresh token.
     * If the user is unauthenticated or the refresh token has expired/been revoked, returns null.
     *
     * @param {number} [skewSeconds=30] - Safety margin in seconds before expiration.
     * @returns {Promise<string|null>} The valid user access token JWT, or null if unauthenticated or session expired.
     */
    getValidAccessToken(skewSeconds?: number): Promise<string | null>;
    /**
     * Retrieves the full map of cached dataset access tokens from storage.
     *
     * @returns {Record<string, DatasetToken>} A dictionary of cached dataset tokens keyed by dataset ID.
     */
    getAllDatasetTokens(): Record<string, DatasetToken>;
    /**
     * Retrieves the cached dataset access token object for a specific dataset from storage.
     *
     * @param {string} dataset - Target dataset ID.
     * @returns {DatasetToken|null} The cached dataset token object, or null if not found.
     */
    getDatasetToken(dataset: string): DatasetToken | null;
    /**
     * Stores a dataset access token credentials object in storage under the given dataset ID.
     *
     * @param {string} dataset - Target dataset ID.
     * @param {DatasetToken} token - The dataset access token credentials to cache.
     * @returns {void}
     */
    setDatasetToken(dataset: string, token: DatasetToken): void;
    /**
     * Clears all cached dataset access tokens from storage.
     * @returns {void}
     */
    clearDatasetTokens(): void;
    /**
     * Checks whether the given dataset access token is expired or will expire within the given skew window.
     *
     * @param {DatasetToken|null} [token] - The dataset token object to inspect.
     * @param {number} [skewSeconds=30] - Safety margin in seconds before expiration.
     * @returns {boolean} True if the token is missing, expired, or expiring within skewSeconds.
     */
    isDatasetTokenExpired(token?: DatasetToken | null, skewSeconds?: number): boolean;
    /**
     * Retrieves a guaranteed-valid dataset access token string for the target dataset.
     *
     * 1. Checks localStorage for a cached dataset token for `dataset`. If present and valid
     *    (not expiring within `skewSeconds`), returns its `access_token` immediately.
     * 2. If expired or not yet cached, retrieves a valid user access token via {@link Tokens#getValidAccessToken}.
     *    If unauthenticated or user session cannot be renewed, returns null.
     * 3. Calls `POST /api/userz/dataset/access-token` on userz requesting all grants (`0x0F`),
     *    which the server clamps to the user's actual grants on that dataset.
     * 4. Caches the resulting {@link DatasetToken} in localStorage under `dataset` and returns the token string.
     * 5. Deduplicates concurrent requests for the same dataset so only a single network request is made.
     *
     * @param {string} dataset - Target dataset ID.
     * @param {number} [skewSeconds=30] - Safety margin in seconds before expiration.
     * @returns {Promise<string|null>} The active dataset access token string, or null if unauthorized/error.
     */
    getValidDatasetAccessToken(dataset: string, skewSeconds?: number): Promise<string | null>;
    /**
     * Clears all session credentials (both user and dataset tokens) from storage.
     * Effectively resets client authentication state.
     *
     * @returns {void}
     */
    clearTokens(): void;
}
export { Tokens };
/**
 * @fileoverview Service container managing SDK service instances and configuration.
 */
import { Invoker } from "../invoker/invoker.js";
import { Auth } from "../auth/auth.js";
import { Tokens } from "../tokens/tokens.js";
import { Ingest } from "../ingest/ingest.js";
import { Apis, SdkFuncs } from "../sdkapis/sdkapis.js";
import { Infer } from "../infer/infer.js";
import { Dash } from "../dash/dash.js";
export type I6SdkConfig = import("../index.js").I6SdkConfig;
/**
 * @typedef {import("../index.js").I6SdkConfig} I6SdkConfig
 */
/**
 * Service container that instantiates and provides access to SDK service clients.
 * `auth` and `tokens` return cached singleton instances; other accessors instantiate a new client
 * sharing this container's config and dispatcher.
 */
declare class Services {
    _dispatcher: EventTarget;
    /**
     * @private
     * @type {I6SdkConfig}
     */
    _config;
    _auth: Auth | undefined;
    _tokens: Tokens | undefined;
    /**
     * Constructs a Services instance.
     * @param {I6SdkConfig} config - Configuration object for the SDK services.
     */
    constructor(config: I6SdkConfig);
    /**
     * Returns the SDK configuration.
     * @returns {I6SdkConfig} The configuration object.
     */
    config(): I6SdkConfig;
    /**
     * Overwrites the given keys of the SDK configuration; the other keys are kept.
     * Clients read the config on every call, so the change is seen by every client of this container at once.
     * @param {Partial<I6SdkConfig>} config - The keys to overwrite.
     * @returns {void}
     */
    setConfig(config: Partial<I6SdkConfig>): void;
    /**
     * Registers an event listener on the internal event dispatcher.
     * @param {string} evt - The event type or name to listen for.
     * @param {EventListenerOrEventListenerObject|Function} fn - The callback function or event listener object invoked when the event occurs.
     * @returns {void}
     */
    bind(evt: string, fn: EventListenerOrEventListenerObject | Function): void;
    /**
     * Creates and returns an Invoker service instance.
     * @returns {Invoker} An instance of the Invoker client.
     */
    invoker(): Invoker;
    /**
     * Creates and returns an Auth service instance.
     * @returns {Auth} An instance of the Auth client.
     */
    auth(): Auth;
    /**
     * Creates and returns a Tokens service instance.
     * @returns {Tokens} An instance of the Tokens client.
     */
    tokens(): Tokens;
    /**
     * Creates and returns an Ingest service instance.
     * @returns {Ingest} An instance of the Ingest client.
     */
    ingest(): Ingest;
    /**
     * Creates and returns an Infer service instance.
     * @returns {Infer} An instance of the Infer client.
     */
    infer(): Infer;
    /**
     * Creates and returns a Dash service instance.
     * @returns {Dash} An instance of the Dash client.
     */
    dash(): Dash;
    /**
     * Creates and returns an Apis service instance.
     * @returns {Apis} An instance of the generated Apis client.
     */
    apis(): Apis;
    /**
    * Creates and returns a Funcs service instance.
    * @returns {SdkFuncs} An instance of the generated SdkFuncs client.
    */
    funcs(): SdkFuncs;
}
export { Services, Apis, SdkFuncs };
/**
 * @fileoverview The LiteRT side of infer: loads the tflite model and runs it. Everything that touches the
 * LiteRT library (runtime, model, tensors) is in this file. The caller only gives data and gets values back.
 */
export type FileRef = import("../internal/fs/fs.js").FileRef;
export type ModelInput = {
    /**
     * - Flat values; their count must be the product of `shape`.
     */
    data: number[];
    /**
     * - Shape of `data`.
     */
    shape: number[];
};
/**
 * Loads the LiteRT runtime (once) and the tflite model. Everything LiteRT stays inside this file. The file is only
 * read and compiled when its version changed since the last call.
 * @param {Object} opts
 * @param {FileRef} opts.ref - The downloaded .tflite file.
 * @param {string} [opts.wasmUrl] - URL of the folder with the LiteRT wasm files. Defaults to the jsdelivr copy.
 * @returns {Promise<Object>} The compiled model, to give to `runModel` and `describeModel`.
 */
declare function loadModel(opts: {
    ref: FileRef;
    wasmUrl?: string;
}): Promise<Object>;
/**
 * Names, dtypes and shapes of what the model takes and returns.
 * @param {Object} model - The compiled model, from `loadModel`.
 * @returns {{inputs: Object[], outputs: Object[]}}
 */
declare function describeModel(model: Object): {
    inputs: Object[];
    outputs: Object[];
};
/**
 * Checks one input against the model's shape.
 * @param {string} name - Input name, for error messages.
 * @param {ModelInput} input - What the caller gave.
 * @param {number[]} modelShape - Shape of the model input (-1 is free).
 * @returns {{flat: number[], shape: number[]}}
 */
declare function toTensorData(name: string, input: ModelInput, modelShape: number[]): {
    flat: number[];
    shape: number[];
};
/**
 * Runs the model. The caller only gives data: every LiteRT tensor is created and freed here.
 * Every model input must be in `inputs` under its exact name.
 * @param {Object} model - The compiled model, from loadModel.
 * @param {Record<string, ModelInput>} inputs - Input name -> data.
 * @returns {Promise<Record<string, ArrayLike<number>>>} Output name -> values, for every output of the model.
 */
declare function runModel(model: Object, inputs: Record<string, ModelInput>): Promise<Record<string, ArrayLike<number>>>;
export { loadModel, describeModel, runModel, toTensorData };
/**
 * @fileoverview Runs an i6 model (e.g. "relevance-fashion-fbt") in the browser and returns the result.
 *
 * Flow: get the model's sqlite + tflite (URLs from the model signed-get API, or from the caller in tests),
 * run the named query `model-${modelName}-input` (its result is the model inputs, `{name: {data, shape}}`),
 * run the tflite model, and run the named query `model-${modelName}-output` with the model outputs.
 * Its result is returned as is. Nothing here is model specific.
 *
 * Set `window.I6_DEBUG = true` to see what happens in the console, and to get the model tensors in the "i6:infer-tensors" event.
 */
export type Services = import("../services/services.js").Services;
export type FileRef = import("../internal/fs/fs.js").FileRef;
export type ServiceOptions = import("../invoker/invoker.js").ServiceOptions;
export type InferOptions = {
    /**
     * - Model name (e.g. "relevance-fashion-fbt"); names the cached assets and the named queries.
     */
    modelName: string;
    /**
     * - Partitions of the model, name -> value (e.g. `{ version: "v1", store_id: "s1" }`). Any partitions.
     */
    partitions: Record<string, string>;
    /**
     * - Dataset that holds the model files.
     */
    dataset: string;
    /**
     * - Model input, any JSON (e.g. `{ skus: [...] }`). Bound as `?1` of the input query.
     */
    params: any;
    /**
     * - Id of the user session; sent in the recommendation events.
     */
    sessionId: string;
    /**
     * - Id of the user; sent in the recommendation events.
     */
    userId: string;
    /**
     * - Max number of results asked from the output query (its `?2`). Default 20.
     */
    limit?: number;
    /**
     * - Tests only, together with `tfliteUrl`: URL of the sqlite (must answer HEAD with an etag). Default: the model API.
     */
    sqliteUrl?: string;
    /**
     * - Tests only, together with `sqliteUrl`: URL of the tflite.
     */
    tfliteUrl?: string;
    /**
     * - URL of the folder with the LiteRT wasm files (ending in "/"). Defaults to the jsdelivr copy.
     */
    litertWasm?: string;
    /**
     * - Given to the API calls (the model API and the `recraw` event).
     */
    serviceOpts?: ServiceOptions;
};
export type SelectResultsOptions = {
    /**
     * - What the caller asked for (the cart).
     */
    req: any;
    /**
     * - What `run` returned.
     */
    results: any;
    /**
     * - Id of the recommendation run, returned by `run`.
     */
    recId: string;
    /**
     * - Id of the user session.
     */
    sessionId: string;
    /**
     * - Id of the user.
     */
    userId: string;
    /**
     * - Dataset of the model.
     */
    dataset: string;
    /**
     * - Model name.
     */
    modelName: string;
    /**
     * - Model version.
     */
    modelVersion: string;
    /**
     * - Store partition.
     */
    storeId?: string;
    /**
     * - Given to the `recshow` event call.
     */
    serviceOpts?: ServiceOptions;
    /**
     * - Custom selection function.
     */
    selectResults?: (req: any, results: any) => Promise<any>;
};
/**
 * Infer client.
 */
declare class Infer {
    #private;
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs an Infer client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * Runs the model in the browser and returns its recommendation result.
     * @param {InferOptions} opts - Inference options.
     * @returns {Promise<*>} The results of the model.
     */
    run(opts: InferOptions): Promise<any>;
    callModel(inputs: any, opts: any): Promise<import("../index.js").Resp<import("../sdkapis/sdkapis.js").apiTfzModelPredictResp>>;
    /**
     * Asks `selectResults` which of the recommended skus are shown and sends their sku ids as the `recshow` event.
     * @param {SelectResultsOptions} opts - Select options.
     * @returns {Promise<*>} What `selectResults` returned, as is (the default sets the `rating` of each sku; see `defaultSelectResults`).
     */
    selectResults(opts: SelectResultsOptions): Promise<any>;
    /**
     * Sends one recommendation event.
     * @private
     * @param {{dataset: string, modelName: string, modelVersion: string, storeId: string, serviceOpts?: ServiceOptions}} opts - Event options.
     * @param {{sessionId: string, userId: string}} ids - Session and user of the sdk.
     * @param {string} recId - Id of the recommendation, the same in the recraw and recshow events.
     * @param {"recraw"|"recshow"} kind - Which event.
     * @param {*} payload - What the event carries, any JSON.
     * @returns {Promise<void>}
     */
    private #sendRecEvent;
    /**
     * Finds where the two model files are: the signed URLs of the model API, unless opts has them (tests).
     * @private
     * @param {InferOptions} opts - Inference options.
     * @returns {Promise<{sqlite: string, tflite: string}>} Download URLs of the files.
     */
    private _assetUrls;
}
export { Infer };
/**
 * @fileoverview HTTP client for sending API requests to i6 services.
 */
export type Services = import("../services/services.js").Services;
export type Fetcher = (url: string, opts: InvokeOptions) => Promise<Response>;
export type PrepareRequest = (opts: InvokeOptions) => Promise<void> | void;
export type ServiceOptions = {
    /**
     * - Custom fetcher function override.
     */
    fetcher?: Fetcher;
    /**
     * - Pre-request hook (e.g. for URL signing).
     */
    prepareRequest?: PrepareRequest;
    /**
     * - Explicit user bearer token for this request.
     */
    bearerToken?: string;
    /**
     * - Contextual metadata labels.
     */
    labels?: Record<string, string>;
};
export type InvokeOptions = {
    /**
     * - Full target URL. Overrides baseUrl + path if set.
     */
    url?: string;
    /**
     * - Path appended to baseUrl (e.g. "api/item/create").
     */
    path?: string;
    /**
     * - HTTP method ("GET", "POST", "PUT", etc.).
     */
    method?: string;
    /**
     * - Query parameters serialized into the URL.
     */
    query?: Record<string, any>;
    /**
     * - Body data serialized as JSON. Sets "Content-Type: application/json".
     */
    json?: any;
    /**
     * - Additional HTTP headers.
     */
    headers?: HeadersInit;
    /**
     * - Advanced service request hooks (fetcher, prepareRequest, etc.).
     */
    opts?: ServiceOptions;
    /**
     * - Fetch credentials mode.
     */
    credentials?: RequestCredentials;
};
/**
 * Response wrapper holding HTTP transport status and lazy parser.
 * @template T
 */
declare class Resp<T> {
    #private;
    status: number;
    headers: Headers;
    ok: boolean;
    /**
     * @param {number} status - HTTP status code.
     * @param {Headers} headers - HTTP response headers.
     * @param {() => *} parser - Lazy parser function.
     * @param {string} [text] - Raw response body text.
     */
    constructor(status: number, headers: Headers, parser: () => any, text?: string);
    /**
     * Raw body text of the response.
     * @returns {string}
     */
    get text(): string;
    /**
     * Structured error information when response is not ok.
     * @returns {{status: number, code: string, message: string, cause: *}|null}
     */
    get error(): {
        status: number;
        code: string;
        message: string;
        cause: any;
    } | null;
    /**
     * Parses and returns the deserialized response value.
     * Throws an error if deserialization fails or if the response status is not ok.
     * @returns {T}
     */
    parse(): T;
}
/**
 * Invoker client for executing HTTP requests against the i6 API.
 */
declare class Invoker {
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs an Invoker instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * @param {{tokenTypes: string, url: string}} opts
     * @return {{token:string, required: boolean}}
     */
    resolveToken(opts: {
        tokenTypes: string;
        url: string;
    }): {
        token: string;
        required: boolean;
    };
    /**
     * Sends an HTTP request using the Fetch API.
     *
     * @param {InvokeOptions} opts - Request options including path/URL, query params, and fetch options.
     * @returns {Promise<Response>} A promise that resolves to the fetch Response.
     */
    invoke(opts: InvokeOptions): Promise<Response>;
    /**
     * Resolves with a `Resp` instance holding the HTTP status, headers, and lazy `parse()`.
     * Network errors bubble up directly as native exceptions.
     * @template T
     * @param {InvokeOptions} opts - Same as `invoke`.
     * @returns {Promise<Resp<T>>}
     */
    invokeResult<T>(opts: InvokeOptions): Promise<Resp<T>>;
}
export { Invoker, Resp };
/**
 * @fileoverview Queries an i6 dash in the browser: downloads the dash's sqlite, runs the named query
 * `dash-${dashName}` on it and returns its result as is. Nothing here is dash specific.
 *
 * Set `window.I6_DEBUG = true` to see what happens in the console.
 */
export type Services = import("../services/services.js").Services;
export type ServiceOptions = import("../invoker/invoker.js").ServiceOptions;
export type DashOptions = {
    /**
     * - Dash name (e.g. "product-relevance-fashion-dash-funnel"); names the cached sqlite and the named query.
     */
    dashName: string;
    /**
     * - Partitions of the dash, name -> value (e.g. `{ store_id: "s1", version: "v1" }`).
     */
    partitions: Record<string, string>;
    /**
     * - Dataset that holds the dash file.
     */
    dataset: string;
    /**
     * - Query input, any JSON. Bound as `?1` of the named query. Omit it for a query that takes none.
     */
    params?: any;
    /**
     * - Tests only: URL of the sqlite (must answer HEAD with an etag). Default: the model API.
     */
    sqliteUrl?: string;
    /**
     * - Given to the API call that signs the sqlite URL.
     */
    serviceOpts?: ServiceOptions;
};
/**
 * Dash client.
 */
declare class Dash {
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs a Dash client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * Downloads the dash sqlite (cached by etag), runs the named query `dash-${dashName}` with `params` and returns its result.
     * @param {DashOptions} opts - Dash options.
     * @returns {Promise<*>} The `ret` of the named query.
     */
    query(opts: DashOptions): Promise<any>;
    /**
     * Finds where the dash sqlite is: the signed URL of the model API (like Infer), unless opts has `sqliteUrl` (tests).
     * @private
     * @param {DashOptions} opts - Dash options.
     * @returns {Promise<string>} Download URL of the sqlite.
     */
    private _sqliteUrl;
}
export { Dash };
/**
 * @fileoverview Main entry point for the i6 Web Legacy SDK.
 */
import { Apis, SdkFuncs } from "./services/services.js";
import { Resp } from "./invoker/invoker.js";
import { bitmapz } from "./internal/bitmapz/bitmapz.js";
export type I6Storage = {
    /**
     * - Retrieves an item by key.
     */
    getItem: (key: string) => string | null;
    /**
     * - Stores an item by key and string value.
     */
    setItem: (key: string, value: string) => void;
    /**
     * - Removes an item by key.
     */
    removeItem: (key: string) => void;
};
export type I6SdkConfig = {
    /**
     * - Base URL of the i6 server. Defaults to the sandbox environment.
     */
    baseUrl?: string;
    /**
     * - Base URL of the other services, by the `servname` label of the api (e.g. `tfinfer`). An api whose service is not listed uses `baseUrl`.
     */
    servUrls?: Record<string, string>;
    /**
     * - Direct base URL override for the i6userz authentication service.
     */
    userzUrl?: string;
    /**
     * - Absolute URL of the application's exchange callback page handling PKCE token exchange.
     */
    userExchangeCallbackUrl?: string;
    /**
     * - Default application redirect URL after logout.
     */
    callbackUrl?: string;
    /**
     * - Client application identifier registered in i6userz (e.g. 'default').
     */
    app?: string;
    /**
     * - Optional storage adapter for persistent token storage. Defaults to global `localStorage` when omitted.
     */
    storage?: I6Storage | (() => I6Storage);
    /**
     * - Optional alias for persistent storage adapter (defaults to global `localStorage`).
     */
    localStorage?: I6Storage | (() => I6Storage);
    /**
     * - Optional storage adapter for session-scoped data such as PKCE code verifier. Defaults to global `sessionStorage` when omitted.
     */
    sessionStorage?: I6Storage | (() => I6Storage);
    /**
     * - Optional alias for session storage adapter.
     */
    storageSession?: I6Storage | (() => I6Storage);
};
/**
 * Main SDK class providing access to i6 services.
 */
declare class I6Sdk {
    /**
     * @private
     * @type {Services}
     */
    _service;
    /**
     * Constructs an instance of the i6 SDK.
     * @param {I6SdkConfig} [config] - Configuration options for the SDK.
     */
    constructor(config?: I6SdkConfig);
    /**
     * Returns a copy of the configuration the SDK is running with.
     * @returns {I6SdkConfig} The current configuration.
     */
    config(): I6SdkConfig;
    /**
     * Overwrites the given keys of the configuration; the other keys are kept.
     * Can be called at any time, the next call of the SDK uses the new values.
     * @param {Partial<I6SdkConfig>} config - The keys to overwrite.
     * @returns {void}
     */
    setConfig(config: Partial<I6SdkConfig>): void;
    /**
     * Returns an Ingest service instance.
     * @returns {import("./ingest/ingest.js").Ingest} An instance of the Ingest client.
     */
    ingest(): import("./ingest/ingest.js").Ingest;
    /**
     * Returns an Infer service instance, which runs an i6 model in the browser and returns the result.
     * @returns {import("./infer/infer.js").Infer} An instance of the Infer client.
     */
    infer(): import("./infer/infer.js").Infer;
    /**
     * Returns a Dash service instance, which queries an i6 dash in the browser and returns the result.
     * @returns {import("./dash/dash.js").Dash} An instance of the Dash client.
     */
    dash(): import("./dash/dash.js").Dash;
    /**
     * Returns an Auth service instance.
     * @returns {import("./auth/auth.js").Auth} An instance of the Auth client.
     */
    auth(): import("./auth/auth.js").Auth;
    /**
     * Returns a Tokens service instance.
     * @returns {import("./tokens/tokens.js").Tokens} An instance of the Tokens client.
     */
    tokens(): import("./tokens/tokens.js").Tokens;
    /**
     * Returns the Apis service instance, one typed method per i6 server API.
     * Each call resolves with `{status, ok, payload?, error?}` and does not throw on an HTTP error.
     * @returns {Apis} An instance of the generated Apis client.
     */
    apis(): Apis;
    /**
     * Returns the Funcs service instance.
     * @returns {SdkFuncs} An instance of the SdkFuncs client.
     */
    funcs(): SdkFuncs;
    /**
     * Registers an event listener on the SDK's internal event dispatcher (an EventTarget).
     * @param {string} evt - The event type or name to listen for.
     * @param {EventListenerOrEventListenerObject|Function} fn - The callback function or event listener object invoked when the event occurs.
     * @returns {void}
     */
    bind(evt: string, fn: EventListenerOrEventListenerObject | Function): void;
}
declare namespace I6Sdk {
    export { Resp };
    export { bitmapz };
    export { Grants };
}
/**
 * Permissions catalog and bitmask constants matching Go's grants package.
 */
declare const Grants: Readonly<{
    System: 1;
    Admin: 2;
    Write: 4;
    Read: 8;
    All: 15;
}>;
export { I6Sdk, Resp, bitmapz, Grants };
/**
 * @fileoverview Ingest client for uploading files to the ingestion service.
 */
export type Services = import("../services/services.js").Services;
export type ServiceOptions = import("../invoker/invoker.js").ServiceOptions;
export type Partitions = Record<string, string>;
export type GetUrlParams = {
    /**
     * - Dataset name.
     */
    dataset: string;
    /**
     * - Inbox table name.
     */
    table: string;
    /**
     * - Values for the table partitions, except the ingest id one.
     */
    partitions: Partitions;
    /**
     * - Given to the ingestz-get-url API call.
     */
    serviceOpts?: ServiceOptions;
};
export type UploadProgress = {
    /**
     * - Bytes sent so far.
     */
    loaded: number;
    /**
     * - Total bytes to send (the file size when the browser can't tell).
     */
    total: number;
    /**
     * - Progress from 0 to 100.
     */
    percent: number;
};
export type UploadParams = {
    /**
     * - Dataset the file is ingested into.
     */
    dataset: string;
    /**
     * - Inbox table name.
     */
    table: string;
    /**
     * - Values for the table partitions, except the ingest id one.
     */
    partitions: Partitions;
    /**
     * - The single file to upload.
     */
    file: File;
    /**
     * - Called as the file is sent.
     */
    onProgress?: (progress: UploadProgress) => void;
    /**
     * - Aborts the upload; the promise then rejects with the signal's reason (an AbortError by default).
     */
    signal?: AbortSignal;
    /**
     * - Content-Type of the PUT. Defaults to the file's own type.
     */
    contentType?: string;
    /**
     * - Given to the ingestz-get-url API call (the PUT to the signed URL needs none).
     */
    serviceOpts?: ServiceOptions;
};
export type UploadResult = {
    /**
     * - Id the server assigned to this ingest.
     */
    ingestId: string;
};
/**
 * @typedef {import("../services/services.js").Services} Services
 * @typedef {import("../invoker/invoker.js").ServiceOptions} ServiceOptions
 */
/**
 * Key-value mapping representing dataset table partition values, except the ingest ID.
 * @typedef {Record<string, string>} Partitions
 */
/**
 * Parameters for requesting a signed upload URL from the ingest service.
 * @typedef {Object} GetUrlParams
 * @property {string} dataset - Dataset name.
 * @property {string} table - Inbox table name.
 * @property {Partitions} partitions - Values for the table partitions, except the ingest id one.
 * @property {ServiceOptions} [serviceOpts] - Given to the ingestz-get-url API call.
 */
/**
 * Progress of an upload in flight.
 * @typedef {Object} UploadProgress
 * @property {number} loaded - Bytes sent so far.
 * @property {number} total - Total bytes to send (the file size when the browser can't tell).
 * @property {number} percent - Progress from 0 to 100.
 */
/**
 * Parameters for uploading a single file to the ingest service.
 * @typedef {Object} UploadParams
 * @property {string} dataset - Dataset the file is ingested into.
 * @property {string} table - Inbox table name.
 * @property {Partitions} partitions - Values for the table partitions, except the ingest id one.
 * @property {File} file - The single file to upload.
 * @property {(progress: UploadProgress) => void} [onProgress] - Called as the file is sent.
 * @property {AbortSignal} [signal] - Aborts the upload; the promise then rejects with the signal's reason (an AbortError by default).
 * @property {string} [contentType] - Content-Type of the PUT. Defaults to the file's own type.
 * @property {ServiceOptions} [serviceOpts] - Given to the ingestz-get-url API call (the PUT to the signed URL needs none).
 */
/**
 * Result of a successful upload.
 * @typedef {Object} UploadResult
 * @property {string} ingestId - Id the server assigned to this ingest.
 */
/**
 * Client for handling file uploads to the ingest service.
 */
declare class Ingest {
    #private;
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs an Ingest client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * Asks ingestz for a signed upload URL (ingestz-get-url API) and uploads a single file to it.
     * @param {UploadParams} params - Upload parameters.
     * @returns {Promise<UploadResult>} Resolves with the ingest id on a successful upload.
     */
    upload({ dataset, table, partitions, file, onProgress, signal, contentType, serviceOpts }: UploadParams): Promise<UploadResult>;
    /**
     * Gets one signed PUT URL from the ingestz-get-url API.
     * @private
     * @param {GetUrlParams} params - Parameters for requesting the upload URL.
     * @returns {Promise<{ingestId: string, url: string}>} The ingest id and the signed PUT URL.
     */
    private #getUrl;
    /**
     * Uploads a file to a signed PUT URL using XMLHttpRequest (fetch has no upload progress).
     * @private
     * @param {string} signedPutUrl - The signed URL to PUT the file to.
     * @param {File} file - The file to upload.
     * @param {Pick<UploadParams, "onProgress"|"signal"|"contentType">} opts
     * @returns {Promise<void>} Resolves on a successful upload, rejects on network or HTTP error or abort.
     */
    private #put;
}
export { Ingest };
