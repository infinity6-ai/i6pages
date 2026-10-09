/**
 * @fileoverview Authentication client. Looks up the signed-in user and sends
 * unauthenticated browsers to the login page. Requests carry the session
 * cookie (credentials are always included by the Invoker).
 */
export type Services = import("../services/services.js").Services;
export type UserProfile = Record<string, any>;
/**
 * @typedef {import("../services/services.js").Services} Services
 */
/**
 * Authenticated user profile data.
 * @typedef {Record<string, any>} UserProfile
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
     * Fetches the current authenticated user profile (`GET api/auth/me`).
     * Does not redirect; use {@link Auth#requireUser} to force a login.
     * @returns {Promise<UserProfile|null>} The user profile data, or null if the
     *   server returns no user.
     * @throws {Error} If the network request fails or the response body is not valid JSON.
     */
    user(): Promise<UserProfile | null>;
    /**
     * Fetches the current user, redirecting the browser to the login page when
     * there is none. The login page sends the user back to the current URL
     * afterwards.
     * @returns {Promise<UserProfile|null>} The user profile data, or null when the
     *   browser is being redirected to login.
     * @throws {Error} If the network request fails or the response body is not valid JSON.
     */
    requireUser(): Promise<UserProfile | null>;
}
export { Auth };
