import { Services, Apis, SdkFuncs } from "./services/services.js";
import { I6Error } from "./errors.js";
const DEFAULT_CONFIG = {
  baseUrl: "https://decsuite.sandbox.rs.infinity6.ai"
  // baseUrl: "https://decsuite.app.rs.infinity6.ai",
  // baseUrl: "http://localhost:9021",
};
class I6Sdk {
  /**
   * Constructs an instance of the i6 SDK.
   * @param {I6SdkConfig} [config] - Configuration options for the SDK.
   */
  constructor(config) {
    this._service = new Services({
      ...DEFAULT_CONFIG,
      ...config
    });
  }
  /**
   * Returns a copy of the configuration the SDK is running with.
   * @returns {I6SdkConfig} The current configuration.
   */
  config() {
    return { ...this._service.config() };
  }
  /**
   * Overwrites the given keys of the configuration (e.g. `{ sessionId, userId }`); the other keys are kept.
   * Can be called at any time, the next call of the SDK uses the new values.
   * @param {Partial<I6SdkConfig>} config - The keys to overwrite.
   * @returns {void}
   */
  setConfig(config) {
    this._service.setConfig(config);
  }
  /**
   * Returns an Ingest service instance.
   * @returns {Ingest} An instance of the Ingest client.
   */
  ingest() {
    return this._service.ingest();
  }
  /**
   * Returns an Infer service instance, which runs an i6 model in the browser and returns the result.
   * @returns {Infer} An instance of the Infer client.
   */
  infer() {
    return this._service.infer();
  }
  /**
   * Returns a Dash service instance, which queries an i6 dash in the browser and returns the result.
   * @returns {Dash} An instance of the Dash client.
   */
  dash() {
    return this._service.dash();
  }
  /**
   * Returns an Auth service instance.
   * @returns {Auth} An instance of the Auth client.
   */
  auth() {
    return this._service.auth();
  }
  /**
   * Returns the Apis service instance, one typed method per i6 server API.
   * Each call resolves with `{status, ok, payload?, error?}` and does not throw on an HTTP error.
   * @returns {Apis} An instance of the generated Apis client.
   */
  apis() {
    return this._service.apis();
  }
  /**
   * Returns the Funcs service instance.
   * @returns {SdkFuncs} An instance of the generated Apis client.
   */
  funcs() {
    return this._service.funcs();
  }
  /**
   * Registers an event listener on the SDK's internal event dispatcher (an EventTarget).
   * @param {string} evt - The event type or name to listen for.
   * @param {EventListenerOrEventListenerObject|Function} fn - The callback function or event listener object invoked when the event occurs.
   * @returns {void}
   */
  bind(evt, fn) {
    this._service.bind(evt, fn);
  }
}
I6Sdk.I6Error = I6Error;
window.I6Sdk = I6Sdk;
export { I6Sdk, I6Error };
