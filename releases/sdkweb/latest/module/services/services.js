import { Invoker } from "../invoker/invoker.js";
import { Auth } from "../auth/auth.js";
import { Ingest } from "../ingest/ingest.js";
import { Apis } from "../sdkapis/sdkapis.js";
class Services {
  /**
   * Constructs a Services instance.
   * @param {I6SdkConfig} config - Configuration object for the SDK services.
   */
  constructor(config) {
    this._dispatcher = new EventTarget();
    this._config = config;
  }
  /**
   * Returns the SDK configuration.
   * @returns {I6SdkConfig} The configuration object.
   */
  config() {
    return this._config;
  }
  /**
   * Registers an event listener on the internal event dispatcher.
   * @param {string} evt - The event type or name to listen for.
   * @param {EventListenerOrEventListenerObject|Function} fn - The callback function or event listener object invoked when the event occurs.
   * @returns {void}
   */
  bind(evt, fn) {
    this._dispatcher.addEventListener(evt, fn);
  }
  /**
   * Creates and returns an Invoker service instance.
   * @returns {Invoker} An instance of the Invoker client.
   */
  invoker() {
    const ret = new Invoker(this);
    if (ret.prepare) {
      ret.prepare();
    }
    return ret;
  }
  /**
   * Creates and returns an Auth service instance.
   * @returns {Auth} An instance of the Auth client.
   */
  auth() {
    const ret = new Auth(this);
    if (ret.prepare) {
      ret.prepare();
    }
    return ret;
  }
  /**
   * Creates and returns an Ingest service instance.
   * @returns {Ingest} An instance of the Ingest client.
   */
  ingest() {
    const ret = new Ingest(this);
    if (ret.prepare) {
      ret.prepare();
    }
    return ret;
  }
  /**
   * Returns i6 apis
   * @returns {Apis} i6 apis.
   */
  apis() {
    const ret = new Apis(this);
    if (ret.prepare) {
      ret.prepare();
    }
    return ret;
  }
}
export { Services };
