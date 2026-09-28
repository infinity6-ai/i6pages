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
      body: result.error
    });
  }
}
export { I6Error };
