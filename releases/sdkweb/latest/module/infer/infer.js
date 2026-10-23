import { I6Error } from "../errors.js";
import { downloadFile, isPartitions, partitionsKey } from "../internal/assets/assets.js";
import { fs } from "../internal/fs/fs.js";
import { sqlitez } from "../internal/sqlitez/sqlitez.js";
import { describeModel, loadModel, runModel } from "./litert.js";
const DEFAULT_LIMIT = 20;
const FILES = { sqlite: "sqlite.bin", tflite: "tflite.bin" };
const debug = (...args) => {
  if (globalThis.I6_DEBUG) console.log("infer:", ...args);
};
class Infer {
  /**
   * Constructs an Infer client instance.
   * @param {Services} services - The services manager instance.
   */
  constructor(services) {
    this._services = services;
  }
  /**
   * Runs the model for the given params and returns what the output query gives.
   * @param {InferOptions} opts - Inference options.
   * @returns {Promise<*>} The `ret` of the named query `model-${modelName}-output`, plus a generated `rec_id` (uuid). Sends the `recraw` event with that id.
   * @throws {I6Error} With code "invalid_argument" if opts is malformed, the sdk has no `sessionId` and `userId` or the model inputs do not fit the model,
   *   "asset" if a download fails, "model" if loading or running the model fails, "query" if the sqlite fails.
   */
  async run(opts) {
    validate(opts);
    const ids = this.#sdkIds();
    const { modelName, params } = opts;
    const queryName = (kind) => `model-${modelName}-${kind}`;
    const urls = await this._assetUrls(opts);
    const cacheName = (kind) => `infer-${modelName}-${partitionsKey(opts.partitions)}-${kind}`;
    const [sqliteRef, tfliteRef] = await Promise.all([
      downloadFile(cacheName("sqlite"), urls.sqlite),
      downloadFile(cacheName("tflite"), urls.tflite)
    ]);
    const conn = await sqlitez.open({ path: await fs.resolve(sqliteRef) });
    try {
      const [inputs, compiled] = await Promise.all([
        conn.namedJsonQuery({ name: queryName("input"), params: [params] }),
        loadModel({ ref: tfliteRef, wasmUrl: opts.litertWasm })
      ]);
      if (!inputs || typeof inputs !== "object") throw new I6Error(`infer: ${queryName("input")} returned no model inputs`, { code: "query" });
      debug("input query returned", Object.keys(inputs), "model", describeModel(compiled));
      const outputs = await runModel(compiled, inputs);
      debug("output returned (before namedJsonQuery)", outputs);
      const result = await conn.namedJsonQuery({ name: queryName("output"), params: outputQueryParams(outputs, opts) });
      debug("output query returned (after namedJsonQuery)", result);
      const recId = crypto.randomUUID();
      const results = { ...result, rec_id: recId };
      const eventOpts = { dataset: opts.dataset, modelName, modelVersion: opts.partitions.version, storeId: opts.partitions.store_id };
      await this.#sendRecEvent(eventOpts, ids, recId, "recraw", results);
      return results;
    } finally {
      await conn.close();
    }
  }
  /**
   * Asks `selectResults` which of the recommended skus are shown and sends their sku ids as the `recshow` event.
   * @param {SelectResultsOptions} opts - Select options.
   * @returns {Promise<*>} What `selectResults` returned, as is (the default sets the `rating` of each sku; see `defaultSelectResults`).
   * @throws {I6Error} With code "invalid_argument" if `selectResults` is not a function, `recId` is missing, the sdk has no `sessionId` and
   *   `userId`, or `selectResults` returned an item with no `sku_id` or a sku not in the results; "event" if an event is not accepted.
   */
  async selectResults(opts) {
    const selectResults = opts?.selectResults ?? defaultSelectResults;
    if (typeof selectResults !== "function") {
      throw new I6Error("infer: opts.selectResults must be a function", { code: "invalid_argument" });
    }
    const { req, results } = opts;
    const { recId } = opts;
    if (!recId) throw new I6Error("infer: opts.recId is required", { code: "invalid_argument" });
    const ids = this.#sdkIds();
    const selected = await selectResults(req, results);
    if (!Array.isArray(selected?.results)) {
      throw new I6Error("infer: selectResults must return { results: [...] }", { code: "invalid_argument" });
    }
    const shown = {
      skus: selected.results.map((item) => {
        const skuId = item?.sku_id;
        if (!skuId) throw new I6Error(`infer: selectResults returned an item with no sku_id: ${JSON.stringify(item)}`, { code: "invalid_argument" });
        return { sku_id: skuId };
      })
    };
    await this.#sendRecEvent(opts, ids, recId, "recshow", shown);
    return selected;
  }
  /**
   * The session and user the sdk was created with (`new I6Sdk({ sessionId, userId })`).
   * @private
   * @returns {{sessionId: string, userId: string}}
   * @throws {I6Error} With code "invalid_argument" if one of them is missing.
   */
  #sdkIds() {
    const { sessionId, userId } = this._services?.config?.() ?? {};
    if (!sessionId || !userId) {
      throw new I6Error("infer: the sdk needs sessionId and userId, e.g. new I6Sdk({ sessionId, userId })", { code: "invalid_argument" });
    }
    return { sessionId, userId };
  }
  /**
   * Sends one recommendation event.
   * @private
   * @param {{dataset: string, modelName: string, modelVersion: string, storeId: string}} opts - Event options.
   * @param {{sessionId: string, userId: string}} ids - Session and user of the sdk.
   * @param {string} recId - Id of the recommendation, the same in the recraw and recshow events.
   * @param {"recraw"|"recshow"} kind - Which event.
   * @param {*} payload - What the event carries, any JSON.
   * @returns {Promise<void>}
   * @throws {I6Error} With code "event" if the event is not accepted.
   */
  async #sendRecEvent(opts, ids, recId, kind, payload) {
    await this._services.apis().ingestzStreamRelevanceFashionEvent({
      params: { dataset: opts.dataset },
      payload: {
        data: [{
          id: crypto.randomUUID(),
          store_id: opts.storeId,
          session_id: ids.sessionId,
          user_id: ids.userId,
          dataset: opts.dataset,
          created_at: (/* @__PURE__ */ new Date()).toISOString().split(".")[0] + "Z",
          [kind]: {
            rec_id: recId,
            model_id: opts.modelName,
            model_version: opts.modelVersion,
            payload: JSON.stringify(payload)
          }
        }]
      }
    });
  }
  /**
   * Finds where the model files are: the signed URLs of the model API, unless opts has both URLs (tests).
   * @private
   * @param {InferOptions} opts - Inference options.
   * @returns {Promise<{sqlite: string, tflite: string}>} Download URLs of the files.
   * @throws {I6Error} With code "asset" if the API gave no URL for a file.
   */
  async _assetUrls(opts) {
    if (opts.sqliteUrl) return { sqlite: opts.sqliteUrl, tflite: opts.tfliteUrl };
    const { modelName, partitions, dataset } = opts;
    const resp = await this._services.apis().dszModelGet({
      params: { dataset, model_name: modelName },
      payload: { model_version: opts.partitions.version, model_partitions: partitions }
    });
    const byName = Object.fromEntries((resp.payload?.urls ?? []).map((file) => [file.name, file.url]));
    const missing = Object.values(FILES).find((name) => !byName[name]);
    if (missing) {
      throw new I6Error(`infer: the model api gave no "${missing}" file: ${resp.error?.message ?? JSON.stringify(Object.keys(byName))}`, { code: "asset", status: resp.error?.status, cause: resp.error });
    }
    return { sqlite: byName[FILES.sqlite], tflite: byName[FILES.tflite] };
  }
}
function validate(opts) {
  for (const key of ["modelName", "dataset"]) {
    if (!opts || !opts[key]) throw new I6Error(`infer: opts.${key} is required`, { code: "invalid_argument" });
  }
  if (!isPartitions(opts.partitions)) {
    throw new I6Error("infer: opts.partitions must be an object of string values", { code: "invalid_argument" });
  }
  if (opts.params === void 0) throw new I6Error("infer: opts.params is required", { code: "invalid_argument" });
  if (opts.limit !== void 0 && !(Number.isInteger(opts.limit) && opts.limit > 0)) {
    throw new I6Error("infer: opts.limit must be a positive integer", { code: "invalid_argument" });
  }
  if (!opts.sqliteUrl !== !opts.tfliteUrl) {
    throw new I6Error("infer: opts.sqliteUrl and opts.tfliteUrl go together", { code: "invalid_argument" });
  }
}
function outputQueryParams(outputs, opts) {
  const named = Object.entries(outputs).map(([name, values]) => [name, { values: Array.from(values) }]);
  return [Object.fromEntries(named), opts.limit ?? DEFAULT_LIMIT];
}
function ratingsBySku(results) {
  const ratings = /* @__PURE__ */ new Map();
  for (const { skus, rating } of results?.results ?? []) {
    for (const { sku_id } of skus ?? []) {
      if (!ratings.has(sku_id) || rating > ratings.get(sku_id)) ratings.set(sku_id, rating);
    }
  }
  return ratings;
}
async function defaultSelectResults(req, results) {
  const taken = new Set(req.input.skus.map((sku) => sku.sku_id));
  const shown = [];
  for (const result of [...results.results]) {
    for (const { sku_id } of result.skus) {
      if (!taken.has(sku_id)) {
        taken.add(sku_id);
        shown.push({ sku_id, rating: result.rating });
        break;
      }
    }
  }
  return {
    results: shown
  };
}
export { Infer };
