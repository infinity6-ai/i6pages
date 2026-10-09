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
export { Services };
