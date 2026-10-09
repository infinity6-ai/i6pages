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
   * Fetches the current authenticated user profile (`GET api/auth/me`).
   * Does not redirect; use {@link Auth#requireUser} to force a login.
   * @returns {Promise<UserProfile|null>} The user profile data, or null if the
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
   * @returns {Promise<UserProfile|null>} The user profile data, or null when the
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
}
export { Auth };
