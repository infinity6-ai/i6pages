class Auth {
  /**
   * Constructs an Auth client instance.
   * @param {Services} services - The services manager instance.
   */
  constructor(services) {
    this._services = services;
  }
  /**
   * Redirects the browser to the login page with the current URL as backurl.
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
   * Fetches the current authenticated user profile.
   * @returns {Promise<UserProfile|null>} The user profile data, or null if redirected to login.
   * @throws {Error} If the HTTP request fails.
   */
  async user() {
    const resp = await this._services.invoker().invoke({
      path: `api/auth/me`
    });
    const user = await resp.json();
    return user;
  }
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
