class Invoker {
  /**
   * Constructs an Invoker instance.
   * @param {Services} services - The services manager instance.
   */
  constructor(services) {
    this._services = services;
  }
  /**
   * Sends an HTTP request using the Fetch API.
   *
   * @param {InvokeOptions} opts - Request options including path/URL, query params, and fetch options.
   * @param {string} [opts.url] - The full URL to request. If omitted, defaults to `${baseUrl}/${path}`.
   * @param {string} [opts.path] - The path to append to the baseUrl if `url` is not provided.
   * @param {Record<string, any>} [opts.query] - Key-value pairs to append as query parameters.
   * @param {*} [opts.json] - JSON-serializable body data. If provided, sets Content-Type header to application/json and serializes to body.
   * Credentials are always set to "include" so the session cookie is sent. Note that `opts`
   * is modified (credentials, and headers/body when `json` is given). An HTTP error status
   * does not throw; check `ok` on the returned Response.
   * @returns {Promise<Response>} A promise that resolves to the fetch Response.
   * @throws {TypeError} If the network request fails (from fetch).
   */
  async invoke(opts) {
    let url = opts.url || `${this._services.config().baseUrl}/${opts.path}`;
    if (opts.query) {
      const search = new URLSearchParams();
      for (const [key, value] of Object.entries(opts.query)) {
        if (value === void 0 || value === null) {
          continue;
        }
        for (const item of Array.isArray(value) ? value : [value]) {
          search.append(key, String(item));
        }
      }
      const queryString = search.toString();
      if (queryString) {
        url = url + (url.includes("?") ? "&" : "?") + queryString;
      }
    }
    if (opts.json) {
      const headers = new Headers(opts.headers);
      headers.set("Content-Type", "application/json");
      opts.headers = headers;
      opts.body = JSON.stringify(opts.json);
    }
    opts.credentials = "include";
    const resp = await fetch(url, opts);
    return resp;
  }
}
export { Invoker };
