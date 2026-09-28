/**
 * @fileoverview HTTP client for sending API requests to i6 services.
 */
export type Services = import("../services/services.js").Services;
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
};
/**
 * @typedef {import("../services/services.js").Services} Services
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
     * @param {string} [opts.url] - The full URL to request. If omitted, defaults to `${baseUrl}/${path}`.
     * @param {string} [opts.path] - The path to append to the baseUrl if `url` is not provided.
     * @param {Record<string, any>} [opts.query] - Key-value pairs to append as query parameters.
     * @param {*} [opts.json] - JSON-serializable body data. If provided, sets Content-Type header to application/json and serializes to body.
     * @returns {Promise<Response>} A promise that resolves to the fetch Response.
     */
    invoke(opts: InvokeOptions): Promise<Response>;
}
export { Invoker };
/**
 * @fileoverview Main entry point for the i6 Web Legacy SDK.
 */
import { I6Error } from "./errors.js";
export type I6SdkConfig = import("./types.js").I6SdkConfig;
export type Ingest = import("./ingest/ingest.js").Ingest;
export type Auth = import("./auth/auth.js").Auth;
export type Pipe = import("./pipe/pipe.js").Pipe;
export type Dataset = import("./dataset/dataset.js").Dataset;
/**
 * Main SDK class providing access to i6 services.
 */
declare class I6Sdk {
    /**
     * @private
     * @type {Services}
     */
    _service;
    _config: {
        baseUrl?: string;
    };
    /**
     * Constructs an instance of the i6 SDK.
     * @param {I6SdkConfig} [config] - Configuration options for the SDK.
     */
    constructor(config?: I6SdkConfig);
    /**
     * Returns an Ingest service instance.
     * @returns {Ingest} An instance of the Ingest client.
     */
    ingest(): Ingest;
    /**
     * Returns an Auth service instance.
     * @returns {Auth} An instance of the Auth client.
     */
    auth(): Auth;
    /**
     * Returns a Pipe service instance.
     * @returns {Pipe} An instance of the Pipe client.
     */
    pipe(): Pipe;
    /**
     * Returns a Dataset service instance.
     * @returns {Dataset} An instance of the Dataset client.
     */
    dataset(): Dataset;
    /**
     * Registers an event listener on the internal event dispatcher.
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
};
export type UploadResult = {
    /**
     * - Id the server assigned to this ingest.
     */
    ingestId: string;
};
/**
 * @typedef {import("../services/services.js").Services} Services
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
    upload({ dataset, table, partitions, file, onProgress, signal, contentType }: UploadParams): Promise<UploadResult>;
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
export type I6ErrorCode = "http" | "network" | "invalid_argument" | "no_upload_url";
/**
 * @typedef {"http"|"network"|"invalid_argument"|"no_upload_url"} I6ErrorCode
 */
/**
 * Error thrown by the SDK when a call fails.
 *
 * `code` tells what kind of failure it was, so callers can branch on it instead of parsing
 * the message. `status` and `body` are set for `"http"` failures.
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
export { I6Error };
/**
 * apiDszDomainSelect Request
 * @typedef {object} apiDszDomainSelectReq
 * @property {apiDszDomainSelectparams} params
 * @property {apiDszDomainSelectreqPayload} payload
 */
export type apiDszDomainSelectReq = {
    params: apiDszDomainSelectparams;
    payload: apiDszDomainSelectreqPayload;
};
export type apiDszDomainSelectResp = object;
export type apiDszDomainSelectparams = {
    dataset: string;
};
export type apiDszDomainSelectreqPayload = {
    domain: string;
    solution: string;
    store: string;
};
export type apiIngestzGetUrlReq = {
    params: apiIngestzGetUrlparams;
    payload: apiIngestzGetUrlreqPayload;
};
export type apiIngestzGetUrlResp = {
    payload: apiIngestzGetUrlrespPayload;
};
export type apiIngestzGetUrlparams = {
    dataset: string;
};
export type apiIngestzGetUrlreqPayload = {
    amount: number;
    partitions: Record<string, string>;
    table: string;
};
export type apiIngestzGetUrlrespPayload = object;
export type apiPipezStartReq = {
    params: apiPipezStartparams;
    payload: apiPipezStartreqPayload;
};
export type apiPipezStartResp = {
    payload: apiPipezStartrespPayload;
};
export type apiPipezStartparams = {
    dataset: string;
};
export type apiPipezStartreqPayload = {
    params: Array<object>;
    pipename: string;
    solution_domain: string;
};
export type apiPipezStartrespPayload = object;
export type apiSamplefractionReq = {
    params: apiSamplefractionparams;
    query: apiSamplefractionquery;
    headers: apiSamplefractionreqHeaders;
    payload: apiSamplefractionreqPayload;
};
export type apiSamplefractionResp = {
    headers: apiSamplefractionrespHeaders;
    payload: apiSamplefractionrespPayload;
};
export type apiSamplefractionparams = {
    denominator: number;
    numerator: number;
};
export type apiSamplefractionquery = {
    precision: number;
};
export type apiSamplefractionreqHeaders = {
    x_i6_trace_id: string;
};
export type apiSamplefractionreqPayload = {
    reason: string;
};
export type apiSamplefractionrespHeaders = {
    x_i6_trace_message: string;
};
export type apiSamplefractionrespPayload = {
    display: string;
    result: string;
};
/**
 * apiDszDomainSelect Response
 * @typedef {object} apiDszDomainSelectResp
 */
