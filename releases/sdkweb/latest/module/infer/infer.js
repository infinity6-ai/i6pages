import { I6Error } from "../errors.js";
import { downloader } from "../internal/downloader/downloader.js";
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
   * @returns {Promise<*>} The `ret` of the named query `model-${modelName}-output`.
   * @throws {I6Error} With code "invalid_argument" if opts is malformed or the model inputs do not fit the model,
   *   "asset" if a download fails, "model" if loading or running the model fails, "query" if the sqlite fails.
   */
  async run(opts) {
    validate(opts);
    const { modelName, params } = opts;
    const queryName = (kind) => `model-${modelName}-${kind}`;
    const urls = await this.assetUrls(opts);
    const partitions = Object.entries(opts.partitions).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, value]) => encodeURIComponent(`${key}=${value}`)).join("-");
    const cacheName = (kind) => `infer-${modelName}-${partitions}-${opts.modelVersion}-${kind}`;
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
      const result = await conn.namedJsonQuery({ name: queryName("output"), params: outputQueryParams(outputs, opts) });
      debug("output query returned", result);
      return result;
    } finally {
      await conn.close();
    }
  }
  /**
   * Finds where the model files are: the signed URLs of the model API, unless opts has both URLs (tests).
   * Also used by the demo page, which runs the steps one by one.
   * @param {InferOptions} opts - Inference options.
   * @returns {Promise<{sqlite: string, tflite: string}>} Download URLs of the files.
   * @throws {I6Error} With code "asset" if the API gave no URL for a file.
   */
  async assetUrls(opts) {
    if (opts.sqliteUrl) return { sqlite: opts.sqliteUrl, tflite: opts.tfliteUrl };
    const { modelName, partitions, dataset } = opts;
    const resp = await this._services.apis().dszModelGet({
      params: { dataset, model_name: modelName },
      payload: { model_version: opts.partitions.version, model_partitions: partitions }
    });
    const byName = Object.fromEntries((resp.payload?.urls ?? []).map((file) => [file.name, file.url]));
    const missing = Object.values(FILES).find((name) => !byName[name]);
    if (missing) {
      throw new I6Error(`infer: the model api gave no "${missing}" file: ${JSON.stringify(resp.error ?? Object.keys(byName))}`, { code: "asset" });
    }
    return { sqlite: byName[FILES.sqlite], tflite: byName[FILES.tflite] };
  }
}
function validate(opts) {
  for (const key of ["modelName", "dataset"]) {
    if (!opts || !opts[key]) throw new I6Error(`infer: opts.${key} is required`, { code: "invalid_argument" });
  }
  console.log("opts", opts);
  const parts = opts.partitions;
  console.log("parts", parts);
  if (!parts || typeof parts !== "object" || Array.isArray(parts) || Object.values(parts).some((v) => typeof v !== "string")) {
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
async function downloadFile(name, url) {
  try {
    const ref = await downloader.update({ name, url });
    debug(`${name} is ready`, ref);
    return ref;
  } catch (cause) {
    throw new I6Error(`infer: could not get ${url}: ${cause.message}`, { code: "asset", cause });
  }
}
export { Infer, outputQueryParams };
