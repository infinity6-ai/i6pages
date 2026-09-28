import { Services } from "./services/services.js";
import { I6Error } from "./errors.js";
const DEFAULT_CONFIG = {
  baseUrl: "https://decsuite.sandbox.rs.infinity6.ai"
  // baseUrl: "http://localhost:9021",
};
class I6Sdk {
  /**
   * Constructs an instance of the i6 SDK.
   * @param {I6SdkConfig} [config] - Configuration options for the SDK.
   */
  constructor(config) {
    this._service = new Services(this._config = {
      ...DEFAULT_CONFIG,
      ...config
    });
  }
  /**
   * Returns an Ingest service instance.
   * @returns {Ingest} An instance of the Ingest client.
   */
  ingest() {
    return this._service.ingest();
  }
  /**
   * Returns an Auth service instance.
   * @returns {Auth} An instance of the Auth client.
   */
  auth() {
    return this._service.auth();
  }
  /**
   * Returns a Pipe service instance.
   * @returns {Pipe} An instance of the Pipe client.
   */
  pipe() {
    return this._service.pipe();
  }
  /**
   * Returns a Dataset service instance.
   * @returns {Dataset} An instance of the Dataset client.
   */
  dataset() {
    return this._service.dataset();
  }
  /**
   * Registers an event listener on the internal event dispatcher.
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
