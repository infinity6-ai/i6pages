/**
 * @fileoverview Authentication client. Looks up the signed-in user and sends
 * unauthenticated browsers to the login page. Requests carry the session
 * cookie (credentials are always included by the Invoker).
 */
export type Services = import("../services/services.js").Services;
export type AuthPayload = {
    /**
     * -
     */
    sub_type?: string;
    /**
     * - user id
     */
    sub?: string;
    /**
     * -
     */
    ext?: string;
};
/**
 * @typedef {import("../services/services.js").Services} Services
 */
/**
 * Configuration options for the i6 SDK.
 * @typedef {Object} AuthPayload
 * @property {string} [sub_type] -
 * @property {string} [sub] - user id
 * @property {string} [ext] -
 */
/**
 * Authentication client for handling user sessions and authentication requests.
 * Obtain an instance with `i6sdk.auth()` rather than constructing it directly.
 */
declare class Auth {
    #private;
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
     * Redirects the browser to the login page, passing the current URL (encoded)
     * as `backurl` so the user returns to this page after signing in.
     * Navigates away from the page; code after the call may not run.
     * @private
     * @returns {void}
     */
    private #redirectToLogin;
    /**
     * Redirects the browser to the logout page, passing the given URL (encoded)
     * as `backurl` so the user returns to it after signing out.
     * Navigates away from the page; code after the call may not run.
     * @private
     * @param {string} backurl - The URL to return to after logging out.
     * @returns {void}
     */
    private #redirectToLogout;
    /**
     * Fetches the current authenticated user profile (`GET api/auth/me`).
     * Does not redirect; use {@link Auth#requireUser} to force a login.
     * @returns {Promise<AuthPayload|null>} The user profile data, or null if the
     *   server returns no user.
     * @throws {Error} If the network request fails or the response body is not valid JSON.
     */
    user(): Promise<AuthPayload | null>;
    /**
     * Fetches the current user, redirecting the browser to the login page when
     * there is none. The login page sends the user back to the current URL
     * afterwards.
     * @returns {Promise<AuthPayload|null>} The user profile data, or null when the
     *   browser is being redirected to login.
     * @throws {Error} If the network request fails or the response body is not valid JSON.
     */
    requireUser(): Promise<AuthPayload | null>;
    /**
     * Logs out the current user by redirecting the browser to the logout endpoint.
     * The server clears the session and redirects the browser back to `backurl`.
     * Navigates away from the page; code after the call may not run.
     * @param {string} [backurl=location.href] - The URL to return to after logging out.
     *   Defaults to the current page URL.
     * @returns {Promise<void>}
     */
    logout(backurl?: string): Promise<void>;
}
export { Auth };
