/**
 * @fileoverview HTTP client for sending API requests to i6 services.
 */
export type Services = import("../services/services.js").Services;
export type Fetcher = (url: string, opts: InvokeOptions) => Promise<Response>;
export type PrepareRequest = (opts: InvokeOptions) => Promise<void> | void;
export type ServiceOptions = {
    /**
     * - [Go: string]
     */
    datasetToken?: string;
    /**
     * - Custom fetch implementation.
     */
    fetcher?: Fetcher;
    /**
     * - Hook to mutate request options before sending (e.g., adding `sig` query parameter).
     */
    prepareRequest?: PrepareRequest;
};
export type InvokeOptions = {
    /**
     * - The full URL to request. If omitted, defaults to `${baseUrl}/${path}`.
     */
    url?: string;
    /**
     * - The path to append to the baseUrl if `url` is not provided.
     */
    path?: string;
    /**
     * - Key-value pairs to append as query parameters.
     */
    query?: Record<string, any>;
    /**
     * - JSON-serializable body data. If provided, sets Content-Type header to application/json and serializes to body.
     */
    json?: any;
    /**
     * - HTTP method (e.g., 'GET', 'POST', 'PUT', 'DELETE').
     */
    method?: string;
    /**
     * - HTTP headers for the request.
     */
    headers?: HeadersInit;
    /**
     * - HTTP request body.
     */
    body?: BodyInit | null;
    /**
     * - Request credentials mode (e.g., 'include', 'same-origin', 'omit').
     */
    credentials?: RequestCredentials;
    /**
     * - Request mode (e.g., 'cors', 'no-cors', 'same-origin').
     */
    mode?: RequestMode;
    /**
     * - An AbortSignal to cancel the request.
     */
    signal?: AbortSignal | null;
    opts?: ServiceOptions;
    sinkable?: boolean;
};
/**
 * @typedef {import("../services/services.js").Services} Services
 */
/**
 * A custom fetch implementation.
 * @typedef {(url: string, opts: InvokeOptions) => Promise<Response>} Fetcher
 */
/**
 * Hook to prepare or mutate request options before the request is sent (e.g., adding `sig` query parameter).
 * @typedef {(opts: InvokeOptions) => Promise<void> | void} PrepareRequest
 */
/**
 * Service options configuring SDK network requests.
 *
 * This is essential when the `DatasetToken` must never be exposed to the browser.
 * There are two main approaches to keep the `DatasetToken` safe on your backend:
 *
 * ---
 * ### Approach 1: Backend Reverse Proxy (Recommended for simplicity)
 * To avoid all signature complexity ("signature hell"), you can simply proxy requests through
 * your own backend server. The browser sends the request to your backend, and your server forwards
 * it to i6 while attaching the `Authorization: Dataset <datasetToken>` header. This also works for
 * all HTTP methods and request bodies without any signing restrictions.
 *
 * Browser Fetcher example:
 * ```js
 * const fetcher = async (url, opts) => {
 *   // Route the request to your own server proxy endpoint
 *   const proxyUrl = url.replace('https://api.i6.ai', '/api/i6-proxy');
 *   return fetch(proxyUrl, opts);
 * };
 * ```
 *
 * Backend server handler example:
 * ```js
 * // Express / Node.js backend
 * app.all('/api/i6-proxy/*', async (req, res) => {
 *   const targetUrl = req.originalUrl.replace('/api/i6-proxy', 'https://api.i6.ai');
 *   const resp = await fetch(targetUrl, {
 *     method: req.method,
 *     headers: {
 *       ...req.headers,
 *       'Authorization': `Dataset ${process.env.I6_DATASET_TOKEN}`,
 *     },
 *     body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
 *   });
 *   res.status(resp.status).send(await resp.text());
 * });
 * ```
 *
 * ---
 * ### Approach 2: URL Signing (Direct browser-to-i6 calls)
 * If you prefer requests to go directly from the browser to i6 (e.g. to offload traffic from your servers),
 * provide a `prepareRequest` hook that calls your backend server to pre-sign the URL before forwarding it to i6.
 *
 * Example:
 * ```js
 * const prepareRequest = async (opts) => {
 *   // Ask your backend to sign the URL
 *   const res = await fetch('/api/sign-i6-url', {
 *     method: 'POST',
 *     body: JSON.stringify({ url: opts.url, method: opts.method })
 *   });
 *   const { sig } = await res.json();
 *   // Append the sig query parameter to opts.url
 *   opts.url += (opts.url.includes('?') ? '&' : '?') + `sig=${encodeURIComponent(sig)}`;
 * };
 * ```
 *
 * #### How the backend signs the URL
 * The `DatasetToken` is a JWT securely stored on your backend. The Ed25519 private key is located inside
 * the JWT payload's `ext.priv_key` field (Base64URL encoded). The public key `jti` is registered in our storage.
 * Signed URLs will work while this specific `jti` is not revoked.
 *
 * Nowadays, we can sign only:
 * - `GET` requests
 * - Path
 * - Expiration timestamp (`exp`)
 * - Allowed open query params
 * - Allowed query params with specific fixed values
 *
 * **Example using `ingestzEventRelevanceFashionEvent`:**
 * The browser sends some fixed values (like `userid`, `sessionid`, `dataset`) and some open values (like `click` or `purchase` inside `payload`).
 *
 * 1. Define your expiration time (`exp`) in ISO8601BasicMillis (e.g., `20261027T150000000Z`).
 * 2. Build the canonical message:
 *    `METHOD\nPATH\nEXP\nOPEN_PARAMS_SORTED_COMMA_SEPARATED\nFIXED_PARAMS_KEY_SORTED_COMMA_SEPARATED`
 *    Note: The values of fixed params are Base64URL-encoded without padding: `key=b64url(value)`.
 *    Example:
 *    ```text
 *    GET
 *    /api/ingest/dataset/my-dataset/event/relevance-fashion-event/text.txt
 *    20261027T150000000Z
 *    payload
 *    dataset=bXktZGF0YXNldA,sessionid=YWJj,userid=MTIz
 *    ```
 * 3. Sign the message bytes with the Ed25519 private key. To make it using openssl (like in `@cryptz/cryptz25519/cryptz25519openssl`):
 *    ```bash
 *    openssl pkeyutl -sign -inkey private_key.pem -rawin -in message.txt -out signature.bin
 *    ```
 * 4. Encode the signature and public key in Base64URL.
 * 5. Append the `sig` query parameter: `?sig=v1.<exp>.<open_params_pipe_separated>.<pub_key>.<signature>`
 *    (e.g., `sig=v1.20261027T150000000Z.payload.PubKeyBase64...SigBase64...`)
 *
 * @typedef {object} ServiceOptions
 * @property {string} [datasetToken] - [Go: string]
 * @property {Fetcher} [fetcher] - Custom fetch implementation.
 * @property {PrepareRequest} [prepareRequest] - Hook to mutate request options before sending (e.g., adding `sig` query parameter).
 */
/**
 * Options for sending HTTP requests via the Invoker.
 * @typedef {Object} InvokeOptions
 * @property {string} [url] - The full URL to request. If omitted, defaults to `${baseUrl}/${path}`.
 * @property {string} [path] - The path to append to the baseUrl if `url` is not provided.
 * @property {Record<string, any>} [query] - Key-value pairs to append as query parameters.
 * @property {*} [json] - JSON-serializable body data. If provided, sets Content-Type header to application/json and serializes to body.
 * @property {string} [method] - HTTP method (e.g., 'GET', 'POST', 'PUT', 'DELETE').
 * @property {HeadersInit} [headers] - HTTP headers for the request.
 * @property {BodyInit|null} [body] - HTTP request body.
 * @property {RequestCredentials} [credentials] - Request credentials mode (e.g., 'include', 'same-origin', 'omit').
 * @property {RequestMode} [mode] - Request mode (e.g., 'cors', 'no-cors', 'same-origin').
 * @property {AbortSignal|null} [signal] - An AbortSignal to cancel the request.
 * @property {ServiceOptions} [opts]
 * @property {boolean} [sinkable]
 */
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
     * Sends an HTTP request using the Fetch API.
     *
     * @param {InvokeOptions} opts - Request options including path/URL, query params, and fetch options.
     * Credentials are always set to "include" so the session cookie is sent. Note that `opts`
     * is modified (credentials, and headers/body when `json` is given). An HTTP error status
     * does not throw; check `ok` on the returned Response.
     * @returns {Promise<Response>} A promise that resolves to the fetch Response.
     * @throws {TypeError} If the network request fails (from fetch).
     */
    invoke(opts: InvokeOptions): Promise<Response>;
    /**
     * Like `invoke`, but never throws: resolves with `{status, ok, <key>}` on success and with
     * `{status, ok: false, error}` (see `I6ApiError`) on an HTTP error or a network failure.
     * A success with status 204 or an empty body resolves with `{status, ok: true}` and no `<key>`.
     * @param {InvokeOptions} opts - Same as `invoke`.
     * @param {"payload"|"body"} [key] - Where the parsed JSON of a success is put.
     * @returns {Promise<{status: number, ok: boolean, error?: import("../errors.js").I6ApiError} & Record<string, any>>}
     */
    invokeResult(opts: InvokeOptions, key?: "payload" | "body"): Promise<{
        status: number;
        ok: boolean;
        error?: import("../errors.js").I6ApiError;
    } & Record<string, any>>;
}
export { Invoker };
/**
 * @fileoverview Main entry point for the i6 Web Legacy SDK.
 */
import { Apis, SdkFuncs } from "./services/services.js";
import { I6Error } from "./errors.js";
export type I6SdkConfig = {
    /**
     * - Base URL of the i6 server. Defaults to the sandbox environment.
     */
    baseUrl?: string;
};
/**
 * Main SDK class providing access to i6 services.
 */
declare class I6Sdk {
    /**
     * @private
     * @type {Services}
     */
    _service;
    /**
     * Constructs an instance of the i6 SDK.
     * @param {I6SdkConfig} [config] - Configuration options for the SDK.
     */
    constructor(config?: I6SdkConfig);
    /**
     * Returns a copy of the configuration the SDK is running with.
     * @returns {I6SdkConfig} The current configuration.
     */
    config(): I6SdkConfig;
    /**
     * Overwrites the given keys of the configuration; the other keys are kept.
     * Can be called at any time, the next call of the SDK uses the new values.
     * @param {Partial<I6SdkConfig>} config - The keys to overwrite.
     * @returns {void}
     */
    setConfig(config: Partial<I6SdkConfig>): void;
    /**
     * Returns an Ingest service instance.
     * @returns {Ingest} An instance of the Ingest client.
     */
    ingest(): Ingest;
    /**
     * Returns an Infer service instance, which runs an i6 model in the browser and returns the result.
     * @returns {Infer} An instance of the Infer client.
     */
    infer(): Infer;
    /**
     * Returns a Dash service instance, which queries an i6 dash in the browser and returns the result.
     * @returns {Dash} An instance of the Dash client.
     */
    dash(): Dash;
    /**
     * Returns an Auth service instance.
     * @returns {Auth} An instance of the Auth client.
     */
    auth(): Auth;
    /**
     * Returns the Apis service instance, one typed method per i6 server API.
     * Each call resolves with `{status, ok, payload?, error?}` and does not throw on an HTTP error.
     * @returns {Apis} An instance of the generated Apis client.
     */
    apis(): Apis;
    /**
     * Returns the Funcs service instance.
     * @returns {SdkFuncs} An instance of the generated Apis client.
     */
    funcs(): SdkFuncs;
    /**
     * Registers an event listener on the SDK's internal event dispatcher (an EventTarget).
     * @param {string} evt - The event type or name to listen for.
     * @param {EventListenerOrEventListenerObject|Function} fn - The callback function or event listener object invoked when the event occurs.
     * @returns {void}
     */
    bind(evt: string, fn: EventListenerOrEventListenerObject | Function): void;
}
declare namespace I6Sdk {
    export { I6Error };
}
export { I6Sdk, I6Error };
/**
 * @fileoverview Ingest client for uploading files to the ingestion service.
 */
export type Services = import("../services/services.js").Services;
export type ServiceOptions = import("../invoker/invoker.js").ServiceOptions;
export type Partitions = Record<string, string>;
export type GetUrlParams = {
    /**
     * - Dataset name.
     */
    dataset: string;
    /**
     * - Inbox table name.
     */
    table: string;
    /**
     * - Values for the table partitions, except the ingest id one.
     */
    partitions: Partitions;
    /**
     * - Given to the ingestz-get-url API call.
     */
    serviceOpts?: ServiceOptions;
};
export type UploadProgress = {
    /**
     * - Bytes sent so far.
     */
    loaded: number;
    /**
     * - Total bytes to send (the file size when the browser can't tell).
     */
    total: number;
    /**
     * - Progress from 0 to 100.
     */
    percent: number;
};
export type UploadParams = {
    /**
     * - Dataset the file is ingested into.
     */
    dataset: string;
    /**
     * - Inbox table name.
     */
    table: string;
    /**
     * - Values for the table partitions, except the ingest id one.
     */
    partitions: Partitions;
    /**
     * - The single file to upload.
     */
    file: File;
    /**
     * - Called as the file is sent.
     */
    onProgress?: (progress: UploadProgress) => void;
    /**
     * - Aborts the upload; the promise then rejects with the signal's reason (an AbortError by default).
     */
    signal?: AbortSignal;
    /**
     * - Content-Type of the PUT. Defaults to the file's own type.
     */
    contentType?: string;
    /**
     * - Given to the ingestz-get-url API call (the PUT to the signed URL needs none).
     */
    serviceOpts?: ServiceOptions;
};
export type UploadResult = {
    /**
     * - Id the server assigned to this ingest.
     */
    ingestId: string;
};
/**
 * @typedef {import("../services/services.js").Services} Services
 * @typedef {import("../invoker/invoker.js").ServiceOptions} ServiceOptions
 */
/**
 * Key-value mapping representing dataset table partition values, except the ingest ID.
 * @typedef {Record<string, string>} Partitions
 */
/**
 * Parameters for requesting a signed upload URL from the ingest service.
 * @typedef {Object} GetUrlParams
 * @property {string} dataset - Dataset name.
 * @property {string} table - Inbox table name.
 * @property {Partitions} partitions - Values for the table partitions, except the ingest id one.
 * @property {ServiceOptions} [serviceOpts] - Given to the ingestz-get-url API call.
 */
/**
 * Progress of an upload in flight.
 * @typedef {Object} UploadProgress
 * @property {number} loaded - Bytes sent so far.
 * @property {number} total - Total bytes to send (the file size when the browser can't tell).
 * @property {number} percent - Progress from 0 to 100.
 */
/**
 * Parameters for uploading a single file to the ingest service.
 * @typedef {Object} UploadParams
 * @property {string} dataset - Dataset the file is ingested into.
 * @property {string} table - Inbox table name.
 * @property {Partitions} partitions - Values for the table partitions, except the ingest id one.
 * @property {File} file - The single file to upload.
 * @property {(progress: UploadProgress) => void} [onProgress] - Called as the file is sent.
 * @property {AbortSignal} [signal] - Aborts the upload; the promise then rejects with the signal's reason (an AbortError by default).
 * @property {string} [contentType] - Content-Type of the PUT. Defaults to the file's own type.
 * @property {ServiceOptions} [serviceOpts] - Given to the ingestz-get-url API call (the PUT to the signed URL needs none).
 */
/**
 * Result of a successful upload.
 * @typedef {Object} UploadResult
 * @property {string} ingestId - Id the server assigned to this ingest.
 */
/**
 * Client for handling file uploads to the ingest service.
 */
declare class Ingest {
    #private;
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs an Ingest client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * Asks ingestz for a signed upload URL (ingestz-get-url API) and uploads a single file to it.
     * @param {UploadParams} params - Upload parameters.
     * @returns {Promise<UploadResult>} Resolves with the ingest id on a successful upload.
     * @throws {I6Error} With code "invalid_argument" if file is not a single File, "http" or
     *   "network" if a request fails. Rejects with an AbortError if `signal` aborts.
     */
    upload({ dataset, table, partitions, file, onProgress, signal, contentType, serviceOpts }: UploadParams): Promise<UploadResult>;
    /**
     * Gets one signed PUT URL from the ingestz-get-url API.
     * @private
     * @param {GetUrlParams} params - Parameters for requesting the upload URL.
     * @returns {Promise<{ingestId: string, url: string}>} The ingest id and the signed PUT URL.
     * @throws {I6Error} If the request fails or no upload URL is returned.
     */
    private #getUrl;
    /**
     * Uploads a file to a signed PUT URL using XMLHttpRequest (fetch has no upload progress).
     * @private
     * @param {string} signedPutUrl - The signed URL to PUT the file to.
     * @param {File} file - The file to upload.
     * @param {Pick<UploadParams, "onProgress"|"signal"|"contentType">} opts
     * @returns {Promise<void>} Resolves on a successful upload, rejects on network or HTTP error or abort.
     */
    private #put;
}
export { Ingest };
/**
 * @fileoverview Error types thrown by the i6 Web Legacy SDK.
 */
export type I6ErrorCode = "http" | "network" | "invalid_argument" | "no_upload_url" | "asset" | "model" | "query";
export type I6ApiErrorCode = "unauthenticated" | "forbidden" | "not_found" | "bad_request" | "unavailable" | "network";
export type I6ApiError = {
    /**
     * - HTTP status; 0 when the server did not answer (network failure).
     */
    status: number;
    /**
     * - Failure kind, from the status: 401 "unauthenticated" (session expired),
     * 403 "forbidden" (no permission), 404 "not_found" (no data), other 4xx "bad_request", 5xx "unavailable".
     */
    code: I6ApiErrorCode;
    /**
     * - The server response text as is (e.g. the Stripe reason), or "HTTP <status>" if empty.
     */
    message: string;
    /**
     * - The raw response text, or the underlying error on a network failure.
     */
    cause?: any;
};
export type I6Result<R> = ({
    status: number;
    ok: true;
    body?: any;
} & R) | {
    status: number;
    ok: false;
    error: I6ApiError;
};
/**
 * @typedef {"http"|"network"|"invalid_argument"|"no_upload_url"|"asset"|"model"|"query"} I6ErrorCode
 */
/**
 * Why an API call failed, derived from the HTTP status alone; the server message is never parsed.
 * @typedef {"unauthenticated"|"forbidden"|"not_found"|"bad_request"|"unavailable"|"network"} I6ApiErrorCode
 */
