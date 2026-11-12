import { apiErrorFromResponse, apiErrorFromNetwork } from "../errors.js";
import * as b64 from "../internal/b64/b64.js";
import * as gzip from "../internal/gzip/gzip.js";
function getValue(obj, path) {
  return path.split(".").reduce((currentObject, key) => {
    return currentObject ? currentObject[key] : void 0;
  }, obj);
}
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
   * Credentials are always set to "include" so the session cookie is sent. Note that `opts`
   * is modified (credentials, and headers/body when `json` is given). An HTTP error status
   * does not throw; check `ok` on the returned Response.
   * @returns {Promise<Response>} A promise that resolves to the fetch Response.
   * @throws {TypeError} If the network request fails (from fetch).
   */
  async invoke(opts) {
    opts.url = opts.url || `${this._services.config().baseUrl}/${opts.path}`;
    if (opts.query) {
      const search = new URLSearchParams();
      for (const [key, value] of Object.entries(opts.query)) {
        if (value === void 0 || value === null) {
          continue;
        }
        for (const item of Array.isArray(value) ? value : [value]) {
          const serializedValue = typeof item === "object" && item !== null ? JSON.stringify(item) : String(item);
          search.append(key, serializedValue);
        }
      }
      const queryString = search.toString();
      if (queryString) {
        opts.url = opts.url + (opts.url.includes("?") ? "&" : "?") + queryString;
      }
    }
    opts.headers = new Headers(opts.headers);
    const datasetToken = opts.opts?.datasetToken || this._services.config().datasetToken;
    const bearerToken = opts.opts?.bearerToken || this._services.config().bearerToken || (typeof sessionStorage !== "undefined" ? sessionStorage.getItem("i6_user_access_token") : null);
    if (!opts.headers.has("Authorization") && datasetToken) {
      opts.headers.set("Authorization", "Dataset " + datasetToken);
    }
    if (!opts.headers.has("Authorization") && bearerToken) {
      opts.headers.set("Authorization", "Bearer " + bearerToken);
    }
    if (!opts.headers.has("Authorization")) {
      const url = new URL(opts.url);
      const split = url.pathname.split("/");
      const idx = split.indexOf("dataset");
      let token = "";
      if (idx < 0) {
        token = await this._services.tokens().getValidAccessToken();
      } else {
        const dataset = split[idx + 1];
        token = await this._services.tokens().getValidDatasetAccessToken(dataset);
      }
      if (token) {
        opts.headers.set("Authorization", "Bearer " + token);
      }
    }
    console.log(opts);
    if (opts.json) {
      opts.headers.set("Content-Type", "application/json");
      opts.body = JSON.stringify(opts.json);
    }
    opts.credentials = "include";
    if (opts.opts?.prepareRequest) {
      await opts.opts.prepareRequest(opts);
    }
    if (opts.opts?.fetcher) {
      return opts.opts.fetcher(opts.url, opts);
    }
    return fetch(opts.url, opts);
  }
  /**
   * Like `invoke`, but never throws: resolves with `{status, ok, <key>}` on success and with
   * `{status, ok: false, error}` (see `I6ApiError`) on an HTTP error or a network failure.
   * A success with status 204 or an empty body resolves with `{status, ok: true}` and no `<key>`.
   * @param {InvokeOptions} opts - Same as `invoke`.
   * @param {"payload"|"body"} [key] - Where the parsed JSON of a success is put.
   * @returns {Promise<{status: number, ok: boolean, error?: import("../errors.js").I6ApiError} & Record<string, any>>}
   */
  async invokeResult(opts, key = "payload") {
    let resp;
    try {
      resp = await this.invoke(opts);
    } catch (cause) {
      return { status: 0, ok: false, error: apiErrorFromNetwork(cause) };
    }
    const result = { status: resp.status, ok: resp.ok };
    try {
      if (resp.ok) {
        const text = resp.status === 204 ? "" : await resp.text();
        if (text) {
          result[key] = JSON.parse(text);
        }
      } else {
        result.error = apiErrorFromResponse(resp.status, await resp.text());
      }
    } catch (cause) {
      result.ok = false;
      result.error = apiErrorFromNetwork(cause);
    }
    return result;
  }
}
export { Invoker };
