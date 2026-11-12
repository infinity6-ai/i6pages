import { downloadFile, isPartitions, partitionsKey } from "../internal/assets/assets.js";
import { fs } from "../internal/fs/fs.js";
import { sqlitez } from "../internal/sqlitez/sqlitez.js";
import { describeModel, loadModel, runModel } from "./litert.js";
import { debugLogger } from "../internal/debug/debug.js";
const FILES = { sqlite: "sqlite.bin", tflite: "tflite.bin" };
const DEFAULT_LIMIT = 20;
const debug = debugLogger("infer");
class Infer {
  /**
   * Constructs an Infer client instance.
   * @param {Services} services - The services manager instance.
   */
  constructor(services) {
    this._services = services;
  }
  /**
   * Runs the model in the browser and returns its recommendation result.
   * @param {InferOptions} opts - Inference options.
   * @returns {Promise<*>} The results of the model.
   */
  async run(opts) {
    validate(opts);
    const startedAt = performance.now();
    const { modelName, params, sessionId, userId } = opts;
    const ids = { sessionId, userId };
    const queryName = (kind) => `model-${modelName}-${kind}`;
    const urls = await this._assetUrls(opts);
    debug("1/4 model files located", { sqlite: withoutQuery(urls.sqlite), tflite: withoutQuery(urls.tflite) });
    const cacheName = (kind) => `infer-${modelName}-${partitionsKey(opts.partitions)}-${kind}`;
    const [sqliteRef, tfliteRef] = await Promise.all([
      downloadFile(cacheName("sqlite"), urls.sqlite)
      // downloadFile(cacheName("tflite"), urls.tflite),
    ]);
    const conn = await sqlitez.open({ path: await fs.resolve(sqliteRef) });
    try {
      const [inputs, compiled] = await Promise.all([
        conn.namedStringQuery({ name: queryName("input"), params: [params] })
        // loadModel({ ref: tfliteRef, wasmUrl: opts.litertWasm }),
      ]);
      if (!inputs) throw new Error(`infer: ${queryName("input")} returned no model inputs`);
      debug("2/4 input query", queryName("input"), "| bound as ?1:", params, "| returned (model inputs):", preview(inputs));
      debug("3/4 calling the model on the server", { model_name: modelName, version: opts.partitions.version, model_partitions: opts.partitions });
      const modelStartedAt = performance.now();
      const outputs = await this.callModel(inputs, opts);
      const data = outputs.parse();
      debug("3/4 model answered", { ms: Math.round(performance.now() - modelStartedAt), ok: outputs?.ok, status: outputs?.status, error: outputs?.error, outputs: preview(data?.outputs) });
      let modelOutputsAndLimit = [JSON.parse(data.outputs), opts.limit ?? DEFAULT_LIMIT];
      debug("4/4 output query", queryName("output"), "| bound as ?1 (model outputs) and ?2 (limit):", preview(modelOutputsAndLimit));
      const result = await conn.namedJsonQuery({ name: queryName("output"), params: modelOutputsAndLimit });
      debug("output query returned (after namedJsonQuery)", result);
      const recId = crypto.randomUUID();
      const results = { ...result, rec_id: recId };
      const eventOpts = { dataset: opts.dataset, modelName, modelVersion: opts.partitions.version, storeId: opts.partitions.store_id, serviceOpts: opts.serviceOpts };
      await this.#sendRecEvent(eventOpts, ids, recId, "recraw", results);
      debug("recraw event sent", { rec_id: recId, results: results.results?.length, totalMs: Math.round(performance.now() - startedAt) });
      return results;
    } finally {
      await conn.close();
    }
  }
  async callModel(inputs, opts) {
    const { dataset, modelName, partitions } = opts;
    return await this._services.apis().tfzModelPredict({
      params: {
        dataset,
        model_name: modelName,
        version: partitions.version
      },
      payload: {
        model_partitions: partitions,
        inputs
      }
    }, opts.serviceOpts);
  }
  /**
   * Asks `selectResults` which of the recommended skus are shown and sends their sku ids as the `recshow` event.
   * @param {SelectResultsOptions} opts - Select options.
   * @returns {Promise<*>} What `selectResults` returned, as is (the default sets the `rating` of each sku; see `defaultSelectResults`).
   */
  async selectResults(opts) {
    const selectResults = opts?.selectResults ?? defaultSelectResults;
    if (typeof selectResults !== "function") {
      throw new TypeError("infer: opts.selectResults must be a function");
    }
    const { req, results, recId, sessionId, userId } = opts;
    if (!recId) throw new TypeError("infer: opts.recId is required");
    if (!sessionId || !userId) {
      throw new TypeError("infer: opts needs sessionId and userId");
    }
    const ids = { sessionId, userId };
    const selected = await selectResults(req, results);
    if (!Array.isArray(selected?.results)) {
      throw new TypeError("infer: selectResults must return { results: [...] }");
    }
    const shown = {
      skus: selected.results.map((item, i) => {
        const skuId = item?.sku_id;
        if (!skuId) throw new TypeError(`infer: selectResults returned an item with no sku_id at results[${i}]`);
        return { sku_id: skuId };
      })
    };
    debug("selectResults picked", { rec_id: recId, sku_ids: shown.skus.map((s) => s.sku_id) });
    await this.#sendRecEvent(opts, ids, recId, "recshow", shown);
    debug("recshow event sent", { rec_id: recId });
    return selected;
  }
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
  async #sendRecEvent(opts, ids, recId, kind, payload) {
    await this._services.apis().ingestzEventRelevanceFashionEvent({
      params: { dataset: opts.dataset },
      payload: {
        id: crypto.randomUUID(),
        store_id: opts.storeId,
        session_id: ids.sessionId,
        user_id: ids.userId,
        created_at: (/* @__PURE__ */ new Date()).toISOString().split(".")[0] + "Z",
        [kind]: {
          rec_id: recId,
          model_id: opts.modelName,
          model_version: opts.modelVersion,
          payload: JSON.stringify(payload)
        }
      }
    }, opts.serviceOpts);
  }
  /**
   * Finds where the two model files are: the signed URLs of the model API, unless opts has them (tests).
   * @private
   * @param {InferOptions} opts - Inference options.
   * @returns {Promise<{sqlite: string, tflite: string}>} Download URLs of the files.
   */
  async _assetUrls(opts) {
    if (opts.sqliteUrl) return { sqlite: opts.sqliteUrl, tflite: opts.tfliteUrl };
    const { modelName, partitions, dataset } = opts;
    const resp = await this._services.apis().dszModelGet({
      params: { dataset, model_name: modelName },
      payload: { model_version: opts.partitions.version, model_partitions: partitions }
    }, opts.serviceOpts);
    const data = resp.parse();
    const byName = Object.fromEntries((data?.urls ?? []).map((file) => [file.name, file.url]));
    const missing = Object.values(FILES).find((name) => !byName[name]);
    if (missing) {
      throw new Error(`infer: the model api gave no "${missing}" file: ${resp.error?.message ?? JSON.stringify(Object.keys(byName))}`);
    }
    return { sqlite: byName[FILES.sqlite], tflite: byName[FILES.tflite] };
  }
}
function withoutQuery(url) {
  return typeof url === "string" ? url.split("?")[0] : url;
}
function preview(value, max = 600) {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  if (typeof text !== "string" || text.length <= max) return text;
  return `${text.slice(0, max)}... (${text.length} chars in total)`;
}
function announceTensors({ outputs, ...rest }) {
  if (!globalThis.I6_DEBUG || typeof globalThis.dispatchEvent !== "function") return;
  const plain = Object.fromEntries(Object.entries(outputs).map(([name, values]) => [name, Array.from(values)]));
  globalThis.dispatchEvent(new CustomEvent("i6:infer-tensors", { detail: { ...rest, outputs: plain } }));
}
function validate(opts) {
  for (const key of ["modelName", "dataset", "sessionId", "userId"]) {
    if (!opts || !opts[key]) throw new TypeError(`infer: opts.${key} is required`);
  }
  if (!isPartitions(opts.partitions)) {
    throw new TypeError("infer: opts.partitions must be an object of string values");
  }
  if (opts.params === void 0) throw new TypeError("infer: opts.params is required");
  if (opts.limit !== void 0 && !(Number.isInteger(opts.limit) && opts.limit > 0)) {
    throw new TypeError("infer: opts.limit must be a positive integer");
  }
  if (!opts.sqliteUrl !== !opts.tfliteUrl) {
    throw new TypeError("infer: opts.sqliteUrl and opts.tfliteUrl go together");
  }
}
function outputQueryParams(outputs, opts) {
  const named = Object.entries(outputs).map(([name, values]) => [name, { values: Array.from(values) }]);
  return [Object.fromEntries(named), opts.limit ?? DEFAULT_LIMIT];
}
async function defaultSelectResults(req, results) {
  const taken = new Set(req.input.skus.map((sku) => sku.sku_id));
  const shown = [];
  for (const result of results.results) {
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
