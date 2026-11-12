const SQLJS_VERSION = "1.14.2";
const SQLJS_WASM_URL = `https://cdn.jsdelivr.net/npm/sql.js@${SQLJS_VERSION}/dist/`;
const SQLITE_HEADER = "SQLite format 3\0";
let sqlJsPromise = null;
function loadSqlJs() {
  if (sqlJsPromise) return sqlJsPromise;
  sqlJsPromise = (async () => {
    if (typeof window !== "undefined" && typeof window.initSqlJs === "function") {
      return window.initSqlJs({ locateFile: (file) => `${SQLJS_WASM_URL}${file}` });
    }
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `${SQLJS_WASM_URL}sql-wasm.js`;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`could not load ${script.src}`));
      document.head.appendChild(script);
    });
    return window.initSqlJs({ locateFile: (file) => `${SQLJS_WASM_URL}${file}` });
  })();
  return sqlJsPromise;
}
class SqliteConn {
  /**
   * @param {Object} db - The sql.js Database instance.
   */
  constructor(db) {
    this.db = db;
  }
  /**
   * Closes the connection and frees its memory. Calling it more than once does nothing.
   * After `close`, every other method throws.
   * @returns {Promise<void>}
   */
  async close() {
    if (!this.db) return;
    this.db.close();
    this.db = null;
  }
  /**
   * Runs a query and returns its rows.
   * @param {Object} opts
   * @param {string} opts.query - required, the SQL; use `?` for values.
   * @param {SqliteValue[]} [opts.params] - values bound, in order, to the `?` of the query (never concatenate them).
   * @returns {Promise<SqliteRow[]>} The rows (empty array when none), each one an object by column name.
   * @throws {TypeError} If opts.query is missing.
   */
  async query(opts) {
    if (!opts || !opts.query) throw new TypeError("sqlitez: opts.query is required");
    const db = this.#alive();
    let stmt;
    try {
      stmt = db.prepare(opts.query);
      if (opts.params) {
        stmt.bind(opts.params);
      }
      const rows = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      return rows;
    } finally {
      if (stmt) stmt.free();
    }
  }
  /**
   * Runs a statement that returns no data (INSERT, UPDATE, CREATE, ...). Only the memory copy changes.
   * @param {Object} opts
   * @param {string} opts.query - required, the SQL; use `?` for values.
   * @param {SqliteValue[]} [opts.params] - values bound, in order, to the `?` of the query.
   * @returns {Promise<void>}
   * @throws {TypeError} If opts.query is missing.
   */
  async update(opts) {
    if (!opts || !opts.query) throw new TypeError("sqlitez: opts.query is required");
    const db = this.#alive();
    db.run(opts.query, opts.params);
  }
  /**
   * Runs a query stored in the `namedqueries` table of the sqlite (columns `name` and `query`).
   * @param {Object} opts
   * @param {string} opts.name - required, the `name` of the stored query.
   * @param {SqliteValue[]} [opts.params] - values bound, in order, to the `?` of the stored query.
   * @returns {Promise<SqliteRow[]>} The rows of the stored query, like `query`.
   * @throws {TypeError} If opts.name is missing.
   */
  async namedQuery(opts) {
    if (!opts || !opts.name) throw new TypeError("sqlitez: opts.name is required");
    const found = await this.query({ query: "SELECT query FROM namedqueries WHERE name = ?", params: [opts.name] });
    if (found.length === 0) {
      throw new Error(`sqlitez: no named query "${opts.name}"`);
    }
    return this.query({ query: String(found[0].query), params: opts.params });
  }
  /**
   * Like `namedQuery`, but with JSON in and JSON out: each value of `opts.params`
   * is bound as a JSON string to the positional `?1`, `?2`, ... of the stored query, in order (read them in SQL with
   * `json_extract(?1, '$.field')`, `json_each(?2)`, ...). The stored query must return a row with a column `ret`
   * holding a JSON string. That JSON is parsed and returned.
   * The stored query must have a placeholder for every value, otherwise sqlite rejects the bind ("column index out of range").
   * @param {Object} opts
   * @param {string} opts.name - required, the `name` of the stored query (see `namedQuery`).
   * @param {Array<*>} [opts.params] - JSON-serializable values, bound in order as `?1`, `?2`, ... Default: none.
   * @returns {Promise<*>} The parsed `ret` of the first row, or null if there is no row or `ret` is null.
   * @throws {TypeError} If opts.name is missing or opts.params is not an array.
   */
  async namedJsonQuery(opts) {
    if (!opts || !opts.name) throw new TypeError("sqlitez: opts.name is required");
    const ret = await this.namedStringQuery(opts);
    if (ret === null) return null;
    return JSON.parse(ret);
  }
  /**
   * Like `namedJsonQuery` (same JSON params bound as `?1`, `?2`, ...), but the `ret` column is returned as is,
   * without JSON.parse. Use it when the stored query returns plain text (e.g. for models); use `namedJsonQuery` when it returns JSON (e.g. for dash).
   * @param {Object} opts
   * @param {string} opts.name - required, the `name` of the stored query (see `namedQuery`).
   * @param {Array<*>} [opts.params] - JSON-serializable values, bound in order as `?1`, `?2`, ... Default: none.
   * @returns {Promise<string|null>} The `ret` of the first row as a string, or null if there is no row or `ret` is null.
   * @throws {TypeError} If opts.name is missing or opts.params is not an array.
   */
  async namedStringQuery(opts) {
    if (!opts || !opts.name) throw new TypeError("sqlitez: opts.name is required");
    if (opts.params !== void 0 && !Array.isArray(opts.params)) throw new TypeError("sqlitez: opts.params must be an array");
    const rows = await this.namedQuery({ name: opts.name, params: (opts.params ?? []).map((value) => JSON.stringify(value ?? null)) });
    if (rows.length === 0) return null;
    if (!("ret" in rows[0])) {
      throw new Error(`sqlitez: named query "${opts.name}" returned no "ret" column`);
    }
    if (rows[0].ret === null) return null;
    return String(rows[0].ret);
  }
  /**
   * @returns {Object} The sql.js database.
   */
  #alive() {
    if (!this.db) throw new Error("sqlitez: the connection is closed");
    return this.db;
  }
}
class Sqlitez {
  /**
   * Opens a sqlite file of the browser file system into memory.
   * @param {Object} opts
   * @param {string} opts.path - required, OPFS path of the file (what `fs.resolve` returns for a downloaded file).
   * @returns {Promise<SqliteConn>} The connection. The caller must `close()` it.
   * @throws {TypeError} If opts.path is missing.
   */
  async open(opts) {
    if (!opts || !opts.path) throw new TypeError("sqlitez: opts.path is required");
    const segments = opts.path.split("/");
    const fileName = segments.pop();
    let dir = await navigator.storage.getDirectory();
    for (const segment of segments) dir = await dir.getDirectoryHandle(segment);
    const file = await (await dir.getFileHandle(fileName)).getFile();
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (new TextDecoder().decode(bytes.subarray(0, 16)) !== SQLITE_HEADER) {
      throw new Error(`sqlitez: ${opts.path} is not a sqlite file`);
    }
    const SQL = await loadSqlJs();
    return new SqliteConn(new SQL.Database(bytes));
  }
}
const sqlitez = new Sqlitez();
export { sqlitez };
