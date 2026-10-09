import { I6Error } from "../errors.js";
import { fs } from "../internal/fs/fs.js";
import { sqlitez } from "../internal/sqlitez/sqlitez.js";
import { downloadFile, isPartitions, partitionsKey } from "../internal/assets/assets.js";
const SQLITE_FILE = "sqlite.bin";
const debug = (...args) => {
  if (globalThis.I6_DEBUG) console.log("dash:", ...args);
};
class Dash {
  /**
   * Constructs a Dash client instance.
   * @param {Services} services - The services manager instance.
   */
  constructor(services) {
    this._services = services;
  }
  /**
   * Downloads the dash sqlite (cached by etag), runs the named query `dash-${dashName}` with `params` and returns its result.
   * @param {DashOptions} opts - Dash options.
   * @returns {Promise<*>} The `ret` of the named query.
   * @throws {I6Error} With code "invalid_argument" if opts is malformed, "asset" if the download fails,
   *   "query" if the sqlite fails.
   */
  async query(opts) {
    validate(opts);
    const url = await this._sqliteUrl(opts);
    const ref = await downloadFile(`dash-${opts.dashName}-${partitionsKey(opts.partitions)}-sqlite`, url);
    const conn = await sqlitez.open({ path: await fs.resolve(ref) });
    try {
      const name = `dash-${opts.dashName}`;
      const result = await conn.namedJsonQuery({ name, params: [opts.params] });
      debug(`${name} returned`, result);
      return result;
    } finally {
      await conn.close();
    }
  }
  /**
   * Finds where the dash sqlite is: the signed URL of the model API (like Infer), unless opts has `sqliteUrl` (tests).
   * @private
   * @param {DashOptions} opts - Dash options.
   * @returns {Promise<string>} Download URL of the sqlite.
   * @throws {I6Error} With code "asset" if the API gave no URL.
   */
  async _sqliteUrl(opts) {
    if (opts.sqliteUrl) return opts.sqliteUrl;
    const { dashName, partitions, dataset } = opts;
    const resp = await this._services.apis().dszModelGet({
      params: { dataset, model_name: dashName },
      payload: { model_version: partitions.version, model_partitions: partitions }
    });
    const url = (resp.payload?.urls ?? []).find((file) => file.name === SQLITE_FILE)?.url;
    if (!url) throw new I6Error(`dash: the api gave no "${SQLITE_FILE}" file: ${JSON.stringify(resp.error ?? null)}`, { code: "asset" });
    return url;
  }
}
function validate(opts) {
  for (const key of ["dashName", "dataset"]) {
    if (!opts || !opts[key]) throw new I6Error(`dash: opts.${key} is required`, { code: "invalid_argument" });
  }
  if (!isPartitions(opts.partitions)) {
    throw new I6Error("dash: opts.partitions must be an object of string values", { code: "invalid_argument" });
  }
  if (opts.params === void 0) throw new I6Error("dash: opts.params is required", { code: "invalid_argument" });
}
export { Dash };
