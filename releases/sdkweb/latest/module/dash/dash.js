import { fs } from "../internal/fs/fs.js";
import { sqlitez } from "../internal/sqlitez/sqlitez.js";
import { downloadFile, isPartitions, partitionsKey } from "../internal/assets/assets.js";
import { debugLogger } from "../internal/debug/debug.js";
const SQLITE_FILE = "sqlite.bin";
const debug = debugLogger("dash");
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
   */
  async query(opts) {
    validate(opts);
    const url = await this._sqliteUrl(opts);
    const ref = await downloadFile(`${opts.dashName}-${partitionsKey(opts.partitions)}-sqlite`, url);
    const conn = await sqlitez.open({ path: await fs.resolve(ref) });
    try {
      const name = `${opts.dashName}`;
      const result = await conn.namedJsonQuery({ name, params: opts.params === void 0 ? [] : [opts.params] });
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
   */
  async _sqliteUrl(opts) {
    if (opts.sqliteUrl) return opts.sqliteUrl;
    const { dashName, partitions, dataset } = opts;
    const apis = await this._services.apis();
    const storeId = partitions?.store_id ?? "1";
    const resp = await apis.dszSignedUrl({
      params: { dataset },
      payload: {
        paths: [
          { method: "GET", path: `i6tb://results.relevance-fashion-store-dash/store_id=${storeId}/sqlite.bin` }
        ]
      }
    }, opts.serviceOpts);
    if (!resp.ok) throw new Error(`dash: the api gave no "${SQLITE_FILE}" file: ${resp.error?.message ?? "empty answer"}`);
    const payload = resp.parse();
    const url = payload?.urls?.[0]?.url;
    if (!url) throw new Error(`dash: the api gave no "${SQLITE_FILE}" file: empty answer`);
    return url;
  }
}
function validate(opts) {
  for (const key of ["dashName", "dataset"]) {
    if (!opts || !opts[key]) throw new TypeError(`dash: opts.${key} is required`);
  }
  if (!isPartitions(opts.partitions)) {
    throw new TypeError("dash: opts.partitions must be an object of string values");
  }
}
export { Dash };
