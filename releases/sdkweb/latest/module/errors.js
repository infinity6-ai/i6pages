class I6Error extends Error {
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
    return new I6Error(`${message} with status ${result.status}`, {
      code: "http",
      status: result.status,
      body: result.error?.message,
      cause: result.error
    });
  }
}
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
function apiErrorFromNetwork(cause) {
  return { status: 0, code: "network", message: cause?.message || "network error", cause };
}
export { I6Error, apiErrorFromResponse, apiErrorFromNetwork };
