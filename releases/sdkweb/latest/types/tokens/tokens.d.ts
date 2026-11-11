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
     * Retrieves the raw stored user access token JWT string without checking expiration or refreshing.
     * Use {@link Tokens#getValidAccessToken} when fresh/valid credentials are required.
     *
     * @returns {string|undefined} The signed EdDSA user access token JWT,
     *   or undefined if no user is authenticated.
     */
    getAccessToken(): string | undefined;
    /**
     * Clears all stored authentication and authorization tokens from storage.
     * Removes both the user token (`'i6_user_user_token'`) and all cached dataset
     * access tokens (`'i6_dataset_access_tokens'`).
     * @returns {void}
     */
    clearTokens(): void;
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
     * and persists the resulting user token credentials in localStorage.
     * Automatically clears any existing dataset tokens before storing new session credentials.
     *
     * @param {string} checkoutCode - The encrypted checkout ticket issued by checkoutcallback.
     * @returns {Promise<UserToken>} The redeemed user token credentials.
     * @throws {Error} If the redemption request fails or the server returns an error status.
     */
    redeemCheckout(checkoutCode: string): Promise<UserToken>;
    /**
     * Refreshes the user access token using the stored user refresh token via `POST /api/userz/auth/refresh`.
     * Enforces token family rotation by storing the newly rotated refresh token and fresh access token.
     * Deduplicates concurrent in-flight refresh requests to prevent token reuse conflicts.
     *
     * @returns {Promise<UserToken|null>} The refreshed token credentials, or null if refresh failed / token revoked.
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
}
export { Tokens };