/**
 * @typedef {object} apiDszDomainSelectparams
 * @property {string} dataset
 */
/**
 * @typedef {object} apiDszDomainSelectreqPayload
 * @property {string} domain
 * @property {string} solution
 * @property {string} store
 */
/**
 * apiIngestzGetUrl Request
 * @typedef {object} apiIngestzGetUrlReq
 * @property {apiIngestzGetUrlparams} params
 * @property {apiIngestzGetUrlreqPayload} payload
 */
/**
 * apiIngestzGetUrl Response
 * @typedef {object} apiIngestzGetUrlResp
 * @property {apiIngestzGetUrlrespPayload} payload
 */
/**
 * @typedef {object} apiIngestzGetUrlparams
 * @property {string} dataset
 */
/**
 * @typedef {object} apiIngestzGetUrlreqPayload
 * @property {number} amount
 * @property {Record<string, string>} partitions
 * @property {string} table
 */
/**
 * @typedef {object} apiIngestzGetUrlrespPayload
 */
/**
 * apiPipezStart Request
 * @typedef {object} apiPipezStartReq
 * @property {apiPipezStartparams} params
 * @property {apiPipezStartreqPayload} payload
 */
/**
 * apiPipezStart Response
 * @typedef {object} apiPipezStartResp
 * @property {apiPipezStartrespPayload} payload
 */
/**
 * @typedef {object} apiPipezStartparams
 * @property {string} dataset
 */
/**
 * @typedef {object} apiPipezStartreqPayload
 * @property {Array<object>} params
 * @property {string} pipename
 * @property {string} solution_domain
 */
/**
 * @typedef {object} apiPipezStartrespPayload
 */
/**
 * apiSamplefraction Request
 * @typedef {object} apiSamplefractionReq
 * @property {apiSamplefractionparams} params
 * @property {apiSamplefractionquery} query
 * @property {apiSamplefractionreqHeaders} headers
 * @property {apiSamplefractionreqPayload} payload
 */
/**
 * apiSamplefraction Response
 * @typedef {object} apiSamplefractionResp
 * @property {apiSamplefractionrespHeaders} headers
 * @property {apiSamplefractionrespPayload} payload
 */
/**
 * @typedef {object} apiSamplefractionparams
 * @property {number} denominator
 * @property {number} numerator
 */
/**
 * @typedef {object} apiSamplefractionquery
 * @property {number} precision
 */
/**
 * @typedef {object} apiSamplefractionreqHeaders
 * @property {string} x_i6_trace_id
 */
/**
 * @typedef {object} apiSamplefractionreqPayload
 * @property {string} reason
 */
/**
 * @typedef {object} apiSamplefractionrespHeaders
 * @property {string} x_i6_trace_message
 */
/**
 * @typedef {object} apiSamplefractionrespPayload
 * @property {string} display
 * @property {string} result
 */
/**
 * @param {import("../services/services.js").Services} services
 * @param {apiSamplefractionReq} req
 * @returns {Promise<apiSamplefractionResp>}
 */
export declare function apiSamplefraction(services: import("../services/services.js").Services, req: apiSamplefractionReq): Promise<apiSamplefractionResp>;
/**
 * @param {import("../services/services.js").Services} services
 * @param {apiIngestzGetUrlReq} req
 * @returns {Promise<apiIngestzGetUrlResp>}
 */
export declare function apiIngestzGetUrl(services: import("../services/services.js").Services, req: apiIngestzGetUrlReq): Promise<apiIngestzGetUrlResp>;
/**
 * @param {import("../services/services.js").Services} services
 * @param {apiPipezStartReq} req
 * @returns {Promise<apiPipezStartResp>}
 */
export declare function apiPipezStart(services: import("../services/services.js").Services, req: apiPipezStartReq): Promise<apiPipezStartResp>;
/**
 * @param {import("../services/services.js").Services} services
 * @param {apiDszDomainSelectReq} req
 * @returns {Promise<apiDszDomainSelectResp>}
 */
export declare function apiDszDomainSelect(services: import("../services/services.js").Services, req: apiDszDomainSelectReq): Promise<apiDszDomainSelectResp>;
/**
 * @fileoverview Generic and shared type definitions for the i6 Web Legacy SDK.
 */
export type I6SdkConfig = {
    /**
     * - Base URL of the i6 server. Defaults to the sandbox environment.
     */
    baseUrl?: string;
};
/**
 * Configuration options for the i6 SDK.
 * @typedef {Object} I6SdkConfig
 * @property {string} [baseUrl] - Base URL of the i6 server. Defaults to the sandbox environment.
 */
export {};
/**
 * @fileoverview Service container managing SDK service instances and configuration.
 */
