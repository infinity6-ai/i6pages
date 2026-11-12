import * as b64 from "../internal/b64/b64.js";
import * as gzip from "../internal/gzip/gzip.js";
function codeFromStatus(status) {
  if (status === 401) return "unauthenticated";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status >= 500) return "unavailable";
  return "bad_request";
}
function apiErrorFromResponse(status, text) {
  return { status, code: codeFromStatus(status), message: text || `HTTP ${status}`, cause: text };
}
class Resp {
  #parser;
  #parsed = false;
  #value = null;
  #text = null;
  /**
   * @param {number} status - HTTP status code.
   * @param {Headers} headers - HTTP response headers.
   * @param {() => *} parser - Lazy parser function.
   * @param {string} [text] - Raw response body text.
   */
  constructor(status, headers, parser, text = "") {
    this.status = status;
    this.headers = headers;
    this.ok = this.status >= 200 && this.status < 300;
    this.#parser = parser;
    this.#text = text;
  }
  /**
   * Raw body text of the response.
   * @returns {string}
   */
  get text() {
    return this.#text;
  }
  /**
   * Structured error information when response is not ok.
   * @returns {{status: number, code: string, message: string, cause: *}|null}
   */
  get error() {
    if (!this.ok) {
      return apiErrorFromResponse(this.status, this.#text);
    }
    return null;
  }
  /**
   * Parses and returns the deserialized response value.
   * Throws an error if deserialization fails or if the response status is not ok.
   * @returns {T}
   */
  parse() {
    if (!this.#parsed) {
      this.#value = this.#parser();
      this.#parsed = true;
    }
    return this.#value;
  }
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
   * @param {{tokenTypes: string, url: string}} opts
   * @return {{token:string, required: boolean}}
   */
  async resolveToken(opts) {
    let ret = { required: false, token: "" };
    if (!opts.tokenTypes) {
      return ret;
    }
    ret.required = true;
    const tokenTypes = opts.tokenTypes.split("|");
    for (const tokenType of tokenTypes) {
      if (!tokenType) continue;
      if (tokenType === "none") {
        return { required: false, token: "" };
      }
      if (tokenType === "user") {
        ret.token = await this._services.tokens().getValidAccessToken();
      } else if (tokenType === "dataset") {
        const url = new URL(opts.url);
        const parts = url.pathname.split("/");
        if (parts[0] === "") parts.shift();
        if (parts[2] !== "dataset") {
          return ret;
        }
        const dataset = parts[3];
        if (dataset) {
          ret.token = await this._services.tokens().getValidDatasetAccessToken(dataset);
        }
      }
      if (ret.token) {
        return ret;
      }
    }
    return ret;
  }
  /**
   * Sends an HTTP request using the Fetch API.
   *
   * @param {InvokeOptions} opts - Request options including path/URL, query params, and fetch options.
   * @returns {Promise<Response>} A promise that resolves to the fetch Response.
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
    const bearerToken = opts.opts?.bearerToken;
    if (!opts.headers.has("Authorization") && bearerToken) {
      opts.headers.set("Authorization", "Bearer " + bearerToken);
    }
    if (!opts.headers.has("Authorization") && opts.opts?.labels?.token_types) {
      const tk = await this.resolveToken({
        tokenTypes: opts.opts.labels.token_types,
        url: opts.url
      });
      if (tk.token) {
        opts.headers.set("Authorization", "Bearer " + tk.token);
      } else if (tk.required) {
        const types = opts.opts.labels.token_types.split("|");
        if (types.includes("user")) {
          return new Response(JSON.stringify({ error: "Unauthorized", message: "Unauthorized" }), { status: 401, statusText: "Unauthorized" });
        }
        return new Response(JSON.stringify({ error: "Forbidden", message: "Forbidden" }), { status: 403, statusText: "Forbidden" });
      }
    }
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
   * Resolves with a `Resp` instance holding the HTTP status, headers, and lazy `parse()`.
   * Network errors bubble up directly as native exceptions.
   * @template T
   * @param {InvokeOptions} opts - Same as `invoke`.
   * @returns {Promise<Resp<T>>}
   */
  async invokeResult(opts) {
    const resp = await this.invoke(opts);
    const text = resp.status === 204 ? "" : await resp.text();
    const parser = () => {
      if (!resp.ok) {
        const apiErr = apiErrorFromResponse(resp.status, text);
        const err = new Error(apiErr.message);
        err.status = apiErr.status;
        err.code = apiErr.code;
        err.cause = apiErr.cause;
        throw err;
      }
      if (!text) {
        return null;
      }
      return JSON.parse(text);
    };
    return new Resp(resp.status, resp.headers, parser, text);
  }
}
export { Invoker, Resp };
