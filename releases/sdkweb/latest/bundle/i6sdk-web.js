(() => {
  // src/invoker/invoker.js
  function codeFromStatus(status) {
    if (status === 401) return "unauthenticated";
    if (status === 403) return "forbidden";
    if (status === 404) return "not_found";
    if (status >= 500) return "unavailable";
    return "bad_request";
  }
  function apiErrorFromResponse(status, text) {
    return { status, code: codeFromStatus(status), message: text || `HTTP ${status}`, cause: text };
  }
  var Resp = class {
    #parser;
    #parsed = false;
    #value = null;
    #text = null;
    /**
     * @param {number} status - HTTP status code.
     * @param {Headers} headers - HTTP response headers.
     * @param {() => *} parser - Lazy parser function.
     * @param {string} [text] - Raw response body text.
     */
    constructor(status, headers, parser, text = "") {
      this.status = status;
      this.headers = headers;
      this.ok = this.status >= 200 && this.status < 300;
      this.#parser = parser;
      this.#text = text;
    }
    /**
     * Raw body text of the response.
     * @returns {string}
     */
    get text() {
      return this.#text;
    }
    /**
     * Structured error information when response is not ok.
     * @returns {{status: number, code: string, message: string, cause: *}|null}
     */
    get error() {
      if (!this.ok) {
        return apiErrorFromResponse(this.status, this.#text);
      }
      return null;
    }
    /**
     * Parses and returns the deserialized response value.
     * Throws an error if deserialization fails or if the response status is not ok.
     * @returns {T}
     */
    parse() {
      if (!this.#parsed) {
        this.#value = this.#parser();
        this.#parsed = true;
      }
      return this.#value;
    }
  };
  var Invoker = class {
    /**
     * Constructs an Invoker instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services) {
      this._services = services;
    }
    /**
     * @param {{tokenTypes: string, url: string}} opts
     * @return {{token:string, required: boolean}}
     */
    async resolveToken(opts) {
      let ret = { required: false, token: "" };
      if (!opts.tokenTypes) {
        return ret;
      }
      ret.required = true;
      const tokenTypes = opts.tokenTypes.split("|");
      for (const tokenType of tokenTypes) {
        if (!tokenType) continue;
        if (tokenType === "none") {
          return { required: false, token: "" };
        }
        if (tokenType === "user") {
          ret.token = await this._services.tokens().getValidAccessToken();
        } else if (tokenType === "dataset") {
          const url = new URL(opts.url);
          const parts = url.pathname.split("/");
          if (parts[0] === "") parts.shift();
          if (parts[2] !== "dataset") {
            return ret;
          }
          const dataset = parts[3];
          if (dataset) {
            ret.token = await this._services.tokens().getValidDatasetAccessToken(dataset);
          }
        }
        if (ret.token) {
          return ret;
        }
      }
      return ret;
    }
    /**
     * Sends an HTTP request using the Fetch API.
     *
     * @param {InvokeOptions} opts - Request options including path/URL, query params, and fetch options.
     * @returns {Promise<Response>} A promise that resolves to the fetch Response.
     */
    async invoke(opts) {
      opts.url = opts.url || `${this._services.config().baseUrl}/${opts.path}`;
      if (opts.query) {
        const search = new URLSearchParams();
        for (const [key, value] of Object.entries(opts.query)) {
          if (value === void 0 || value === null) {
            continue;
          }
          for (const item of Array.isArray(value) ? value : [value]) {
            const serializedValue = typeof item === "object" && item !== null ? JSON.stringify(item) : String(item);
            search.append(key, serializedValue);
          }
        }
        const queryString = search.toString();
        if (queryString) {
          opts.url = opts.url + (opts.url.includes("?") ? "&" : "?") + queryString;
        }
      }
      opts.headers = new Headers(opts.headers);
      const bearerToken = opts.opts?.bearerToken;
      if (!opts.headers.has("Authorization") && bearerToken) {
        opts.headers.set("Authorization", "Bearer " + bearerToken);
      }
      if (!opts.headers.has("Authorization") && opts.opts?.labels?.token_types) {
        const tk = await this.resolveToken({
          tokenTypes: opts.opts.labels.token_types,
          url: opts.url
        });
        if (tk.token) {
          opts.headers.set("Authorization", "Bearer " + tk.token);
        } else if (tk.required) {
          const types = opts.opts.labels.token_types.split("|");
          if (types.includes("user")) {
            return new Response(JSON.stringify({ error: "Unauthorized", message: "Unauthorized" }), { status: 401, statusText: "Unauthorized" });
          }
          return new Response(JSON.stringify({ error: "Forbidden", message: "Forbidden" }), { status: 403, statusText: "Forbidden" });
        }
      }
      if (opts.json) {
        opts.headers.set("Content-Type", "application/json");
        opts.body = JSON.stringify(opts.json);
      }
      opts.credentials = "include";
      if (opts.opts?.prepareRequest) {
        await opts.opts.prepareRequest(opts);
      }
      if (opts.opts?.fetcher) {
        return opts.opts.fetcher(opts.url, opts);
      }
      return fetch(opts.url, opts);
    }
    /**
     * Resolves with a `Resp` instance holding the HTTP status, headers, and lazy `parse()`.
     * Network errors bubble up directly as native exceptions.
     * @template T
     * @param {InvokeOptions} opts - Same as `invoke`.
     * @returns {Promise<Resp<T>>}
     */
    async invokeResult(opts) {
      const resp = await this.invoke(opts);
      const text = resp.status === 204 ? "" : await resp.text();
      const parser = () => {
        if (!resp.ok) {
          const apiErr = apiErrorFromResponse(resp.status, text);
          const err = new Error(apiErr.message);
          err.status = apiErr.status;
          err.code = apiErr.code;
          err.cause = apiErr.cause;
          throw err;
        }
        if (!text) {
          return null;
        }
        return JSON.parse(text);
      };
      return new Resp(resp.status, resp.headers, parser, text);
    }
  };

  // src/auth/auth.js
  var CODE_VERIFIER_KEY = "i6_auth_code_verifier";
  var AUTH_STATE_KEY = "i6_auth_state";
  var Auth = class {
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
        return s();
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
    async handleCallback() {
      if (typeof window === "undefined") return null;
      const params = new URLSearchParams(window.location.search);
      const checkoutCode = params.get("checkout_code");
      if (checkoutCode) {
        const data = await this._services.tokens().redeemCheckout(checkoutCode);
        const dataset = data?.dataset || "";
        let callback2 = params.get("callback");
        if (callback2) {
          if (dataset && callback2.includes("{{DATASET}}")) {
            callback2 = callback2.replaceAll("{{DATASET}}", dataset);
          }
          if (!this._isSafeRedirect(callback2)) {
            throw new Error("Untrusted callback URL: " + callback2);
          }
          this._redirect(callback2);
        }
        return dataset;
      }
      const code = params.get("code");
      if (!code) {
        return null;
      }
      const storage = this._getSessionStorage();
      const storedState = storage ? storage.getItem(AUTH_STATE_KEY) : null;
      if (storage) {
        storage.removeItem(AUTH_STATE_KEY);
      }
      const returnedState = params.get("state");
      if (!storedState || returnedState !== storedState) {
        throw new Error("State mismatch / CSRF attempt");
      }
      const codeVerifier = storage ? storage.getItem(CODE_VERIFIER_KEY) : null;
      if (storage) {
        storage.removeItem(CODE_VERIFIER_KEY);
      }
      if (!codeVerifier) {
        throw new Error("Missing PKCE code verifier in session storage");
      }
      await this._services.tokens().exchange(code, codeVerifier);
      let callback = params.get("callback");
      if (callback) {
        if (!this._isSafeRedirect(callback)) {
          throw new Error("Untrusted callback URL: " + callback);
        }
        this._redirect(callback);
      }
      return "";
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
  };

  // src/tokens/tokens.js
  var USER_TOKEN_KEY = "i6_user_user_token";
  var DATASET_TOKENS_KEY = "i6_dataset_access_tokens";
  var Tokens = class {
    /**
     * Constructs a Tokens client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services) {
      this._services = services;
      this._refreshPromise = null;
      this._datasetTokenPromises = /* @__PURE__ */ new Map();
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
     * Resolves the storage adapter for token persistence.
     * Checks SDK configuration for a custom storage adapter or factory function,
     * falling back to the browser's global `localStorage`.
     * @private
     * @returns {import("../index.js").I6Storage|null} The active storage adapter or null if unavailable.
     */
    _getStorage() {
      const config = this._services.config();
      const s = config.storage || config.localStorage;
      if (typeof s === "function") {
        return s();
      }
      if (s) {
        return s;
      }
      return typeof localStorage !== "undefined" ? localStorage : null;
    }
    /**
     * Checks whether the given user access token is expired or will expire within the given skew window.
     *
     * @param {UserToken|null} [token] - The token object to inspect. If omitted, inspects stored token.
     * @param {number} [skewSeconds=30] - Safety margin in seconds before actual expiration timestamp.
     * @returns {boolean} True if the access token is missing, expired, or expiring within skewSeconds.
     */
    isAccessTokenExpired(token = this.getUserToken(), skewSeconds = 30) {
      if (!token || !token.user_access_token || typeof token.expires_at !== "number") {
        return true;
      }
      return Date.now() >= token.expires_at - skewSeconds * 1e3;
    }
    /**
     * Checks whether the user refresh token is expired.
     *
     * @param {UserToken|null} [token] - The token object to inspect. If omitted, inspects stored token.
     * @returns {boolean} True if the refresh token is missing or its expiration timestamp has elapsed.
     */
    isRefreshTokenExpired(token = this.getUserToken()) {
      if (!token || !token.user_refresh_token) {
        return true;
      }
      if (typeof token.refresh_token_expires_at === "number") {
        return Date.now() >= token.refresh_token_expires_at;
      }
      return false;
    }
    /**
     * Retrieves the stored user token credentials from storage.
     *
     * @param {boolean} [refreshed] - Optional flag indicating whether to return
     *   a freshly refreshed token.
     * @returns {UserToken|null} The stored user token object containing access and
     *   refresh tokens, or null if no valid session exists in storage.
     */
    getUserToken(refreshed) {
      const storage = this._getStorage();
      if (!storage) return null;
      const s = storage.getItem(USER_TOKEN_KEY);
      if (!s) {
        return null;
      }
      return JSON.parse(s);
    }
    /**
     * Stores user token credentials in storage under `'i6_user_user_token'`.
     *
     * @param {UserToken} token - The user token credentials to store.
     * @returns {void}
     */
    setUserToken(token) {
      const storage = this._getStorage();
      if (!storage) return;
      storage.setItem(USER_TOKEN_KEY, JSON.stringify(token));
    }
    /**
     * Retrieves the current user access token directly from storage without expiration checks or refresh attempts.
     * Use {@link Tokens#getValidAccessToken} when fresh/valid credentials are required.
     *
     * @returns {string|undefined} The signed EdDSA user access token JWT,
     *   or undefined if no user is authenticated.
     */
    getAccessToken() {
      return this.getUserToken()?.user_access_token;
    }
    /**
     * Clears stored user token credentials from storage.
     * @returns {void}
     */
    clearUserToken() {
      const storage = this._getStorage();
      if (!storage) return;
      storage.removeItem(USER_TOKEN_KEY);
    }
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
    async exchange(code, codeVerifier) {
      const userzUrl = this._getUserzUrl();
      const exchangeUrl = `${userzUrl}/api/userz/auth/exchange`;
      const resp = await fetch(exchangeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          code,
          code_verifier: codeVerifier
        })
      });
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Token exchange failed (${resp.status}): ${errText}`);
      }
      const data = await resp.json();
      this.clearDatasetTokens();
      this.setUserToken(data);
      return data;
    }
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
    async redeemCheckout(checkoutCode) {
      const config = this._services.config();
      const baseUrl = config.servUrls?.["decsuite"] || config.decsuiteUrl || config.baseUrl || "";
      const redeemUrl = `${baseUrl}/api/decsuite/auth/checkoutredeem`;
      const resp = await fetch(redeemUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          checkout_code: checkoutCode
        })
      });
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Checkout redeem failed (${resp.status}): ${errText}`);
      }
      const data = await resp.json();
      const dataset = data.dataset_id || "";
      delete data.dataset_id;
      this.clearDatasetTokens();
      this.setUserToken(data);
      const ret = {
        ...data,
        dataset
      };
      return ret;
    }
    /**
     * Refreshes the user access token using the stored user refresh token via `POST /api/userz/auth/refresh`.
     * Enforces token family rotation by storing the newly rotated refresh token and fresh access token.
     * If session renewal is revoked or family reuse is detected, wipes the stored user session.
     * Concurrent refresh calls are deduplicated using an in-flight promise cache.
     *
     * @returns {Promise<UserToken|null>} The newly refreshed user token credentials or null if renewal failed.
     */
    async refresh() {
      if (this._refreshPromise) {
        return this._refreshPromise;
      }
      this._refreshPromise = (async () => {
        try {
          const token = this.getUserToken();
          if (!token || !token.user_refresh_token || this.isRefreshTokenExpired(token)) {
            this.clearTokens();
            return null;
          }
          const userzUrl = this._getUserzUrl();
          const refreshUrl = `${userzUrl}/api/userz/auth/refresh`;
          const resp = await fetch(refreshUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              refresh_token: token.user_refresh_token
            })
          });
          if (!resp.ok) {
            if (resp.status === 401 || resp.status === 400) {
              this.clearTokens();
            }
            return null;
          }
          const data = await resp.json();
          this.setUserToken(data);
          return data;
        } finally {
          this._refreshPromise = null;
        }
      })();
      return this._refreshPromise;
    }
    /**
     * Revokes the active user session server-side via `POST /api/userz/auth/logout`.
     * Sends the stored `user_refresh_token` to revoke the entire session token family in userzsession.
     * Clears local tokens regardless of server response to guarantee client session cleanup.
     *
     * @returns {Promise<boolean>} True if revocation completed and tokens were cleared.
     */
    async logout() {
      const token = this.getUserToken();
      const refreshToken = token?.user_refresh_token;
      if (refreshToken) {
        const userzUrl = this._getUserzUrl();
        const logoutUrl = `${userzUrl}/api/userz/auth/logout`;
        await fetch(logoutUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            refresh_token: refreshToken
          })
        });
      }
      this.clearTokens();
      return true;
    }
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
    async getValidAccessToken(skewSeconds = 30) {
      const token = this.getUserToken();
      if (!token) {
        return null;
      }
      if (!this.isAccessTokenExpired(token, skewSeconds)) {
        return token.user_access_token;
      }
      const refreshed = await this.refresh();
      return refreshed?.user_access_token || null;
    }
    /**
     * Retrieves the full map of cached dataset access tokens from storage.
     *
     * @returns {Record<string, DatasetToken>} A dictionary of cached dataset tokens keyed by dataset ID.
     */
    getAllDatasetTokens() {
      const storage = this._getStorage();
      if (!storage) return {};
      const s = storage.getItem(DATASET_TOKENS_KEY);
      if (!s) return {};
      return JSON.parse(s) || {};
    }
    /**
     * Retrieves the cached dataset access token object for a specific dataset from storage.
     *
     * @param {string} dataset - Target dataset ID.
     * @returns {DatasetToken|null} The cached dataset token object, or null if not found.
     */
    getDatasetToken(dataset) {
      if (!dataset) return null;
      const all = this.getAllDatasetTokens();
      return all[dataset] || null;
    }
    /**
     * Stores a dataset access token credentials object in storage under the given dataset ID.
     *
     * @param {string} dataset - Target dataset ID.
     * @param {DatasetToken} token - The dataset access token credentials to cache.
     * @returns {void}
     */
    setDatasetToken(dataset, token) {
      if (!dataset) return;
      const storage = this._getStorage();
      if (!storage) return;
      const all = this.getAllDatasetTokens();
      all[dataset] = token;
      storage.setItem(DATASET_TOKENS_KEY, JSON.stringify(all));
    }
    /**
     * Clears all cached dataset access tokens from storage.
     * @returns {void}
     */
    clearDatasetTokens() {
      this._datasetTokenPromises.clear();
      const storage = this._getStorage();
      if (!storage) return;
      storage.removeItem(DATASET_TOKENS_KEY);
    }
    /**
     * Checks whether the given dataset access token is expired or will expire within the given skew window.
     *
     * @param {DatasetToken|null} [token] - The dataset token object to inspect.
     * @param {number} [skewSeconds=30] - Safety margin in seconds before expiration.
     * @returns {boolean} True if the token is missing, expired, or expiring within skewSeconds.
     */
    isDatasetTokenExpired(token, skewSeconds = 30) {
      if (!token || !token.access_token || typeof token.expires_at !== "number") {
        return true;
      }
      return Date.now() >= token.expires_at - skewSeconds * 1e3;
    }
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
    async getValidDatasetAccessToken(dataset, skewSeconds = 30) {
      if (!dataset) {
        return null;
      }
      const cached = this.getDatasetToken(dataset);
      if (cached && !this.isDatasetTokenExpired(cached, skewSeconds)) {
        return cached.access_token;
      }
      if (this._datasetTokenPromises.has(dataset)) {
        const inFlight = await this._datasetTokenPromises.get(dataset);
        return inFlight?.access_token || null;
      }
      const promise = (async () => {
        try {
          const userAccessToken = await this.getValidAccessToken(skewSeconds);
          if (!userAccessToken) {
            return null;
          }
          const userzUrl = this._getUserzUrl();
          const url = `${userzUrl}/api/userz/dataset-access-token/` + encodeURIComponent(dataset);
          const resp = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userAccessToken}`
            },
            body: JSON.stringify({})
          });
          if (!resp.ok) {
            return null;
          }
          const data = await resp.json();
          this.setDatasetToken(dataset, data);
          return data;
        } finally {
          this._datasetTokenPromises.delete(dataset);
        }
      })();
      this._datasetTokenPromises.set(dataset, promise);
      const result = await promise;
      return result?.access_token || null;
    }
    /**
     * Clears all session credentials (both user and dataset tokens) from storage.
     * Effectively resets client authentication state.
     *
     * @returns {void}
     */
    clearTokens() {
      this.clearUserToken();
      this.clearDatasetTokens();
    }
  };

  // src/ingest/ingest.js
  var Ingest = class {
    /**
     * Constructs an Ingest client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services) {
      this._services = services;
    }
    /**
     * Asks ingestz for a signed upload URL (ingestz-get-url API) and uploads a single file to it.
     * @param {UploadParams} params - Upload parameters.
     * @returns {Promise<UploadResult>} Resolves with the ingest id on a successful upload.
     */
    async upload({ dataset, table, partitions, file, onProgress, signal, contentType, serviceOpts }) {
      if (!(file instanceof File)) {
        throw new TypeError("file must be a single File.");
      }
      signal?.throwIfAborted();
      const { ingestId, url } = await this.#getUrl({ dataset, table, partitions, serviceOpts });
      signal?.throwIfAborted();
      await this.#put(url, file, { onProgress, signal, contentType });
      return { ingestId };
    }
    /**
     * Gets one signed PUT URL from the ingestz-get-url API.
     * @private
     * @param {GetUrlParams} params - Parameters for requesting the upload URL.
     * @returns {Promise<{ingestId: string, url: string}>} The ingest id and the signed PUT URL.
     */
    async #getUrl({ dataset, table, partitions, serviceOpts }) {
      const resp = await this._services.apis().ingestzGetUrl({
        params: { dataset },
        payload: { table, partitions, amount: 1 }
      }, serviceOpts);
      if (!resp.ok) {
        throw new Error(`Get upload URL failed with status ${resp.status}: ${resp.error?.message ?? ""}`);
      }
      const data = resp.parse();
      const uploads = data?.uploads;
      if (!uploads?.[0]) {
        throw new Error("Get upload URL returned no upload URL.");
      }
      return { ingestId: data.ingest_id, url: uploads[0] };
    }
    /**
     * Uploads a file to a signed PUT URL using XMLHttpRequest (fetch has no upload progress).
     * @private
     * @param {string} signedPutUrl - The signed URL to PUT the file to.
     * @param {File} file - The file to upload.
     * @param {Pick<UploadParams, "onProgress"|"signal"|"contentType">} opts
     * @returns {Promise<void>} Resolves on a successful upload, rejects on network or HTTP error or abort.
     */
    #put(signedPutUrl, file, { onProgress, signal, contentType }) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const abort = () => xhr.abort();
        const abortError = () => signal?.reason ?? new DOMException("Upload aborted.", "AbortError");
        const done = (fn, arg) => {
          signal?.removeEventListener("abort", abort);
          fn(arg);
        };
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            done(resolve);
          } else {
            done(reject, new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`));
          }
        });
        xhr.addEventListener("error", () => {
          done(reject, new TypeError("Network error occurred during upload."));
        });
        xhr.addEventListener("abort", () => {
          done(reject, abortError());
        });
        if (onProgress) {
          xhr.upload.addEventListener("progress", (e) => {
            const total = e.lengthComputable ? e.total : file.size;
            onProgress({
              loaded: e.loaded,
              total,
              percent: total > 0 ? e.loaded / total * 100 : 100
            });
          });
        }
        xhr.open("PUT", signedPutUrl, true);
        if (contentType) {
          xhr.setRequestHeader("Content-Type", contentType);
        }
        signal?.addEventListener("abort", abort, { once: true });
        xhr.send(file);
      });
    }
  };

  // src/sdkapis/sdkapis.js
  var Apis = class {
    /**
     * Constructs an Ingest client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services) {
      this._services = services;
    }
    /**
     * Get Ingestion Upload URLs
     * 
     * Generates presigned PUT URLs and an ingestion token for uploading files into a target dataset table and partitions.
     * 
     * @param {apiIngestzGetUrlReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiIngestzGetUrlResp>>}
     */
    async ingestzGetUrl(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        path: `api/ingest/dataset/${encodeURIComponent(String(req.params.dataset))}/get-url`,
        json: req.payload,
        opts
      });
    }
    /**
     * Create Store Display
     * 
     * Creates a store display configuration mapping for a store under a specific dataset.
     * 
     * @param {apiDszStoreDisplayCreateReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszStoreDisplayCreateResp>>}
     */
    async dszStoreDisplayCreate(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/display/create`,
        json: req.payload,
        opts
      });
    }
    /**
     * List Recsys Tokens
     * 
     * Lists all active recommendation system tokens for a specific dataset.
     * 
     * @param {apiDszListRecsysTokensReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszListRecsysTokensResp>>}
     */
    async dszListRecsysTokens(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "GET",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/recsystoken/list`,
        opts
      });
    }
    /**
     * Get Model Metadata
     * 
     * Gets the input and output tensors of a model version.
     * 
     * @param {apiTfzModelMetadataReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiTfzModelMetadataResp>>}
     */
    async tfzModelMetadata(req, opts) {
      return this._services.invoker().invokeResult({
        method: "GET",
        path: `api/metadata/${encodeURIComponent(String(req.params.model_name))}/${encodeURIComponent(String(req.params.version))}`,
        opts
      });
    }
    /**
     * List Payments
     * 
     * Lists the Stripe payments (invoices) of a dataset. The list is empty for datasets without a Stripe customer.
     * 
     * @param {apiDszListPaymentsReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszListPaymentsResp>>}
     */
    async dszListPayments(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "GET",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/payments`,
        opts
      });
    }
    /**
     * List Plans
     * 
     * Lists the plans a subscription of a solution can be switched to, with the price data from Stripe.
     * 
     * @param {apiDszListPlansReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszListPlansResp>>}
     */
    async dszListPlans(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "user",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "GET",
        path: `api/ds/solution/${encodeURIComponent(String(req.params.solution))}/plans`,
        opts
      });
    }
    /**
     * Password Reset Email Dispatch
     * 
     * Dispatches an out-of-band password reset email via Identity Platform.
     * 
     * @param {apiUserAuthPasswordResetReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthPasswordResetResp>>}
     */
    async userAuthPasswordReset(req, opts) {
      opts = opts || {};
      opts.labels = {
        "servname": "userz",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/auth/password/reset`,
        json: req.payload,
        opts
      });
    }
    /**
     * Email and Password Sign-In
     * 
     * Authenticates an email and password against Identity Platform, enforcing confirmed emails and minting a PKCE code.
     * 
     * @param {apiUserAuthPasswordSigninReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthPasswordSigninResp>>}
     */
    async userAuthPasswordSignin(req, opts) {
      opts = opts || {};
      opts.labels = {
        "servname": "userz",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/auth/signin/password`,
        json: req.payload,
        opts
      });
    }
    /**
     * Get Subscription
     * 
     * Gets the plan and the status of the Stripe subscription of a dataset product/solution. The payload is empty for contracts without Stripe.
     * 
     * @param {apiDszGetSubscriptionReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszGetSubscriptionResp>>}
     */
    async dszGetSubscription(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "GET",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/solution/${encodeURIComponent(String(req.params.solution))}/subscription`,
        opts
      });
    }
    /**
     * Update Payment Auto Renew
     * 
     * Turns auto renew on or off for the Stripe subscription of a dataset product/solution.
     * 
     * @param {apiDszUpdatePaymentAutoRenewReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszUpdatePaymentAutoRenewResp>>}
     */
    async dszUpdatePaymentAutoRenew(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/solution/${encodeURIComponent(String(req.params.solution))}/payment/autorenew`,
        json: req.payload,
        opts
      });
    }
    /**
     * Google Sign-In Credential Exchange
     * 
     * Verifies a Google OAuth ID token via Identity Platform and mints a single-use PKCE code.
     * 
     * @param {apiUserAuthGoogleReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthGoogleResp>>}
     */
    async userAuthGoogle(req, opts) {
      opts = opts || {};
      opts.labels = {
        "servname": "userz",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/auth/google`,
        json: req.payload,
        opts
      });
    }
    /**
     * Human User Session Logout
     * 
     * Revokes an active human user session by marking the refresh token and its token family as revoked in userzsession.
     * 
     * @param {apiUserAuthLogoutReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthLogoutResp>>}
     */
    async userAuthLogout(req, opts) {
      opts = opts || {};
      opts.labels = {
        "servname": "userz",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/auth/logout`,
        json: req.payload,
        opts
      });
    }
    /**
     * Attenuate Dataset Access Token
     * 
     * Derives an in-flight attenuated child access token with dropped privileges from an active access token.
     * 
     * @param {apiUserDatasetTokenAccessAttenuateReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserDatasetTokenAccessAttenuateResp>>}
     */
    async userDatasetTokenAccessAttenuate(req, opts) {
      opts = opts || {};
      opts.labels = {
        "servname": "userz",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/attenuate`,
        headers: req.headers,
        json: req.payload,
        opts
      });
    }
    /**
     * Create Dataset Access Token
     * 
     * Mints a short-lived dataset access token for an authenticated user.
     * 
     * @param {apiUserDatasetTokenAccessCreateReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserDatasetTokenAccessCreateResp>>}
     */
    async userDatasetTokenAccessCreate(req, opts) {
      opts = opts || {};
      opts.labels = {
        "servname": "userz",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/dataset-access-token/${encodeURIComponent(String(req.params.dataset))}`,
        headers: req.headers,
        json: req.payload,
        opts
      });
    }
    /**
     * Refresh Dataset Access Token
     * 
     * Refreshes and attenuates a dataset access token using an Ed25519 signature assertion.
     * 
     * @param {apiUserDatasetTokenRefreshReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserDatasetTokenRefreshResp>>}
     */
    async userDatasetTokenRefresh(req, opts) {
      opts = opts || {};
      opts.labels = {
        "servname": "userz",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/refresh-dataset`,
        headers: req.headers,
        json: req.payload,
        opts
      });
    }
    /**
     * Revoke Dataset Refresh Token
     * 
     * Instantly revokes a machine dataset refresh token by JTI.
     * 
     * @param {apiUserDatasetTokenRefreshDeleteReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserDatasetTokenRefreshDeleteResp>>}
     */
    async userDatasetTokenRefreshDelete(req, opts) {
      opts = opts || {};
      opts.labels = {
        "servname": "userz",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "DELETE",
        url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/dataset-refresh-token/${encodeURIComponent(String(req.params.dataset))}/jti/${encodeURIComponent(String(req.params.jti))}`,
        headers: req.headers,
        opts
      });
    }
    /**
     * List Store Displays
     * 
     * Lists all active store displays configured for a store under a specific dataset.
     * 
     * @param {apiDszStoreDisplayListReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszStoreDisplayListResp>>}
     */
    async dszStoreDisplayList(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "GET",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/display/list`,
        query: req.query,
        opts
      });
    }
    /**
     * Email and Password Sign-Up
     * 
     * Registers a new user with Identity Platform and dispatches a verification email.
     * 
     * @param {apiUserAuthPasswordSignupReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthPasswordSignupResp>>}
     */
    async userAuthPasswordSignup(req, opts) {
      opts = opts || {};
      opts.labels = {
        "servname": "userz",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/auth/signup/password`,
        json: req.payload,
        opts
      });
    }
    /**
     * Human User Session Refresh
     * 
     * Exchanges a human user refresh token for fresh access and rotated refresh tokens.
     * 
     * @param {apiUserAuthRefreshReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthRefreshResp>>}
     */
    async userAuthRefresh(req, opts) {
      opts = opts || {};
      opts.labels = {
        "servname": "userz",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/refresh-user`,
        json: req.payload,
        opts
      });
    }
    /**
     * Public Settings Discovery
     * 
     * Retrieves public operational policies and token expiration parameters.
     * 
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserConfSettingsResp>>}
     */
    async userConfSettings(opts) {
      opts = opts || {};
      opts.labels = {
        "servname": "userz",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "GET",
        url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/conf/settings.json`,
        opts
      });
    }
    /**
     * Create Dataset Refresh Token
     * 
     * Provisions a long-lived machine dataset refresh token with an Ed25519 keypair.
     * 
     * @param {apiUserDatasetTokenRefreshCreateReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserDatasetTokenRefreshCreateResp>>}
     */
    async userDatasetTokenRefreshCreate(req, opts) {
      opts = opts || {};
      opts.labels = {
        "servname": "userz",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/dataset-refresh-token/${encodeURIComponent(String(req.params.dataset))}`,
        headers: req.headers,
        json: req.payload,
        opts
      });
    }
    /**
     * List Datasets
     * 
     * Lists all datasets available to the user.
     * 
     * @param {apiDszListDatasetsReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszListDatasetsResp>>}
     */
    async dszListDatasets(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "user",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "GET",
        path: `api/ds/user-id/${encodeURIComponent(String(req.params.userId))}/datasets`,
        opts
      });
    }
    /**
     * List Ingestion Tokens
     * 
     * Lists all active data ingestion tokens for a specific dataset.
     * 
     * @param {apiDszListIngestionTokensReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszListIngestionTokensResp>>}
     */
    async dszListIngestionTokens(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "GET",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/ingestiontoken/list`,
        opts
      });
    }
    /**
     * Start Pipeline
     * 
     * Starts a pipeline on a dataset with the given params and returns its id.
     * 
     * @param {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiPipezStartRelevanceFashionRelevanceFashionBatchIngestResp>>}
     */
    async pipezStartRelevanceFashionRelevanceFashionBatchIngest(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        path: `api/pipe/dataset/${encodeURIComponent(String(req.params.dataset))}/start/relevance_fashion/relevance-fashion-batch-ingest`,
        json: req.payload,
        opts
      });
    }
    /**
     * Sample Fraction
     * 
     * Sample API that performs a fraction operation
     * 
     * @param {apiSampleFractionReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiSampleFractionResp>>}
     */
    async sampleFraction(req, opts) {
      return this._services.invoker().invokeResult({
        method: "POST",
        path: `api/gox/routez/sample/fraction/${encodeURIComponent(String(req.params.numerator))}/${encodeURIComponent(String(req.params.denominator))}`,
        query: req.query,
        headers: req.headers,
        json: req.payload,
        opts
      });
    }
    /**
     * Load Table File as JSON
     * 
     * Load a table file from the datalake as JSON and return it.
     * 
     * @param {apiDszResultRelevanceFashionCatalogReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszResultRelevanceFashionCatalogResp>>}
     */
    async dszResultRelevanceFashionCatalog(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "GET",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/results/relevance-fashion-catalog`,
        query: req.query,
        opts
      });
    }
    /**
     * Current User Profile
     * 
     * Retrieves current authenticated user identity profile metadata.
     * 
     * @param {apiUserAuthMeReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthMeResp>>}
     */
    async userAuthMe(req, opts) {
      opts = opts || {};
      opts.labels = {
        "servname": "userz",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "GET",
        url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/auth/me`,
        headers: req.headers,
        opts
      });
    }
    /**
     * List Dataset Refresh Tokens
     * 
     * Lists all active machine refresh tokens provisioned for a dataset.
     * 
     * @param {apiUserDatasetTokenRefreshListReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserDatasetTokenRefreshListResp>>}
     */
    async userDatasetTokenRefreshList(req, opts) {
      opts = opts || {};
      opts.labels = {
        "servname": "userz",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "GET",
        url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/dataset-refresh-token/${encodeURIComponent(String(req.params.dataset))}`,
        headers: req.headers,
        opts
      });
    }
    /**
     * Activate Pipeline Scheduler
     * 
     * Activates a scheduler for a pipeline on a dataset.
     * 
     * @param {apiPipezSchedulerActivateRelevanceFashionRelevanceFashionMainReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiPipezSchedulerActivateRelevanceFashionRelevanceFashionMainResp>>}
     */
    async pipezSchedulerActivateRelevanceFashionRelevanceFashionMain(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        path: `api/pipe/dataset/${encodeURIComponent(String(req.params.dataset))}/scheduler/activate/relevance_fashion/relevance-fashion-main`,
        json: req.payload,
        opts
      });
    }
    /**
     * Delete Token
     * 
     * Deletes (revokes) a specific token (e.g. ingestion or recsys token) associated with a dataset.
     * 
     * @param {apiDszDeleteTokenReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszDeleteTokenResp>>}
     */
    async dszDeleteToken(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "DELETE",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/token/delete`,
        query: req.query,
        opts
      });
    }
    /**
     * Create Stripe Checkout
     * 
     * Creates a Stripe checkout session for a subscription and returns its id and url.
     * 
     * @param {apiDszStripeCheckoutReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszStripeCheckoutResp>>}
     */
    async dszStripeCheckout(req, opts) {
      return this._services.invoker().invokeResult({
        method: "POST",
        path: `api/stripe/checkout`,
        json: req.payload,
        opts
      });
    }
    /**
     * Device Token Polling & Exchange
     * 
     * Polled by CLI clients to check status and exchange an authorized device code for active user tokens.
     * 
     * @param {apiUserAuthDeviceTokenReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthDeviceTokenResp>>}
     */
    async userAuthDeviceToken(req, opts) {
      opts = opts || {};
      opts.labels = {
        "servname": "userz",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/auth/device/token`,
        json: req.payload,
        opts
      });
    }
    /**
     * List Pipelines
     * 
     * Lists the pipelines of a dataset, optionally filtered, with cursor pagination.
     * 
     * @param {apiPipezListReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiPipezListResp>>}
     */
    async pipezList(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "GET",
        path: `api/pipe/dataset/${encodeURIComponent(String(req.params.dataset))}/list`,
        query: req.query,
        opts
      });
    }
    /**
     * Get Dataset Signed URLs
     * 
     * Generates presigned URLs for accessing or mutating files in the specified dataset.
     * 
     * @param {apiDszSignedUrlReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszSignedUrlResp>>}
     */
    async dszSignedUrl(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/signed-url`,
        json: req.payload,
        opts
      });
    }
    /**
     * Get Pipeline
     * 
     * Gets a pipeline of a dataset by its id.
     * 
     * @param {apiPipezGetReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiPipezGetResp>>}
     */
    async pipezGet(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "GET",
        path: `api/pipe/dataset/${encodeURIComponent(String(req.params.dataset))}/id/${encodeURIComponent(String(req.params.id))}`,
        opts
      });
    }
    /**
     * Create Ingestion Token
     * 
     * Creates a write token for data ingestion into a specific dataset.
     * 
     * @param {apiDszCreateIngestionTokenReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszCreateIngestionTokenResp>>}
     */
    async dszCreateIngestionToken(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/ingestiontoken/create`,
        json: req.payload,
        opts
      });
    }
    /**
     * Update Subscription Plan
     * 
     * Updates the plan (price) of the Stripe subscription for a dataset product/solution.
     * 
     * @param {apiDszUpdateSubscriptionPlanReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszUpdateSubscriptionPlanResp>>}
     */
    async dszUpdateSubscriptionPlan(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/solution/${encodeURIComponent(String(req.params.solution))}/subscription/plan`,
        json: req.payload,
        opts
      });
    }
    /**
     * Device Authorization Code Initiation
     * 
     * Initiates an RFC 8628 device authorization flow for CLI and remote headless SSH sessions.
     * 
     * @param {apiUserAuthDeviceCodeReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthDeviceCodeResp>>}
     */
    async userAuthDeviceCode(req, opts) {
      opts = opts || {};
      opts.labels = {
        "servname": "userz",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/auth/device/code`,
        json: req.payload,
        opts
      });
    }
    /**
     * Universal Token & Signature Diagnostics
     * 
     * Auto-detects, validates, and diagnoses any credential supported by authz.Filter without state side-effects.
     * 
     * @param {apiUserTokenCheckReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserTokenCheckResp>>}
     */
    async userTokenCheck(req, opts) {
      opts = opts || {};
      opts.labels = {
        "servname": "userz",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/token/check`,
        headers: req.headers,
        json: req.payload,
        opts
      });
    }
    /**
     * Start Pipeline
     * 
     * Starts a pipeline on a dataset with the given params and returns its id.
     * 
     * @param {apiPipezStartRelevanceFashionRelevanceFashionMainReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiPipezStartRelevanceFashionRelevanceFashionMainResp>>}
     */
    async pipezStartRelevanceFashionRelevanceFashionMain(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        path: `api/pipe/dataset/${encodeURIComponent(String(req.params.dataset))}/start/relevance_fashion/relevance-fashion-main`,
        json: req.payload,
        opts
      });
    }
    /**
     * Deactivate Pipeline Scheduler
     * 
     * Deactivates a scheduler for a pipeline on a dataset.
     * 
     * @param {apiPipezSchedulerDeactivateRelevanceFashionRelevanceFashionMainReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiPipezSchedulerDeactivateRelevanceFashionRelevanceFashionMainResp>>}
     */
    async pipezSchedulerDeactivateRelevanceFashionRelevanceFashionMain(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        path: `api/pipe/dataset/${encodeURIComponent(String(req.params.dataset))}/scheduler/deactivate/relevance_fashion/relevance-fashion-main`,
        json: req.payload,
        opts
      });
    }
    /**
     * Create Store
     * 
     * Creates a store configuration under a specific dataset.
     * 
     * @param {apiDszCreateStoreReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszCreateStoreResp>>}
     */
    async dszCreateStore(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/create`,
        json: req.payload,
        opts
      });
    }
    /**
     * List Stores
     * 
     * Lists all stores configured under a specific dataset.
     * 
     * @param {apiDszListStoresReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszListStoresResp>>}
     */
    async dszListStores(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "GET",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/list`,
        opts
      });
    }
    /**
     * Get Model Signed URLs
     * 
     * Generates presigned URLs for accessing model files in the specified dataset.
     * 
     * @param {apiDszModelGetReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszModelGetResp>>}
     */
    async dszModelGet(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        path: `api/model/dataset/${encodeURIComponent(String(req.params.dataset))}/signed-get/${encodeURIComponent(String(req.params.model_name))}`,
        json: req.payload,
        opts
      });
    }
    /**
     * Model Predict
     * 
     * Runs a prediction of a dataset model version on the inference service (tfinfer), sending the model inputs and the model partitions and returning the model outputs.
     * 
     * @param {apiTfzModelPredictReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiTfzModelPredictResp>>}
     */
    async tfzModelPredict(req, opts) {
      opts = opts || {};
      opts.labels = {
        "servname": "tfinfer",
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        url: `${this._services.config().servUrls?.["tfinfer"] ?? this._services.config().baseUrl}/api/model/dataset/${encodeURIComponent(String(req.params.dataset))}/${encodeURIComponent(String(req.params.model_name))}/${encodeURIComponent(String(req.params.version))}/predict`,
        json: req.payload,
        opts
      });
    }
    /**
     * Create Customer Portal
     * 
     * Creates a Stripe billing portal session URL where the user can manage cards, auto-renew, and plans.
     * 
     * @param {apiDszCreateCustomerPortalReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszCreateCustomerPortalResp>>}
     */
    async dszCreateCustomerPortal(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/portal`,
        json: req.payload,
        opts
      });
    }
    /**
     * PKCE Authorization Code Exchange
     * 
     * Exchanges a PKCE authorization code and verifier for user access and refresh tokens.
     * 
     * @param {apiUserAuthExchangeReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthExchangeResp>>}
     */
    async userAuthExchange(req, opts) {
      opts = opts || {};
      opts.labels = {
        "servname": "userz",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/auth/exchange`,
        json: req.payload,
        opts
      });
    }
    /**
     * List Active Dataset Solutions
     * 
     * Lists all active solutions configured for a specific dataset.
     * 
     * @param {apiDszDatasetSolutionsReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszDatasetSolutionsResp>>}
     */
    async dszDatasetSolutions(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "GET",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/solutions`,
        opts
      });
    }
    /**
     * Get Solution Domain
     * 
     * Retrieves the active solutions and their corresponding domains for a given store in a dataset.
     * 
     * @param {apiDszDomainGetReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszDomainGetResp>>}
     */
    async dszDomainGet(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "GET",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/solution-domain`,
        query: req.query,
        opts
      });
    }
    /**
     * Create Recsys Token
     * 
     * Creates a read/recommendation token for the recommendation system associated with a specific dataset.
     * 
     * @param {apiDszCreateRecsysTokenReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszCreateRecsysTokenResp>>}
     */
    async dszCreateRecsysToken(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/recsystoken/create`,
        json: req.payload,
        opts
      });
    }
    /**
     * Event Ingestion
     * 
     * Ingests events data into a target dataset table.
     * 
     * @param {apiIngestzEventRelevanceFashionCatalogReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiIngestzEventRelevanceFashionCatalogResp>>}
     */
    async ingestzEventRelevanceFashionCatalog(req, opts) {
      opts = opts || {};
      opts.labels = {
        "sinkable": "true",
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        path: `api/ingest/dataset/${encodeURIComponent(String(req.params.dataset))}/event/relevance-fashion-catalog/text.txt`,
        json: req.payload,
        opts,
        sinkable: true
      });
    }
    /**
     * Event Ingestion
     * 
     * Ingests events data into a target dataset table.
     * 
     * @param {apiIngestzEventRelevanceFashionEventReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiIngestzEventRelevanceFashionEventResp>>}
     */
    async ingestzEventRelevanceFashionEvent(req, opts) {
      opts = opts || {};
      opts.labels = {
        "sinkable": "true",
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "POST",
        path: `api/ingest/dataset/${encodeURIComponent(String(req.params.dataset))}/event/relevance-fashion-event/text.txt`,
        json: req.payload,
        opts,
        sinkable: true
      });
    }
    /**
     * Get Dataset Table File
     * 
     * Get table file by redirecting to its signed URL.
     * 
     * @param {apiDszTableGetReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszTableGetResp>>}
     */
    async dszTableGet(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "GET",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/table-file/{path...}`,
        opts
      });
    }
    /**
     * List Dataset Tables
     * 
     * Lists files and tables in the specified dataset.
     * 
     * @param {apiDszTableListReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszTableListResp>>}
     */
    async dszTableList(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "GET",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/table-list`,
        query: req.query,
        opts
      });
    }
    /**
     * Load Table File as JSON
     * 
     * Load a table file from the datalake as JSON and return it.
     * 
     * @param {apiDszResultLastBatchSummaryReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszResultLastBatchSummaryResp>>}
     */
    async dszResultLastBatchSummary(req, opts) {
      opts = opts || {};
      opts.labels = {
        "token_types": "dataset",
        ...opts.labels || {}
      };
      return this._services.invoker().invokeResult({
        method: "GET",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/results/last-batch-summary`,
        query: req.query,
        opts
      });
    }
  };
  var SdkFuncs = class {
    /**
     * Constructs an SdkFuncs instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services) {
      this._services = services;
    }
    /**
     * Get Metrics by Category
     * 
     * Gets the metrics impacted by recommendations by showcase category for a store and period.
     * 
     * @param {sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryOutput>}
     */
    async productRelevanceFashionDashImpactedMetricsByShowcaseCategoryV1(req, opts) {
      const dash = this._services.dash();
      const ret = await dash.query({
        dataset: req.input.dataset,
        dashName: "product-relevance-fashion-dash-impacted-metrics-by-showcase-category",
        params: req.input,
        partitions: { "version": "v1", ...req.partitions },
        serviceOpts: opts
      });
      return ret;
    }
    /**
     * Get Metrics by SKU
     * 
     * Gets the metrics impacted by recommendations by SKU for a store and period.
     * 
     * @param {sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuOutput>}
     */
    async productRelevanceFashionDashImpactedMetricsBySkuV1(req, opts) {
      const dash = this._services.dash();
      const ret = await dash.query({
        dataset: req.input.dataset,
        dashName: "product-relevance-fashion-dash-impacted-metrics-by-sku",
        params: req.input,
        partitions: { "version": "v1", ...req.partitions },
        serviceOpts: opts
      });
      return ret;
    }
    /**
     * Get Coverage
     * 
     * Gets the recommendation coverage of the catalog for a store and period.
     * 
     * @param {sdkFuncProductRelevanceFashionDashCoverageReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<sdkFuncProductRelevanceFashionDashCoverageOutput>}
     */
    async productRelevanceFashionDashCoverageV1(req, opts) {
      const dash = this._services.dash();
      const ret = await dash.query({
        dataset: req.input.dataset,
        dashName: "product-relevance-fashion-dash-coverage",
        params: req.input,
        partitions: { "version": "v1", ...req.partitions },
        serviceOpts: opts
      });
      return ret;
    }
    /**
     * Get Display Metrics
     * 
     * Gets recommendation metrics by display for a store and period, optionally filtered by display and recommendation origin.
     * 
     * @param {sdkFuncProductRelevanceFashionDashDisplayMetricsReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<sdkFuncProductRelevanceFashionDashDisplayMetricsOutput>}
     */
    async productRelevanceFashionDashDisplayMetricsV1(req, opts) {
      const dash = this._services.dash();
      const ret = await dash.query({
        dataset: req.input.dataset,
        dashName: "product-relevance-fashion-dash-display-metrics",
        params: req.input,
        partitions: { "version": "v1", ...req.partitions },
        serviceOpts: opts
      });
      return ret;
    }
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
    async productRelevanceFashionFbtV1(req, selectResults, opts) {
      const infer = this._services.infer();
      const results = await infer.run({
        dataset: req.input.dataset,
        modelName: "relevance-fashion-fbt",
        params: req.input,
        partitions: { "version": "v1", ...req.partitions },
        sessionId: req.input.session_id,
        userId: req.input.user_id,
        serviceOpts: opts
      });
      return infer.selectResults({
        dataset: req.input.dataset,
        modelName: "relevance-fashion-fbt",
        modelVersion: "v1",
        storeId: req.partitions.store_id,
        req,
        results,
        recId: results.rec_id,
        sessionId: req.input.session_id,
        userId: req.input.user_id,
        selectResults,
        serviceOpts: opts
      });
    }
    /**
     * Get Funnel
     * 
     * Gets the event counts of the recommendation funnel for a store and period.
     * 
     * @param {sdkFuncProductRelevanceFashionDashFunnelReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<sdkFuncProductRelevanceFashionDashFunnelOutput>}
     */
    async productRelevanceFashionDashFunnelV1(req, opts) {
      const dash = this._services.dash();
      const ret = await dash.query({
        dataset: req.input.dataset,
        dashName: "product-relevance-fashion-dash-funnel",
        params: req.input,
        partitions: { "version": "v1", ...req.partitions },
        serviceOpts: opts
      });
      return ret;
    }
    /**
     * Get Attached Revenue
     * 
     * Gets the revenue attached to recommendations for a store and period.
     * 
     * @param {sdkFuncProductRelevanceFashionDashAttachedRevenueReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<sdkFuncProductRelevanceFashionDashAttachedRevenueOutput>}
     */
    async productRelevanceFashionDashAttachedRevenueV1(req, opts) {
      const dash = this._services.dash();
      const ret = await dash.query({
        dataset: req.input.dataset,
        dashName: "product-relevance-fashion-dash-attached-revenue",
        params: req.input,
        partitions: { "version": "v1", ...req.partitions },
        serviceOpts: opts
      });
      return ret;
    }
    /**
     * List Showcase Categories
     * 
     * Lists the showcase categories of a store.
     * 
     * @param {sdkFuncProductRelevanceFashionDashListShowcaseCategoriesReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<sdkFuncProductRelevanceFashionDashListShowcaseCategoriesOutput>}
     */
    async productRelevanceFashionDashListShowcaseCategoriesV1(req, opts) {
      const dash = this._services.dash();
      const ret = await dash.query({
        dataset: req.input.dataset,
        dashName: "product-relevance-fashion-dash-list-showcase-categories",
        partitions: { "version": "v1", ...req.partitions },
        serviceOpts: opts
      });
      return ret;
    }
  };

  // src/internal/fs/fs.js
  var base = "i6/fs";
  var getDirIfExists = async (parent, name) => {
    try {
      return await parent.getDirectoryHandle(name);
    } catch (e) {
      if (e.name === "NotFoundError") return null;
      throw e;
    }
  };
  var getFileIfExists = async (parent, name) => {
    try {
      return await parent.getFileHandle(name);
    } catch (e) {
      if (e.name === "NotFoundError") return null;
      throw e;
    }
  };
  var readTextIfExists = async (dir, fileName) => {
    const fileHandle = await getFileIfExists(dir, fileName);
    if (!fileHandle) return null;
    return (await fileHandle.getFile()).text();
  };
  var removeEntryIfExists = async (dir, name, opts) => {
    try {
      await dir.removeEntry(name, opts);
      return true;
    } catch (e) {
      if (e.name === "NotFoundError") return false;
      throw e;
    }
  };
  var writeFile = async (dir, fileName, data) => {
    const writable = await (await dir.getFileHandle(fileName, { create: true })).createWritable();
    await writable.write(data);
    await writable.close();
  };
  var baseDir = async () => {
    let dir = await navigator.storage.getDirectory();
    for (const segment of base.split("/")) {
      dir = await dir.getDirectoryHandle(segment);
    }
    return dir;
  };
  var baseDirIfExists = async () => {
    let dir = await navigator.storage.getDirectory();
    for (const segment of base.split("/")) {
      dir = await getDirIfExists(dir, segment);
      if (!dir) return null;
    }
    return dir;
  };
  var FS = class {
    /**
     * Removes the versions older than version.txt, and the whole file if it is left empty.
     * Without version.txt no version is removed.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @returns {Promise<void>}
     */
    async cleanFile(opts) {
      if (!opts || !opts.name) throw new TypeError("fs: opts.name is required");
      const parent = await baseDirIfExists();
      if (!parent) return;
      const dir = await getDirIfExists(parent, opts.name);
      if (!dir) return;
      const versionText = await readTextIfExists(dir, "version.txt");
      const released = versionText ? "v" + versionText : null;
      for await (const [entryName, entry] of dir.entries()) {
        if (released && entry.kind === "directory" && entryName < released) {
          await removeEntryIfExists(dir, entryName, { recursive: true });
        }
      }
      for await (const _ of dir.entries()) return;
      await removeEntryIfExists(parent, opts.name);
    }
    /**
     * Cleans all files, see cleanFile.
     * @returns {Promise<void>}
     */
    async clean() {
      const parent = await baseDirIfExists();
      if (!parent) return;
      const names = [];
      for await (const [entryName, entry] of parent.entries()) {
        if (entry.kind === "directory") names.push(entryName);
      }
      for (const name of names) {
        await this.cleanFile({ name });
      }
    }
    /**
     * Resolves a version of a file.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} [opts.version] - defaults to the content of version.txt
     * @returns {Promise<FileRef|null>} a new full FileRef, or null if it does not exist.
     */
    async get(opts) {
      if (!opts || !opts.name) throw new TypeError("fs: opts.name is required");
      const baseHandle = await baseDirIfExists();
      if (!baseHandle) return null;
      const dir = await getDirIfExists(baseHandle, opts.name);
      if (!dir) return null;
      const version = opts.version || await readTextIfExists(dir, "version.txt");
      if (!version) return null;
      const versionDir = await getDirIfExists(dir, "v" + version);
      if (!versionDir) return null;
      const etag = await readTextIfExists(versionDir, "etag.txt");
      return {
        name: opts.name,
        version,
        etag
      };
    }
    /**
     * Creates a new version, unless the latest version already has this etag.
     * The new version is not released.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.etag - required
     * @param {Blob|BufferSource|string} [opts.data] - content, required when a new version is created
     * @returns {Promise<FileRef>} a new full FileRef.
     */
    async create(opts) {
      if (!opts || !opts.name) throw new TypeError("fs: opts.name is required");
      if (!opts.etag) throw new TypeError("fs: opts.etag is required");
      let dir = await navigator.storage.getDirectory();
      for (const segment of [...base.split("/"), opts.name]) {
        dir = await dir.getDirectoryHandle(segment, { create: true });
      }
      let latest = null;
      for await (const [entryName, entry] of dir.entries()) {
        if (entry.kind === "directory" && entryName.startsWith("v") && (!latest || entryName > latest)) latest = entryName;
      }
      if (latest) {
        const latestDir = await getDirIfExists(dir, latest);
        if (latestDir && await readTextIfExists(latestDir, "etag.txt") === opts.etag) {
          return { name: opts.name, version: latest.substring(1), etag: opts.etag };
        }
      }
      if (opts.data === void 0) throw new TypeError("fs: opts.data is required to create a new version");
      const version = (/* @__PURE__ */ new Date()).toISOString();
      const versionDir = await dir.getDirectoryHandle("v" + version, { create: true });
      await writeFile(versionDir, "etag.txt", opts.etag);
      return { name: opts.name, version, etag: opts.etag };
    }
    /**
     * Returns the bin file path, full (with base). Does not check that it exists, see get.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.version - required
     * @returns {Promise<string>} e.g. "i6/fs/{name}/v{version}/blob.bin"
     */
    async resolve(opts) {
      if (!opts || !opts.name) throw new TypeError("fs: opts.name is required");
      if (!opts.version) throw new TypeError("fs: opts.version is required");
      return `${base}/${opts.name}/v${opts.version}/blob.bin`;
    }
    /**
     * Reads the content (blob.bin) of a version.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.version - required
     * @returns {Promise<Uint8Array>} the bytes of the file.
     * @throws {DOMException} NotFoundError if the version or its blob does not exist.
     */
    async read(opts) {
      if (!opts || !opts.name) throw new TypeError("fs: opts.name is required");
      if (!opts.version) throw new TypeError("fs: opts.version is required");
      let dir = await navigator.storage.getDirectory();
      for (const segment of [...base.split("/"), opts.name, "v" + opts.version]) {
        dir = await dir.getDirectoryHandle(segment);
      }
      const file = await (await dir.getFileHandle("blob.bin")).getFile();
      return new Uint8Array(await file.arrayBuffer());
    }
    /**
     * Makes a version the current one (version.txt), then cleans the older versions.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.version - required, must exist
     * @returns {Promise<FileRef>} a new full FileRef of the released version.
     */
    async release(opts) {
      if (!opts || !opts.name) throw new TypeError("fs: opts.name is required");
      if (!opts.version) throw new TypeError("fs: opts.version is required");
      const ref = await this.get(opts);
      if (!ref) throw new Error(`fs: version ${opts.version} of ${opts.name} does not exist`);
      await writeFile(await (await baseDir()).getDirectoryHandle(opts.name), "version.txt", opts.version);
      await this.cleanFile(opts);
      return ref;
    }
    /**
     * Removes a version that was never released (e.g. its download failed). Does nothing if it does not exist.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.version - required, must not be the released one
     * @returns {Promise<void>}
     */
    async discard(opts) {
      if (!opts || !opts.name) throw new TypeError("fs: opts.name is required");
      if (!opts.version) throw new TypeError("fs: opts.version is required");
      const baseHandle = await baseDirIfExists();
      if (!baseHandle) return;
      const dir = await getDirIfExists(baseHandle, opts.name);
      if (!dir) return;
      if (await readTextIfExists(dir, "version.txt") === opts.version) {
        throw new Error(`fs: version ${opts.version} of ${opts.name} is the released one`);
      }
      await removeEntryIfExists(dir, "v" + opts.version, { recursive: true });
    }
  };
  var fs = new FS();

  // src/internal/downloader/downloader.js
  function httpError(message, status) {
    return Object.assign(new Error(message), { status });
  }
  var Downloader = class {
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
    async update(opts) {
      if (!opts || !opts.name) throw new TypeError("downloader: opts.name is required");
      if (!opts.url) throw new TypeError("downloader: opts.url is required");
      const head = await fetch(opts.url, { method: "HEAD" });
      if (!head.ok) throw httpError(`downloader: HEAD ${opts.url} failed (${head.status})`, head.status);
      const etag = head.headers.get("etag");
      if (!etag) throw new Error("downloader: no etag in HEAD response");
      const current = await fs.get({ name: opts.name });
      if (current && current.etag === etag) return current;
      const ref = await fs.create({ name: opts.name, etag, data: "" });
      let success = false;
      try {
        const response = await fetch(opts.url);
        if (!response.ok) throw httpError(`downloader: GET ${opts.url} failed (${response.status})`, response.status);
        let dir = await navigator.storage.getDirectory();
        for (const segment of (await fs.resolve(ref)).split("/")) {
          dir = segment === "blob.bin" ? await dir.getFileHandle(segment, { create: true }) : await dir.getDirectoryHandle(segment);
        }
        await response.body.pipeTo(await dir.createWritable());
        success = true;
      } finally {
        if (!success) {
          await fs.discard(ref);
        }
      }
      return fs.release(ref);
    }
  };
  var downloader = new Downloader();

  // src/internal/debug/debug.js
  var debugLogger = (prefix) => (...args) => {
    if (globalThis.I6_DEBUG) console.log(`${prefix}:`, ...args);
  };

  // src/internal/assets/assets.js
  var debug = debugLogger("assets");
  function partitionsKey(partitions) {
    return Object.entries(partitions).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, value]) => encodeURIComponent(`${key}=${value}`)).join("-");
  }
  function isPartitions(partitions) {
    return !!partitions && typeof partitions === "object" && !Array.isArray(partitions) && Object.values(partitions).every((v) => typeof v === "string");
  }
  async function downloadFile(name, url) {
    const ref = await downloader.update({ name, url });
    debug(`${name} is ready`, ref);
    return ref;
  }

  // src/internal/sqlitez/sqlitez.js
  var SQLJS_VERSION = "1.14.2";
  var SQLJS_WASM_URL = `https://cdn.jsdelivr.net/npm/sql.js@${SQLJS_VERSION}/dist/`;
  var SQLITE_HEADER = "SQLite format 3\0";
  var sqlJsPromise = null;
  function loadSqlJs() {
    if (sqlJsPromise) return sqlJsPromise;
    sqlJsPromise = (async () => {
      if (typeof window !== "undefined" && typeof window.initSqlJs === "function") {
        return window.initSqlJs({ locateFile: (file) => `${SQLJS_WASM_URL}${file}` });
      }
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `${SQLJS_WASM_URL}sql-wasm.js`;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`could not load ${script.src}`));
        document.head.appendChild(script);
      });
      return window.initSqlJs({ locateFile: (file) => `${SQLJS_WASM_URL}${file}` });
    })();
    return sqlJsPromise;
  }
  var SqliteConn = class {
    /**
     * @param {Object} db - The sql.js Database instance.
     */
    constructor(db) {
      this.db = db;
    }
    /**
     * Closes the connection and frees its memory. Calling it more than once does nothing.
     * After `close`, every other method throws.
     * @returns {Promise<void>}
     */
    async close() {
      if (!this.db) return;
      this.db.close();
      this.db = null;
    }
    /**
     * Runs a query and returns its rows.
     * @param {Object} opts
     * @param {string} opts.query - required, the SQL; use `?` for values.
     * @param {SqliteValue[]} [opts.params] - values bound, in order, to the `?` of the query (never concatenate them).
     * @returns {Promise<SqliteRow[]>} The rows (empty array when none), each one an object by column name.
     * @throws {TypeError} If opts.query is missing.
     */
    async query(opts) {
      if (!opts || !opts.query) throw new TypeError("sqlitez: opts.query is required");
      const db = this.#alive();
      let stmt;
      try {
        stmt = db.prepare(opts.query);
        if (opts.params) {
          stmt.bind(opts.params);
        }
        const rows = [];
        while (stmt.step()) {
          rows.push(stmt.getAsObject());
        }
        return rows;
      } finally {
        if (stmt) stmt.free();
      }
    }
    /**
     * Runs a statement that returns no data (INSERT, UPDATE, CREATE, ...). Only the memory copy changes.
     * @param {Object} opts
     * @param {string} opts.query - required, the SQL; use `?` for values.
     * @param {SqliteValue[]} [opts.params] - values bound, in order, to the `?` of the query.
     * @returns {Promise<void>}
     * @throws {TypeError} If opts.query is missing.
     */
    async update(opts) {
      if (!opts || !opts.query) throw new TypeError("sqlitez: opts.query is required");
      const db = this.#alive();
      db.run(opts.query, opts.params);
    }
    /**
     * Runs a query stored in the `namedqueries` table of the sqlite (columns `name` and `query`).
     * @param {Object} opts
     * @param {string} opts.name - required, the `name` of the stored query.
     * @param {SqliteValue[]} [opts.params] - values bound, in order, to the `?` of the stored query.
     * @returns {Promise<SqliteRow[]>} The rows of the stored query, like `query`.
     * @throws {TypeError} If opts.name is missing.
     */
    async namedQuery(opts) {
      if (!opts || !opts.name) throw new TypeError("sqlitez: opts.name is required");
      const found = await this.query({ query: "SELECT query FROM namedqueries WHERE name = ?", params: [opts.name] });
      if (found.length === 0) {
        throw new Error(`sqlitez: no named query "${opts.name}"`);
      }
      return this.query({ query: String(found[0].query), params: opts.params });
    }
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
    async namedJsonQuery(opts) {
      if (!opts || !opts.name) throw new TypeError("sqlitez: opts.name is required");
      const ret = await this.namedStringQuery(opts);
      if (ret === null) return null;
      return JSON.parse(ret);
    }
    /**
     * Like `namedJsonQuery` (same JSON params bound as `?1`, `?2`, ...), but the `ret` column is returned as is,
     * without JSON.parse. Use it when the stored query returns plain text (e.g. for models); use `namedJsonQuery` when it returns JSON (e.g. for dash).
     * @param {Object} opts
     * @param {string} opts.name - required, the `name` of the stored query (see `namedQuery`).
     * @param {Array<*>} [opts.params] - JSON-serializable values, bound in order as `?1`, `?2`, ... Default: none.
     * @returns {Promise<string|null>} The `ret` of the first row as a string, or null if there is no row or `ret` is null.
     * @throws {TypeError} If opts.name is missing or opts.params is not an array.
     */
    async namedStringQuery(opts) {
      if (!opts || !opts.name) throw new TypeError("sqlitez: opts.name is required");
      if (opts.params !== void 0 && !Array.isArray(opts.params)) throw new TypeError("sqlitez: opts.params must be an array");
      const rows = await this.namedQuery({ name: opts.name, params: (opts.params ?? []).map((value) => JSON.stringify(value ?? null)) });
      if (rows.length === 0) return null;
      if (!("ret" in rows[0])) {
        throw new Error(`sqlitez: named query "${opts.name}" returned no "ret" column`);
      }
      if (rows[0].ret === null) return null;
      return String(rows[0].ret);
    }
    /**
     * @returns {Object} The sql.js database.
     */
    #alive() {
      if (!this.db) throw new Error("sqlitez: the connection is closed");
      return this.db;
    }
  };
  var Sqlitez = class {
    /**
     * Opens a sqlite file of the browser file system into memory.
     * @param {Object} opts
     * @param {string} opts.path - required, OPFS path of the file (what `fs.resolve` returns for a downloaded file).
     * @returns {Promise<SqliteConn>} The connection. The caller must `close()` it.
     * @throws {TypeError} If opts.path is missing.
     */
    async open(opts) {
      if (!opts || !opts.path) throw new TypeError("sqlitez: opts.path is required");
      const segments = opts.path.split("/");
      const fileName = segments.pop();
      let dir = await navigator.storage.getDirectory();
      for (const segment of segments) dir = await dir.getDirectoryHandle(segment);
      const file = await (await dir.getFileHandle(fileName)).getFile();
      const bytes = new Uint8Array(await file.arrayBuffer());
      if (new TextDecoder().decode(bytes.subarray(0, 16)) !== SQLITE_HEADER) {
        throw new Error(`sqlitez: ${opts.path} is not a sqlite file`);
      }
      const SQL = await loadSqlJs();
      return new SqliteConn(new SQL.Database(bytes));
    }
  };
  var sqlitez = new Sqlitez();

  // src/infer/litert.js
  var LITERT_VERSION = "2.5.3";
  var LITERT_WASM_URL = `https://cdn.jsdelivr.net/npm/@litertjs/core@${LITERT_VERSION}/wasm/`;

  // src/infer/infer.js
  var FILES = { sqlite: "sqlite.bin", tflite: "tflite.bin" };
  var DEFAULT_LIMIT = 20;
  var debug2 = debugLogger("infer");
  var Infer = class {
    /**
     * Constructs an Infer client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services) {
      this._services = services;
    }
    /**
     * Runs the model in the browser and returns its recommendation result.
     * @param {InferOptions} opts - Inference options.
     * @returns {Promise<*>} The results of the model.
     */
    async run(opts) {
      validate(opts);
      const startedAt = performance.now();
      const { modelName, params, sessionId, userId } = opts;
      const ids = { sessionId, userId };
      const queryName = (kind) => `model-${modelName}-${kind}`;
      const urls = await this._assetUrls(opts);
      debug2("1/4 model files located", { sqlite: withoutQuery(urls.sqlite), tflite: withoutQuery(urls.tflite) });
      const cacheName = (kind) => `infer-${modelName}-${partitionsKey(opts.partitions)}-${kind}`;
      const [sqliteRef, tfliteRef] = await Promise.all([
        downloadFile(cacheName("sqlite"), urls.sqlite)
        // downloadFile(cacheName("tflite"), urls.tflite),
      ]);
      const conn = await sqlitez.open({ path: await fs.resolve(sqliteRef) });
      try {
        const [inputs, compiled] = await Promise.all([
          conn.namedStringQuery({ name: queryName("input"), params: [params] })
          // loadModel({ ref: tfliteRef, wasmUrl: opts.litertWasm }),
        ]);
        if (!inputs) throw new Error(`infer: ${queryName("input")} returned no model inputs`);
        debug2("2/4 input query", queryName("input"), "| bound as ?1:", params, "| returned (model inputs):", preview(inputs));
        debug2("3/4 calling the model on the server", { model_name: modelName, version: opts.partitions.version, model_partitions: opts.partitions });
        const modelStartedAt = performance.now();
        const outputs = await this.callModel(inputs, opts);
        const data = outputs.parse();
        debug2("3/4 model answered", { ms: Math.round(performance.now() - modelStartedAt), ok: outputs?.ok, status: outputs?.status, error: outputs?.error, outputs: preview(data?.outputs) });
        let modelOutputsAndLimit = [JSON.parse(data.outputs), opts.limit ?? DEFAULT_LIMIT];
        debug2("4/4 output query", queryName("output"), "| bound as ?1 (model outputs) and ?2 (limit):", preview(modelOutputsAndLimit));
        const result = await conn.namedJsonQuery({ name: queryName("output"), params: modelOutputsAndLimit });
        debug2("output query returned (after namedJsonQuery)", result);
        const recId = crypto.randomUUID();
        const results = { ...result, rec_id: recId };
        const eventOpts = { dataset: opts.dataset, modelName, modelVersion: opts.partitions.version, storeId: opts.partitions.store_id, serviceOpts: opts.serviceOpts };
        await this.#sendRecEvent(eventOpts, ids, recId, "recraw", results);
        debug2("recraw event sent", { rec_id: recId, results: results.results?.length, totalMs: Math.round(performance.now() - startedAt) });
        return results;
      } finally {
        await conn.close();
      }
    }
    async callModel(inputs, opts) {
      const { dataset, modelName, partitions } = opts;
      return await this._services.apis().tfzModelPredict({
        params: {
          dataset,
          model_name: modelName,
          version: partitions.version
        },
        payload: {
          model_partitions: partitions,
          inputs
        }
      }, opts.serviceOpts);
    }
    /**
     * Asks `selectResults` which of the recommended skus are shown and sends their sku ids as the `recshow` event.
     * @param {SelectResultsOptions} opts - Select options.
     * @returns {Promise<*>} What `selectResults` returned, as is (the default sets the `rating` of each sku; see `defaultSelectResults`).
     */
    async selectResults(opts) {
      const selectResults = opts?.selectResults ?? defaultSelectResults;
      if (typeof selectResults !== "function") {
        throw new TypeError("infer: opts.selectResults must be a function");
      }
      const { req, results, recId, sessionId, userId } = opts;
      if (!recId) throw new TypeError("infer: opts.recId is required");
      if (!sessionId || !userId) {
        throw new TypeError("infer: opts needs sessionId and userId");
      }
      const ids = { sessionId, userId };
      const selected = await selectResults(req, results);
      if (!Array.isArray(selected?.results)) {
        throw new TypeError("infer: selectResults must return { results: [...] }");
      }
      const shown = {
        skus: selected.results.map((item, i) => {
          const skuId = item?.sku_id;
          if (!skuId) throw new TypeError(`infer: selectResults returned an item with no sku_id at results[${i}]`);
          return { sku_id: skuId };
        })
      };
      debug2("selectResults picked", { rec_id: recId, sku_ids: shown.skus.map((s) => s.sku_id) });
      await this.#sendRecEvent(opts, ids, recId, "recshow", shown);
      debug2("recshow event sent", { rec_id: recId });
      return selected;
    }
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
    async #sendRecEvent(opts, ids, recId, kind, payload) {
      await this._services.apis().ingestzEventRelevanceFashionEvent({
        params: { dataset: opts.dataset },
        payload: {
          id: crypto.randomUUID(),
          store_id: opts.storeId,
          session_id: ids.sessionId,
          user_id: ids.userId,
          created_at: (/* @__PURE__ */ new Date()).toISOString().split(".")[0] + "Z",
          [kind]: {
            rec_id: recId,
            model_id: opts.modelName,
            model_version: opts.modelVersion,
            payload: JSON.stringify(payload)
          }
        }
      }, opts.serviceOpts);
    }
    /**
     * Finds where the two model files are: the signed URLs of the model API, unless opts has them (tests).
     * @private
     * @param {InferOptions} opts - Inference options.
     * @returns {Promise<{sqlite: string, tflite: string}>} Download URLs of the files.
     */
    async _assetUrls(opts) {
      if (opts.sqliteUrl) return { sqlite: opts.sqliteUrl, tflite: opts.tfliteUrl };
      const { modelName, partitions, dataset } = opts;
      const resp = await this._services.apis().dszModelGet({
        params: { dataset, model_name: modelName },
        payload: { model_version: opts.partitions.version, model_partitions: partitions }
      }, opts.serviceOpts);
      const data = resp.parse();
      const byName = Object.fromEntries((data?.urls ?? []).map((file) => [file.name, file.url]));
      const missing = Object.values(FILES).find((name) => !byName[name]);
      if (missing) {
        throw new Error(`infer: the model api gave no "${missing}" file: ${resp.error?.message ?? JSON.stringify(Object.keys(byName))}`);
      }
      return { sqlite: byName[FILES.sqlite], tflite: byName[FILES.tflite] };
    }
  };
  function withoutQuery(url) {
    return typeof url === "string" ? url.split("?")[0] : url;
  }
  function preview(value, max = 600) {
    const text = typeof value === "string" ? value : JSON.stringify(value);
    if (typeof text !== "string" || text.length <= max) return text;
    return `${text.slice(0, max)}... (${text.length} chars in total)`;
  }
  function validate(opts) {
    for (const key of ["modelName", "dataset", "sessionId", "userId"]) {
      if (!opts || !opts[key]) throw new TypeError(`infer: opts.${key} is required`);
    }
    if (!isPartitions(opts.partitions)) {
      throw new TypeError("infer: opts.partitions must be an object of string values");
    }
    if (opts.params === void 0) throw new TypeError("infer: opts.params is required");
    if (opts.limit !== void 0 && !(Number.isInteger(opts.limit) && opts.limit > 0)) {
      throw new TypeError("infer: opts.limit must be a positive integer");
    }
    if (!opts.sqliteUrl !== !opts.tfliteUrl) {
      throw new TypeError("infer: opts.sqliteUrl and opts.tfliteUrl go together");
    }
  }
  async function defaultSelectResults(req, results) {
    const taken = new Set(req.input.skus.map((sku) => sku.sku_id));
    const shown = [];
    for (const result of results.results) {
      for (const { sku_id } of result.skus) {
        if (!taken.has(sku_id)) {
          taken.add(sku_id);
          shown.push({ sku_id, rating: result.rating });
          break;
        }
      }
    }
    return {
      results: shown
    };
  }

  // src/dash/dash.js
  var SQLITE_FILE = "sqlite.bin";
  var debug3 = debugLogger("dash");
  var Dash = class {
    /**
     * Constructs a Dash client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services) {
      this._services = services;
    }
    /**
     * Downloads the dash sqlite (cached by etag), runs the named query `dash-${dashName}` with `params` and returns its result.
     * @param {DashOptions} opts - Dash options.
     * @returns {Promise<*>} The `ret` of the named query.
     */
    async query(opts) {
      validate2(opts);
      const url = await this._sqliteUrl(opts);
      const ref = await downloadFile(`${opts.dashName}-${partitionsKey(opts.partitions)}-sqlite`, url);
      const conn = await sqlitez.open({ path: await fs.resolve(ref) });
      try {
        const name = `${opts.dashName}`;
        const result = await conn.namedJsonQuery({ name, params: opts.params === void 0 ? [] : [opts.params] });
        debug3(`${name} returned`, result);
        return result;
      } finally {
        await conn.close();
      }
    }
    /**
     * Finds where the dash sqlite is: the signed URL of the model API (like Infer), unless opts has `sqliteUrl` (tests).
     * @private
     * @param {DashOptions} opts - Dash options.
     * @returns {Promise<string>} Download URL of the sqlite.
     */
    async _sqliteUrl(opts) {
      if (opts.sqliteUrl) return opts.sqliteUrl;
      const { dashName, partitions, dataset } = opts;
      const apis = await this._services.apis();
      const storeId = partitions?.store_id ?? "1";
      const resp = await apis.dszSignedUrl({
        params: { dataset },
        payload: {
          paths: [
            { method: "GET", path: `i6tb://results.relevance-fashion-store-dash/store_id=${storeId}/sqlite.bin` }
          ]
        }
      }, opts.serviceOpts);
      if (!resp.ok) throw new Error(`dash: the api gave no "${SQLITE_FILE}" file: ${resp.error?.message ?? "empty answer"}`);
      const payload = resp.parse();
      const url = payload?.urls?.[0]?.url;
      if (!url) throw new Error(`dash: the api gave no "${SQLITE_FILE}" file: empty answer`);
      return url;
    }
  };
  function validate2(opts) {
    for (const key of ["dashName", "dataset"]) {
      if (!opts || !opts[key]) throw new TypeError(`dash: opts.${key} is required`);
    }
    if (!isPartitions(opts.partitions)) {
      throw new TypeError("dash: opts.partitions must be an object of string values");
    }
  }

  // src/services/services.js
  var Services = class {
    /**
     * Constructs a Services instance.
     * @param {I6SdkConfig} config - Configuration object for the SDK services.
     */
    constructor(config) {
      this._dispatcher = new EventTarget();
      this._config = config;
    }
    /**
     * Returns the SDK configuration.
     * @returns {I6SdkConfig} The configuration object.
     */
    config() {
      return this._config;
    }
    /**
     * Overwrites the given keys of the SDK configuration; the other keys are kept.
     * Clients read the config on every call, so the change is seen by every client of this container at once.
     * @param {Partial<I6SdkConfig>} config - The keys to overwrite.
     * @returns {void}
     */
    setConfig(config) {
      this._config = { ...this._config, ...config };
    }
    /**
     * Registers an event listener on the internal event dispatcher.
     * @param {string} evt - The event type or name to listen for.
     * @param {EventListenerOrEventListenerObject|Function} fn - The callback function or event listener object invoked when the event occurs.
     * @returns {void}
     */
    bind(evt, fn) {
      this._dispatcher.addEventListener(evt, fn);
    }
    /**
     * Creates and returns an Invoker service instance.
     * @returns {Invoker} An instance of the Invoker client.
     */
    invoker() {
      const ret = new Invoker(this);
      if (ret.prepare) {
        ret.prepare();
      }
      return ret;
    }
    /**
     * Creates and returns an Auth service instance.
     * @returns {Auth} An instance of the Auth client.
     */
    auth() {
      if (!this._auth) {
        this._auth = new Auth(this);
        if (this._auth.prepare) {
          this._auth.prepare();
        }
      }
      return this._auth;
    }
    /**
     * Creates and returns a Tokens service instance.
     * @returns {Tokens} An instance of the Tokens client.
     */
    tokens() {
      if (!this._tokens) {
        this._tokens = new Tokens(this);
        if (this._tokens.prepare) {
          this._tokens.prepare();
        }
      }
      return this._tokens;
    }
    /**
     * Creates and returns an Ingest service instance.
     * @returns {Ingest} An instance of the Ingest client.
     */
    ingest() {
      const ret = new Ingest(this);
      if (ret.prepare) {
        ret.prepare();
      }
      return ret;
    }
    /**
     * Creates and returns an Infer service instance.
     * @returns {Infer} An instance of the Infer client.
     */
    infer() {
      const ret = new Infer(this);
      if (ret.prepare) {
        ret.prepare();
      }
      return ret;
    }
    /**
     * Creates and returns a Dash service instance.
     * @returns {Dash} An instance of the Dash client.
     */
    dash() {
      const ret = new Dash(this);
      if (ret.prepare) {
        ret.prepare();
      }
      return ret;
    }
    /**
     * Creates and returns an Apis service instance.
     * @returns {Apis} An instance of the generated Apis client.
     */
    apis() {
      const ret = new Apis(this);
      if (ret.prepare) {
        ret.prepare();
      }
      return ret;
    }
    /**
    * Creates and returns a Funcs service instance.
    * @returns {SdkFuncs} An instance of the generated SdkFuncs client.
    */
    funcs() {
      const ret = new SdkFuncs(this);
      if (ret.prepare) {
        ret.prepare();
      }
      return ret;
    }
  };

  // src/internal/bitmapz/bitmapz.js
  function join(...values) {
    let result = 0;
    for (const v of values) {
      result |= Number(v);
    }
    return result;
  }
  function containsAll(current, ...expected) {
    const all = join(...expected);
    const cur = Number(current);
    return (cur & all) === all;
  }
  function containsAny(current, ...expected) {
    const any = join(...expected);
    const cur = Number(current);
    return (cur & any) !== 0;
  }
  function split(current) {
    if (!current) return [];
    const result = [];
    let c = BigInt(current);
    while (c > 0n) {
      const bit = c & -c;
      result.push(Number(bit));
      c &= ~bit;
    }
    return result;
  }
  function set(current, enable, ...values) {
    const mask = join(...values);
    const cur = Number(current);
    return enable ? cur | mask : cur & ~mask;
  }
  function serialize(v) {
    const u = BigInt(v);
    if (u <= 0x0Fn) {
      return new Uint8Array([Number(u)]);
    }
    let temp = u;
    let bitLen = 0;
    while (temp > 0n) {
      bitLen++;
      temp >>= 1n;
    }
    const size = Math.floor((bitLen + 7) / 8);
    const buf = new Uint8Array(1 + size);
    buf[0] = size << 4;
    for (let i = 0; i < size; i++) {
      buf[1 + i] = Number(u >> BigInt(8 * i) & 0xFFn);
    }
    return buf;
  }
  function deserialize(data) {
    if (!data || data.length === 0) {
      throw new Error("bitmapz: data is empty");
    }
    const header = data[0];
    const size = header >> 4;
    if (size > 8) {
      throw new Error(`bitmapz: invalid size ${size}: bitmask size cannot exceed 8 bytes`);
    }
    if (size === 0) {
      if (data.length !== 1) {
        throw new Error(`bitmapz: invalid data length: expected 1 byte for 4-bit value, got ${data.length}`);
      }
      return header & 15;
    }
    if ((header & 15) !== 0) {
      throw new Error(`bitmapz: invalid header 0x${header.toString(16).padStart(2, "0")}: lower 4 bits must be 0 when size > 0`);
    }
    const expectedLen = 1 + size;
    if (data.length !== expectedLen) {
      throw new Error(`bitmapz: invalid data length: expected ${expectedLen} bytes for size ${size}, got ${data.length}`);
    }
    let val = 0n;
    for (let i = 0; i < size; i++) {
      val |= BigInt(data[1 + i]) << BigInt(8 * i);
    }
    if (val <= BigInt(Number.MAX_SAFE_INTEGER)) {
      return Number(val);
    }
    return val;
  }
  var bitmapz = Object.freeze({
    join,
    containsAll,
    containsAny,
    split,
    set,
    serialize,
    deserialize
  });

  // src/index.js
  var DEFAULT_CONFIG = {
    baseUrl: "https://decsuite.sandbox.rs.infinity6.ai",
    servUrls: {
      "tfinfer": "https://tfinfer.sandbox.rs.infinity6.ai",
      "userz": "https://userz.sandbox.rs.infinity6.ai"
    }
    // baseUrl: "http://localhost:9021",
    // servUrls: {
    //   "tfinfer": "http://localhost:9022",
    //   "userz": "http://localhost:9023"
    // },
  };
  var I6Sdk = class {
    /**
     * Constructs an instance of the i6 SDK.
     * @param {I6SdkConfig} [config] - Configuration options for the SDK.
     */
    constructor(config) {
      this._service = new Services({
        ...DEFAULT_CONFIG,
        ...config
      });
    }
    /**
     * Returns a copy of the configuration the SDK is running with.
     * @returns {I6SdkConfig} The current configuration.
     */
    config() {
      return { ...this._service.config() };
    }
    /**
     * Overwrites the given keys of the configuration; the other keys are kept.
     * Can be called at any time, the next call of the SDK uses the new values.
     * @param {Partial<I6SdkConfig>} config - The keys to overwrite.
     * @returns {void}
     */
    setConfig(config) {
      this._service.setConfig(config);
    }
    /**
     * Returns an Ingest service instance.
     * @returns {import("./ingest/ingest.js").Ingest} An instance of the Ingest client.
     */
    ingest() {
      return this._service.ingest();
    }
    /**
     * Returns an Infer service instance, which runs an i6 model in the browser and returns the result.
     * @returns {import("./infer/infer.js").Infer} An instance of the Infer client.
     */
    infer() {
      return this._service.infer();
    }
    /**
     * Returns a Dash service instance, which queries an i6 dash in the browser and returns the result.
     * @returns {import("./dash/dash.js").Dash} An instance of the Dash client.
     */
    dash() {
      return this._service.dash();
    }
    /**
     * Returns an Auth service instance.
     * @returns {import("./auth/auth.js").Auth} An instance of the Auth client.
     */
    auth() {
      return this._service.auth();
    }
    /**
     * Returns a Tokens service instance.
     * @returns {import("./tokens/tokens.js").Tokens} An instance of the Tokens client.
     */
    tokens() {
      return this._service.tokens();
    }
    /**
     * Returns the Apis service instance, one typed method per i6 server API.
     * Each call resolves with `{status, ok, payload?, error?}` and does not throw on an HTTP error.
     * @returns {Apis} An instance of the generated Apis client.
     */
    apis() {
      return this._service.apis();
    }
    /**
     * Returns the Funcs service instance.
     * @returns {SdkFuncs} An instance of the SdkFuncs client.
     */
    funcs() {
      return this._service.funcs();
    }
    /**
     * Registers an event listener on the SDK's internal event dispatcher (an EventTarget).
     * @param {string} evt - The event type or name to listen for.
     * @param {EventListenerOrEventListenerObject|Function} fn - The callback function or event listener object invoked when the event occurs.
     * @returns {void}
     */
    bind(evt, fn) {
      this._service.bind(evt, fn);
    }
  };
  var Grants = Object.freeze({
    System: 1,
    Admin: 2,
    Write: 4,
    Read: 8,
    All: 15
  });
  window.I6Sdk = I6Sdk;
  I6Sdk.Resp = Resp;
  I6Sdk.bitmapz = bitmapz;
  I6Sdk.Grants = Grants;
})();
//# sourceMappingURL=i6sdk-web.js.map
