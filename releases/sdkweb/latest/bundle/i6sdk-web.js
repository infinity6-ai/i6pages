(() => {
  // src/ingestz/ingestz.js
  var Ingestz = class {
    /**
     * @param {Object} config
     * @param {string} config.baseUrl - Default base URL of the ingestz server.
     */
    constructor(config) {
      this._config = config;
    }
    /**
     * Asks ingestz for a signed upload URL (ingestz-get-url API) and uploads a single file to it.
     * @param {Object} params
     * @param {string} [params.baseUrl] - Base URL of the ingestz server. Defaults to the SDK config one.
     * @param {string} params.dataset - Dataset the file is ingested into.
     * @param {string} params.table - Inbox table name.
     * @param {Object<string, string>} params.partitions - Values for the table partitions, except the ingest id one.
     * @param {HTMLInputElement} params.inputfile - A single file input element.
     * @returns {Promise<void>} Resolves on a successful upload, rejects otherwise.
     */
    async upload({ baseUrl = this._config.baseUrl, dataset, table, partitions, inputfile }) {
      const file = inputfile.files?.[0];
      if (!file) {
        throw new Error("No file selected.");
      }
      const signedPutUrl = await this.#getUrl({ baseUrl, dataset, table, partitions });
      await this.#put(signedPutUrl, file);
    }
    /**
     * Gets one signed PUT URL from the ingestz-get-url API.
     * @param {Object} params
     * @param {string} params.baseUrl
     * @param {string} params.dataset
     * @param {string} params.table
     * @param {Object<string, string>} params.partitions
     * @returns {Promise<string>}
     */
    async #getUrl({ baseUrl, dataset, table, partitions }) {
      const url = `${baseUrl}/api/ingest/get-url/dataset/${encodeURIComponent(dataset)}`;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, partitions, amount: 1 })
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
     * @param {string} signedPutUrl
     * @param {File} file
     * @returns {Promise<void>}
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

  // src/index.js
  var DEFAULT_BASE_URL = "https://decsuite.sandbox.rs.infinity6.ai";
  var I6Sdk = class {
    _config = {
      baseUrl: DEFAULT_BASE_URL
    };
    /**
     * @param {Object} [config]
     * @param {string} [config.baseUrl] - Base URL of the i6 server. Defaults to the sandbox one.
     */
    constructor(config) {
      if (config) {
        this.config(config);
      }
    }
    /**
     * @param {Object} config
     * @param {string} [config.baseUrl] - Base URL of the i6 server. Defaults to the sandbox one.
     */
    config(config) {
      if (!config) {
        throw new Error("SDK configuration is missing.");
      }
      this._config = {
        baseUrl: config.baseUrl ?? DEFAULT_BASE_URL
      };
    }
    hello() {
      return "Hello from i6sdk-web!";
    }
    async ingestz() {
      return new Ingestz(this._config);
    }
  };
  window.I6Sdk = I6Sdk;
})();
//# sourceMappingURL=i6sdk-web.js.map
