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