/**
 * Error of an API call that did not succeed, as returned in `I6Result.error`.
 * @typedef {Object} I6ApiError
 * @property {number} status - HTTP status; 0 when the server did not answer (network failure).
 * @property {I6ApiErrorCode} code - Failure kind, from the status: 401 "unauthenticated" (session expired),
 *   403 "forbidden" (no permission), 404 "not_found" (no data), other 4xx "bad_request", 5xx "unavailable".
 * @property {string} message - The server response text as is (e.g. the Stripe reason), or "HTTP <status>" if empty.
 * @property {*} [cause] - The raw response text, or the underlying error on a network failure.
 */
/**
 * What every generated API call resolves with; it does not throw on an HTTP error or a network failure.
 * Check `ok` to tell the two shapes apart. `body` is the parsed JSON of an API that has no declared payload.
 * @template R - The generated response type of the API (`{payload}`).
 * @typedef {({status: number, ok: true, body?: *} & R) | {status: number, ok: false, error: I6ApiError}} I6Result
 */
/**
 * Error thrown by the SDK when a call fails.
 *
 * `code` tells what kind of failure it was, so callers can branch on it instead of parsing
 * the message. `status` and `body` are set for `"http"` failures. `"asset"` failures also have `status`
 * when a file download was answered with an error (404: the file does not exist), and always `cause`.
 */
declare class I6Error extends Error {
    /** @type {I6ErrorCode|undefined} */
    code: I6ErrorCode | undefined;
    /** @type {number|undefined} */
    status: number | undefined;
    /** @type {*} */
    body: any;
    /**
     * @param {string} message - Human readable description.
     * @param {Object} [details]
     * @param {I6ErrorCode} [details.code] - Failure kind. Defaults to "http" when a status is given.
     * @param {number} [details.status] - HTTP status code, when the server answered.
     * @param {*} [details.body] - Error body of the response (parsed JSON, or raw text).
     * @param {*} [details.cause] - The underlying error, if any.
     */
    constructor(message: string, { code, status, body, cause }?: {
        code?: I6ErrorCode;
        status?: number;
        body?: any;
        cause?: any;
    });
    /**
     * Builds an "http" error from a failed generated-client result ({status, error}).
     * @param {string} message
     * @param {{status: number, error?: *}} result
     * @returns {I6Error}
     */
    static fromResult(message: string, result: {
        status: number;
        error?: any;
    }): I6Error;
}
/**
 * Builds the error of a failed HTTP response, keeping the server text untouched.
 * @param {number} status - HTTP status.
 * @param {string} text - Response body as text.
 * @returns {I6ApiError}
 */
declare function apiErrorFromResponse(status: number, text: string): I6ApiError;
/**
 * Builds the error of a request that got no answer.
 * @param {*} cause - The error thrown by fetch.
 * @returns {I6ApiError}
 */
declare function apiErrorFromNetwork(cause: any): I6ApiError;
export { I6Error, apiErrorFromResponse, apiErrorFromNetwork };
/**
 * @typedef {import("../services/services.js").Services} Services
 */
