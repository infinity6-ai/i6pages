const CODE_VERIFIER_KEY = "i6_auth_code_verifier";
const AUTH_STATE_KEY = "i6_auth_state";
class Auth {
  /**
   * Constructs an Auth client instance.
   * @param {Services} services - The services manager instance.
   */
  constructor(services) {
    this._services = services;
  }
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
  _getUserzUrl() {
    const config = this._services.config();
    return config.servUrls?.["userz"] || config.userzUrl || config.baseUrl || "";
  }
  /**
   * Resolves the session storage adapter for transient auth data (e.g. PKCE code verifier).
   * Checks SDK configuration for a custom session storage adapter or factory function,
   * falling back to the browser's global `sessionStorage`.
   * @private
   * @returns {import("../index.js").I6Storage|null} The active session storage adapter or null if unavailable.
   */
  _getSessionStorage() {
    const config = this._services.config();
    const s = config.sessionStorage || config.storageSession;
    if (typeof s === "function") {
      try {
        return s();
      } catch {
        return null;
      }
    }
    if (s) {
      return s;
    }
    return typeof sessionStorage !== "undefined" ? sessionStorage : null;
  }
  /**
   * Navigates the browser window to a target URL.
   * @private
   * @param {string} url - Target URL.
   * @returns {void}
   */
  _navigate(url) {
    if (typeof window !== "undefined") {
      window.location.href = url;
    }
  }
  /**
   * Redirects the browser location to a callback URL.
   * @private
   * @param {string} url - Target redirect URL.
   * @returns {void}
   */
  _redirect(url) {
    if (typeof location !== "undefined") {
      location = url;
    }
  }
  /**
   * Validates whether a redirect URL is safe to prevent open redirect vulnerabilities.
   * A URL is considered safe if:
   * 1. It is a relative path starting with '/' (but not '//' or '/\\').
   * 2. It is an absolute URL whose origin matches window.location.origin or configured callback URLs.
   * @private
   * @param {string} url - The URL to validate.
   * @returns {boolean} True if the redirect target is safe, false otherwise.
   */
  _isSafeRedirect(url) {
    if (!url || typeof url !== "string") {
      return false;
    }
    if (url.startsWith("/") && !url.startsWith("//") && !url.startsWith("/\\")) {
      return true;
    }
    if (typeof window !== "undefined" && window.location) {
      try {
        const parsed = new URL(url, window.location.origin);
        if (parsed.origin === window.location.origin) {
          return true;
        }
        const config = this._services.config();
        if (config.callbackUrl) {
          const cbOrigin = new URL(config.callbackUrl, window.location.origin).origin;
          if (parsed.origin === cbOrigin) return true;
        }
        if (config.userExchangeCallbackUrl) {
          const excOrigin = new URL(config.userExchangeCallbackUrl, window.location.origin).origin;
          if (parsed.origin === excOrigin) return true;
        }
      } catch {
        return false;
      }
    }
    return false;
  }
  /**
   * Generates a cryptographically random standard PKCE code verifier (RFC 7636 §4.1).
   * Uses unreserved URL characters (`[A-Z]`, `[a-z]`, `[0-9]`, `-`, `.`, `_`, `~`).
   * @private
   * @param {number} [length=64] - The length of the code verifier (between 43 and 128 characters).
   * @returns {string} The generated code verifier string.
   */
  _generateCodeVerifier(length = 64) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    const array = new Uint8Array(length);
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      for (let i = 0; i < length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    let verifier = "";
    for (let i = 0; i < array.length; i++) {
      verifier += charset[array[i] % charset.length];
    }
    return verifier;
  }
  /**
   * Generates an RFC 7636 S256 PKCE code challenge from a code verifier.
   * Computes SHA-256 over the ASCII code verifier and base64url-encodes the digest without padding.
   * @private
   * @param {string} verifier - The plaintext code verifier.
   * @returns {Promise<string>} The base64url-encoded code challenge.
   * @throws {Error} If Web Crypto API (`crypto.subtle.digest`) is unavailable.
   */
  async _generateCodeChallenge(verifier) {
    if (typeof crypto !== "undefined" && crypto.subtle && crypto.subtle.digest) {
      const encoder = new TextEncoder();
      const data = encoder.encode(verifier);
      const digest = await crypto.subtle.digest("SHA-256", data);
      return this._base64UrlEncode(new Uint8Array(digest));
    }
    throw new Error("Web Crypto API required for PKCE code challenge");
  }
  /**
   * Encodes a byte array as an unpadded base64url string (RFC 4648 §5).
   * Replaces '+' with '-', '/' with '_', and strips trailing '=' padding.
   * @private
   * @param {Uint8Array|ArrayBuffer} bytes - The bytes to encode.
   * @returns {string} The base64url-encoded string.
   * @throws {Error} If no base64 encoder (`btoa` or Node.js `Buffer`) is available.
   */
  _base64UrlEncode(bytes) {
    const bytesArray = new Uint8Array(bytes);
    let binary = "";
    for (let i = 0; i < bytesArray.byteLength; i++) {
      binary += String.fromCharCode(bytesArray[i]);
    }
    let base64;
    if (typeof btoa !== "undefined") {
      base64 = btoa(binary);
    } else if (typeof Buffer !== "undefined") {
      base64 = Buffer.from(binary, "binary").toString("base64");
    } else {
      throw new Error("No base64 encoder found");
    }
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
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
  async login(callbackUrl) {
    const config = this._services.config();
    if (!config.userExchangeCallbackUrl) {
      throw "config.userExchangeCallbackUrl is required";
    }
    this._services.tokens().clearTokens();
    const app = config.app || "default";
    const codeVerifier = this._generateCodeVerifier();
    const codeChallenge = await this._generateCodeChallenge(codeVerifier);
    const state = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : this._generateCodeVerifier(32);
    const storage = this._getSessionStorage();
    if (storage) {
      storage.setItem(CODE_VERIFIER_KEY, codeVerifier);
      storage.setItem(AUTH_STATE_KEY, state);
    }
    let cbUrl = config.userExchangeCallbackUrl;
    if (cbUrl.includes("?")) {
      cbUrl += "&";
    } else {
      cbUrl += "?";
    }
    cbUrl += "callback=" + encodeURIComponent(callbackUrl || (typeof window !== "undefined" ? window.location.href : ""));
    const userzUrl = this._getUserzUrl();
    const params = new URLSearchParams({
      app,
      redirect: cbUrl,
      code_challenge: codeChallenge,
      state
    });
    const loginUrl = `${userzUrl}/api/userz/auth?${params.toString()}`;
    this._navigate(loginUrl);
    return loginUrl;
  }
  /**
   * Processes the authorization code present in the URL query string, exchanging it for tokens via
   * the Tokens service (`POST /api/userz/auth/exchange`), and redirecting to the post-exchange `callback` URL.
   *
   * Validates the CSRF `state` parameter against session storage, and retrieves the PKCE `code_verifier`
   * from session storage. Deletes both from session storage upon processing.
   *
   * Note: This method must be called explicitly by the exchange callback page
   * (configured via `config.userExchangeCallbackUrl`). It is not called automatically by `user()`.
   *
   * @returns {Promise<boolean>} True if handling tokens completed (code was exchanged and redirect initiated),
   *   false if not an auth callback (no authorization `code` in the URL query parameters).
   * @throws {Error} If state mismatch occurs, token exchange fails, or server returns an error.
   */
  async handleCallback() {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) {
      return false;
    }
    const storage = this._getSessionStorage();
    const storedState = storage ? storage.getItem(AUTH_STATE_KEY) : null;
    if (storage) {
      storage.removeItem(AUTH_STATE_KEY);
    }
    const returnedState = params.get("state");
    if (storedState || returnedState) {
      if (!storedState || returnedState !== storedState) {
        throw new Error("State mismatch / CSRF attempt");
      }
    }
    let codeVerifier = storage ? storage.getItem(CODE_VERIFIER_KEY) : null;
    if (storage) {
      storage.removeItem(CODE_VERIFIER_KEY);
    }
    if (!codeVerifier) {
      codeVerifier = params.get("code_verifier") || "";
    }
    await this._services.tokens().exchange(code, codeVerifier);
    const callback = params.get("callback");
    if (callback) {
      if (!this._isSafeRedirect(callback)) {
        throw new Error("Untrusted callback URL: " + callback);
      }
      this._redirect(callback);
    }
    return true;
  }
  /**
   * Retrieves the stored user token credentials from the Tokens service.
   *
   * @param {boolean} [refreshed] - Optional flag indicating whether to return
   *   a freshly refreshed token.
   * @returns {UserToken|null} The stored user token object, or null if no valid session exists.
   */
  getUserToken(refreshed) {
    return this._services.tokens().getUserToken(refreshed);
  }
  /**
   * Retrieves the active user access token JWT string for authorizing API requests.
   *
   * @returns {string|undefined} The signed EdDSA user access token JWT,
   *   or undefined if no user is authenticated.
   */
  getAccessToken() {
    return this._services.tokens().getAccessToken();
  }
  /**
   * Retrieves a guaranteed-valid user access token JWT string, silently refreshing if expired.
   *
   * @param {number} [skewSeconds=30] - Safety margin in seconds before expiration.
   * @returns {Promise<string|null>} The valid user access token JWT, or null if unauthenticated.
   */
  async getValidAccessToken(skewSeconds = 30) {
    return this._services.tokens().getValidAccessToken(skewSeconds);
  }
  /**
   * Refreshes the active user access token using the stored refresh token.
   *
   * @returns {Promise<UserToken|null>} The refreshed user token credentials, or null if failed.
   */
  async refresh() {
    return this._services.tokens().refresh();
  }
  /**
   * Clears all stored authentication tokens and credentials via the Tokens service,
   * and clears any pending PKCE code verifier and CSRF state in session storage.
   * @returns {void}
   */
  clearTokens() {
    const storage = this._getSessionStorage();
    if (storage) {
      storage.removeItem(CODE_VERIFIER_KEY);
      storage.removeItem(AUTH_STATE_KEY);
    }
    this._services.tokens().clearTokens();
  }
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
  async user() {
    const token = await this.getValidAccessToken();
    if (!token) {
      return null;
    }
    const userzUrl = this._getUserzUrl();
    const resp = await fetch(`${userzUrl}/api/userz/auth/me`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`Error getting logged user (${resp.status}): ${errText}`);
    }
    return resp.json();
  }
  /**
   * Fetches the current user profile, automatically redirecting the browser to the login page
   * via {@link Auth#login} when the user is unauthenticated.
   *
   * @returns {Promise<AuthPayload|null>} The user profile data, or null when redirecting to login.
   */
  async requireUser() {
    const user = await this.user();
    if (!user) {
      await this.login();
      return null;
    }
    return user;
  }
  /**
   * Logs out the current user by revoking the session family server-side via `POST /api/userz/auth/logout`,
   * clearing stored credentials and session storage, and navigating to `backurl`.
   *
   * @param {string} [backurl] - The URL to return to after logging out.
   *   Defaults to `config.callbackUrl` or the current window URL (`window.location.href`).
   * @returns {Promise<void>}
   */
  async logout(backurl = typeof window !== "undefined" ? this._services.config().callbackUrl || window.location.href : "") {
    await this._services.tokens().logout();
    this.clearTokens();
    if (backurl) {
      this._navigate(backurl);
    }
  }
}
export { Auth };
