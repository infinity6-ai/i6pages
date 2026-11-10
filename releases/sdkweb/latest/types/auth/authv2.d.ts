/**
 * @fileoverview Authentication client V2 using i6userz PKCE redirect flow.
 *
 * Flow Architecture:
 * 1. Login Initiation: {@link AuthV2#login} generates an RFC 7636 PKCE code verifier and S256 code
 *    challenge, appends the target application URL (`callback`) and `code_verifier` as query
 *    parameters to `config.userExchangeCallbackUrl`, and redirects the browser to `GET /api/userz/auth`.
 * 2. Identity Provider Authentication: The user signs in via Google or Email/Password on the i6userz UI.
 * 3. Authorization Code Redirect: i6userz redirects the browser to the intermediate exchange URL
 *    (`config.userExchangeCallbackUrl`) with a short-lived authorization `code` appended.
 * 4. Token Exchange: The exchange callback page invokes {@link AuthV2#handleCallback}, which extracts
 *    the `code` and `code_verifier`, calls the Tokens service to exchange them via `POST /api/userz/auth/exchange`
 *    for active tokens (access token JWT, refresh token, user ID, expiration), persists them, and redirects the browser
 *    to the original application URL.
 * 5. Profile Retrieval: {@link AuthV2#user} fetches user identity metadata via `GET /api/userz/auth/me`
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
 * @typedef {import("../services/services.js").Services} Services
 * @typedef {import("../tokens/tokens.js").UserToken} UserToken
 */
/**
 * User profile metadata returned by the GET /api/userz/auth/me endpoint.
 * @typedef {Object} AuthPayload
 * @property {string} user_id - Authenticated user unique identifier UUID.
 * @property {string} [email_redacted] - Redacted email address for display (e.g. "u***@infinity6.ai").
 * @property {string[]} [providers] - List of linked identity providers (e.g. ["google", "password"]).
 * @property {number} [created_at] - Account creation timestamp in epoch milliseconds.
 * @property {string} [sub] - User ID (legacy alias for user_id).
 * @property {string} [display] - User display name (legacy alias).
 * @property {string} [email] - User email address (legacy alias).
 */
/**
 * Authentication client V2 for handling browser redirects, PKCE, and user profile retrieval with i6userz.
 * Configuration (callbackUrl, userExchangeCallbackUrl, app) is read directly from `i6sdk.config()`.
 */
declare class AuthV2 {
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs an AuthV2 client instance.
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
     * generates a random PKCE `code_verifier` and S256 `code_challenge`, and redirects
     * the browser with `app`, `redirect`, and `code_challenge` query parameters.
     *
     * @param {string} [callbackUrl] - The final destination URL to return to after login and token exchange complete.
     *   Defaults to `window.location.href`.
     * @returns {Promise<void>}
     * @throws {string} If `config.userExchangeCallbackUrl` is not defined in the SDK configuration.
     */
    login(callbackUrl?: string): Promise<void>;
    /**
     * Processes the authorization code present in the URL query string, exchanging it for tokens via
     * the Tokens service (`POST /api/userz/auth/exchange`), and redirecting to the post-exchange `callback` URL.
     *
     * Note: This method must be called explicitly by the exchange callback page
     * (configured via `config.userExchangeCallbackUrl`). It is not called automatically by `user()`.
     *
     * @returns {Promise<boolean>} True if handling tokens completed (code was exchanged and redirect initiated),
     *   false if not an auth callback (no authorization `code` in the URL query parameters).
     * @throws {Error} If the token exchange request fails or the server returns an error status.
     */
    handleCallback(): Promise<boolean>;
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
     * Clears all stored authentication tokens and credentials via the Tokens service.
     * @returns {void}
     */
    clearTokens(): void;
    /**
     * Fetches the current authenticated user profile metadata (`GET /api/userz/auth/me`).
     * Sends a valid user access token in the `Authorization: Bearer <user_access_token>` header,
     * automatically performing a silent renewal if the access token has expired.
     * Does not redirect; use {@link AuthV2#requireUser} to automatically force a login redirect.
     *
     * Note: Expects tokens to already be present in storage. Call {@link AuthV2#handleCallback}
     * on the exchange page before attempting to fetch the user profile.
     *
     * @returns {Promise<AuthPayload|null>} The user profile data, or null if unauthenticated.
     * @throws {Error} If the network request fails or the userz service returns an error status.
     */
    user(): Promise<AuthPayload | null>;
    /**
     * Fetches the current user profile, automatically redirecting the browser to the login page
     * via {@link AuthV2#login} when the user is unauthenticated.
     *
     * @returns {Promise<AuthPayload|null>} The user profile data, or null when redirecting to login.
     */
    requireUser(): Promise<AuthPayload | null>;
    /**
     * Logs out the current user by clearing stored tokens and navigating to `backurl`.
     *
     * @param {string} [backurl] - The URL to return to after logging out.
     *   Defaults to `config.callbackUrl` or the current window URL (`window.location.href`).
     * @returns {Promise<void>}
     */
    logout(backurl?: string): Promise<void>;
}
export { AuthV2 };