export type Services = import("../services/services.js").Services;
export type ServiceOptions = import("../invoker/invoker.js").ServiceOptions;
export type i6JsonEmbedded<T> = T;
export type apiDszCreateIngestionTokenParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszCreateIngestionTokenReq = {
    params: apiDszCreateIngestionTokenParams;
    payload: apiDszCreateIngestionTokenReqPayload;
};
export type apiDszCreateIngestionTokenReqPayload = {
    /**
     * - [Go: string]
     */
    annotation: string;
};
export type apiDszCreateIngestionTokenResp = {
    payload: apiDszCreateIngestionTokenRespPayload;
};
export type apiDszCreateIngestionTokenRespPayload = {
    /**
     * - [Go: string]
     */
    annotation: string;
    /**
     * - [Go: string]
     */
    audience: string;
    /**
     * - [Go: string]
     */
    channel: string;
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    /**
     * - [Go: int64]
     */
    expiration_date: number;
    grants: Array<apiDszCreateIngestionTokenRespPayloadGrantsElement>;
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: string]
     */
    jti: string;
    /**
     * - [Go: string]
     */
    token: string;
};
export type apiDszCreateIngestionTokenRespPayloadGrantsElement = string;
export type apiDszCreateRecsysTokenParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszCreateRecsysTokenReq = {
    params: apiDszCreateRecsysTokenParams;
    payload: apiDszCreateRecsysTokenReqPayload;
};
export type apiDszCreateRecsysTokenReqPayload = {
    /**
     * - [Go: string]
     */
    annotation: string;
    /**
     * - [Go: string]
     */
    channel: string;
};
export type apiDszCreateRecsysTokenResp = {
    payload: apiDszCreateRecsysTokenRespPayload;
};
export type apiDszCreateRecsysTokenRespPayload = {
    /**
     * - [Go: string]
     */
    annotation: string;
    /**
     * - [Go: string]
     */
    audience: string;
    /**
     * - [Go: string]
     */
    channel: string;
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    /**
     * - [Go: int64]
     */
    expiration_date: number;
    grants: Array<apiDszCreateRecsysTokenRespPayloadGrantsElement>;
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: string]
     */
    jti: string;
    /**
     * - [Go: string]
     */
    token: string;
};
export type apiDszCreateRecsysTokenRespPayloadGrantsElement = string;
export type apiDszCreateStoreParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszCreateStoreReq = {
    params: apiDszCreateStoreParams;
    payload: apiDszCreateStoreReqPayload;
};
export type apiDszCreateStoreReqPayload = {
    store: apiDszCreateStoreReqPayloadStore;
};
export type apiDszCreateStoreReqPayloadStore = {
    /**
     * - [Go: storeid.StoreId]
     */
    id: string;
    /**
     * - [Go: string]
     */
    name: string;
    solution_domains: Array<apiDszCreateStoreReqPayloadStoreSolutionDomainsElement>;
};
export type apiDszCreateStoreReqPayloadStoreSolutionDomainsElement = string;
export type apiDszCreateStoreResp = object;
export type apiDszDatasetSolutionsParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszDatasetSolutionsReq = {
    params: apiDszDatasetSolutionsParams;
};
export type apiDszDatasetSolutionsResp = {
    payload: apiDszDatasetSolutionsRespPayload;
};
export type apiDszDatasetSolutionsRespPayload = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    solutions: Array<apiDszDatasetSolutionsRespPayloadSolutionsElement>;
};
export type apiDszDatasetSolutionsRespPayloadSolutionsElement = string;
export type apiDszDeleteTokenParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszDeleteTokenQuery = {
    /**
     * - [Go: string]
     */
    token: string;
};
export type apiDszDeleteTokenReq = {
    params: apiDszDeleteTokenParams;
    query: apiDszDeleteTokenQuery;
};
export type apiDszDeleteTokenResp = object;
export type apiDszGetSubscriptionParams = {
    /**
     * - [Go: lakedsz.Dataset] Dataset of the subscription
     */
    dataset: string;
};
export type apiDszGetSubscriptionReq = {
    params: apiDszGetSubscriptionParams;
};
export type apiDszGetSubscriptionResp = {
    payload: apiDszGetSubscriptionRespPayload;
};
export type apiDszGetSubscriptionRespPayload = {
    /**
     * - [Go: time.Time] When the subscription will be or was canceled, in UTC; null when there is no cancellation
     */
    cancel_at: dszTime;
    /**
     * - [Go: time.Time] End of the current period, in UTC
     */
    current_period_end: dszTime;
    /**
     * - [Go: string] Lookup key of the base price in Stripe, like relevance_growth_base_monthly
     */
    plan_key: string;
    /**
     * - [Go: string] Status of the subscription in Stripe, without translation: active, trialing, past_due, unpaid, incomplete, canceled, incomplete_expired or paused
     */
    status: string;
};
export type apiDszListDatasetsQuery = {
    /**
     * - [Go: string]
     */
    user: string;
};
export type apiDszListDatasetsReq = {
    query: apiDszListDatasetsQuery;
};
export type apiDszListDatasetsResp = {
    payload: apiDszListDatasetsRespPayload;
};
export type apiDszListDatasetsRespPayload = {
    datasets: Array<apiDszListDatasetsRespPayloadDatasetsElement>;
};
export type apiDszListDatasetsRespPayloadDatasetsElement = {
    grants: Array<apiDszListDatasetsRespPayloadDatasetsElementGrantsElement>;
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: string]
     */
    name: string;
};
export type apiDszListDatasetsRespPayloadDatasetsElementGrantsElement = string;
export type apiDszListIngestionTokensParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszListIngestionTokensReq = {
    params: apiDszListIngestionTokensParams;
};
export type apiDszListIngestionTokensResp = {
    payload: apiDszListIngestionTokensRespPayload;
};
export type apiDszListIngestionTokensRespPayload = {
    tokens: Array<apiDszListIngestionTokensRespPayloadTokensElement>;
};
export type apiDszListIngestionTokensRespPayloadTokensElement = {
    /**
     * - [Go: string]
     */
    annotation: string;
    /**
     * - [Go: string]
     */
    audience: string;
    /**
     * - [Go: string]
     */
    channel: string;
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    /**
     * - [Go: int64]
     */
    expiration_date: number;
    grants: Array<apiDszListIngestionTokensRespPayloadTokensElementGrantsElement>;
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: string]
     */
    jti: string;
    /**
     * - [Go: string]
     */
    token: string;
};
export type apiDszListIngestionTokensRespPayloadTokensElementGrantsElement = string;
export type apiDszListRecsysTokensParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszListRecsysTokensReq = {
    params: apiDszListRecsysTokensParams;
};
export type apiDszListRecsysTokensResp = {
    payload: apiDszListRecsysTokensRespPayload;
};
export type apiDszListRecsysTokensRespPayload = {
    tokens: Array<apiDszListRecsysTokensRespPayloadTokensElement>;
};
export type apiDszListRecsysTokensRespPayloadTokensElement = {
    /**
     * - [Go: string]
     */
    annotation: string;
    /**
     * - [Go: string]
     */
    audience: string;
    /**
     * - [Go: string]
     */
    channel: string;
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    /**
     * - [Go: int64]
     */
    expiration_date: number;
    grants: Array<apiDszListRecsysTokensRespPayloadTokensElementGrantsElement>;
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: string]
     */
    jti: string;
    /**
     * - [Go: string]
     */
    token: string;
};
export type apiDszListRecsysTokensRespPayloadTokensElementGrantsElement = string;
export type apiDszListStoresParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszListStoresReq = {
    params: apiDszListStoresParams;
};
export type apiDszListStoresResp = {
    payload: apiDszListStoresRespPayload;
};
export type apiDszListStoresRespPayload = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    stores: Array<apiDszListStoresRespPayloadStoresElement>;
};
export type apiDszListStoresRespPayloadStoresElement = {
    /**
     * - [Go: storeid.StoreId]
     */
    id: string;
    /**
     * - [Go: string]
     */
    name: string;
    solution_domains: Array<apiDszListStoresRespPayloadStoresElementSolutionDomainsElement>;
};
export type apiDszListStoresRespPayloadStoresElementSolutionDomainsElement = string;
export type apiDszModelGetParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset to generate signed URLs for.
     */
    dataset: string;
    /**
     * - [Go: string] Model name
     */
    model_name: string;
};
export type apiDszModelGetReq = {
    params: apiDszModelGetParams;
    payload: apiDszModelGetReqPayload;
};
export type apiDszModelGetReqPayload = {
    /**
     * - Model partition key/value pairs
     */
    model_partitions: Record<apiDszModelGetReqPayloadModelPartitionsKey, apiDszModelGetReqPayloadModelPartitionsValue>;
    /**
     * - [Go: string] Model version
     */
    model_version: string;
};
export type apiDszModelGetReqPayloadModelPartitionsKey = string;
export type apiDszModelGetReqPayloadModelPartitionsValue = string;
export type apiDszModelGetResp = {
    payload: apiDszModelGetRespPayload;
};
export type apiDszModelGetRespPayload = {
    /**
     * - Signed URLs
     */
    urls: Array<apiDszModelGetRespPayloadUrlsElement>;
};
export type apiDszModelGetRespPayloadUrlsElement = {
    /**
     * - [Go: string] File Name
     */
    name: string;
    /**
     * - [Go: string] signed URL.
     */
    url: string;
};
export type apiDszResultLastBatchSummaryParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset.
     */
    dataset: string;
};
export type apiDszResultLastBatchSummaryQuery = {
    /**
     * - [Go: storeid.StoreId] Store ID to query.
     */
    store_id: string;
    /**
     * - [Go: laketbnamez.TableName] Table of the batch in question.
     */
    table: string;
};
export type apiDszResultLastBatchSummaryReq = {
    params: apiDszResultLastBatchSummaryParams;
    query: apiDszResultLastBatchSummaryQuery;
};
export type apiDszResultLastBatchSummaryResp = {
    payload: apiDszResultLastBatchSummaryRespPayload;
};
export type apiDszResultLastBatchSummaryRespPayload = {
    /**
     * - Generic table data loaded from the datalake file.
     */
    data: apiDszResultLastBatchSummaryRespPayloadData;
};
export type apiDszResultLastBatchSummaryRespPayloadData = {
    /**
     * - Summaries of distinct and null counts per column.
     */
    column_summaries: Array<apiDszResultLastBatchSummaryRespPayloadDataColumnSummariesElement>;
    /**
     * - [Go: string]
     */
    ingested_at: string;
    /**
     * - [Go: int]
     */
    row_count: number;
    /**
     * - [Go: storeid.StoreId]
     */
    store_id: string;
};
export type apiDszResultLastBatchSummaryRespPayloadDataColumnSummariesElement = {
    /**
     * - [Go: string] Name of the column.
     */
    column_name: string;
    /**
     * - [Go: int] Number of distinct values in the column.
     */
    distinct_count: number;
    /**
     * - [Go: int] Number of null values in the column.
     */
    null_count: number;
};
export type apiDszResultRelevanceFashionCatalogParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset.
     */
    dataset: string;
};
export type apiDszResultRelevanceFashionCatalogQuery = {
    /**
     * - [Go: storeid.StoreId] Store ID to query.
     */
    store_id: string;
};
export type apiDszResultRelevanceFashionCatalogReq = {
    params: apiDszResultRelevanceFashionCatalogParams;
    query: apiDszResultRelevanceFashionCatalogQuery;
};
export type apiDszResultRelevanceFashionCatalogResp = {
    payload: apiDszResultRelevanceFashionCatalogRespPayload;
};
export type apiDszResultRelevanceFashionCatalogRespPayload = {
    /**
     * - Generic table data loaded from the datalake file.
     */
    data: Array<apiDszResultRelevanceFashionCatalogRespPayloadDataElement>;
};
export type apiDszResultRelevanceFashionCatalogRespPayloadDataElement = {
    /**
     * - [Go: string]
     */
    sku_ds: string;
    /**
     * - [Go: string]
     */
    sku_id: string;
    /**
     * - [Go: storeid.StoreId]
     */
    store_id: string;
};
export type apiDszSignedUrlParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset to generate signed URLs for.
     */
    dataset: string;
};
export type apiDszSignedUrlReq = {
    params: apiDszSignedUrlParams;
    payload: apiDszSignedUrlReqPayload;
};
export type apiDszSignedUrlReqPayload = {
    /**
     * - List of paths and HTTP methods to generate signed URLs for.
     */
    paths: Array<apiDszSignedUrlReqPayloadPathsElement>;
};
export type apiDszSignedUrlReqPayloadPathsElement = {
    /**
     * - [Go: fszsignmethod.SignMethod] HTTP method (e.g. GET, PUT) for the signed URL.
     */
    method: string;
    /**
     * - [Go: laketbpathz.Path] File path within the dataset.
     */
    path: string;
};
export type apiDszSignedUrlResp = {
    payload: apiDszSignedUrlRespPayload;
};
export type apiDszSignedUrlRespPayload = {
    /**
     * - Signed URLs
     */
    urls: Array<apiDszSignedUrlRespPayloadUrlsElement>;
};
export type apiDszSignedUrlRespPayloadUrlsElement = {
    /**
     * - [Go: string] signed URL.
     */
    url: string;
};
export type apiDszStoreDisplayCreateParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszStoreDisplayCreateReq = {
    params: apiDszStoreDisplayCreateParams;
    payload: apiDszStoreDisplayCreateReqPayload;
};
export type apiDszStoreDisplayCreateReqPayload = {
    display: apiDszStoreDisplayCreateReqPayloadDisplay;
    /**
     * - [Go: storeid.StoreId]
     */
    store_id: string;
};
export type apiDszStoreDisplayCreateReqPayloadDisplay = {
    /**
     * - [Go: storedisplayid.StoreDisplayId]
     */
    id: string;
    /**
     * - [Go: string]
     */
    model_name: string;
    /**
     * - [Go: string]
     */
    name: string;
};
export type apiDszStoreDisplayCreateResp = {
    payload: apiDszStoreDisplayCreateRespPayload;
};
export type apiDszStoreDisplayCreateRespPayload = {
    display: apiDszStoreDisplayCreateRespPayloadDisplay;
};
export type apiDszStoreDisplayCreateRespPayloadDisplay = {
    /**
     * - [Go: storedisplayid.StoreDisplayId]
     */
    id: string;
    /**
     * - [Go: string]
     */
    name: string;
};
export type apiDszStoreDisplayListParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszStoreDisplayListQuery = {
    /**
     * - [Go: storeid.StoreId]
     */
    store_id: string;
};
export type apiDszStoreDisplayListReq = {
    params: apiDszStoreDisplayListParams;
    query: apiDszStoreDisplayListQuery;
};
export type apiDszStoreDisplayListResp = {
    payload: apiDszStoreDisplayListRespPayload;
};
export type apiDszStoreDisplayListRespPayload = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    displays: Array<apiDszStoreDisplayListRespPayloadDisplaysElement>;
    /**
     * - [Go: storeid.StoreId]
     */
    store_id: string;
};
export type apiDszStoreDisplayListRespPayloadDisplaysElement = {
    /**
     * - [Go: storedisplayid.StoreDisplayId]
     */
    id: string;
    /**
     * - [Go: string]
     */
    name: string;
};
export type apiDszStripeCheckoutReq = {
    payload: apiDszStripeCheckoutReqPayload;
};
export type apiDszStripeCheckoutReqPayload = {
    /**
     * - [Go: string] Base64 state token with the trial days and the metadata of the checkout; the service parses it
     */
    campaign_state: string;
    /**
     * - [Go: string] Url to go after a canceled checkout
     */
    cancel_url: string;
    /**
     * - [Go: string] Dataset name
     */
    dataset_name: string;
    /**
     * - [Go: string] Document of the buyer
     */
    document: string;
    /**
     * - [Go: string] Email of the buyer used in Stripe
     */
    payment_email: string;
    /**
     * - [Go: string] Phone of the buyer
     */
    payment_phone: string;
    /**
     * - [Go: string] Lookup key of the Stripe price of the plan to buy; the service gets the price id from the Stripe prices api
     */
    plan: string;
    /**
     * - [Go: string] Url to go after a successful checkout
     */
    success_url: string;
};
export type apiDszStripeCheckoutResp = {
    payload: apiDszStripeCheckoutRespPayload;
};
export type apiDszStripeCheckoutRespPayload = {
    /**
     * - [Go: lakedsz.Dataset] Dataset that is going to be created after the payment; its id starts with ds
     */
    dataset: string;
    /**
     * - [Go: string] Checkout session id
     */
    id: string;
    /**
     * - [Go: string] Checkout session url
     */
    url: string;
};
export type apiDszTableGetParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset.
     */
    dataset: string;
    /**
     * - [Go: string] Path to the file without schema.
     */
    path: string;
};
export type apiDszTableGetReq = {
    params: apiDszTableGetParams;
};
export type apiDszTableGetResp = {
    headers: apiDszTableGetRespHeaders;
};
export type apiDszTableGetRespHeaders = {
    /**
     * - [Go: string] Redirect URL for the file.
     */
    location: string;
};
export type apiDszTableListParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset to list tables from.
     */
    dataset: string;
};
export type apiDszTableListQuery = {
    /**
     * - [Go: string] Pagination cursor.
     */
    from_cursor: string;
    /**
     * - [Go: int] Limit the number of results.
     */
    limist: number;
    /**
     * - [Go: laketbpathz.Path] Path to list.
     */
    path: string;
    /**
     * - [Go: bool] Whether to list recursively.
     */
    recursive: boolean;
    /**
     * - [Go: fszsignmethod.SignMethod] Whether to return signed URLs.
     */
    sign_method: string;
    /**
     * - [Go: bool] Whether to include file stats.
     */
    stat: boolean;
};
export type apiDszTableListReq = {
    params: apiDszTableListParams;
    query: apiDszTableListQuery;
};
export type apiDszTableListResp = {
    payload: apiDszTableListRespPayload;
};
export type apiDszTableListRespPayload = {
    files: Array<apiDszTableListRespPayloadFilesElement>;
    /**
     * - [Go: string] Cursor for the next page of results.
     */
    next_cursor: string;
};
export type apiDszTableListRespPayloadFilesElement = {
    /**
     * - [Go: laketbpathz.Path] write it
     */
    path: string;
    /**
     * - [Go: string] write it
     */
    signed_url: string;
    /**
     * - [Go: fsz.FileStat] write it
     */
    stat: dszFileStat;
};
export type apiIngestzEventRelevanceFashionCatalogParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset that receives the stream data.
     */
    dataset: string;
};
export type apiIngestzEventRelevanceFashionCatalogQuery = {
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: bool]
     */
    inactive: boolean;
    /**
     * - [Go: string]
     */
    product_id: string;
    /**
     * - [Go: string]
     */
    sku_ds: string;
    /**
     * - [Go: string]
     */
    sku_id: string;
    /**
     * - [Go: string]
     */
    store_id: string;
};
export type apiIngestzEventRelevanceFashionCatalogReq = {
    params: apiIngestzEventRelevanceFashionCatalogParams;
    query: apiIngestzEventRelevanceFashionCatalogQuery;
};
export type apiIngestzEventRelevanceFashionCatalogResp = {
    payload: apiIngestzEventRelevanceFashionCatalogRespPayload;
};
export type apiIngestzEventRelevanceFashionCatalogRespPayload = {
    /**
     * - [Go: int]
     */
    count: number;
};
export type apiIngestzEventRelevanceFashionEventParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset that receives the stream data.
     */
    dataset: string;
};
export type apiIngestzEventRelevanceFashionEventQuery = {
    /**
     * - AddToCart event payload. Mutually exclusive with other payloads.
     */
    add_to_cart: apiIngestzEventRelevanceFashionEventQueryAddToCart;
    /**
     * - Click event payload. Mutually exclusive with other payloads.
     */
    click: apiIngestzEventRelevanceFashionEventQueryClick;
    /**
     * - [Go: time.Time] Timestamp of event creation (required).
     */
    created_at: dszTime;
    /**
     * - [Go: bigquery.NullString] Optional display identifier.
     */
    display_id: string;
    /**
     * - [Go: string] Unique identifier for the event (required).
     */
    id: string;
    /**
     * - Purchase event payload. Mutually exclusive with other payloads.
     */
    purchase: apiIngestzEventRelevanceFashionEventQueryPurchase;
    /**
     * - Recraw event payload. Mutually exclusive with other payloads.
     */
    recraw: apiIngestzEventRelevanceFashionEventQueryRecraw;
    /**
     * - Recshow event payload. Mutually exclusive with other payloads.
     */
    recshow: apiIngestzEventRelevanceFashionEventQueryRecshow;
    /**
     * - RemoveFromCart event payload. Mutually exclusive with other payloads.
     */
    remove_from_cart: apiIngestzEventRelevanceFashionEventQueryRemoveFromCart;
    /**
     * - Search event payload. Mutually exclusive with other payloads.
     */
    search: apiIngestzEventRelevanceFashionEventQuerySearch;
    /**
     * - [Go: string] Identifier of the user session (required).
     */
    session_id: string;
    /**
     * - [Go: string] Identifier of the store (required).
     */
    store_id: string;
    /**
     * - [Go: bigquery.NullString] Optional user identifier.
     */
    user_id: string;
};
export type apiIngestzEventRelevanceFashionEventQueryAddToCart = {
    /**
     * - [Go: float64] Price of the added SKU (non-negative).
     */
    price: number;
    /**
     * - [Go: string] SKU identifier (required).
     */
    sku_id: string;
};
export type apiIngestzEventRelevanceFashionEventQueryClick = {
    /**
     * - [Go: float64] Price of the clicked SKU (non-negative).
     */
    price: number;
    /**
     * - [Go: string] SKU identifier (required).
     */
    sku_id: string;
};
export type apiIngestzEventRelevanceFashionEventQueryPurchase = {
    /**
     * - [Go: string] Order identifier (required).
     */
    order_id: string;
    /**
     * - List of purchased SKUs (must not be empty).
     */
    skus: Array<apiIngestzEventRelevanceFashionEventQueryPurchaseSkusElement>;
};
export type apiIngestzEventRelevanceFashionEventQueryPurchaseSkusElement = {
    /**
     * - [Go: int64] Quantity of the purchased item (must be greater than 0).
     */
    qtty: number;
    /**
     * - [Go: string] SKU identifier (required).
     */
    sku_id: string;
    /**
     * - [Go: float64] Unit price of the item (non-negative).
     */
    unit_price: number;
};
export type apiIngestzEventRelevanceFashionEventQueryRecraw = {
    /**
     * - [Go: string] Model identifier (required).
     */
    model_id: string;
    /**
     * - [Go: string] Model version string.
     */
    model_version: string;
    /**
     * - [Go: string] Raw recommendation payload (required).
     */
    payload: string;
    /**
     * - [Go: string] Recommendation identifier (required).
     */
    rec_id: string;
};
export type apiIngestzEventRelevanceFashionEventQueryRecshow = {
    /**
     * - [Go: string] Model identifier.
     */
    model_id: string;
    /**
     * - [Go: string] Model version string.
     */
    model_version: string;
    /**
     * - [Go: string] Displayed recommendation payload (required).
     */
    payload: string;
    /**
     * - [Go: string] Recommendation identifier (required).
     */
    rec_id: string;
};
export type apiIngestzEventRelevanceFashionEventQueryRemoveFromCart = {
    /**
     * - [Go: float64] Price of the removed SKU (non-negative).
     */
    price: number;
    /**
     * - [Go: string] SKU identifier (required).
     */
    sku_id: string;
};
export type apiIngestzEventRelevanceFashionEventQuerySearch = {
    /**
     * - [Go: string] Search query text (required).
     */
    text: string;
};
export type apiIngestzEventRelevanceFashionEventReq = {
    params: apiIngestzEventRelevanceFashionEventParams;
    query: apiIngestzEventRelevanceFashionEventQuery;
};
export type apiIngestzEventRelevanceFashionEventResp = {
    payload: apiIngestzEventRelevanceFashionEventRespPayload;
};
export type apiIngestzEventRelevanceFashionEventRespPayload = {
    /**
     * - [Go: int]
     */
    count: number;
};
export type apiIngestzGetUrlParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset that receives the uploaded files.
     */
    dataset: string;
};
export type apiIngestzGetUrlReq = {
    params: apiIngestzGetUrlParams;
    payload: apiIngestzGetUrlReqPayload;
};
export type apiIngestzGetUrlReqPayload = {
    /**
     * - [Go: int] Number of presigned upload URLs to generate.
     */
    amount: number;
    /**
     * - Partition key/value pairs that select the table partition the files are ingested into.
     */
    partitions: Record<apiIngestzGetUrlReqPayloadPartitionsKey, apiIngestzGetUrlReqPayloadPartitionsValue>;
    /**
     * - [Go: laketbnamez.TableName] Name of the table, inside the dataset, that receives the uploaded files.
     */
    table: string;
};
export type apiIngestzGetUrlReqPayloadPartitionsKey = string;
export type apiIngestzGetUrlReqPayloadPartitionsValue = string;
export type apiIngestzGetUrlResp = {
    payload: apiIngestzGetUrlRespPayload;
};
export type apiIngestzGetUrlRespPayload = {
    /**
     * - [Go: string] Ingestion token that identifies this ingestion and ties the uploaded files together.
     */
    ingest_id: string;
    /**
     * - Presigned PUT URLs, one per requested file; upload each file to its URL.
     */
    uploads: Array<apiIngestzGetUrlRespPayloadUploadsElement>;
};
export type apiIngestzGetUrlRespPayloadUploadsElement = string;
export type apiIngestzLastBatchSummaryParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset that receives the uploaded files.
     */
    dataset: string;
};
export type apiIngestzLastBatchSummaryQuery = {
    /**
     * - [Go: storeid.StoreId] Store ID associated with the ingestion.
     */
    store_id: string;
    /**
     * - [Go: laketbnamez.TableName] Name of the table inside the dataset.
     */
    table: string;
};
export type apiIngestzLastBatchSummaryReq = {
    params: apiIngestzLastBatchSummaryParams;
    query: apiIngestzLastBatchSummaryQuery;
};
export type apiIngestzLastBatchSummaryResp = {
    payload: apiIngestzLastBatchSummaryRespPayload;
};
export type apiIngestzLastBatchSummaryRespPayload = {
    /**
     * - Summaries of distinct and null counts per column.
     */
    column_summaries: Array<apiIngestzLastBatchSummaryRespPayloadColumnSummariesElement>;
    /**
     * - [Go: string] Timestamp when the batch was successfully ingested.
     */
    ingested_at: string;
    /**
     * - [Go: int] Total number of successfully ingested rows.
     */
    row_count: number;
    /**
     * - [Go: storeid.StoreId] Store ID associated with the ingestion.
     */
    store_id: string;
};
export type apiIngestzLastBatchSummaryRespPayloadColumnSummariesElement = {
    /**
     * - [Go: string] Name of the column.
     */
    column_name: string;
    /**
     * - [Go: int] Number of distinct values in the column.
     */
    distinct_count: number;
    /**
     * - [Go: int] Number of null values in the column.
     */
    null_count: number;
};
export type apiPipezGetParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    /**
     * - [Go: string]
     */
    id: string;
};
export type apiPipezGetReq = {
    params: apiPipezGetParams;
};
export type apiPipezGetResp = {
    payload: apiPipezGetRespPayload;
};
export type apiPipezGetRespPayload = {
    pipeline: apiPipezGetRespPayloadPipeline;
};
export type apiPipezGetRespPayloadPipeline = {
    /**
     * - [Go: string]
     */
    concurrent_id: string;
    /**
     * - [Go: string]
     */
    dataset: string;
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: string]
     */
    name: string;
    /**
     * - [Go: solutiondomain.SolutionDomain]
     */
    solution_domain: string;
    states: Array<apiPipezGetRespPayloadPipelineStatesElement>;
};
export type apiPipezGetRespPayloadPipelineStatesElement = {
    /**
     * - [Go: string]
     */
    created_at: string;
    params: Record<apiPipezGetRespPayloadPipelineStatesElementParamsKey, apiPipezGetRespPayloadPipelineStatesElementParamsValue>;
    /**
     * - [Go: string]
     */
    status: string;
};
export type apiPipezGetRespPayloadPipelineStatesElementParamsKey = string;
export type apiPipezGetRespPayloadPipelineStatesElementParamsValue = any;
export type apiPipezListParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiPipezListQuery = {
    /**
     * - [Go: string]
     */
    cursor: string;
    /**
     * - [Go: int]
     */
    limit: number;
    /**
     * - [Go: string]
     */
    name: string;
    /**
     * - [Go: solutiondomain.SolutionDomain]
     */
    solution_domain: string;
    /**
     * - [Go: string]
     */
    status: string;
};
export type apiPipezListReq = {
    params: apiPipezListParams;
    query: apiPipezListQuery;
};
export type apiPipezListResp = {
    payload: apiPipezListRespPayload;
};
export type apiPipezListRespPayload = {
    /**
     * - [Go: string]
     */
    cursor: string;
    pipelines: Array<apiPipezListRespPayloadPipelinesElement>;
};
export type apiPipezListRespPayloadPipelinesElement = {
    /**
     * - [Go: string]
     */
    concurrent_id: string;
    /**
     * - [Go: string]
     */
    dataset: string;
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: string]
     */
    name: string;
    /**
     * - [Go: solutiondomain.SolutionDomain]
     */
    solution_domain: string;
    states: Array<apiPipezListRespPayloadPipelinesElementStatesElement>;
};
export type apiPipezListRespPayloadPipelinesElementStatesElement = {
    /**
     * - [Go: string]
     */
    created_at: string;
    params: Record<apiPipezListRespPayloadPipelinesElementStatesElementParamsKey, apiPipezListRespPayloadPipelinesElementStatesElementParamsValue>;
    /**
     * - [Go: string]
     */
    status: string;
};
export type apiPipezListRespPayloadPipelinesElementStatesElementParamsKey = string;
export type apiPipezListRespPayloadPipelinesElementStatesElementParamsValue = any;
export type apiPipezStartRelevanceFashionRelevanceFashionBatchIngestParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReq = {
    params: apiPipezStartRelevanceFashionRelevanceFashionBatchIngestParams;
    payload: apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayload;
};
export type apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayload = {
    params: apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayloadParams;
};
export type apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayloadParams = {
    /**
     * - [Go: string]
     */
    ingest_id: string;
    /**
     * - [Go: laketbnamez.TableName]
     */
    table: string;
};
export type apiPipezStartRelevanceFashionRelevanceFashionBatchIngestResp = {
    payload: apiPipezStartRelevanceFashionRelevanceFashionBatchIngestRespPayload;
};
export type apiPipezStartRelevanceFashionRelevanceFashionBatchIngestRespPayload = {
    /**
     * - [Go: string]
     */
    id: string;
};
export type apiPipezStartRelevanceFashionRelevanceFashionMainParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiPipezStartRelevanceFashionRelevanceFashionMainReq = {
    params: apiPipezStartRelevanceFashionRelevanceFashionMainParams;
    payload: apiPipezStartRelevanceFashionRelevanceFashionMainReqPayload;
};
export type apiPipezStartRelevanceFashionRelevanceFashionMainReqPayload = object;
export type apiPipezStartRelevanceFashionRelevanceFashionMainResp = {
    payload: apiPipezStartRelevanceFashionRelevanceFashionMainRespPayload;
};
export type apiPipezStartRelevanceFashionRelevanceFashionMainRespPayload = {
    /**
     * - [Go: string]
     */
    id: string;
};
export type apiSampleFractionParams = {
    /**
     * - [Go: float64] Fraction Denominator
     */
    denominator: number;
    /**
     * - [Go: float64] Fraction Numerator
     */
    numerator: number;
};
export type apiSampleFractionQuery = {
    /**
     * - [Go: int] Fraction max precision
     */
    precision: number;
    smsg: apiSampleFractionQuerySmsg;
};
export type apiSampleFractionQuerySmsg = {
    /**
     * - [Go: string] message string
     */
    message: string;
};
export type apiSampleFractionReq = {
    params: apiSampleFractionParams;
    query: apiSampleFractionQuery;
    headers: apiSampleFractionReqHeaders;
    payload: apiSampleFractionReqPayload;
};
export type apiSampleFractionReqHeaders = {
    /**
     * - [Go: string] Sample of Trace Id
     */
    x_i6_trace_id: string;
};
export type apiSampleFractionReqPayload = {
    messages: Array<apiSampleFractionReqPayloadMessagesElement>;
    /**
     * - [Go: string] Sample reason of this fraction
     */
    reason: string;
};
export type apiSampleFractionReqPayloadMessagesElement = {
    /**
     * - [Go: string] message string
     */
    message: string;
};
export type apiSampleFractionResp = {
    headers: apiSampleFractionRespHeaders;
    payload: apiSampleFractionRespPayload;
};
export type apiSampleFractionRespHeaders = {
    x_i6_smsg: apiSampleFractionRespHeadersXI6Smsg;
    /**
     * - [Go: string] Sample of any trace message
     */
    x_i6_trace_message: string;
};
export type apiSampleFractionRespHeadersXI6Smsg = {
    /**
     * - [Go: string] message string
     */
    message: string;
};
export type apiSampleFractionRespPayload = {
    /**
     * - [Go: string] Human Fraction Representation
     */
    display: string;
    /**
     * - Output Messages
     */
    messages: Array<apiSampleFractionRespPayloadMessagesElement>;
    /**
     * - [Go: string] Fraction Result
     */
    result: string;
};
export type apiSampleFractionRespPayloadMessagesElement = string;
export type dszFileStat = {
    /**
     * - missing summary
     */
    url: string;
    /**
     * - missing summary
     */
    content_type: string;
    /**
     * - missing summary
     */
    md5: string;
    /**
     * - missing summary
     */
    size: string;
    /**
     * - missing summary
     */
    etag: string;
    /**
     * - missing summary
     */
    created_at: dszTime;
    /**
     * - missing summary
     */
    updated_at: dszTime;
};
export type dszTime = string;
export type sdkFuncProductRelevanceFashionDashAttachedRevenueInput = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    params: sdkFuncProductRelevanceFashionDashAttachedRevenueInputParams;
};
export type sdkFuncProductRelevanceFashionDashAttachedRevenueInputParams = {
    /**
     * - [Go: string]
     */
    max_year_month: string;
    /**
     * - [Go: string]
     */
    min_year_month: string;
};
export type sdkFuncProductRelevanceFashionDashAttachedRevenueOutput = {
    rows: Array<sdkFuncProductRelevanceFashionDashAttachedRevenueOutputRowsElement>;
};
export type sdkFuncProductRelevanceFashionDashAttachedRevenueOutputRowsElement = {
    /**
     * - [Go: float64]
     */
    attached_purchases: number;
    /**
     * - [Go: float64]
     */
    attached_revenue: number;
    /**
     * - [Go: float64]
     */
    attached_skus: number;
    /**
     * - [Go: float64]
     */
    avg_ticket: number;
};
export type sdkFuncProductRelevanceFashionDashAttachedRevenuePartitions = {
    /**
     * - [Go: string]
     */
    store_id: string;
};
export type sdkFuncProductRelevanceFashionDashAttachedRevenueReq = {
    input: sdkFuncProductRelevanceFashionDashAttachedRevenueInput;
    partitions: sdkFuncProductRelevanceFashionDashAttachedRevenuePartitions;
};
export type sdkFuncProductRelevanceFashionDashAttachedRevenueResp = {
    output: sdkFuncProductRelevanceFashionDashAttachedRevenueOutput;
};
export type sdkFuncProductRelevanceFashionDashFunnelInput = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    params: sdkFuncProductRelevanceFashionDashFunnelInputParams;
};
export type sdkFuncProductRelevanceFashionDashFunnelInputParams = {
    /**
     * - [Go: string]
     */
    max_year_month: string;
    /**
     * - [Go: string]
     */
    min_year_month: string;
};
export type sdkFuncProductRelevanceFashionDashFunnelOutput = {
    rows: Array<sdkFuncProductRelevanceFashionDashFunnelOutputRowsElement>;
};
export type sdkFuncProductRelevanceFashionDashFunnelOutputRowsElement = {
    /**
     * - [Go: string]
     */
    event_type: string;
    /**
     * - [Go: string]
     */
    from_rec: string;
    /**
     * - [Go: string]
     */
    qt_events: string;
};
export type sdkFuncProductRelevanceFashionDashFunnelPartitions = {
    /**
     * - [Go: string]
     */
    store_id: string;
};
export type sdkFuncProductRelevanceFashionDashFunnelReq = {
    input: sdkFuncProductRelevanceFashionDashFunnelInput;
    partitions: sdkFuncProductRelevanceFashionDashFunnelPartitions;
};
export type sdkFuncProductRelevanceFashionDashFunnelResp = {
    output: sdkFuncProductRelevanceFashionDashFunnelOutput;
};
export type sdkFuncProductRelevanceFashionFbtInput = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    /**
     * - [Go: string]
     */
    session_id: string;
    skus: Array<sdkFuncProductRelevanceFashionFbtInputSkusElement>;
    /**
     * - [Go: string]
     */
    user_id: string;
};
export type sdkFuncProductRelevanceFashionFbtInputSkusElement = {
    /**
     * - [Go: string]
     */
    sku_id: string;
};
export type sdkFuncProductRelevanceFashionFbtOutput = {
    results: Array<sdkFuncProductRelevanceFashionFbtOutputResultsElement>;
};
export type sdkFuncProductRelevanceFashionFbtOutputResultsElement = {
    /**
     * - [Go: float64]
     */
    rating: number;
    skus: Array<sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElement>;
};
export type sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElement = {
    /**
     * - [Go: string]
     */
    sku_id: string;
};
export type sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElementEnriched = {
    /**
     * - Id of the sku. Required; the only field sent to i6 (in the recshow event)
     */
    sku_id: string;
    /**
     * - Model rating, higher is more relevant. The default selectResults sets the rating of the result the sku was picked from
     */
    rating: number;
    /**
     * - Optional: any data your selectResults attaches to the sku (e.g. name, price, image). Returned to you as is, never sent to i6. The default selectResults does not set it
     */
    enriched: any;
};
export type sdkFuncProductRelevanceFashionFbtPartitions = {
    /**
     * - [Go: string]
     */
    store_id: string;
};
export type sdkFuncProductRelevanceFashionFbtReq = {
    input: sdkFuncProductRelevanceFashionFbtInput;
    partitions: sdkFuncProductRelevanceFashionFbtPartitions;
};
export type sdkFuncProductRelevanceFashionFbtResp = {
    output: sdkFuncProductRelevanceFashionFbtOutput;
};
export type sdkFuncProductRelevanceFashionFbtSelected = {
    /**
     * - Skus to show, in the order selectResults returned them
     */
    results: Array<sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElementEnriched>;
};
/**
 * @typedef {import("../invoker/invoker.js").ServiceOptions} ServiceOptions
 */
