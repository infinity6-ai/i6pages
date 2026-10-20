class Auth {
  /**
   * Constructs an Auth client instance.
   * @param {Services} services - The services manager instance.
   */
  constructor(services) {
    this._services = services;
  }
  /**
   * Redirects the browser to the login page, passing the current URL (encoded)
   * as `backurl` so the user returns to this page after signing in.
   * Navigates away from the page; code after the call may not run.
   * @private
   * @returns {void}
   */
  #redirectToLogin() {
    const backurl = location.href;
    const encoded = encodeURIComponent(backurl);
    const loginUrl = `${this._services.config().baseUrl}/api/decsuite/auth/login?backurl=${encoded}`;
    location = loginUrl;
  }
  /**
   * Redirects the browser to the logout page, passing the given URL (encoded)
   * as `backurl` so the user returns to it after signing out.
   * Navigates away from the page; code after the call may not run.
   * @private
   * @param {string} backurl - The URL to return to after logging out.
   * @returns {void}
   */
  #redirectToLogout(backurl) {
    const encoded = encodeURIComponent(backurl);
    const logoutUrl = `${this._services.config().baseUrl}/api/decsuite/auth/logout?backurl=${encoded}`;
    location = logoutUrl;
  }
  /**
   * Fetches the current authenticated user profile (`GET api/auth/me`).
   * Does not redirect; use {@link Auth#requireUser} to force a login.
   * @returns {Promise<AuthPayload|null>} The user profile data, or null if the
   *   server returns no user.
   * @throws {Error} If the network request fails or the response body is not valid JSON.
   */
  async user() {
    const resp = await this._services.invoker().invoke({
      path: `api/auth/me`
    });
    const user = await resp.json();
    return user;
  }
  /**
   * Fetches the current user, redirecting the browser to the login page when
   * there is none. The login page sends the user back to the current URL
   * afterwards.
   * @returns {Promise<AuthPayload|null>} The user profile data, or null when the
   *   browser is being redirected to login.
   * @throws {Error} If the network request fails or the response body is not valid JSON.
   */
  async requireUser() {
    var user = await this.user();
    if (!user) {
      this.#redirectToLogin();
      return null;
    }
    return user;
  }
  /**
   * Logs out the current user by redirecting the browser to the logout endpoint.
   * The server clears the session and redirects the browser back to `backurl`.
   * Navigates away from the page; code after the call may not run.
   * @param {string} [backurl=location.href] - The URL to return to after logging out.
   *   Defaults to the current page URL.
   * @returns {Promise<void>}
   */
  async logout(backurl = location.href) {
    this.#redirectToLogout(backurl);
  }
}
export { Auth };
