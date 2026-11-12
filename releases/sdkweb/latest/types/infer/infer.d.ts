/**
 * @fileoverview Runs an i6 model (e.g. "relevance-fashion-fbt") in the browser and returns the result.
 *
 * Flow: get the model's sqlite + tflite (URLs from the model signed-get API, or from the caller in tests),
 * run the named query `model-${modelName}-input` (its result is the model inputs, `{name: {data, shape}}`),
 * run the tflite model, and run the named query `model-${modelName}-output` with the model outputs.
 * Its result is returned as is. Nothing here is model specific.
 *
 * Set `window.I6_DEBUG = true` to see what happens in the console, and to get the model tensors in the "i6:infer-tensors" event.
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
     * - Id of the user session; sent in the recommendation events.
     */
    sessionId: string;
    /**
     * - Id of the user; sent in the recommendation events.
     */
    userId: string;
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
     * - What the caller asked for (the cart).
     */
    req: any;
    /**
     * - What `run` returned.
     */
    results: any;
    /**
     * - Id of the recommendation run, returned by `run`.
     */
    recId: string;
    /**
     * - Id of the user session.
     */
    sessionId: string;
    /**
     * - Id of the user.
     */
    userId: string;
    /**
     * - Dataset of the model.
     */
    dataset: string;
    /**
     * - Model name.
     */
    modelName: string;
    /**
     * - Model version.
     */
    modelVersion: string;
    /**
     * - Store partition.
     */
    storeId?: string;
    /**
     * - Given to the `recshow` event call.
     */
    serviceOpts?: ServiceOptions;
    /**
     * - Custom selection function.
     */
    selectResults?: (req: any, results: any) => Promise<any>;
};
/**
 * Infer client.
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
     * Runs the model in the browser and returns its recommendation result.
     * @param {InferOptions} opts - Inference options.
     * @returns {Promise<*>} The results of the model.
     */
    run(opts: InferOptions): Promise<any>;
    callModel(inputs: any, opts: any): Promise<import("../index.js").Resp<import("../sdkapis/sdkapis.js").apiTfzModelPredictResp>>;
    /**
     * Asks `selectResults` which of the recommended skus are shown and sends their sku ids as the `recshow` event.
     * @param {SelectResultsOptions} opts - Select options.
     * @returns {Promise<*>} What `selectResults` returned, as is (the default sets the `rating` of each sku; see `defaultSelectResults`).
     */
    selectResults(opts: SelectResultsOptions): Promise<any>;
    /**
     * Sends one recommendation event.
     * @private
     * @param {{dataset: string, modelName: string, modelVersion: string, storeId: string, serviceOpts?: ServiceOptions}} opts - Event options.
     * @param {{sessionId: string, userId: string}} ids - Session and user of the sdk.
     * @param {string} recId - Id of the recommendation, the same in the recraw and recshow events.
     * @param {"recraw"|"recshow"} kind - Which event.
     * @param {*} payload - What the event carries, any JSON.
     * @returns {Promise<void>}
     */
    private #sendRecEvent;
    /**
     * Finds where the two model files are: the signed URLs of the model API, unless opts has them (tests).
     * @private
     * @param {InferOptions} opts - Inference options.
     * @returns {Promise<{sqlite: string, tflite: string}>} Download URLs of the files.
     */
    private _assetUrls;
}
export { Infer };