/**
 * @template T
 * @typedef {T} i6JsonEmbedded
 */
/**
 * apiDszCreateIngestionToken params
 * @typedef {object} apiDszCreateIngestionTokenParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszCreateIngestionToken Request
 * @typedef {object} apiDszCreateIngestionTokenReq
 * @property {apiDszCreateIngestionTokenParams} params
 * @property {apiDszCreateIngestionTokenReqPayload} payload
 */
/**
 * apiDszCreateIngestionToken reqPayload
 * @typedef {object} apiDszCreateIngestionTokenReqPayload
 * @property {string} annotation - [Go: string]
 */
/**
 * apiDszCreateIngestionToken Response
 * @typedef {object} apiDszCreateIngestionTokenResp
 * @property {apiDszCreateIngestionTokenRespPayload} payload
 */
/**
 * apiDszCreateIngestionToken respPayload
 * @typedef {object} apiDszCreateIngestionTokenRespPayload
 * @property {string} annotation - [Go: string]
 * @property {string} audience - [Go: string]
 * @property {string} channel - [Go: string]
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {number} expiration_date - [Go: int64]
 * @property {Array<apiDszCreateIngestionTokenRespPayloadGrantsElement>} grants
 * @property {string} id - [Go: string]
 * @property {string} jti - [Go: string]
 * @property {string} token - [Go: string]
 */
/**
 * [Go: string]
 * @typedef {string} apiDszCreateIngestionTokenRespPayloadGrantsElement
 */
/**
 * apiDszCreateRecsysToken params
 * @typedef {object} apiDszCreateRecsysTokenParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszCreateRecsysToken Request
 * @typedef {object} apiDszCreateRecsysTokenReq
 * @property {apiDszCreateRecsysTokenParams} params
 * @property {apiDszCreateRecsysTokenReqPayload} payload
 */
/**
 * apiDszCreateRecsysToken reqPayload
 * @typedef {object} apiDszCreateRecsysTokenReqPayload
 * @property {string} annotation - [Go: string]
 * @property {string} channel - [Go: string]
 */
/**
 * apiDszCreateRecsysToken Response
 * @typedef {object} apiDszCreateRecsysTokenResp
 * @property {apiDszCreateRecsysTokenRespPayload} payload
 */
/**
 * apiDszCreateRecsysToken respPayload
 * @typedef {object} apiDszCreateRecsysTokenRespPayload
 * @property {string} annotation - [Go: string]
 * @property {string} audience - [Go: string]
 * @property {string} channel - [Go: string]
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {number} expiration_date - [Go: int64]
 * @property {Array<apiDszCreateRecsysTokenRespPayloadGrantsElement>} grants
 * @property {string} id - [Go: string]
 * @property {string} jti - [Go: string]
 * @property {string} token - [Go: string]
 */
/**
 * [Go: string]
 * @typedef {string} apiDszCreateRecsysTokenRespPayloadGrantsElement
 */
/**
 * apiDszCreateStore params
 * @typedef {object} apiDszCreateStoreParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszCreateStore Request
 * @typedef {object} apiDszCreateStoreReq
 * @property {apiDszCreateStoreParams} params
 * @property {apiDszCreateStoreReqPayload} payload
 */
/**
 * apiDszCreateStore reqPayload
 * @typedef {object} apiDszCreateStoreReqPayload
 * @property {apiDszCreateStoreReqPayloadStore} store
 */
/**
 * @typedef {object} apiDszCreateStoreReqPayloadStore
 * @property {string} id - [Go: storeid.StoreId]
 * @property {string} name - [Go: string]
 * @property {Array<apiDszCreateStoreReqPayloadStoreSolutionDomainsElement>} solution_domains
 */
/**
 * [Go: solutiondomain.SolutionDomain]
 * @typedef {string} apiDszCreateStoreReqPayloadStoreSolutionDomainsElement
 */
/**
 * apiDszCreateStore Response
 * @typedef {object} apiDszCreateStoreResp
 */
/**
 * apiDszDatasetSolutions params
 * @typedef {object} apiDszDatasetSolutionsParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszDatasetSolutions Request
 * @typedef {object} apiDszDatasetSolutionsReq
 * @property {apiDszDatasetSolutionsParams} params
 */
/**
 * apiDszDatasetSolutions Response
 * @typedef {object} apiDszDatasetSolutionsResp
 * @property {apiDszDatasetSolutionsRespPayload} payload
 */
/**
 * apiDszDatasetSolutions respPayload
 * @typedef {object} apiDszDatasetSolutionsRespPayload
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {Array<apiDszDatasetSolutionsRespPayloadSolutionsElement>} solutions
 */
/**
 * [Go: solution.Solution]
 * @typedef {string} apiDszDatasetSolutionsRespPayloadSolutionsElement
 */
/**
 * apiDszDeleteToken params
 * @typedef {object} apiDszDeleteTokenParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszDeleteToken query
 * @typedef {object} apiDszDeleteTokenQuery
 * @property {string} token - [Go: string]
 */
/**
 * apiDszDeleteToken Request
 * @typedef {object} apiDszDeleteTokenReq
 * @property {apiDszDeleteTokenParams} params
 * @property {apiDszDeleteTokenQuery} query
 */
/**
 * apiDszDeleteToken Response
 * @typedef {object} apiDszDeleteTokenResp
 */
/**
 * apiDszGetSubscription params
 * @typedef {object} apiDszGetSubscriptionParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset of the subscription
 */
/**
 * apiDszGetSubscription Request
 * @typedef {object} apiDszGetSubscriptionReq
 * @property {apiDszGetSubscriptionParams} params
 */
/**
 * apiDszGetSubscription Response
 * @typedef {object} apiDszGetSubscriptionResp
 * @property {apiDszGetSubscriptionRespPayload} payload
 */
/**
 * apiDszGetSubscription respPayload
 * @typedef {object} apiDszGetSubscriptionRespPayload
 * @property {dszTime} cancel_at - [Go: time.Time] When the subscription will be or was canceled, in UTC; null when there is no cancellation
 * @property {dszTime} current_period_end - [Go: time.Time] End of the current period, in UTC
 * @property {string} plan_key - [Go: string] Lookup key of the base price in Stripe, like relevance_growth_base_monthly
 * @property {string} status - [Go: string] Status of the subscription in Stripe, without translation: active, trialing, past_due, unpaid, incomplete, canceled, incomplete_expired or paused
 */
/**
 * apiDszListDatasets query
 * @typedef {object} apiDszListDatasetsQuery
 * @property {string} user - [Go: string]
 */
/**
 * apiDszListDatasets Request
 * @typedef {object} apiDszListDatasetsReq
 * @property {apiDszListDatasetsQuery} query
 */
/**
 * apiDszListDatasets Response
 * @typedef {object} apiDszListDatasetsResp
 * @property {apiDszListDatasetsRespPayload} payload
 */
/**
 * apiDszListDatasets respPayload
 * @typedef {object} apiDszListDatasetsRespPayload
 * @property {Array<apiDszListDatasetsRespPayloadDatasetsElement>} datasets
 */
/**
 * @typedef {object} apiDszListDatasetsRespPayloadDatasetsElement
 * @property {Array<apiDszListDatasetsRespPayloadDatasetsElementGrantsElement>} grants
 * @property {string} id - [Go: string]
 * @property {string} name - [Go: string]
 */
/**
 * [Go: string]
 * @typedef {string} apiDszListDatasetsRespPayloadDatasetsElementGrantsElement
 */
/**
 * apiDszListIngestionTokens params
 * @typedef {object} apiDszListIngestionTokensParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszListIngestionTokens Request
 * @typedef {object} apiDszListIngestionTokensReq
 * @property {apiDszListIngestionTokensParams} params
 */
/**
 * apiDszListIngestionTokens Response
 * @typedef {object} apiDszListIngestionTokensResp
 * @property {apiDszListIngestionTokensRespPayload} payload
 */
/**
 * apiDszListIngestionTokens respPayload
 * @typedef {object} apiDszListIngestionTokensRespPayload
 * @property {Array<apiDszListIngestionTokensRespPayloadTokensElement>} tokens
 */
/**
 * @typedef {object} apiDszListIngestionTokensRespPayloadTokensElement
 * @property {string} annotation - [Go: string]
 * @property {string} audience - [Go: string]
 * @property {string} channel - [Go: string]
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {number} expiration_date - [Go: int64]
 * @property {Array<apiDszListIngestionTokensRespPayloadTokensElementGrantsElement>} grants
 * @property {string} id - [Go: string]
 * @property {string} jti - [Go: string]
 * @property {string} token - [Go: string]
 */
/**
 * [Go: string]
 * @typedef {string} apiDszListIngestionTokensRespPayloadTokensElementGrantsElement
 */
/**
 * apiDszListRecsysTokens params
 * @typedef {object} apiDszListRecsysTokensParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszListRecsysTokens Request
 * @typedef {object} apiDszListRecsysTokensReq
 * @property {apiDszListRecsysTokensParams} params
 */
/**
 * apiDszListRecsysTokens Response
 * @typedef {object} apiDszListRecsysTokensResp
 * @property {apiDszListRecsysTokensRespPayload} payload
 */
/**
 * apiDszListRecsysTokens respPayload
 * @typedef {object} apiDszListRecsysTokensRespPayload
 * @property {Array<apiDszListRecsysTokensRespPayloadTokensElement>} tokens
 */
/**
 * @typedef {object} apiDszListRecsysTokensRespPayloadTokensElement
 * @property {string} annotation - [Go: string]
 * @property {string} audience - [Go: string]
 * @property {string} channel - [Go: string]
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {number} expiration_date - [Go: int64]
 * @property {Array<apiDszListRecsysTokensRespPayloadTokensElementGrantsElement>} grants
 * @property {string} id - [Go: string]
 * @property {string} jti - [Go: string]
 * @property {string} token - [Go: string]
 */
/**
 * [Go: string]
 * @typedef {string} apiDszListRecsysTokensRespPayloadTokensElementGrantsElement
 */
/**
 * apiDszListStores params
 * @typedef {object} apiDszListStoresParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszListStores Request
 * @typedef {object} apiDszListStoresReq
 * @property {apiDszListStoresParams} params
 */
/**
 * apiDszListStores Response
 * @typedef {object} apiDszListStoresResp
 * @property {apiDszListStoresRespPayload} payload
 */
/**
 * apiDszListStores respPayload
 * @typedef {object} apiDszListStoresRespPayload
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {Array<apiDszListStoresRespPayloadStoresElement>} stores
 */
/**
 * @typedef {object} apiDszListStoresRespPayloadStoresElement
 * @property {string} id - [Go: storeid.StoreId]
 * @property {string} name - [Go: string]
 * @property {Array<apiDszListStoresRespPayloadStoresElementSolutionDomainsElement>} solution_domains
 */
/**
 * [Go: solutiondomain.SolutionDomain]
 * @typedef {string} apiDszListStoresRespPayloadStoresElementSolutionDomainsElement
 */
/**
 * apiDszModelGet params
 * @typedef {object} apiDszModelGetParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset to generate signed URLs for.
 * @property {string} model_name - [Go: string] Model name
 */
/**
 * apiDszModelGet Request
 * @typedef {object} apiDszModelGetReq
 * @property {apiDszModelGetParams} params
 * @property {apiDszModelGetReqPayload} payload
 */
/**
 * apiDszModelGet reqPayload
 * @typedef {object} apiDszModelGetReqPayload
 * @property {Record<apiDszModelGetReqPayloadModelPartitionsKey, apiDszModelGetReqPayloadModelPartitionsValue>} model_partitions - Model partition key/value pairs
 * @property {string} model_version - [Go: string] Model version
 */
/**
 * [Go: string]
 * @typedef {string} apiDszModelGetReqPayloadModelPartitionsKey
 */
/**
 * [Go: string]
 * @typedef {string} apiDszModelGetReqPayloadModelPartitionsValue
 */
/**
 * apiDszModelGet Response
 * @typedef {object} apiDszModelGetResp
 * @property {apiDszModelGetRespPayload} payload
 */
/**
 * apiDszModelGet respPayload
 * @typedef {object} apiDszModelGetRespPayload
 * @property {Array<apiDszModelGetRespPayloadUrlsElement>} urls - Signed URLs
 */
/**
 * @typedef {object} apiDszModelGetRespPayloadUrlsElement
 * @property {string} name - [Go: string] File Name
 * @property {string} url - [Go: string] signed URL.
 */
/**
 * apiDszResultLastBatchSummary params
 * @typedef {object} apiDszResultLastBatchSummaryParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset.
 */
/**
 * apiDszResultLastBatchSummary query
 * @typedef {object} apiDszResultLastBatchSummaryQuery
 * @property {string} store_id - [Go: storeid.StoreId] Store ID to query.
 * @property {string} table - [Go: laketbnamez.TableName] Table of the batch in question.
 */
