/**
 * @fileoverview HTTP client for sending API requests to i6 services.
 */
export type Services = import("../services/services.js").Services;
export type Fetcher = (url: string, opts: InvokeOptions) => Promise<Response>;
export type PrepareRequest = (opts: InvokeOptions) => Promise<void> | void;
export type ServiceOptions = {
    /**
     * - Custom fetcher function override.
     */
    fetcher?: Fetcher;
    /**
     * - Pre-request hook (e.g. for URL signing).
     */
    prepareRequest?: PrepareRequest;
    /**
     * - Explicit user bearer token for this request.
     */
    bearerToken?: string;
    /**
     * - Contextual metadata labels.
     */
    labels?: Record<string, string>;
};
export type InvokeOptions = {
    /**
     * - Full target URL. Overrides baseUrl + path if set.
     */
    url?: string;
    /**
     * - Path appended to baseUrl (e.g. "api/item/create").
     */
    path?: string;
    /**
     * - HTTP method ("GET", "POST", "PUT", etc.).
     */
    method?: string;
    /**
     * - Query parameters serialized into the URL.
     */
    query?: Record<string, any>;
    /**
     * - Body data serialized as JSON. Sets "Content-Type: application/json".
     */
    json?: any;
    /**
     * - Additional HTTP headers.
     */
    headers?: HeadersInit;
    /**
     * - Advanced service request hooks (fetcher, prepareRequest, etc.).
     */
    opts?: ServiceOptions;
    /**
     * - Fetch credentials mode.
     */
    credentials?: RequestCredentials;
};
/**
 * Response wrapper holding HTTP transport status and lazy parser.
 * @template T
 */
declare class Resp<T> {
    #private;
    status: number;
    headers: Headers;
    ok: boolean;
    /**
     * @param {number} status - HTTP status code.
     * @param {Headers} headers - HTTP response headers.
     * @param {() => *} parser - Lazy parser function.
     * @param {string} [text] - Raw response body text.
     */
    constructor(status: number, headers: Headers, parser: () => any, text?: string);
    /**
     * Raw body text of the response.
     * @returns {string}
     */
    get text(): string;
    /**
     * Structured error information when response is not ok.
     * @returns {{status: number, code: string, message: string, cause: *}|null}
     */
    get error(): {
        status: number;
        code: string;
        message: string;
        cause: any;
    } | null;
    /**
     * Parses and returns the deserialized response value.
     * Throws an error if deserialization fails or if the response status is not ok.
     * @returns {T}
     */
    parse(): T;
}
/**
 * Invoker client for executing HTTP requests against the i6 API.
 */
declare class Invoker {
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs an Invoker instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * @param {{tokenTypes: string, url: string}} opts
     * @return {{token:string, required: boolean}}
     */
    resolveToken(opts: {
        tokenTypes: string;
        url: string;
    }): {
        token: string;
        required: boolean;
    };
    /**
     * Sends an HTTP request using the Fetch API.
     *
     * @param {InvokeOptions} opts - Request options including path/URL, query params, and fetch options.
     * @returns {Promise<Response>} A promise that resolves to the fetch Response.
     */
    invoke(opts: InvokeOptions): Promise<Response>;
    /**
     * Resolves with a `Resp` instance holding the HTTP status, headers, and lazy `parse()`.
     * Network errors bubble up directly as native exceptions.
     * @template T
     * @param {InvokeOptions} opts - Same as `invoke`.
     * @returns {Promise<Resp<T>>}
     */
    invokeResult<T>(opts: InvokeOptions): Promise<Resp<T>>;
}
export { Invoker, Resp };
