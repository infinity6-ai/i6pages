/**
 * @fileoverview Sqlite client for the SDK, running sqlite (sql.js, wasm) in the browser.
 *
 * Usage: get the file with the downloader, open it by its OPFS path and always close the
 * connection when done:
 *
 *   const ref = await downloader.update({ name, url })
 *   const conn = await sqlitez.open({ path: await fs.resolve(ref) })
 *   try {
 *     const rows = await conn.query({ query: 'SELECT * FROM t WHERE id = ?', params: [1] })
 *   } finally {
 *     await conn.close()
 *   }
 *
 * The database lives in memory: `update` changes the memory copy, the file is never written back.
 * Every method takes a single `opts` object with the real parameters inside it.
 */
export type SqliteValue = number | string | null | Uint8Array;
export type SqliteRow = Record<string, SqliteValue>;
/**
 * An open sqlite database. Get one with `sqlitez.open` and always call `close()` in a `finally`.
 */
declare class SqliteConn {
    /** @private */
    db;
    /**
     * Use `sqlitez.open`, not this constructor.
     * @param {Object} db - The sql.js database.
     */
    constructor(db: Object);
    /**
     * Closes the connection, freeing the database. Closing twice is fine.
     * @returns {Promise<void>}
     */
    close(): Promise<void>;
    /**
     * Runs a query and returns its rows.
     * @param {Object} opts
     * @param {string} opts.query - required, the SQL; use `?` for values.
     * @param {SqliteValue[]} [opts.params] - values bound, in order, to the `?` of the query (never concatenate them).
     * @returns {Promise<SqliteRow[]>} The rows (empty array when none), each one an object by column name.
     * @throws {TypeError} If opts.query is missing.
     * @throws {I6Error} With code "query" if the connection is closed or sqlite rejects the query.
     */
    query(opts: {
        query: string;
        params?: SqliteValue[];
    }): Promise<SqliteRow[]>;
    /**
     * Runs a statement that returns no data (INSERT, UPDATE, CREATE, ...). Only the memory copy changes.
     * @param {Object} opts
     * @param {string} opts.query - required, the SQL; use `?` for values.
     * @param {SqliteValue[]} [opts.params] - values bound, in order, to the `?` of the query.
     * @returns {Promise<void>}
     * @throws {TypeError} If opts.query is missing.
     * @throws {I6Error} With code "query" if the connection is closed or sqlite rejects the statement.
     */
    update(opts: {
        query: string;
        params?: SqliteValue[];
    }): Promise<void>;
    /**
     * Runs a query stored in the `namedqueries` table of the sqlite (columns `name` and `query`).
     * @param {Object} opts
     * @param {string} opts.name - required, the `name` of the stored query.
     * @param {SqliteValue[]} [opts.params] - values bound, in order, to the `?` of the stored query.
     * @returns {Promise<SqliteRow[]>} The rows of the stored query, like `query`.
     * @throws {TypeError} If opts.name is missing.
     * @throws {I6Error} With code "query" if the connection is closed, there is no such table or named query, or the query fails.
     */
    namedQuery(opts: {
        name: string;
        params?: SqliteValue[];
    }): Promise<SqliteRow[]>;
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
     * @throws {I6Error} With code "query" if `namedQuery` fails, the rows have no `ret` column, or `ret` is not valid JSON.
     */
    namedJsonQuery(opts: {
        name: string;
        params?: Array<any>;
    }): Promise<any>;
    /**
     * @private
     * @returns {Object} The sql.js database.
     * @throws {I6Error} With code "query" if the connection is closed.
     */
    private alive;
}
/**
 * Sqlitez client. Use the `sqlitez` singleton.
 */
declare class Sqlitez {
    /**
     * Opens a sqlite file of the browser file system into memory.
     * @param {Object} opts
     * @param {string} opts.path - required, OPFS path of the file (what `fs.resolve` returns for a downloaded file).
     * @returns {Promise<SqliteConn>} The connection. The caller must `close()` it.
     * @throws {TypeError} If opts.path is missing.
     * @throws {I6Error} With code "asset" if the file cannot be read or is not a sqlite file.
     */
    open(opts: {
        path: string;
    }): Promise<SqliteConn>;
}
/** Shared Sqlitez instance. */
declare const sqlitez: Sqlitez;
export { sqlitez };
