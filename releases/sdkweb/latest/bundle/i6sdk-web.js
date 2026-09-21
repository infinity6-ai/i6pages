(() => {
  // src/invoker/invoker.js
  var Invoker = class {
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
     * @returns {Promise<Response>} A promise that resolves to the fetch Response.
     */
    async invoke(opts) {
      let url = opts.url || `${this._services.config().baseUrl}/${opts.path}`;
      if (opts.query) {
        const queryString = new URLSearchParams(params).toString();
        if (!url.contains("?")) {
          url = url + "?" + queryString;
        } else {
          url = url + "&" + queryString;
        }
      }
      if (opts.json) {
        opts.headers = {
          "Content-Type": "application/json"
        };
        opts.body = JSON.stringify(opts.json);
      }
      opts.credentials = "include";
      const resp = await fetch(url, opts);
      return resp;
    }
  };

  // src/auth/auth.js
  var Auth = class {
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
  };

  // src/ingest/ingest.js
  var Ingest = class {
    /**
     * Constructs an Ingest client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services) {
      this._services = services;
    }
    /**
     * Asks ingestz for a signed upload URL (ingestz-get-url API) and uploads a single file to it.
     * @param {UploadParams} params - Upload parameters.
     * @param {string} params.dataset - Dataset the file is ingested into.
     * @param {string} params.table - Inbox table name.
     * @param {Partitions} params.partitions - Values for the table partitions, except the ingest id one.
     * @param {File} params.file - The single file to upload.
     * @returns {Promise<void>} Resolves on a successful upload, rejects otherwise.
     * @throws {Error} If file is not a single File or if upload fails.
     */
    async upload({ dataset, table, partitions, file }) {
      if (!(file instanceof File)) {
        throw new Error("file must be a single File.");
      }
      const signedPutUrl = await this.#getUrl({ dataset, table, partitions });
      await this.#put(signedPutUrl, file);
    }
    /**
     * Gets one signed PUT URL from the ingestz-get-url API.
     * @private
     * @param {GetUrlParams} params - Parameters for requesting the upload URL.
     * @param {string} params.dataset - Dataset name.
     * @param {string} params.table - Inbox table name.
     * @param {Partitions} params.partitions - Values for the table partitions, except the ingest id one.
     * @returns {Promise<string>} Resolves with the signed PUT URL.
     * @throws {Error} If the request fails or no upload URL is returned.
     */
    async #getUrl({ dataset, table, partitions }) {
      const resp = await this._services.invoker().invoke({
        method: "POST",
        path: `api/ingest/get-url/dataset/${encodeURIComponent(dataset)}`,
        json: { table, partitions, amount: 1 }
      });
      if (!resp.ok) {
        throw new Error(`Get upload URL failed with status ${resp.status}`);
      }
      const { uploads } = await resp.json();
      if (!uploads?.[0]) {
        throw new Error("Get upload URL returned no upload URL.");
      }
      return uploads[0];
    }
    /**
     * Uploads a file to a signed PUT URL using XMLHttpRequest.
     * @private
     * @param {string} signedPutUrl - The signed URL to PUT the file to.
     * @param {File} file - The file to upload.
     * @returns {Promise<void>} Resolves on a successful upload, rejects on network or HTTP error.
     */
    #put(signedPutUrl, file) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });
        xhr.addEventListener("error", () => {
          reject(new Error("Network error occurred during upload."));
        });
        xhr.open("PUT", signedPutUrl, true);
        xhr.send(file);
      });
    }
  };

  // src/services/services.js
  var Services = class {
    /**
     * Constructs a Services instance.
     * @param {I6SdkConfig} config - Configuration object for the SDK services.
     */
    constructor(config) {
      this._dispatcher = new EventTarget();
      this._config = config;
    }
    /**
     * Returns the SDK configuration.
     * @returns {I6SdkConfig} The configuration object.
     */
    config() {
      return this._config;
    }
    /**
     * Registers an event listener on the internal event dispatcher.
     * @param {string} evt - The event type or name to listen for.
     * @param {EventListenerOrEventListenerObject|Function} fn - The callback function or event listener object invoked when the event occurs.
     * @returns {void}
     */
    bind(evt, fn) {
      this._dispatcher.addEventListener(evt, fn);
    }
    /**
     * Creates and returns an Invoker service instance.
     * @returns {Invoker} An instance of the Invoker client.
     */
    invoker() {
      const ret = new Invoker(this);
      if (ret.prepare) {
        ret.prepare();
      }
      return ret;
    }
    /**
     * Creates and returns an Auth service instance.
     * @returns {Auth} An instance of the Auth client.
     */
    auth() {
      const ret = new Auth(this);
      if (ret.prepare) {
        ret.prepare();
      }
      return ret;
    }
    /**
     * Creates and returns an Ingest service instance.
     * @returns {Ingest} An instance of the Ingest client.
     */
    ingest() {
      const ret = new Ingest(this);
      if (ret.prepare) {
        ret.prepare();
      }
      return ret;
    }
  };

  // src/index.js
  var DEFAULT_CONFIG = {
    baseUrl: "https://decsuite.sandbox.rs.infinity6.ai"
    // baseUrl: "http://localhost:9021",
  };
  var I6Sdk = class {
    /**
     * Constructs an instance of the i6 SDK.
     * @param {I6SdkConfig} [config] - Configuration options for the SDK.
     */
    constructor(config) {
      this._service = new Services(this._config = {
        ...DEFAULT_CONFIG,
        ...config
      });
    }
    /**
     * Returns an Ingest service instance.
     * @returns {Ingest} An instance of the Ingest client.
     */
    ingest() {
      return this._service.ingest();
    }
    /**
     * Returns an Auth service instance.
     * @returns {Auth} An instance of the Auth client.
     */
    auth() {
      return this._service.auth();
    }
    /**
     * Registers an event listener on the internal event dispatcher.
     * @param {string} evt - The event type or name to listen for.
     * @param {EventListenerOrEventListenerObject|Function} fn - The callback function or event listener object invoked when the event occurs.
     * @returns {void}
     */
    bind(evt, fn) {
      this._service.bind(evt, fn);
    }
  };
  window.I6Sdk = I6Sdk;
})();
//# sourceMappingURL=i6sdk-web.js.map