import { Invoker } from "../invoker/invoker.js";
import { Auth } from "../auth/auth.js";
import { Ingest } from "../ingest/ingest.js";
import { Pipe } from "../pipe/pipe.js";
import { Dataset } from "../dataset/dataset.js";
export type I6SdkConfig = import("../types.js").I6SdkConfig;
/**
 * @typedef {import("../types.js").I6SdkConfig} I6SdkConfig
 */
/**
 * Service container that instantiates and provides access to SDK service clients.
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
     * Creates and returns a Pipe service instance.
     * @returns {Pipe} An instance of the Pipe client.
     */
    pipe(): Pipe;
    /**
     * Creates and returns a Dataset service instance.
     * @returns {Dataset} An instance of the Dataset client.
     */
    dataset(): Dataset;
}
export { Services };
/**
 * @fileoverview Authentication client.
 */
export type Services = import("../services/services.js").Services;
export type UserProfile = Record<string, any>;
/**
 * @typedef {import("../services/services.js").Services} Services
 */
/**
 * Authenticated user profile data.
 * @typedef {Record<string, any>} UserProfile
 */
/**
 * Authentication client for handling user sessions and authentication requests.
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
     * Redirects the browser to the login page with the current URL as backurl.
     * @private
     * @returns {void}
     */
    private #redirectToLogin;
    /**
     * Fetches the current authenticated user profile.
     * @returns {Promise<UserProfile|null>} The user profile data, or null if redirected to login.
     * @throws {Error} If the HTTP request fails.
     */
    user(): Promise<UserProfile | null>;
    requireUser(): Promise<UserProfile | null>;
}
export { Auth };
/**
 * @fileoverview Dataset client for selecting the solution domain of a dataset.
 */
export type Services = import("../services/services.js").Services;
export type SelectDomainParams = {
    /**
     * - Dataset to configure.
     */
    dataset: string;
    /**
     * - Domain to select.
     */
    domain: any;
    /**
     * - Solution the domain belongs to.
     */
    solution: any;
    /**
     * - Store the selection applies to.
     */
    store: string;
};
/**
 * @typedef {import("../services/services.js").Services} Services
 */
/**
 * Parameters for selecting a solution domain.
 * @typedef {Object} SelectDomainParams
 * @property {string} dataset - Dataset to configure.
 * @property {*} domain - Domain to select.
 * @property {*} solution - Solution the domain belongs to.
 * @property {string} store - Store the selection applies to.
 */
/**
 * Client for dataset operations.
 */
declare class Dataset {
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs a Dataset client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * Selects the solution domain of a dataset (dsz-domain-select API).
     * @param {SelectDomainParams} params - Selection parameters.
     * @returns {Promise<void>} Resolves when the domain is selected.
     * @throws {I6Error} If the request fails.
     */
    selectDomain({ dataset, domain, solution, store }: SelectDomainParams): Promise<void>;
}
export { Dataset };
export type FileRef = {
    /**
     * - [write it: bla, ble].
     */
    name: string;
    /**
     * - [write it].
     */
    version: string;
    /**
     * - [write it].
     */
    etag: string;
};
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
}
declare const fs: FS;
export { fs };
declare class Downloader {
    /**
     * Download the file by name if necessary (checking etag)
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.url - required
     * @returns {Promise<FileRef>} the FileRef of the downloaded file (basically to get the version)
    */
    update(opts: {
        name: string;
        url: string;
    }): Promise<FileRef>;
}
declare const downloader: Downloader;
export { downloader };
/**
 * @fileoverview Pipe client for starting pipelines.
 */
export type Services = import("../services/services.js").Services;
export type StartParams = {
    /**
     * - Dataset the pipe runs on.
     */
    dataset: string;
    /**
     * - Name of the pipe to start.
     */
    pipename: string;
    /**
     * - Pipe parameters.
     */
    params?: {
        name: string;
        value: string;
    }[];
    /**
     * - Solution/domain the pipe runs in.
     */
    solutionDomain: any;
};
export type StartResult = {
    /**
     * - Id of the started pipe run.
     */
    id: string;
};
/**
 * @typedef {import("../services/services.js").Services} Services
 */
/**
 * Parameters for starting a pipe.
 * @typedef {Object} StartParams
 * @property {string} dataset - Dataset the pipe runs on.
 * @property {string} pipename - Name of the pipe to start.
 * @property {{name: string, value: string}[]} [params] - Pipe parameters.
 * @property {*} solutionDomain - Solution/domain the pipe runs in.
 */
/**
 * Result of a successful start.
 * @typedef {Object} StartResult
 * @property {string} id - Id of the started pipe run.
 */
/**
 * Client for starting pipes.
 */
declare class Pipe {
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs a Pipe client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * Starts a pipe (pipez-start API).
     * @param {StartParams} params - Start parameters.
     * @returns {Promise<StartResult>} The id of the started run.
     * @throws {I6Error} If the request fails.
     */
    start({ dataset, pipename, params, solutionDomain }: StartParams): Promise<StartResult>;
}
export { Pipe };
