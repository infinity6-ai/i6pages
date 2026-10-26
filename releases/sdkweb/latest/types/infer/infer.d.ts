/**
 * @fileoverview Runs an i6 model (e.g. "relevance-fashion-fbt") in the browser and returns the result.
 *
 * Flow: get the model's sqlite + tflite (URLs from the model signed-get API, or from the caller in tests),
 * run the named query `model-${modelName}-input` (its result is the model inputs, `{name: {data, shape}}`),
 * run the tflite model, and run the named query `model-${modelName}-output` with the model outputs.
 * Its result is returned as is. Nothing here is model specific.
 *
 * Set `window.I6_DEBUG = true` to see what happens in the console.
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
     * @throws {I6Error} With code "invalid_argument" if opts is malformed, the sdk has no `sessionId` and `userId` or the model inputs do not fit the model,
     *   "asset" if a download fails, "model" if loading or running the model fails, "query" if the sqlite fails.
     */
    run(opts: InferOptions): Promise<any>;
    /**
     * Asks `selectResults` which of the recommended skus are shown and sends their sku ids as the `recshow` event.
     * @param {SelectResultsOptions} opts - Select options.
     * @returns {Promise<*>} What `selectResults` returned, as is (the default sets the `rating` of each sku; see `defaultSelectResults`).
     * @throws {I6Error} With code "invalid_argument" if `selectResults` is not a function, `recId` is missing, the sdk has no `sessionId` and
     *   `userId`, or `selectResults` returned an item with no `sku_id` or a sku not in the results; "event" if an event is not accepted.
     */
    selectResults(opts: SelectResultsOptions): Promise<any>;
    /**
     * The session and user the sdk was created with (`new I6Sdk({ sessionId, userId })`).
     * @private
     * @returns {{sessionId: string, userId: string}}
     * @throws {I6Error} With code "invalid_argument" if one of them is missing.
     */
    private #sdkIds;
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
