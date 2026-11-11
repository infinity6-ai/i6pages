const USER_TOKEN_KEY = "i6_user_user_token";
const DATASET_TOKENS_KEY = "i6_dataset_access_tokens";
const ALL_GRANTS = 15;
class Tokens {
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
      try {
        return s();
      } catch {
        return null;
      }
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
    try {
      return JSON.parse(s);
    } catch {
      return null;
    }
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
   * Retrieves the raw stored user access token JWT string without checking expiration or refreshing.
   * Use {@link Tokens#getValidAccessToken} when fresh/valid credentials are required.
   *
   * @returns {string|undefined} The signed EdDSA user access token JWT,
   *   or undefined if no user is authenticated.
   */
  getAccessToken() {
    return this.getUserToken()?.user_access_token;
  }
  /**
   * Clears all stored authentication and authorization tokens from storage.
   * Removes both the user token (`'i6_user_user_token'`) and all cached dataset
   * access tokens (`'i6_dataset_access_tokens'`).
   * @returns {void}
   */
  clearTokens() {
    this.clearDatasetTokens();
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
   * Refreshes the user access token using the stored user refresh token via `POST /api/userz/auth/refresh`.
   * Enforces token family rotation by storing the newly rotated refresh token and fresh access token.
   * Deduplicates concurrent in-flight refresh requests to prevent token reuse conflicts.
   *
   * @returns {Promise<UserToken|null>} The refreshed token credentials, or null if refresh failed / token revoked.
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
      } catch {
        return null;
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
      try {
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
      } catch {
      }
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
    try {
      return JSON.parse(s) || {};
    } catch {
      return {};
    }
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
        const url = `${userzUrl}/api/userz/dataset/access-token`;
        const resp = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userAccessToken}`
          },
          body: JSON.stringify({
            dataset,
            grants: ALL_GRANTS
          })
        });
        if (!resp.ok) {
          return null;
        }
        const data = await resp.json();
        this.setDatasetToken(dataset, data);
        return data;
      } catch {
        return null;
      } finally {
        this._datasetTokenPromises.delete(dataset);
      }
    })();
    this._datasetTokenPromises.set(dataset, promise);
    const result = await promise;
    return result?.access_token || null;
  }
}
export { Tokens };
