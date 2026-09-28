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

  // src/sdkapis/sdkapis.js
  async function ingestzGetUrl(services, req) {
    const resp = await services.invoker().invoke({
      method: "POST",
      path: `api/ingest/get-url/dataset/${encodeURIComponent(String(req.params.dataset))}`,
      json: req.payload
    });
    const result = { status: resp.status, ok: resp.ok };
    if (resp.ok) {
      result.payload = await resp.json();
    }
    if (!resp.ok) {
      const text = await resp.text();
      try {
        result.error = JSON.parse(text);
      } catch {
        result.error = text;
      }
    }
    return result;
  }
  async function pipezStart(services, req) {
    const resp = await services.invoker().invoke({
      method: "POST",
      path: `api/pipe/start/dataset/${encodeURIComponent(String(req.params.dataset))}`,
      json: req.payload
    });
    const result = { status: resp.status, ok: resp.ok };
    if (resp.ok) {
      result.payload = await resp.json();
    }
    if (!resp.ok) {
      const text = await resp.text();
      try {
        result.error = JSON.parse(text);
      } catch {
        result.error = text;
      }
    }
    return result;
  }
  async function dszDomainSelect(services, req) {
    const resp = await services.invoker().invoke({
      method: "POST",
      path: `api/ds/solution-domain-select/dataset/${encodeURIComponent(String(req.params.dataset))}`,
      json: req.payload
    });
    const result = { status: resp.status, ok: resp.ok };
    if (resp.ok) {
      result.body = await resp.json();
    }
    if (!resp.ok) {
      const text = await resp.text();
      try {
        result.error = JSON.parse(text);
      } catch {
        result.error = text;
      }
    }
    return result;
  }

  // src/errors.js
  var I6Error = class _I6Error extends Error {
    /**
     * @param {string} message - Human readable description.
     * @param {Object} [details]
     * @param {I6ErrorCode} [details.code] - Failure kind. Defaults to "http" when a status is given.
     * @param {number} [details.status] - HTTP status code, when the server answered.
     * @param {*} [details.body] - Error body of the response (parsed JSON, or raw text).
     * @param {*} [details.cause] - The underlying error, if any.
     */
    constructor(message, { code, status, body, cause } = {}) {
      super(message, cause === void 0 ? void 0 : { cause });
      this.name = "I6Error";
      this.code = code ?? (status === void 0 ? void 0 : "http");
      this.status = status;
      this.body = body;
    }
    /**
     * Builds an "http" error from a failed generated-client result ({status, error}).
     * @param {string} message
     * @param {{status: number, error?: *}} result
     * @returns {I6Error}
     */
    static fromResult(message, result) {
      return new _I6Error(`${message} with status ${result.status}`, {
        code: "http",
        status: result.status,
        body: result.error
      });
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
     * @returns {Promise<UploadResult>} Resolves with the ingest id on a successful upload.
     * @throws {I6Error} With code "invalid_argument" if file is not a single File, "http" or
     *   "network" if a request fails. Rejects with an AbortError if `signal` aborts.
     */
    async upload({ dataset, table, partitions, file, onProgress, signal, contentType }) {
      if (!(file instanceof File)) {
        throw new I6Error("file must be a single File.", { code: "invalid_argument" });
      }
      signal?.throwIfAborted();
      const { ingestId, url } = await this.#getUrl({ dataset, table, partitions });
      signal?.throwIfAborted();
      await this.#put(url, file, { onProgress, signal, contentType });
      return { ingestId };
    }
    /**
     * Gets one signed PUT URL from the ingestz-get-url API.
     * @private
     * @param {GetUrlParams} params - Parameters for requesting the upload URL.
     * @returns {Promise<{ingestId: string, url: string}>} The ingest id and the signed PUT URL.
     * @throws {I6Error} If the request fails or no upload URL is returned.
     */
    async #getUrl({ dataset, table, partitions }) {
      const resp = await ingestzGetUrl(this._services, {
        params: { dataset },
        payload: { table, partitions, amount: 1 }
      });
      if (!resp.ok) {
        throw I6Error.fromResult("Get upload URL failed", resp);
      }
      const uploads = resp.payload?.uploads;
      if (!uploads?.[0]) {
        throw new I6Error("Get upload URL returned no upload URL.", { code: "no_upload_url" });
      }
      return { ingestId: resp.payload.ingest_id, url: uploads[0] };
    }
    /**
     * Uploads a file to a signed PUT URL using XMLHttpRequest (fetch has no upload progress).
     * @private
     * @param {string} signedPutUrl - The signed URL to PUT the file to.
     * @param {File} file - The file to upload.
     * @param {Pick<UploadParams, "onProgress"|"signal"|"contentType">} opts
     * @returns {Promise<void>} Resolves on a successful upload, rejects on network or HTTP error or abort.
     */
    #put(signedPutUrl, file, { onProgress, signal, contentType }) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const abort = () => xhr.abort();
        const abortError = () => signal?.reason ?? new DOMException("Upload aborted.", "AbortError");
        const done = (fn, arg) => {
          signal?.removeEventListener("abort", abort);
          fn(arg);
        };
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            done(resolve);
          } else {
            done(reject, new I6Error(`Upload failed with status ${xhr.status}`, {
              code: "http",
              status: xhr.status,
              body: xhr.responseText
            }));
          }
        });
        xhr.addEventListener("error", () => {
          done(reject, new I6Error("Network error occurred during upload.", { code: "network" }));
        });
        xhr.addEventListener("abort", () => {
          done(reject, abortError());
        });
        if (onProgress) {
          xhr.upload.addEventListener("progress", (e) => {
            const total = e.lengthComputable ? e.total : file.size;
            onProgress({
              loaded: e.loaded,
              total,
              percent: total > 0 ? e.loaded / total * 100 : 100
            });
          });
        }
        xhr.open("PUT", signedPutUrl, true);
        if (contentType) {
          xhr.setRequestHeader("Content-Type", contentType);
        }
        signal?.addEventListener("abort", abort, { once: true });
        xhr.send(file);
      });
    }
  };

  // src/pipe/pipe.js
  var Pipe = class {
    /**
     * Constructs a Pipe client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services) {
      this._services = services;
    }
    /**
     * Starts a pipe (pipez-start API).
     * @param {StartParams} params - Start parameters.
     * @returns {Promise<StartResult>} The id of the started run.
     * @throws {I6Error} If the request fails.
     */
    async start({ dataset, pipename, params = [], solutionDomain }) {
      const resp = await pipezStart(this._services, {
        params: { dataset },
        payload: { pipename, params, solution_domain: solutionDomain }
      });
      if (!resp.ok) {
        throw I6Error.fromResult("Start pipe failed", resp);
      }
      return { id: resp.payload.id };
    }
  };

  // src/dataset/dataset.js
  var Dataset = class {
    /**
     * Constructs a Dataset client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services) {
      this._services = services;
    }
    /**
     * Selects the solution domain of a dataset (dsz-domain-select API).
     * @param {SelectDomainParams} params - Selection parameters.
     * @returns {Promise<void>} Resolves when the domain is selected.
     * @throws {I6Error} If the request fails.
     */
    async selectDomain({ dataset, domain, solution, store }) {
      const resp = await dszDomainSelect(this._services, {
        params: { dataset },
        payload: { domain, solution, store }
      });
      if (!resp.ok) {
        throw I6Error.fromResult("Select domain failed", resp);
      }
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
    /**
     * Creates and returns a Pipe service instance.
     * @returns {Pipe} An instance of the Pipe client.
     */
    pipe() {
      const ret = new Pipe(this);
      if (ret.prepare) {
        ret.prepare();
      }
      return ret;
    }
    /**
     * Creates and returns a Dataset service instance.
     * @returns {Dataset} An instance of the Dataset client.
     */
    dataset() {
      const ret = new Dataset(this);
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
     * Returns a Pipe service instance.
     * @returns {Pipe} An instance of the Pipe client.
     */
    pipe() {
      return this._service.pipe();
    }
    /**
     * Returns a Dataset service instance.
     * @returns {Dataset} An instance of the Dataset client.
     */
    dataset() {
      return this._service.dataset();
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
  I6Sdk.I6Error = I6Error;
  window.I6Sdk = I6Sdk;
})();
//# sourceMappingURL=i6sdk-web.js.map