/**
 * apiDszResultLastBatchSummary Request
 * @typedef {object} apiDszResultLastBatchSummaryReq
 * @property {apiDszResultLastBatchSummaryParams} params
 * @property {apiDszResultLastBatchSummaryQuery} query
 */
/**
 * apiDszResultLastBatchSummary Response
 * @typedef {object} apiDszResultLastBatchSummaryResp
 * @property {apiDszResultLastBatchSummaryRespPayload} payload
 */
/**
 * apiDszResultLastBatchSummary respPayload
 * @typedef {object} apiDszResultLastBatchSummaryRespPayload
 * @property {apiDszResultLastBatchSummaryRespPayloadData} data - Generic table data loaded from the datalake file.
 */
/**
 * Generic table data loaded from the datalake file.
 * @typedef {object} apiDszResultLastBatchSummaryRespPayloadData
 * @property {Array<apiDszResultLastBatchSummaryRespPayloadDataColumnSummariesElement>} column_summaries - Summaries of distinct and null counts per column.
 * @property {string} ingested_at - [Go: string]
 * @property {number} row_count - [Go: int]
 * @property {string} store_id - [Go: storeid.StoreId]
 */
/**
 * @typedef {object} apiDszResultLastBatchSummaryRespPayloadDataColumnSummariesElement
 * @property {string} column_name - [Go: string] Name of the column.
 * @property {number} distinct_count - [Go: int] Number of distinct values in the column.
 * @property {number} null_count - [Go: int] Number of null values in the column.
 */
/**
 * apiDszResultRelevanceFashionCatalog params
 * @typedef {object} apiDszResultRelevanceFashionCatalogParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset.
 */
/**
 * apiDszResultRelevanceFashionCatalog query
 * @typedef {object} apiDszResultRelevanceFashionCatalogQuery
 * @property {string} store_id - [Go: storeid.StoreId] Store ID to query.
 */
/**
 * apiDszResultRelevanceFashionCatalog Request
 * @typedef {object} apiDszResultRelevanceFashionCatalogReq
 * @property {apiDszResultRelevanceFashionCatalogParams} params
 * @property {apiDszResultRelevanceFashionCatalogQuery} query
 */
/**
 * apiDszResultRelevanceFashionCatalog Response
 * @typedef {object} apiDszResultRelevanceFashionCatalogResp
 * @property {apiDszResultRelevanceFashionCatalogRespPayload} payload
 */
/**
 * apiDszResultRelevanceFashionCatalog respPayload
 * @typedef {object} apiDszResultRelevanceFashionCatalogRespPayload
 * @property {Array<apiDszResultRelevanceFashionCatalogRespPayloadDataElement>} data - Generic table data loaded from the datalake file.
 */
/**
 * @typedef {object} apiDszResultRelevanceFashionCatalogRespPayloadDataElement
 * @property {string} sku_ds - [Go: string]
 * @property {string} sku_id - [Go: string]
 * @property {string} store_id - [Go: storeid.StoreId]
 */
/**
 * apiDszSignedUrl params
 * @typedef {object} apiDszSignedUrlParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset to generate signed URLs for.
 */
/**
 * apiDszSignedUrl Request
 * @typedef {object} apiDszSignedUrlReq
 * @property {apiDszSignedUrlParams} params
 * @property {apiDszSignedUrlReqPayload} payload
 */
/**
 * apiDszSignedUrl reqPayload
 * @typedef {object} apiDszSignedUrlReqPayload
 * @property {Array<apiDszSignedUrlReqPayloadPathsElement>} paths - List of paths and HTTP methods to generate signed URLs for.
 */
/**
 * Path and HTTP method specification for a signed URL.
 * @typedef {object} apiDszSignedUrlReqPayloadPathsElement
 * @property {string} method - [Go: fszsignmethod.SignMethod] HTTP method (e.g. GET, PUT) for the signed URL.
 * @property {string} path - [Go: laketbpathz.Path] File path within the dataset.
 */
/**
 * apiDszSignedUrl Response
 * @typedef {object} apiDszSignedUrlResp
 * @property {apiDszSignedUrlRespPayload} payload
 */
/**
 * apiDszSignedUrl respPayload
 * @typedef {object} apiDszSignedUrlRespPayload
 * @property {Array<apiDszSignedUrlRespPayloadUrlsElement>} urls - Signed URLs
 */
/**
 * @typedef {object} apiDszSignedUrlRespPayloadUrlsElement
 * @property {string} url - [Go: string] signed URL.
 */
/**
 * apiDszStoreDisplayCreate params
 * @typedef {object} apiDszStoreDisplayCreateParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszStoreDisplayCreate Request
 * @typedef {object} apiDszStoreDisplayCreateReq
 * @property {apiDszStoreDisplayCreateParams} params
 * @property {apiDszStoreDisplayCreateReqPayload} payload
 */
/**
 * apiDszStoreDisplayCreate reqPayload
 * @typedef {object} apiDszStoreDisplayCreateReqPayload
 * @property {apiDszStoreDisplayCreateReqPayloadDisplay} display
 * @property {string} store_id - [Go: storeid.StoreId]
 */
/**
 * @typedef {object} apiDszStoreDisplayCreateReqPayloadDisplay
 * @property {string} id - [Go: storedisplayid.StoreDisplayId]
 * @property {string} model_name - [Go: string]
 * @property {string} name - [Go: string]
 */
/**
 * apiDszStoreDisplayCreate Response
 * @typedef {object} apiDszStoreDisplayCreateResp
 * @property {apiDszStoreDisplayCreateRespPayload} payload
 */
/**
 * apiDszStoreDisplayCreate respPayload
 * @typedef {object} apiDszStoreDisplayCreateRespPayload
 * @property {apiDszStoreDisplayCreateRespPayloadDisplay} display
 */
/**
 * @typedef {object} apiDszStoreDisplayCreateRespPayloadDisplay
 * @property {string} id - [Go: storedisplayid.StoreDisplayId]
 * @property {string} name - [Go: string]
 */
/**
 * apiDszStoreDisplayList params
 * @typedef {object} apiDszStoreDisplayListParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszStoreDisplayList query
 * @typedef {object} apiDszStoreDisplayListQuery
 * @property {string} store_id - [Go: storeid.StoreId]
 */
/**
 * apiDszStoreDisplayList Request
 * @typedef {object} apiDszStoreDisplayListReq
 * @property {apiDszStoreDisplayListParams} params
 * @property {apiDszStoreDisplayListQuery} query
 */
/**
 * apiDszStoreDisplayList Response
 * @typedef {object} apiDszStoreDisplayListResp
 * @property {apiDszStoreDisplayListRespPayload} payload
 */
/**
 * apiDszStoreDisplayList respPayload
 * @typedef {object} apiDszStoreDisplayListRespPayload
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {Array<apiDszStoreDisplayListRespPayloadDisplaysElement>} displays
 * @property {string} store_id - [Go: storeid.StoreId]
 */
/**
 * @typedef {object} apiDszStoreDisplayListRespPayloadDisplaysElement
 * @property {string} id - [Go: storedisplayid.StoreDisplayId]
 * @property {string} name - [Go: string]
 */
/**
 * apiDszStripeCheckout Request
 * @typedef {object} apiDszStripeCheckoutReq
 * @property {apiDszStripeCheckoutReqPayload} payload
 */
/**
 * apiDszStripeCheckout reqPayload
 * @typedef {object} apiDszStripeCheckoutReqPayload
 * @property {string} campaign_state - [Go: string] Base64 state token with the trial days and the metadata of the checkout; the service parses it
 * @property {string} cancel_url - [Go: string] Url to go after a canceled checkout
 * @property {string} dataset_name - [Go: string] Dataset name
 * @property {string} document - [Go: string] Document of the buyer
 * @property {string} payment_email - [Go: string] Email of the buyer used in Stripe
 * @property {string} payment_phone - [Go: string] Phone of the buyer
 * @property {string} plan - [Go: string] Lookup key of the Stripe price of the plan to buy; the service gets the price id from the Stripe prices api
 * @property {string} success_url - [Go: string] Url to go after a successful checkout
 */
/**
 * apiDszStripeCheckout Response
 * @typedef {object} apiDszStripeCheckoutResp
 * @property {apiDszStripeCheckoutRespPayload} payload
 */
/**
 * apiDszStripeCheckout respPayload
 * @typedef {object} apiDszStripeCheckoutRespPayload
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset that is going to be created after the payment; its id starts with ds
 * @property {string} id - [Go: string] Checkout session id
 * @property {string} url - [Go: string] Checkout session url
 */
/**
 * apiDszTableGet params
 * @typedef {object} apiDszTableGetParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset.
 * @property {string} path - [Go: string] Path to the file without schema.
 */
/**
 * apiDszTableGet Request
 * @typedef {object} apiDszTableGetReq
 * @property {apiDszTableGetParams} params
 */
/**
 * apiDszTableGet Response
 * @typedef {object} apiDszTableGetResp
 * @property {apiDszTableGetRespHeaders} headers
 */
/**
 * apiDszTableGet respHeaders
 * @typedef {object} apiDszTableGetRespHeaders
 * @property {string} location - [Go: string] Redirect URL for the file.
 */
/**
 * apiDszTableList params
 * @typedef {object} apiDszTableListParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset to list tables from.
 */
/**
 * apiDszTableList query
 * @typedef {object} apiDszTableListQuery
 * @property {string} from_cursor - [Go: string] Pagination cursor.
 * @property {number} limist - [Go: int] Limit the number of results.
 * @property {string} path - [Go: laketbpathz.Path] Path to list.
 * @property {boolean} recursive - [Go: bool] Whether to list recursively.
 * @property {string} sign_method - [Go: fszsignmethod.SignMethod] Whether to return signed URLs.
 * @property {boolean} stat - [Go: bool] Whether to include file stats.
 */
/**
 * apiDszTableList Request
 * @typedef {object} apiDszTableListReq
 * @property {apiDszTableListParams} params
 * @property {apiDszTableListQuery} query
 */
/**
 * apiDszTableList Response
 * @typedef {object} apiDszTableListResp
 * @property {apiDszTableListRespPayload} payload
 */
/**
 * apiDszTableList respPayload
 * @typedef {object} apiDszTableListRespPayload
 * @property {Array<apiDszTableListRespPayloadFilesElement>} files
 * @property {string} next_cursor - [Go: string] Cursor for the next page of results.
 */
/**
 * File entry
 * @typedef {object} apiDszTableListRespPayloadFilesElement
 * @property {string} path - [Go: laketbpathz.Path] write it
 * @property {string} signed_url - [Go: string] write it
 * @property {dszFileStat} stat - [Go: fsz.FileStat] write it
 */
/**
 * apiIngestzEventRelevanceFashionCatalog params
 * @typedef {object} apiIngestzEventRelevanceFashionCatalogParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset that receives the stream data.
 */
/**
 * apiIngestzEventRelevanceFashionCatalog query
 * @typedef {object} apiIngestzEventRelevanceFashionCatalogQuery
 * @property {string} id - [Go: string]
 * @property {boolean} inactive - [Go: bool]
 * @property {string} product_id - [Go: string]
 * @property {string} sku_ds - [Go: string]
 * @property {string} sku_id - [Go: string]
 * @property {string} store_id - [Go: string]
 */
/**
 * apiIngestzEventRelevanceFashionCatalog Request
 * @typedef {object} apiIngestzEventRelevanceFashionCatalogReq
 * @property {apiIngestzEventRelevanceFashionCatalogParams} params
 * @property {apiIngestzEventRelevanceFashionCatalogQuery} query
 */
/**
 * apiIngestzEventRelevanceFashionCatalog Response
 * @typedef {object} apiIngestzEventRelevanceFashionCatalogResp
 * @property {apiIngestzEventRelevanceFashionCatalogRespPayload} payload
 */
/**
 * apiIngestzEventRelevanceFashionCatalog respPayload
 * @typedef {object} apiIngestzEventRelevanceFashionCatalogRespPayload
 * @property {number} count - [Go: int]
 */
/**
 * apiIngestzEventRelevanceFashionEvent params
 * @typedef {object} apiIngestzEventRelevanceFashionEventParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset that receives the stream data.
 */
/**
 * apiIngestzEventRelevanceFashionEvent query
 * @typedef {object} apiIngestzEventRelevanceFashionEventQuery
 * @property {apiIngestzEventRelevanceFashionEventQueryAddToCart} add_to_cart - AddToCart event payload. Mutually exclusive with other payloads.
 * @property {apiIngestzEventRelevanceFashionEventQueryClick} click - Click event payload. Mutually exclusive with other payloads.
 * @property {dszTime} created_at - [Go: time.Time] Timestamp of event creation (required).
 * @property {string} display_id - [Go: bigquery.NullString] Optional display identifier.
 * @property {string} id - [Go: string] Unique identifier for the event (required).
 * @property {apiIngestzEventRelevanceFashionEventQueryPurchase} purchase - Purchase event payload. Mutually exclusive with other payloads.
 * @property {apiIngestzEventRelevanceFashionEventQueryRecraw} recraw - Recraw event payload. Mutually exclusive with other payloads.
 * @property {apiIngestzEventRelevanceFashionEventQueryRecshow} recshow - Recshow event payload. Mutually exclusive with other payloads.
 * @property {apiIngestzEventRelevanceFashionEventQueryRemoveFromCart} remove_from_cart - RemoveFromCart event payload. Mutually exclusive with other payloads.
 * @property {apiIngestzEventRelevanceFashionEventQuerySearch} search - Search event payload. Mutually exclusive with other payloads.
 * @property {string} session_id - [Go: string] Identifier of the user session (required).
 * @property {string} store_id - [Go: string] Identifier of the store (required).
 * @property {string} user_id - [Go: bigquery.NullString] Optional user identifier.
 */
/**
 * AddToCart event payload. Mutually exclusive with other payloads.
 * @typedef {object} apiIngestzEventRelevanceFashionEventQueryAddToCart
 * @property {number} price - [Go: float64] Price of the added SKU (non-negative).
 * @property {string} sku_id - [Go: string] SKU identifier (required).
 */
/**
 * Click event payload. Mutually exclusive with other payloads.
 * @typedef {object} apiIngestzEventRelevanceFashionEventQueryClick
 * @property {number} price - [Go: float64] Price of the clicked SKU (non-negative).
 * @property {string} sku_id - [Go: string] SKU identifier (required).
 */
/**
 * Purchase event payload. Mutually exclusive with other payloads.
 * @typedef {object} apiIngestzEventRelevanceFashionEventQueryPurchase
 * @property {string} order_id - [Go: string] Order identifier (required).
 * @property {Array<apiIngestzEventRelevanceFashionEventQueryPurchaseSkusElement>} skus - List of purchased SKUs (must not be empty).
 */
/**
 * PurchaseSku represents an individual item in a purchase. SkuId is required, unit_price must be non-negative, and qtty must be greater than 0.
 * @typedef {object} apiIngestzEventRelevanceFashionEventQueryPurchaseSkusElement
 * @property {number} qtty - [Go: int64] Quantity of the purchased item (must be greater than 0).
 * @property {string} sku_id - [Go: string] SKU identifier (required).
 * @property {number} unit_price - [Go: float64] Unit price of the item (non-negative).
 */
/**
 * Recraw event payload. Mutually exclusive with other payloads.
 * @typedef {object} apiIngestzEventRelevanceFashionEventQueryRecraw
 * @property {string} model_id - [Go: string] Model identifier (required).
 * @property {string} model_version - [Go: string] Model version string.
 * @property {string} payload - [Go: string] Raw recommendation payload (required).
 * @property {string} rec_id - [Go: string] Recommendation identifier (required).
 */
/**
 * Recshow event payload. Mutually exclusive with other payloads.
 * @typedef {object} apiIngestzEventRelevanceFashionEventQueryRecshow
 * @property {string} model_id - [Go: string] Model identifier.
 * @property {string} model_version - [Go: string] Model version string.
 * @property {string} payload - [Go: string] Displayed recommendation payload (required).
 * @property {string} rec_id - [Go: string] Recommendation identifier (required).
 */
/**
 * RemoveFromCart event payload. Mutually exclusive with other payloads.
 * @typedef {object} apiIngestzEventRelevanceFashionEventQueryRemoveFromCart
 * @property {number} price - [Go: float64] Price of the removed SKU (non-negative).
 * @property {string} sku_id - [Go: string] SKU identifier (required).
 */
/**
 * Search event payload. Mutually exclusive with other payloads.
 * @typedef {object} apiIngestzEventRelevanceFashionEventQuerySearch
 * @property {string} text - [Go: string] Search query text (required).
 */
/**
 * apiIngestzEventRelevanceFashionEvent Request
 * @typedef {object} apiIngestzEventRelevanceFashionEventReq
 * @property {apiIngestzEventRelevanceFashionEventParams} params
 * @property {apiIngestzEventRelevanceFashionEventQuery} query
 */
/**
 * apiIngestzEventRelevanceFashionEvent Response
 * @typedef {object} apiIngestzEventRelevanceFashionEventResp
 * @property {apiIngestzEventRelevanceFashionEventRespPayload} payload
 */
/**
 * apiIngestzEventRelevanceFashionEvent respPayload
 * @typedef {object} apiIngestzEventRelevanceFashionEventRespPayload
 * @property {number} count - [Go: int]
 */
/**
 * apiIngestzGetUrl params
 * @typedef {object} apiIngestzGetUrlParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset that receives the uploaded files.
 */
/**
 * apiIngestzGetUrl Request
 * @typedef {object} apiIngestzGetUrlReq
 * @property {apiIngestzGetUrlParams} params
 * @property {apiIngestzGetUrlReqPayload} payload
 */
/**
 * apiIngestzGetUrl reqPayload
 * @typedef {object} apiIngestzGetUrlReqPayload
 * @property {number} amount - [Go: int] Number of presigned upload URLs to generate.
 * @property {Record<apiIngestzGetUrlReqPayloadPartitionsKey, apiIngestzGetUrlReqPayloadPartitionsValue>} partitions - Partition key/value pairs that select the table partition the files are ingested into.
 * @property {string} table - [Go: laketbnamez.TableName] Name of the table, inside the dataset, that receives the uploaded files.
 */
/**
 * [Go: string]
 * @typedef {string} apiIngestzGetUrlReqPayloadPartitionsKey
 */
/**
 * [Go: string]
 * @typedef {string} apiIngestzGetUrlReqPayloadPartitionsValue
 */
