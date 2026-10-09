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
export type InferOptions = {
    /**
     * - Model name (e.g. "relevance-fashion-fbt"); names the cached assets and the named queries.
     */
    modelName: string;
    /**
     * - Model version (e.g. "v1").
     */
    modelVersion: string;
    /**
     * - Partitions of the model, name -> value (e.g. `{ store_id: "s1" }`). Any partitions.
     */
    partitions: Record<string, string>;
    /**
     * - Dataset that holds the model files.
     */
    dataset: string;
    /**
     * - Model input, any JSON (e.g. `{ cart_skus: [...] }`). Bound as `?1` of the input query.
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
};
/**
 * Inference client.
 */
declare class Infer {
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
     * @returns {Promise<*>} The `ret` of the named query `model-${modelName}-output`.
     * @throws {I6Error} With code "invalid_argument" if opts is malformed or the model inputs do not fit the model,
     *   "asset" if a download fails, "model" if loading or running the model fails, "query" if the sqlite fails.
     */
    run(opts: InferOptions): Promise<any>;
    /**
     * Finds where the model files are: the signed URLs of the model API, unless opts has both URLs (tests).
     * Also used by the demo page, which runs the steps one by one.
     * @param {InferOptions} opts - Inference options.
     * @returns {Promise<{sqlite: string, tflite: string}>} Download URLs of the files.
     * @throws {I6Error} With code "asset" if the API gave no URL for a file.
     */
    assetUrls(opts: InferOptions): Promise<{
        sqlite: string;
        tflite: string;
    }>;
}
/**
 * The values bound to the output query (also used by the demo page): `?1` the model outputs as `{name: {values: [...]}}` (plain arrays, which JSON
 * can hold), `?2` the limit.
 * @param {Record<string, ArrayLike<number>>} outputs - Model outputs (typed arrays).
 * @param {InferOptions} opts - Inference options.
 * @returns {Array<*>} The params of `namedJsonQuery`.
 */
declare function outputQueryParams(outputs: Record<string, ArrayLike<number>>, opts: InferOptions): Array<any>;
export { Infer, outputQueryParams };
