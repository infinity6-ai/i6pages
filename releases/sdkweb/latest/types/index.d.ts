/**
 * @fileoverview Main entry point for the i6 Web Legacy SDK.
 */
import { Apis, SdkFuncs } from "./services/services.js";
import { Resp } from "./invoker/invoker.js";
import { bitmapz } from "./internal/bitmapz/bitmapz.js";
export type I6Storage = {
    /**
     * - Retrieves an item by key.
     */
    getItem: (key: string) => string | null;
    /**
     * - Stores an item by key and string value.
     */
    setItem: (key: string, value: string) => void;
    /**
     * - Removes an item by key.
     */
    removeItem: (key: string) => void;
};
export type I6SdkConfig = {
    /**
     * - Base URL of the i6 server. Defaults to the sandbox environment.
     */
    baseUrl?: string;
    /**
     * - Base URL of the other services, by the `servname` label of the api (e.g. `tfinfer`). An api whose service is not listed uses `baseUrl`.
     */
    servUrls?: Record<string, string>;
    /**
     * - Direct base URL override for the i6userz authentication service.
     */
    userzUrl?: string;
    /**
     * - Absolute URL of the application's exchange callback page handling PKCE token exchange.
     */
    userExchangeCallbackUrl?: string;
    /**
     * - Default application redirect URL after logout.
     */
    callbackUrl?: string;
    /**
     * - Client application identifier registered in i6userz (e.g. 'default').
     */
    app?: string;
    /**
     * - Optional storage adapter for persistent token storage. Defaults to global `localStorage` when omitted.
     */
    storage?: I6Storage | (() => I6Storage);
    /**
     * - Optional alias for persistent storage adapter (defaults to global `localStorage`).
     */
    localStorage?: I6Storage | (() => I6Storage);
    /**
     * - Optional storage adapter for session-scoped data such as PKCE code verifier. Defaults to global `sessionStorage` when omitted.
     */
    sessionStorage?: I6Storage | (() => I6Storage);
    /**
     * - Optional alias for session storage adapter.
     */
    storageSession?: I6Storage | (() => I6Storage);
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
     * @returns {import("./ingest/ingest.js").Ingest} An instance of the Ingest client.
     */
    ingest(): import("./ingest/ingest.js").Ingest;
    /**
     * Returns an Infer service instance, which runs an i6 model in the browser and returns the result.
     * @returns {import("./infer/infer.js").Infer} An instance of the Infer client.
     */
    infer(): import("./infer/infer.js").Infer;
    /**
     * Returns a Dash service instance, which queries an i6 dash in the browser and returns the result.
     * @returns {import("./dash/dash.js").Dash} An instance of the Dash client.
     */
    dash(): import("./dash/dash.js").Dash;
    /**
     * Returns an Auth service instance.
     * @returns {import("./auth/auth.js").Auth} An instance of the Auth client.
     */
    auth(): import("./auth/auth.js").Auth;
    /**
     * Returns a Tokens service instance.
     * @returns {import("./tokens/tokens.js").Tokens} An instance of the Tokens client.
     */
    tokens(): import("./tokens/tokens.js").Tokens;
    /**
     * Returns the Apis service instance, one typed method per i6 server API.
     * Each call resolves with `{status, ok, payload?, error?}` and does not throw on an HTTP error.
     * @returns {Apis} An instance of the generated Apis client.
     */
    apis(): Apis;
    /**
     * Returns the Funcs service instance.
     * @returns {SdkFuncs} An instance of the SdkFuncs client.
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
    export { Resp };
    export { bitmapz };
    export { Grants };
}
/**
 * Permissions catalog and bitmask constants matching Go's grants package.
 */
declare const Grants: Readonly<{
    System: 1;
    Admin: 2;
    Write: 4;
    Read: 8;
    All: 15;
}>;
export { I6Sdk, Resp, bitmapz, Grants };