/**
 * apiIngestzGetUrl Response
 * @typedef {object} apiIngestzGetUrlResp
 * @property {apiIngestzGetUrlRespPayload} payload
 */
/**
 * apiIngestzGetUrl respPayload
 * @typedef {object} apiIngestzGetUrlRespPayload
 * @property {string} ingest_id - [Go: string] Ingestion token that identifies this ingestion and ties the uploaded files together.
 * @property {Array<apiIngestzGetUrlRespPayloadUploadsElement>} uploads - Presigned PUT URLs, one per requested file; upload each file to its URL.
 */
/**
 * [Go: string]
 * @typedef {string} apiIngestzGetUrlRespPayloadUploadsElement
 */
/**
 * apiIngestzLastBatchSummary params
 * @typedef {object} apiIngestzLastBatchSummaryParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset that receives the uploaded files.
 */
/**
 * apiIngestzLastBatchSummary query
 * @typedef {object} apiIngestzLastBatchSummaryQuery
 * @property {string} store_id - [Go: storeid.StoreId] Store ID associated with the ingestion.
 * @property {string} table - [Go: laketbnamez.TableName] Name of the table inside the dataset.
 */
/**
 * apiIngestzLastBatchSummary Request
 * @typedef {object} apiIngestzLastBatchSummaryReq
 * @property {apiIngestzLastBatchSummaryParams} params
 * @property {apiIngestzLastBatchSummaryQuery} query
 */
/**
 * apiIngestzLastBatchSummary Response
 * @typedef {object} apiIngestzLastBatchSummaryResp
 * @property {apiIngestzLastBatchSummaryRespPayload} payload
 */
/**
 * apiIngestzLastBatchSummary respPayload
 * @typedef {object} apiIngestzLastBatchSummaryRespPayload
 * @property {Array<apiIngestzLastBatchSummaryRespPayloadColumnSummariesElement>} column_summaries - Summaries of distinct and null counts per column.
 * @property {string} ingested_at - [Go: string] Timestamp when the batch was successfully ingested.
 * @property {number} row_count - [Go: int] Total number of successfully ingested rows.
 * @property {string} store_id - [Go: storeid.StoreId] Store ID associated with the ingestion.
 */
/**
 * @typedef {object} apiIngestzLastBatchSummaryRespPayloadColumnSummariesElement
 * @property {string} column_name - [Go: string] Name of the column.
 * @property {number} distinct_count - [Go: int] Number of distinct values in the column.
 * @property {number} null_count - [Go: int] Number of null values in the column.
 */
/**
 * apiPipezGet params
 * @typedef {object} apiPipezGetParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {string} id - [Go: string]
 */
/**
 * apiPipezGet Request
 * @typedef {object} apiPipezGetReq
 * @property {apiPipezGetParams} params
 */
/**
 * apiPipezGet Response
 * @typedef {object} apiPipezGetResp
 * @property {apiPipezGetRespPayload} payload
 */
/**
 * apiPipezGet respPayload
 * @typedef {object} apiPipezGetRespPayload
 * @property {apiPipezGetRespPayloadPipeline} pipeline
 */
/**
 * @typedef {object} apiPipezGetRespPayloadPipeline
 * @property {string} concurrent_id - [Go: string]
 * @property {string} dataset - [Go: string]
 * @property {string} id - [Go: string]
 * @property {string} name - [Go: string]
 * @property {string} solution_domain - [Go: solutiondomain.SolutionDomain]
 * @property {Array<apiPipezGetRespPayloadPipelineStatesElement>} states
 */
/**
 * @typedef {object} apiPipezGetRespPayloadPipelineStatesElement
 * @property {string} created_at - [Go: string]
 * @property {Record<apiPipezGetRespPayloadPipelineStatesElementParamsKey, apiPipezGetRespPayloadPipelineStatesElementParamsValue>} params
 * @property {string} status - [Go: string]
 */
/**
 * [Go: string]
 * @typedef {string} apiPipezGetRespPayloadPipelineStatesElementParamsKey
 */
/**
 * [Go: any]
 * @typedef {any} apiPipezGetRespPayloadPipelineStatesElementParamsValue
 */
/**
 * apiPipezList params
 * @typedef {object} apiPipezListParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiPipezList query
 * @typedef {object} apiPipezListQuery
 * @property {string} cursor - [Go: string]
 * @property {number} limit - [Go: int]
 * @property {string} name - [Go: string]
 * @property {string} solution_domain - [Go: solutiondomain.SolutionDomain]
 * @property {string} status - [Go: string]
 */
/**
 * apiPipezList Request
 * @typedef {object} apiPipezListReq
 * @property {apiPipezListParams} params
 * @property {apiPipezListQuery} query
 */
/**
 * apiPipezList Response
 * @typedef {object} apiPipezListResp
 * @property {apiPipezListRespPayload} payload
 */
/**
 * apiPipezList respPayload
 * @typedef {object} apiPipezListRespPayload
 * @property {string} cursor - [Go: string]
 * @property {Array<apiPipezListRespPayloadPipelinesElement>} pipelines
 */
/**
 * @typedef {object} apiPipezListRespPayloadPipelinesElement
 * @property {string} concurrent_id - [Go: string]
 * @property {string} dataset - [Go: string]
 * @property {string} id - [Go: string]
 * @property {string} name - [Go: string]
 * @property {string} solution_domain - [Go: solutiondomain.SolutionDomain]
 * @property {Array<apiPipezListRespPayloadPipelinesElementStatesElement>} states
 */
/**
 * @typedef {object} apiPipezListRespPayloadPipelinesElementStatesElement
 * @property {string} created_at - [Go: string]
 * @property {Record<apiPipezListRespPayloadPipelinesElementStatesElementParamsKey, apiPipezListRespPayloadPipelinesElementStatesElementParamsValue>} params
 * @property {string} status - [Go: string]
 */
/**
 * [Go: string]
 * @typedef {string} apiPipezListRespPayloadPipelinesElementStatesElementParamsKey
 */
/**
 * [Go: any]
 * @typedef {any} apiPipezListRespPayloadPipelinesElementStatesElementParamsValue
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionBatchIngest params
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionBatchIngestParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionBatchIngest Request
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReq
 * @property {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestParams} params
 * @property {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayload} payload
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionBatchIngest reqPayload
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayload
 * @property {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayloadParams} params
 */
/**
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayloadParams
 * @property {string} ingest_id - [Go: string]
 * @property {string} table - [Go: laketbnamez.TableName]
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionBatchIngest Response
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionBatchIngestResp
 * @property {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestRespPayload} payload
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionBatchIngest respPayload
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionBatchIngestRespPayload
 * @property {string} id - [Go: string]
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionMain params
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionMainParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionMain Request
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionMainReq
 * @property {apiPipezStartRelevanceFashionRelevanceFashionMainParams} params
 * @property {apiPipezStartRelevanceFashionRelevanceFashionMainReqPayload} payload
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionMain reqPayload
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionMainReqPayload
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionMain Response
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionMainResp
 * @property {apiPipezStartRelevanceFashionRelevanceFashionMainRespPayload} payload
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionMain respPayload
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionMainRespPayload
 * @property {string} id - [Go: string]
 */
/**
 * apiSampleFraction params
 * @typedef {object} apiSampleFractionParams
 * @property {number} denominator - [Go: float64] Fraction Denominator
 * @property {number} numerator - [Go: float64] Fraction Numerator
 */
/**
 * apiSampleFraction query
 * @typedef {object} apiSampleFractionQuery
 * @property {number} precision - [Go: int] Fraction max precision
 * @property {apiSampleFractionQuerySmsg} smsg
 */
/**
 * @typedef {object} apiSampleFractionQuerySmsg
 * @property {string} message - [Go: string] message string
 */
/**
 * apiSampleFraction Request
 * @typedef {object} apiSampleFractionReq
 * @property {apiSampleFractionParams} params
 * @property {apiSampleFractionQuery} query
 * @property {apiSampleFractionReqHeaders} headers
 * @property {apiSampleFractionReqPayload} payload
 */
/**
 * apiSampleFraction reqHeaders
 * @typedef {object} apiSampleFractionReqHeaders
 * @property {string} x_i6_trace_id - [Go: string] Sample of Trace Id
 */
/**
 * apiSampleFraction reqPayload
 * @typedef {object} apiSampleFractionReqPayload
 * @property {Array<apiSampleFractionReqPayloadMessagesElement>} messages
 * @property {string} reason - [Go: string] Sample reason of this fraction
 */
/**
 * message
 * @typedef {object} apiSampleFractionReqPayloadMessagesElement
 * @property {string} message - [Go: string] message string
 */
/**
 * apiSampleFraction Response
 * @typedef {object} apiSampleFractionResp
 * @property {apiSampleFractionRespHeaders} headers
 * @property {apiSampleFractionRespPayload} payload
 */
/**
 * apiSampleFraction respHeaders
 * @typedef {object} apiSampleFractionRespHeaders
 * @property {apiSampleFractionRespHeadersXI6Smsg} x_i6_smsg
 * @property {string} x_i6_trace_message - [Go: string] Sample of any trace message
 */
/**
 * @typedef {object} apiSampleFractionRespHeadersXI6Smsg
 * @property {string} message - [Go: string] message string
 */
/**
 * apiSampleFraction respPayload
 * @typedef {object} apiSampleFractionRespPayload
 * @property {string} display - [Go: string] Human Fraction Representation
 * @property {Array<apiSampleFractionRespPayloadMessagesElement>} messages - Output Messages
 * @property {string} result - [Go: string] Fraction Result
 */
/**
 * [Go: string]
 * @typedef {string} apiSampleFractionRespPayloadMessagesElement
 */
/**
 * @typedef {object} dszFileStat
 * @property {string} url - missing summary
 * @property {string} content_type - missing summary
 * @property {string} md5 - missing summary
 * @property {string} size - missing summary
 * @property {string} etag - missing summary
 * @property {dszTime} created_at - missing summary
 * @property {dszTime} updated_at - missing summary
 */
/**
 * Missing Summary
 * @typedef {string} dszTime
 */
/**
 * sdkFuncProductRelevanceFashionDashAttachedRevenue input
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenueInput
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {sdkFuncProductRelevanceFashionDashAttachedRevenueInputParams} params
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenueInputParams
 * @property {string} max_year_month - [Go: string]
 * @property {string} min_year_month - [Go: string]
 */
/**
 * sdkFuncProductRelevanceFashionDashAttachedRevenue output
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenueOutput
 * @property {Array<sdkFuncProductRelevanceFashionDashAttachedRevenueOutputRowsElement>} rows
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenueOutputRowsElement
 * @property {number} attached_purchases - [Go: float64]
 * @property {number} attached_revenue - [Go: float64]
 * @property {number} attached_skus - [Go: float64]
 * @property {number} avg_ticket - [Go: float64]
 */
/**
 * sdkFuncProductRelevanceFashionDashAttachedRevenue partitions
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenuePartitions
 * @property {string} store_id - [Go: string]
 */
/**
 * sdkFuncProductRelevanceFashionDashAttachedRevenue Request
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenueReq
 * @property {sdkFuncProductRelevanceFashionDashAttachedRevenueInput} input
 * @property {sdkFuncProductRelevanceFashionDashAttachedRevenuePartitions} partitions
 */
/**
 * sdkFuncProductRelevanceFashionDashAttachedRevenue Response
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenueResp
 * @property {sdkFuncProductRelevanceFashionDashAttachedRevenueOutput} output
 */
/**
 * sdkFuncProductRelevanceFashionDashFunnel input
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelInput
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {sdkFuncProductRelevanceFashionDashFunnelInputParams} params
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelInputParams
 * @property {string} max_year_month - [Go: string]
 * @property {string} min_year_month - [Go: string]
 */
/**
 * sdkFuncProductRelevanceFashionDashFunnel output
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelOutput
 * @property {Array<sdkFuncProductRelevanceFashionDashFunnelOutputRowsElement>} rows
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelOutputRowsElement
 * @property {string} event_type - [Go: string]
 * @property {string} from_rec - [Go: string]
 * @property {string} qt_events - [Go: string]
 */
/**
 * sdkFuncProductRelevanceFashionDashFunnel partitions
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelPartitions
 * @property {string} store_id - [Go: string]
 */
/**
 * sdkFuncProductRelevanceFashionDashFunnel Request
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelReq
 * @property {sdkFuncProductRelevanceFashionDashFunnelInput} input
 * @property {sdkFuncProductRelevanceFashionDashFunnelPartitions} partitions
 */
/**
 * sdkFuncProductRelevanceFashionDashFunnel Response
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelResp
 * @property {sdkFuncProductRelevanceFashionDashFunnelOutput} output
 */
/**
 * sdkFuncProductRelevanceFashionFbt input
 * @typedef {object} sdkFuncProductRelevanceFashionFbtInput
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {string} session_id - [Go: string]
 * @property {Array<sdkFuncProductRelevanceFashionFbtInputSkusElement>} skus
 * @property {string} user_id - [Go: string]
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionFbtInputSkusElement
 * @property {string} sku_id - [Go: string]
 */
/**
 * sdkFuncProductRelevanceFashionFbt output
 * @typedef {object} sdkFuncProductRelevanceFashionFbtOutput
 * @property {Array<sdkFuncProductRelevanceFashionFbtOutputResultsElement>} results
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionFbtOutputResultsElement
 * @property {number} rating - [Go: float64]
 * @property {Array<sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElement>} skus
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElement
 * @property {string} sku_id - [Go: string]
 */
/**
 * One recommended sku to show, as picked by selectResults
 * @typedef {object} sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElementEnriched
 * @property {string} sku_id - Id of the sku. Required; the only field sent to i6 (in the recshow event)
 * @property {number} rating - Model rating, higher is more relevant. The default selectResults sets the rating of the result the sku was picked from
 * @property {*} enriched - Optional: any data your selectResults attaches to the sku (e.g. name, price, image). Returned to you as is, never sent to i6. The default selectResults does not set it
 */
/**
 * sdkFuncProductRelevanceFashionFbt partitions
 * @typedef {object} sdkFuncProductRelevanceFashionFbtPartitions
 * @property {string} store_id - [Go: string]
 */
/**
 * sdkFuncProductRelevanceFashionFbt Request
 * @typedef {object} sdkFuncProductRelevanceFashionFbtReq
 * @property {sdkFuncProductRelevanceFashionFbtInput} input
 * @property {sdkFuncProductRelevanceFashionFbtPartitions} partitions
 */
/**
 * sdkFuncProductRelevanceFashionFbt Response
 * @typedef {object} sdkFuncProductRelevanceFashionFbtResp
 * @property {sdkFuncProductRelevanceFashionFbtOutput} output
 */
/**
 * sdkFuncProductRelevanceFashionFbt Selected: the skus to show, as returned by selectResults
 * @typedef {object} sdkFuncProductRelevanceFashionFbtSelected
 * @property {Array<sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElementEnriched>} results - Skus to show, in the order selectResults returned them
 */
