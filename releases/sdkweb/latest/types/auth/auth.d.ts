/**
 * @fileoverview Authentication client.
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
     * Redirects the browser to the login page with the current URL as backurl.
     * @private
     * @returns {void}
     */
    private #redirectToLogin;
    /**
     * Fetches the current authenticated user profile.
     * @returns {Promise<UserProfile|null>} The user profile data, or null if redirected to login.
     * @throws {Error} If the HTTP request fails.
     */
    user(): Promise<UserProfile | null>;
    requireUser(): Promise<UserProfile | null>;
}
export { Auth };