declare class Apis {
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs an Ingest client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * Get Dataset Signed URLs
     *
     * Generates presigned URLs for accessing or mutating files in the specified dataset.
     *
     * @param {apiDszSignedUrlReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszSignedUrlResp>>}
     */
    dszSignedUrl(req: apiDszSignedUrlReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszSignedUrlResp>>;
    /**
     * List Dataset Tables
     *
     * Lists files and tables in the specified dataset.
     *
     * @param {apiDszTableListReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszTableListResp>>}
     */
    dszTableList(req: apiDszTableListReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszTableListResp>>;
    /**
     * Load Table File as JSON
     *
     * Load a table file from the datalake as JSON and return it.
     *
     * @param {apiDszResultLastBatchSummaryReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszResultLastBatchSummaryResp>>}
     */
    dszResultLastBatchSummary(req: apiDszResultLastBatchSummaryReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszResultLastBatchSummaryResp>>;
    /**
     *
     *
     *
     *
     * @param {apiPipezListReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiPipezListResp>>}
     */
    pipezList(req: apiPipezListReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiPipezListResp>>;
    /**
     *
     *
     *
     *
     * @param {apiPipezGetReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiPipezGetResp>>}
     */
    pipezGet(req: apiPipezGetReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiPipezGetResp>>;
    /**
     *
     *
     *
     *
     * @param {apiDszStoreDisplayCreateReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszStoreDisplayCreateResp>>}
     */
    dszStoreDisplayCreate(req: apiDszStoreDisplayCreateReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszStoreDisplayCreateResp>>;
    /**
     *
     *
     *
     *
     * @param {apiDszListStoresReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszListStoresResp>>}
     */
    dszListStores(req: apiDszListStoresReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszListStoresResp>>;
    /**
     * Get Ingestion Upload URLs
     *
     * Generates presigned PUT URLs and an ingestion token for uploading files into a target dataset table and partitions.
     *
     * @param {apiIngestzGetUrlReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiIngestzGetUrlResp>>}
     */
    ingestzGetUrl(req: apiIngestzGetUrlReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiIngestzGetUrlResp>>;
    /**
     * Event Ingestion
     *
     * Ingests events data into a target dataset table.
     *
     * @param {apiIngestzEventRelevanceFashionEventReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiIngestzEventRelevanceFashionEventResp>>}
     */
    ingestzEventRelevanceFashionEvent(req: apiIngestzEventRelevanceFashionEventReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiIngestzEventRelevanceFashionEventResp>>;
    /**
     * Get Dataset Table File
     *
     * Get table file by redirecting to its signed URL.
     *
     * @param {apiDszTableGetReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszTableGetResp>>}
     */
    dszTableGet(req: apiDszTableGetReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszTableGetResp>>;
    /**
     *
     *
     *
     *
     * @param {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiPipezStartRelevanceFashionRelevanceFashionBatchIngestResp>>}
     */
    pipezStartRelevanceFashionRelevanceFashionBatchIngest(req: apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiPipezStartRelevanceFashionRelevanceFashionBatchIngestResp>>;
    /**
     *
     *
     *
     *
     * @param {apiDszDatasetSolutionsReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszDatasetSolutionsResp>>}
     */
    dszDatasetSolutions(req: apiDszDatasetSolutionsReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszDatasetSolutionsResp>>;
    /**
     *
     *
     *
     *
     * @param {apiDszListIngestionTokensReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszListIngestionTokensResp>>}
     */
    dszListIngestionTokens(req: apiDszListIngestionTokensReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszListIngestionTokensResp>>;
    /**
     *
     *
     *
     *
     * @param {apiDszDeleteTokenReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszDeleteTokenResp>>}
     */
    dszDeleteToken(req: apiDszDeleteTokenReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszDeleteTokenResp>>;
    /**
     * Get Model Signed URLs
     *
     * Generates presigned URLs for accessing model files in the specified dataset.
     *
     * @param {apiDszModelGetReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszModelGetResp>>}
     */
    dszModelGet(req: apiDszModelGetReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszModelGetResp>>;
    /**
     * Event Ingestion
     *
     * Ingests events data into a target dataset table.
     *
     * @param {apiIngestzEventRelevanceFashionCatalogReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiIngestzEventRelevanceFashionCatalogResp>>}
     */
    ingestzEventRelevanceFashionCatalog(req: apiIngestzEventRelevanceFashionCatalogReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiIngestzEventRelevanceFashionCatalogResp>>;
    /**
     * Get Last Successful Ingestion Data Summary
     *
     * Returns the date of ingestion, rows count and distinct and null columns count
     *
     * @param {apiIngestzLastBatchSummaryReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiIngestzLastBatchSummaryResp>>}
     */
    ingestzLastBatchSummary(req: apiIngestzLastBatchSummaryReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiIngestzLastBatchSummaryResp>>;
    /**
     *
     *
     *
     *
     * @param {apiPipezStartRelevanceFashionRelevanceFashionMainReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiPipezStartRelevanceFashionRelevanceFashionMainResp>>}
     */
    pipezStartRelevanceFashionRelevanceFashionMain(req: apiPipezStartRelevanceFashionRelevanceFashionMainReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiPipezStartRelevanceFashionRelevanceFashionMainResp>>;
    /**
     *
     *
     *
     *
     * @param {apiDszCreateStoreReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszCreateStoreResp>>}
     */
    dszCreateStore(req: apiDszCreateStoreReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszCreateStoreResp>>;
    /**
     *
     *
     *
     *
     * @param {apiDszCreateIngestionTokenReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszCreateIngestionTokenResp>>}
     */
    dszCreateIngestionToken(req: apiDszCreateIngestionTokenReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszCreateIngestionTokenResp>>;
    /**
     *
     *
     *
     *
     * @param {apiDszCreateRecsysTokenReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszCreateRecsysTokenResp>>}
     */
    dszCreateRecsysToken(req: apiDszCreateRecsysTokenReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszCreateRecsysTokenResp>>;
    /**
     * Create Stripe Checkout
     *
     * Creates a Stripe checkout session for a subscription and returns its id and url.
     *
     * @param {apiDszStripeCheckoutReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszStripeCheckoutResp>>}
     */
    dszStripeCheckout(req: apiDszStripeCheckoutReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszStripeCheckoutResp>>;
    /**
     * Get Subscription
     *
     * Gets the plan and the status of the Stripe subscription of a dataset. The payload is empty for contracts without Stripe.
     *
     * @param {apiDszGetSubscriptionReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszGetSubscriptionResp>>}
     */
    dszGetSubscription(req: apiDszGetSubscriptionReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszGetSubscriptionResp>>;
    /**
     * Load Table File as JSON
     *
     * Load a table file from the datalake as JSON and return it.
     *
     * @param {apiDszResultRelevanceFashionCatalogReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszResultRelevanceFashionCatalogResp>>}
     */
    dszResultRelevanceFashionCatalog(req: apiDszResultRelevanceFashionCatalogReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszResultRelevanceFashionCatalogResp>>;
    /**
     *
     *
     *
     *
     * @param {apiDszStoreDisplayListReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszStoreDisplayListResp>>}
     */
    dszStoreDisplayList(req: apiDszStoreDisplayListReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszStoreDisplayListResp>>;
    /**
     *
     *
     *
     *
     * @param {apiDszListDatasetsReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszListDatasetsResp>>}
     */
    dszListDatasets(req: apiDszListDatasetsReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszListDatasetsResp>>;
    /**
     *
     *
     *
     *
     * @param {apiDszListRecsysTokensReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszListRecsysTokensResp>>}
     */
    dszListRecsysTokens(req: apiDszListRecsysTokensReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszListRecsysTokensResp>>;
    /**
     * Sample Fraction
     *
     * Sample API that performs a fraction operation
     *
     * @param {apiSampleFractionReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiSampleFractionResp>>}
     */
    sampleFraction(req: apiSampleFractionReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiSampleFractionResp>>;
}
export { Apis };
declare class SdkFuncs {
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs an SdkFuncs instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * @param {sdkFuncProductRelevanceFashionDashFunnelReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<sdkFuncProductRelevanceFashionDashFunnelOutput>}
     */
    productRelevanceFashionDashFunnelV1(req: sdkFuncProductRelevanceFashionDashFunnelReq, opts?: ServiceOptions): Promise<sdkFuncProductRelevanceFashionDashFunnelOutput>;
    /**
     * @param {sdkFuncProductRelevanceFashionDashAttachedRevenueReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<sdkFuncProductRelevanceFashionDashAttachedRevenueOutput>}
     */
    productRelevanceFashionDashAttachedRevenueV1(req: sdkFuncProductRelevanceFashionDashAttachedRevenueReq, opts?: ServiceOptions): Promise<sdkFuncProductRelevanceFashionDashAttachedRevenueOutput>;
    /**
     * @param {sdkFuncProductRelevanceFashionFbtReq} req
     * @param {(req: sdkFuncProductRelevanceFashionFbtReq, results: sdkFuncProductRelevanceFashionFbtOutput) => Promise<sdkFuncProductRelevanceFashionFbtSelected>} [selectResults] - picks which of the recommended skus are shown and may attach your own data to each in enriched; default: for each result, in order, the first sku not in req.input.skus (the cart) and not already picked, with the rating of that result; no duplicates, and results with no such sku are skipped
     * @param {ServiceOptions} [opts]
     * @returns {Promise<sdkFuncProductRelevanceFashionFbtSelected>}
     */
    productRelevanceFashionFbtV1(req: sdkFuncProductRelevanceFashionFbtReq, selectResults?: (req: sdkFuncProductRelevanceFashionFbtReq, results: sdkFuncProductRelevanceFashionFbtOutput) => Promise<sdkFuncProductRelevanceFashionFbtSelected>, opts?: ServiceOptions): Promise<sdkFuncProductRelevanceFashionFbtSelected>;
}
export { SdkFuncs };
/**
 * @fileoverview Service container managing SDK service instances and configuration.
 */
import { Invoker } from "../invoker/invoker.js";
import { Auth } from "../auth/auth.js";
import { Ingest } from "../ingest/ingest.js";
import { Apis, SdkFuncs } from "../sdkapis/sdkapis.js";
import { Infer } from "../infer/infer.js";
import { Dash } from "../dash/dash.js";
export type I6SdkConfig = import("../index.js").I6SdkConfig;
/**
 * @typedef {import("../index.js").I6SdkConfig} I6SdkConfig
 */
/**
 * Service container that instantiates and provides access to SDK service clients.
 * Every accessor returns a new client sharing this container's config and dispatcher.
 */
declare class Services {
    _dispatcher: EventTarget;
    /**
     * @private
     * @type {I6SdkConfig}
     */
    _config;
    /**
     * Constructs a Services instance.
     * @param {I6SdkConfig} config - Configuration object for the SDK services.
     */
    constructor(config: I6SdkConfig);
    /**
     * Returns the SDK configuration.
     * @returns {I6SdkConfig} The configuration object.
     */
    config(): I6SdkConfig;
    /**
     * Overwrites the given keys of the SDK configuration; the other keys are kept.
     * Clients read the config on every call, so the change is seen by every client of this container at once.
     * @param {Partial<I6SdkConfig>} config - The keys to overwrite.
     * @returns {void}
     */
    setConfig(config: Partial<I6SdkConfig>): void;
    /**
     * Registers an event listener on the internal event dispatcher.
     * @param {string} evt - The event type or name to listen for.
     * @param {EventListenerOrEventListenerObject|Function} fn - The callback function or event listener object invoked when the event occurs.
     * @returns {void}
     */
    bind(evt: string, fn: EventListenerOrEventListenerObject | Function): void;
    /**
     * Creates and returns an Invoker service instance.
     * @returns {Invoker} An instance of the Invoker client.
     */
    invoker(): Invoker;
    /**
     * Creates and returns an Auth service instance.
     * @returns {Auth} An instance of the Auth client.
     */
    auth(): Auth;
    /**
     * Creates and returns an Ingest service instance.
     * @returns {Ingest} An instance of the Ingest client.
     */
    ingest(): Ingest;
    /**
     * Creates and returns an Infer service instance.
     * @returns {Infer} An instance of the Infer client.
     */
    infer(): Infer;
    /**
     * Creates and returns a Dash service instance.
     * @returns {Dash} An instance of the Dash client.
     */
    dash(): Dash;
    /**
     * Creates and returns an Apis service instance.
     * @returns {Apis} An instance of the generated Apis client.
     */
    apis(): Apis;
    /**
    * Creates and returns a Funcs service instance.
    * @returns {SdkFuncs} An instance of the generated SdkFuncs client.
    */
    funcs(): SdkFuncs;
}
export { Services, Apis, SdkFuncs };
/**
 * @fileoverview Authentication client. Looks up the signed-in user and sends
 * unauthenticated browsers to the login page. Requests carry the session
 * cookie (credentials are always included by the Invoker).
 */
export type Services = import("../services/services.js").Services;
export type AuthPayload = {
    /**
     * -
     */
    sub_type?: string;
    /**
     * - user id
     */
    sub?: string;
    /**
     * -
     */
    ext?: string;
    /**
     * - display name
     */
    display?: string;
};
/**
 * @typedef {import("../services/services.js").Services} Services
 */
/**
 * Configuration options for the i6 SDK.
 * @typedef {Object} AuthPayload
 * @property {string} [sub_type] -
 * @property {string} [sub] - user id
 * @property {string} [ext] -
 * @property {string} [display] - display name
 */
/**
 * Authentication client for handling user sessions and authentication requests.
 * Obtain an instance with `i6sdk.auth()` rather than constructing it directly.
 */
declare class Auth {
    #private;
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs an Auth client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * Redirects the browser to the login page, passing the current URL (encoded)
     * as `backurl` so the user returns to this page after signing in.
     * Navigates away from the page; code after the call may not run.
     * @private
     * @returns {void}
     */
    private #redirectToLogin;
    /**
     * Redirects the browser to the logout page, passing the given URL (encoded)
     * as `backurl` so the user returns to it after signing out.
     * Navigates away from the page; code after the call may not run.
     * @private
     * @param {string} backurl - The URL to return to after logging out.
     * @returns {void}
     */
    private #redirectToLogout;
    /**
     * Fetches the current authenticated user profile (`GET api/auth/me`).
     * Does not redirect; use {@link Auth#requireUser} to force a login.
     * @returns {Promise<AuthPayload|null>} The user profile data, or null if the
     *   server returns no user.
     * @throws {Error} If the network request fails or the response body is not valid JSON.
     */
    user(): Promise<AuthPayload | null>;
    /**
     * Fetches the current user, redirecting the browser to the login page when
     * there is none. The login page sends the user back to the current URL
     * afterwards.
     * @returns {Promise<AuthPayload|null>} The user profile data, or null when the
     *   browser is being redirected to login.
     * @throws {Error} If the network request fails or the response body is not valid JSON.
     */
    requireUser(): Promise<AuthPayload | null>;
    /**
     * Logs out the current user by redirecting the browser to the logout endpoint.
     * The server clears the session and redirects the browser back to `backurl`.
     * Navigates away from the page; code after the call may not run.
     * @param {string} [backurl=location.href] - The URL to return to after logging out.
     *   Defaults to the current page URL.
     * @returns {Promise<void>}
     */
    logout(backurl?: string): Promise<void>;
}
export { Auth };
/**
 * @fileoverview Queries an i6 dash in the browser: downloads the dash's sqlite, runs the named query
 * `dash-${dashName}` on it and returns its result as is. Nothing here is dash specific.
 *
 * Set `window.I6_DEBUG = true` to see what happens in the console.
 */
export type Services = import("../services/services.js").Services;
export type ServiceOptions = import("../invoker/invoker.js").ServiceOptions;
export type DashOptions = {
    /**
     * - Dash name (e.g. "product-relevance-fashion-dash-funnel"); names the cached sqlite and the named query.
     */
    dashName: string;
    /**
     * - Partitions of the dash, name -> value (e.g. `{ store_id: "s1", version: "v1" }`).
     */
    partitions: Record<string, string>;
    /**
     * - Dataset that holds the dash file.
     */
    dataset: string;
    /**
     * - Query input, any JSON. Bound as `?1` of the named query.
     */
    params: any;
    /**
     * - Tests only: URL of the sqlite (must answer HEAD with an etag). Default: the model API.
     */
    sqliteUrl?: string;
    /**
     * - Given to the API call that signs the sqlite URL.
     */
    serviceOpts?: ServiceOptions;
};
/**
 * Dash client.
 */
declare class Dash {
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs a Dash client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * Downloads the dash sqlite (cached by etag), runs the named query `dash-${dashName}` with `params` and returns its result.
     * @param {DashOptions} opts - Dash options.
     * @returns {Promise<*>} The `ret` of the named query.
     * @throws {I6Error} With code "invalid_argument" if opts is malformed, "asset" if the download fails,
     *   "query" if the sqlite fails.
     */
    query(opts: DashOptions): Promise<any>;
    /**
     * Finds where the dash sqlite is: the signed URL of the model API (like Infer), unless opts has `sqliteUrl` (tests).
     * @private
     * @param {DashOptions} opts - Dash options.
     * @returns {Promise<string>} Download URL of the sqlite.
     * @throws {I6Error} With code "asset" if the API gave no URL.
     */
    private _sqliteUrl;
}
export { Dash };
/**
 * @fileoverview The LiteRT side of infer: loads the tflite model and runs it. Everything that touches the
 * LiteRT library (runtime, model, tensors) is in this file. The caller only gives data and gets values back.
 */
export type FileRef = import("../internal/fs/fs.js").FileRef;
export type ModelInput = {
    /**
     * - Flat values; their count must be the product of `shape`.
     */
    data: number[];
    /**
     * - Shape of `data`.
     */
    shape: number[];
};
/**
 * Loads the LiteRT runtime (once) and the tflite model. Everything LiteRT stays inside this file. The file is only
 * read and compiled when its version changed since the last call.
 * @param {Object} opts
 * @param {FileRef} opts.ref - The downloaded .tflite file.
 * @param {string} [opts.wasmUrl] - URL of the folder with the LiteRT wasm files. Defaults to the jsdelivr copy.
 * @returns {Promise<Object>} The compiled model, to give to `runModel` and `describeModel`.
 * @throws {I6Error} With code "asset" if the file is not a tflite file, "model" if the runtime or the model cannot be loaded.
 */
declare function loadModel(opts: {
    ref: FileRef;
    wasmUrl?: string;
}): Promise<Object>;
/**
 * Names, dtypes and shapes of what the model takes and returns.
 * @param {Object} model - The compiled model, from `loadModel`.
 * @returns {{inputs: Object[], outputs: Object[]}}
 */
declare function describeModel(model: Object): {
    inputs: Object[];
    outputs: Object[];
};
/**
 * Checks one input against the model's shape.
 * @param {string} name - Input name, for error messages.
 * @param {ModelInput} input - What the caller gave.
 * @param {number[]} modelShape - Shape of the model input (-1 is free).
 * @returns {{flat: number[], shape: number[]}}
 * @throws {I6Error} With code "invalid_argument" if the data does not fit the model's shape.
 */
declare function toTensorData(name: string, input: ModelInput, modelShape: number[]): {
    flat: number[];
    shape: number[];
};
/**
 * Runs the model. The caller only gives data: every LiteRT tensor is created and freed here.
 * Every model input must be in `inputs` under its exact name.
 * @param {Object} model - The compiled model, from loadModel.
 * @param {Record<string, ModelInput>} inputs - Input name -> data.
 * @returns {Promise<Record<string, ArrayLike<number>>>} Output name -> values, for every output of the model.
 * @throws {I6Error} With code "invalid_argument" if an input is missing or its data does not fit the model, "model" if the run fails.
 */
declare function runModel(model: Object, inputs: Record<string, ModelInput>): Promise<Record<string, ArrayLike<number>>>;
export { loadModel, describeModel, runModel, toTensorData };
/**
 * @fileoverview Runs an i6 model (e.g. "relevance-fashion-fbt") in the browser and returns the result.
 *
 * Flow: get the model's sqlite + tflite (URLs from the model signed-get API, or from the caller in tests),
 * run the named query `model-${modelName}-input` (its result is the model inputs, `{name: {data, shape}}`),
 * run the tflite model, and run the named query `model-${modelName}-output` with the model outputs.
 * Its result is returned as is. Nothing here is model specific.
 *
 * Set `window.I6_DEBUG = true` to see what happens in the console, and to get the model tensors in the "i6:infer-tensors" event.
 */
export type Services = import("../services/services.js").Services;
export type FileRef = import("../internal/fs/fs.js").FileRef;
export type ServiceOptions = import("../invoker/invoker.js").ServiceOptions;
export type InferOptions = {
    /**
     * - Model name (e.g. "relevance-fashion-fbt"); names the cached assets and the named queries.
     */
    modelName: string;
    /**
     * - Partitions of the model, name -> value (e.g. `{ version: "v1", store_id: "s1" }`). Any partitions.
     */
    partitions: Record<string, string>;
    /**
     * - Dataset that holds the model files.
     */
    dataset: string;
    /**
     * - Model input, any JSON (e.g. `{ skus: [...] }`). Bound as `?1` of the input query.
     */
    params: any;
    /**
     * - Id of the user session; sent in the recommendation events.
     */
    sessionId: string;
    /**
     * - Id of the user; sent in the recommendation events.
     */
    userId: string;
    /**
     * - Max number of results asked from the output query (its `?2`). Default 20.
     */
    limit?: number;
    /**
     * - Tests only, together with `tfliteUrl`: URL of the sqlite (must answer HEAD with an etag). Default: the model API.
     */
    sqliteUrl?: string;
    /**
     * - Tests only, together with `sqliteUrl`: URL of the tflite.
     */
    tfliteUrl?: string;
    /**
     * - URL of the folder with the LiteRT wasm files (ending in "/"). Defaults to the jsdelivr copy.
     */
    litertWasm?: string;
    /**
     * - Given to the API calls (the model API and the `recraw` event).
     */
    serviceOpts?: ServiceOptions;
};
export type SelectResultsOptions = {
    /**
     * - Dataset that receives the `recraw` and `recshow` events.
     */
    dataset: string;
    /**
     * - Model that made the recommendation (e.g. "relevance-fashion-fbt").
     */
    modelName: string;
    /**
     * - Version of that model.
     */
    modelVersion: string;
    /**
     * - Store of the event.
     */
    storeId: string;
    /**
     * - Id of the user session; sent in the recommendation events.
     */
    sessionId: string;
    /**
     * - Id of the user; sent in the recommendation events.
     */
    userId: string;
    /**
     * - What the caller asked for; given as is to `selectResults`.
     */
    req: any;
    /**
     * - What `run` returned (its `rec_id` is the id of the recommendation); given as is to `selectResults`.
     */
    results: any;
    /**
     * - Id of the recommendation, the `rec_id` that `run` returned. Same as in the `recraw` event that `run` sent; sent in the `recshow` event.
     */
    recId: string;
    /**
     * - Picks which of the recommended skus are shown: returns
     * `{ results: [{ sku_id, rating?, enriched? }] }`. Only `sku_id` is sent (in the `recshow` event); `enriched` is any data of
     * your own for the sku (e.g. name, price, image), returned to you as is. Default: `defaultSelectResults`.
     */
    selectResults?: (req: any, results: any) => Promise<any>;
    /**
     * - Given to the API call of the `recshow` event.
     */
    serviceOpts?: ServiceOptions;
};
/**
 * Inference client.
 */
declare class Infer {
    #private;
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs an Infer client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * Runs the model for the given params and returns what the output query gives.
     * @param {InferOptions} opts - Inference options.
     * @returns {Promise<*>} The `ret` of the named query `model-${modelName}-output`, plus a generated `rec_id` (uuid). Sends the `recraw` event with that id.
     * @throws {I6Error} With code "invalid_argument" if opts is malformed, has no `sessionId` and `userId` or the model inputs do not fit the model,
     *   "asset" if a download fails, "model" if loading or running the model fails, "query" if the sqlite fails.
     */
    run(opts: InferOptions): Promise<any>;
    /**
     * Asks `selectResults` which of the recommended skus are shown and sends their sku ids as the `recshow` event.
     * @param {SelectResultsOptions} opts - Select options.
     * @returns {Promise<*>} What `selectResults` returned, as is (the default sets the `rating` of each sku; see `defaultSelectResults`).
     * @throws {I6Error} With code "invalid_argument" if `selectResults` is not a function, `recId` is missing, `opts` has no `sessionId` and
     *   `userId`, or `selectResults` returned an item with no `sku_id` or a sku not in the results; "event" if an event is not accepted.
     */
    selectResults(opts: SelectResultsOptions): Promise<any>;
    /**
     * Sends one recommendation event.
     * @private
     * @param {{dataset: string, modelName: string, modelVersion: string, storeId: string, serviceOpts?: ServiceOptions}} opts - Event options.
     * @param {{sessionId: string, userId: string}} ids - Session and user of the sdk.
     * @param {string} recId - Id of the recommendation, the same in the recraw and recshow events.
     * @param {"recraw"|"recshow"} kind - Which event.
     * @param {*} payload - What the event carries, any JSON.
     * @returns {Promise<void>}
     * @throws {I6Error} With code "event" if the event is not accepted.
     */
    private #sendRecEvent;
    /**
     * Finds where the model files are: the signed URLs of the model API, unless opts has both URLs (tests).
     * @private
     * @param {InferOptions} opts - Inference options.
     * @returns {Promise<{sqlite: string, tflite: string}>} Download URLs of the files.
     * @throws {I6Error} With code "asset" if the API gave no URL for a file.
     */
    private _assetUrls;
}
export { Infer };
/**
 * @fileoverview Base64 URL safe encoding utilities.
 */
/**
 * Encodes a string or Uint8Array to a Base64 URL safe string.
 * @param {string|Uint8Array|ArrayBuffer} data
 * @returns {string}
 */
export declare function encodeUrlSafe(data: string | Uint8Array | ArrayBuffer): string;
/**
 * Decodes a Base64 URL safe string to a Uint8Array.
 * @param {string} b64UrlSafe
 * @returns {Uint8Array}
 */
export declare function decodeUrlSafeToBytes(b64UrlSafe: string): Uint8Array;
/**
 * Decodes a Base64 URL safe string to a UTF-8 string.
 * @param {string} b64UrlSafe
 * @returns {string}
 */
export declare function decodeUrlSafe(b64UrlSafe: string): string;
/**
 * @fileoverview Gzip compression utilities.
 */
/**
 * Compresses data (string, Uint8Array, or ArrayBuffer) using gzip.
 * @param {string|Uint8Array|ArrayBuffer} data - The data to compress.
 * @returns {Promise<Uint8Array>} The gzipped bytes.
 */
export declare function gzip(data: string | Uint8Array | ArrayBuffer): Promise<Uint8Array>;
/**
 * Decompresses gzipped bytes to a UTF-8 string.
 * @param {Uint8Array|ArrayBuffer} compressedBytes - The gzipped data.
 * @returns {Promise<string>} The decompressed string.
 */
export declare function gunzipString(compressedBytes: Uint8Array | ArrayBuffer): Promise<string>;
/**
 * Decompresses gzipped bytes and returns raw Uint8Array.
 * @param {Uint8Array|ArrayBuffer} compressedBytes - The gzipped data.
 * @returns {Promise<Uint8Array>} The decompressed bytes.
 */
export declare function gunzip(compressedBytes: Uint8Array | ArrayBuffer): Promise<Uint8Array>;
/**
 * Gzips a string and encodes it as a Base64 URL safe string.
 * @param {string} str - The string to compress and encode.
 * @returns {Promise<string>} The Base64 URL safe string.
 */
export declare function gzipStringToBase64Url(str: string): Promise<string>;
/**
 * Decodes a Base64 URL safe string and decompresses it as a UTF-8 string.
 * @param {string} b64Str - The Base64 URL safe string.
 * @returns {Promise<string>} The decompressed string.
 */
export declare function gunzipStringFromBase64Url(b64Str: string): Promise<string>;
/**
 * Gzips a given JSON object or array.
 * @param {any} obj - The JSON serializable object to compress.
 * @returns {Promise<Uint8Array>} The gzipped bytes.
 */
export declare function gzipJson(obj: any): Promise<Uint8Array>;
/**
 * Decompresses a gzipped byte array into a JSON object.
 * @param {Uint8Array|ArrayBuffer} compressedBytes - The gzipped data.
 * @returns {Promise<any>} The parsed JSON object.
 */
export declare function gunzipJson(compressedBytes: Uint8Array | ArrayBuffer): Promise<any>;
/**
 * Gzips a JSON object and encodes it as a Base64 URL safe string.
 * @param {any} obj - The JSON serializable object.
 * @returns {Promise<string>} The Base64 URL safe encoded string of the gzipped JSON.
 */
export declare function gzipJsonToBase64Url(obj: any): Promise<string>;
/**
 * Decodes a Base64 URL safe string, gunzips it, and parses it as JSON.
 * @param {string} b64Str - The Base64 URL safe string containing gzipped JSON.
 * @returns {Promise<any>} The parsed JSON object.
 */
export declare function gunzipJsonFromBase64Url(b64Str: string): Promise<any>;
/**
 * @fileoverview Versioned file store on the browser's origin private file system (OPFS).
 *
 * Layout under `i6/fs`:
 *   {name}/version.txt          the released (current) version, if any
 *   {name}/v{version}/etag.txt  the etag the version was created for
 *   {name}/v{version}/blob.bin  the content (written by the caller, see `resolve`)
 *
 * Versions are ISO timestamps, so they sort in creation order.
 */
export type FileRef = {
    /**
     * - File name, a single OPFS directory name (e.g. "model").
     */
    name: string;
    /**
     * - Version id, an ISO timestamp (e.g. "2026-09-29T12:00:00.000Z").
     */
    version: string;
    /**
     * - Etag of the remote content this version was created for.
     */
    etag: string;
};
/**
 * Versioned file store. Use the `fs` singleton.
 *
 * A file is created as a new unreleased version, filled, then released to become the
 * current one; releasing removes the older versions.
 */
declare class FS {
    /**
     * Removes the versions older than version.txt, and the whole file if it is left empty.
     * Without version.txt no version is removed.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @returns {Promise<void>}
     */
    cleanFile(opts: {
        name: string;
    }): Promise<void>;
    /**
     * Cleans all files, see cleanFile.
     * @returns {Promise<void>}
     */
    clean(): Promise<void>;
    /**
     * Resolves a version of a file.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} [opts.version] - defaults to the content of version.txt
     * @returns {Promise<FileRef|null>} a new full FileRef, or null if it does not exist.
     */
    get(opts: {
        name: string;
        version?: string;
    }): Promise<FileRef | null>;
    /**
     * Creates a new version, unless the latest version already has this etag.
     * The new version is not released.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.etag - required
     * @param {Blob|BufferSource|string} [opts.data] - content, required when a new version is created
     * @returns {Promise<FileRef>} a new full FileRef.
     */
    create(opts: {
        name: string;
        etag: string;
        data?: Blob | BufferSource | string;
    }): Promise<FileRef>;
    /**
     * Returns the bin file path, full (with base). Does not check that it exists, see get.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.version - required
     * @returns {Promise<string>} e.g. "i6/fs/{name}/v{version}/blob.bin"
     */
    resolve(opts: {
        name: string;
        version: string;
    }): Promise<string>;
    /**
     * Reads the content (blob.bin) of a version.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.version - required
     * @returns {Promise<Uint8Array>} the bytes of the file.
     * @throws {DOMException} NotFoundError if the version or its blob does not exist.
     */
    read(opts: {
        name: string;
        version: string;
    }): Promise<Uint8Array>;
    /**
     * Makes a version the current one (version.txt), then cleans the older versions.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.version - required, must exist
     * @returns {Promise<FileRef>} a new full FileRef of the released version.
     */
    release(opts: {
        name: string;
        version: string;
    }): Promise<FileRef>;
    /**
     * Removes a version that was never released (e.g. its download failed). Does nothing if it does not exist.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.version - required, must not be the released one
     * @returns {Promise<void>}
     */
    discard(opts: {
        name: string;
        version: string;
    }): Promise<void>;
}
/** Shared FS instance. */
declare const fs: FS;
export { fs };
/**
 * @fileoverview Helpers shared by the services that run on files downloaded from i6 (infer, dash).
 */
export type FileRef = import("../fs/fs.js").FileRef;
/**
 * @typedef {import("../fs/fs.js").FileRef} FileRef
 */
/**
 * @param {Object<string, string>} partitions - Partitions, name -> value.
 * @returns {string} A stable key of the partitions, safe as part of a cache file name (e.g. "store_id%3Ds1-version%3Dv1").
 */
declare function partitionsKey(partitions: Record<string, string>): string;
/**
 * @param {*} partitions - Value to check.
 * @returns {boolean} True if it is an object (not an array) whose values are all strings.
 */
declare function isPartitions(partitions: any): boolean;
/**
 * Brings one remote file to the browser cache, downloading it only if its etag changed.
 * @param {string} name - Name of the cached file.
 * @param {string} url - URL of the file.
 * @returns {Promise<FileRef>} The cached file.
 * @throws {I6Error} With code "asset" if the download fails; `status` is the HTTP status when the server answered
 *   (404 when the file does not exist, e.g. a store or month without data) and `cause` is the underlying error.
 */
declare function downloadFile(name: string, url: string): Promise<FileRef>;
export { partitionsKey, isPartitions, downloadFile };
/**
 * @fileoverview Sqlite client for the SDK, running sqlite (sql.js, wasm) in the browser.
 *
 * Usage: get the file with the downloader, open it by its OPFS path and always close the
 * connection when done:
 *
 *   const ref = await downloader.update({ name, url })
 *   const conn = await sqlitez.open({ path: await fs.resolve(ref) })
 *   try {
 *     const rows = await conn.query({ query: 'SELECT * FROM t WHERE id = ?', params: [1] })
 *   } finally {
 *     await conn.close()
 *   }
 *
 * The database lives in memory: `update` changes the memory copy, the file is never written back.
 * Every method takes a single `opts` object with the real parameters inside it.
 */
export type SqliteValue = number | string | null | Uint8Array;
export type SqliteRow = Record<string, SqliteValue>;
/**
 * An open sqlite database. Get one with `sqlitez.open` and always call `close()` in a `finally`.
 */
declare class SqliteConn {
    #private;
    /** @private */
    db;
    /**
     * Use `sqlitez.open`, not this constructor.
     * @param {Object} db - The sql.js database.
     */
    constructor(db: Object);
    /**
     * Closes the connection, freeing the database. Closing twice is fine.
     * @returns {Promise<void>}
     */
    close(): Promise<void>;
    /**
     * Runs a query and returns its rows.
     * @param {Object} opts
     * @param {string} opts.query - required, the SQL; use `?` for values.
     * @param {SqliteValue[]} [opts.params] - values bound, in order, to the `?` of the query (never concatenate them).
     * @returns {Promise<SqliteRow[]>} The rows (empty array when none), each one an object by column name.
     * @throws {TypeError} If opts.query is missing.
     * @throws {I6Error} With code "query" if the connection is closed or sqlite rejects the query.
     */
    query(opts: {
        query: string;
        params?: SqliteValue[];
    }): Promise<SqliteRow[]>;
    /**
     * Runs a statement that returns no data (INSERT, UPDATE, CREATE, ...). Only the memory copy changes.
     * @param {Object} opts
     * @param {string} opts.query - required, the SQL; use `?` for values.
     * @param {SqliteValue[]} [opts.params] - values bound, in order, to the `?` of the query.
     * @returns {Promise<void>}
     * @throws {TypeError} If opts.query is missing.
     * @throws {I6Error} With code "query" if the connection is closed or sqlite rejects the statement.
     */
    update(opts: {
        query: string;
        params?: SqliteValue[];
    }): Promise<void>;
    /**
     * Runs a query stored in the `namedqueries` table of the sqlite (columns `name` and `query`).
     * @param {Object} opts
     * @param {string} opts.name - required, the `name` of the stored query.
     * @param {SqliteValue[]} [opts.params] - values bound, in order, to the `?` of the stored query.
     * @returns {Promise<SqliteRow[]>} The rows of the stored query, like `query`.
     * @throws {TypeError} If opts.name is missing.
     * @throws {I6Error} With code "query" if the connection is closed, there is no such table or named query, or the query fails.
     */
    namedQuery(opts: {
        name: string;
        params?: SqliteValue[];
    }): Promise<SqliteRow[]>;
    /**
     * Like `namedQuery`, but with JSON in and JSON out: each value of `opts.params`
     * is bound as a JSON string to the positional `?1`, `?2`, ... of the stored query, in order (read them in SQL with
     * `json_extract(?1, '$.field')`, `json_each(?2)`, ...). The stored query must return a row with a column `ret`
     * holding a JSON string. That JSON is parsed and returned.
     * The stored query must have a placeholder for every value, otherwise sqlite rejects the bind ("column index out of range").
     * @param {Object} opts
     * @param {string} opts.name - required, the `name` of the stored query (see `namedQuery`).
     * @param {Array<*>} [opts.params] - JSON-serializable values, bound in order as `?1`, `?2`, ... Default: none.
     * @returns {Promise<*>} The parsed `ret` of the first row, or null if there is no row or `ret` is null.
     * @throws {TypeError} If opts.name is missing or opts.params is not an array.
     * @throws {I6Error} With code "query" if `namedQuery` fails, the rows have no `ret` column, or `ret` is not valid JSON.
     */
    namedJsonQuery(opts: {
        name: string;
        params?: Array<any>;
    }): Promise<any>;
}
/**
 * Sqlitez client. Use the `sqlitez` singleton.
 */
declare class Sqlitez {
    /**
     * Opens a sqlite file of the browser file system into memory.
     * @param {Object} opts
     * @param {string} opts.path - required, OPFS path of the file (what `fs.resolve` returns for a downloaded file).
     * @returns {Promise<SqliteConn>} The connection. The caller must `close()` it.
     * @throws {TypeError} If opts.path is missing.
     * @throws {I6Error} With code "asset" if the file cannot be read or is not a sqlite file.
     */
    open(opts: {
        path: string;
    }): Promise<SqliteConn>;
}
/** Shared Sqlitez instance. */
declare const sqlitez: Sqlitez;
export { sqlitez };
/**
 * @fileoverview Keeps a remote file cached in the browser's file system (see fs.js),
 * downloading it only when its etag changes.
 */
export type FileRef = import('../fs/fs.js').FileRef;
/**
 * Downloads remote files into the versioned file store. Use the `downloader` singleton.
 */
declare class Downloader {
    /**
     * Downloads the file by name if necessary (checking etag): sends a HEAD request, and
     * if the etag differs from the released version, streams the body into a new version
     * and releases it.
     * @param {Object} opts
     * @param {string} opts.name - required, name to store the file under (see fs.js)
     * @param {string} opts.url - required, URL of the file; must answer HEAD with an etag
     * @returns {Promise<FileRef>} the FileRef of the up-to-date file (basically to get the version)
     * @throws {TypeError} If name or url is missing.
     * @throws {Error} If the HEAD or GET request fails, or the HEAD response has no etag.
     *   When the server answered, the error has `status` (the HTTP status code).
    */
    update(opts: {
        name: string;
        url: string;
    }): Promise<FileRef>;
}
/** Shared Downloader instance. */
declare const downloader: Downloader;
export { downloader };
/**
 * @fileoverview Debug logging of the SDK. Set `window.I6_DEBUG = true` to see it in the console.
 */
/**
 * @param {string} prefix - Printed first, followed by ":" (e.g. "infer").
 * @returns {(...args: *) => void} A logger that prints only when `window.I6_DEBUG` is true.
 */
declare const debugLogger: (prefix: string) => (...args: any) => void;
export { debugLogger };
