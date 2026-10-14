/**
 * @fileoverview Authentication client. Looks up the signed-in user and sends
 * unauthenticated browsers to the login page. Requests carry the session
 * cookie (credentials are always included by the Invoker).
 */
export type Services = import("../services/services.js").Services;
export type AuthPayload = {
    /**
     * -
     */
    sub_type?: string;
    /**
     * - user id
     */
    sub?: string;
    /**
     * -
     */
    ext?: string;
};
/**
 * @typedef {import("../services/services.js").Services} Services
 */
/**
 * Configuration options for the i6 SDK.
 * @typedef {Object} AuthPayload
 * @property {string} [sub_type] -
 * @property {string} [sub] - user id
 * @property {string} [ext] -
 */
/**
 * Authentication client for handling user sessions and authentication requests.
 * Obtain an instance with `i6sdk.auth()` rather than constructing it directly.
 */
declare class Auth {
    #private;
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs an Auth client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * Redirects the browser to the login page, passing the current URL (encoded)
     * as `backurl` so the user returns to this page after signing in.
     * Navigates away from the page; code after the call may not run.
     * @private
     * @returns {void}
     */
    private #redirectToLogin;
    /**
     * Fetches the current authenticated user profile (`GET api/auth/me`).
     * Does not redirect; use {@link Auth#requireUser} to force a login.
     * @returns {Promise<AuthPayload|null>} The user profile data, or null if the
     *   server returns no user.
     * @throws {Error} If the network request fails or the response body is not valid JSON.
     */
    user(): Promise<AuthPayload | null>;
    /**
     * Fetches the current user, redirecting the browser to the login page when
     * there is none. The login page sends the user back to the current URL
     * afterwards.
     * @returns {Promise<AuthPayload|null>} The user profile data, or null when the
     *   browser is being redirected to login.
     * @throws {Error} If the network request fails or the response body is not valid JSON.
     */
    requireUser(): Promise<AuthPayload | null>;
}
export { Auth };
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
/**
 * @fileoverview Keeps a remote file cached in the browser's file system (see fs.js),
 * downloading it only when its etag changes.
 */
export type FileRef = import('../fs/fs.js').FileRef;
/**
 * @typedef {import('../fs/fs.js').FileRef} FileRef
 */
/**
 * Downloads remote files into the versioned file store. Use the `downloader` singleton.
 */
declare class Downloader {
    /**
     * Downloads the file by name if necessary (checking etag): sends a HEAD request, and
     * if the etag differs from the released version, streams the body into a new version
     * and releases it.
     * @param {Object} opts
     * @param {string} opts.name - required, name to store the file under (see fs.js)
     * @param {string} opts.url - required, URL of the file; must answer HEAD with an etag
     * @returns {Promise<FileRef>} the FileRef of the up-to-date file (basically to get the version)
     * @throws {TypeError} If name or url is missing.
     * @throws {Error} If the HEAD or GET request fails, or the HEAD response has no etag.
    */
    update(opts: {
        name: string;
        url: string;
    }): Promise<FileRef>;
}
/** Shared Downloader instance. */
declare const downloader: Downloader;
export { downloader };
/**
 * @fileoverview Versioned file store on the browser's origin private file system (OPFS).
 *
 * Layout under `i6/fs`:
 *   {name}/version.txt          the released (current) version, if any
 *   {name}/v{version}/etag.txt  the etag the version was created for
 *   {name}/v{version}/blob.bin  the content (written by the caller, see `resolve`)
 *
 * Versions are ISO timestamps, so they sort in creation order.
 */
export type FileRef = {
    /**
     * - File name, a single OPFS directory name (e.g. "model").
     */
    name: string;
    /**
     * - Version id, an ISO timestamp (e.g. "2026-09-29T12:00:00.000Z").
     */
    version: string;
    /**
     * - Etag of the remote content this version was created for.
     */
    etag: string;
};
/**
 * Versioned file store. Use the `fs` singleton.
 *
 * A file is created as a new unreleased version, filled, then released to become the
 * current one; releasing removes the older versions.
 */
declare class FS {
    /**
     * Removes the versions older than version.txt, and the whole file if it is left empty.
     * Without version.txt no version is removed.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @returns {Promise<void>}
     */
    cleanFile(opts: {
        name: string;
    }): Promise<void>;
    /**
     * Cleans all files, see cleanFile.
     * @returns {Promise<void>}
     */
    clean(): Promise<void>;
    /**
     * Resolves a version of a file.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} [opts.version] - defaults to the content of version.txt
     * @returns {Promise<FileRef|null>} a new full FileRef, or null if it does not exist.
     */
    get(opts: {
        name: string;
        version?: string;
    }): Promise<FileRef | null>;
    /**
     * Creates a new version, unless the latest version already has this etag.
     * The new version is not released.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.etag - required
     * @param {Blob|BufferSource|string} [opts.data] - content, required when a new version is created
     * @returns {Promise<FileRef>} a new full FileRef.
     */
    create(opts: {
        name: string;
        etag: string;
        data?: Blob | BufferSource | string;
    }): Promise<FileRef>;
    /**
     * Returns the bin file path, full (with base). Does not check that it exists, see get.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.version - required
     * @returns {Promise<string>} e.g. "i6/fs/{name}/v{version}/blob.bin"
     */
    resolve(opts: {
        name: string;
        version: string;
    }): Promise<string>;
    /**
     * Reads the content (blob.bin) of a version.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.version - required
     * @returns {Promise<Uint8Array>} the bytes of the file.
     * @throws {DOMException} NotFoundError if the version or its blob does not exist.
     */
    read(opts: {
        name: string;
        version: string;
    }): Promise<Uint8Array>;
    /**
     * Makes a version the current one (version.txt), then cleans the older versions.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.version - required, must exist
     * @returns {Promise<FileRef>} a new full FileRef of the released version.
     */
    release(opts: {
        name: string;
        version: string;
    }): Promise<FileRef>;
    /**
     * Removes a version that was never released (e.g. its download failed). Does nothing if it does not exist.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.version - required, must not be the released one
     * @returns {Promise<void>}
     */
    discard(opts: {
        name: string;
        version: string;
    }): Promise<void>;
}
/** Shared FS instance. */
declare const fs: FS;
export { fs };
/**
 * @fileoverview Helpers shared by the services that run on files downloaded from i6 (infer, dash).
 */
export type FileRef = import("../fs/fs.js").FileRef;
/**
 * @typedef {import("../fs/fs.js").FileRef} FileRef
 */
/**
 * @param {Object<string, string>} partitions - Partitions, name -> value.
 * @returns {string} A stable key of the partitions, safe as part of a cache file name (e.g. "store_id%3Ds1-version%3Dv1").
 */
declare function partitionsKey(partitions: Record<string, string>): string;
/**
 * @param {*} partitions - Value to check.
 * @returns {boolean} True if it is an object (not an array) whose values are all strings.
 */
declare function isPartitions(partitions: any): boolean;
/**
 * Brings one remote file to the browser cache, downloading it only if its etag changed.
 * @param {string} name - Name of the cached file.
 * @param {string} url - URL of the file.
 * @returns {Promise<FileRef>} The cached file.
 * @throws {I6Error} With code "asset" if the download fails.
 */
declare function downloadFile(name: string, url: string): Promise<FileRef>;
export { partitionsKey, isPartitions, downloadFile };
/**
 * @typedef {import("../services/services.js").Services} Services
 */
export type Services = import("../services/services.js").Services;
export type apiDszCreateIngestionTokenParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszCreateIngestionTokenReq = {
    params: apiDszCreateIngestionTokenParams;
    payload: apiDszCreateIngestionTokenReqPayload;
};
export type apiDszCreateIngestionTokenReqPayload = {
    /**
     * - [Go: string]
     */
    annotation: string;
};
export type apiDszCreateIngestionTokenResp = {
    payload: apiDszCreateIngestionTokenRespPayload;
};
export type apiDszCreateIngestionTokenRespPayload = {
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: string]
     */
    jti: string;
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    /**
     * - [Go: string]
     */
    annotation: string;
    /**
     * - [Go: int64]
     */
    expiration_date: number;
    /**
     * - [Go: string]
     */
    audience: string;
    /**
     * - [Go: []string]
     */
    grants: Array<string>;
    /**
     * - [Go: string]
     */
    channel: string;
    /**
     * - [Go: string]
     */
    token: string;
};
export type apiDszCreateRecsysTokenParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszCreateRecsysTokenReq = {
    params: apiDszCreateRecsysTokenParams;
    payload: apiDszCreateRecsysTokenReqPayload;
};
export type apiDszCreateRecsysTokenReqPayload = {
    /**
     * - [Go: string]
     */
    annotation: string;
    /**
     * - [Go: string]
     */
    channel: string;
};
export type apiDszCreateRecsysTokenResp = {
    payload: apiDszCreateRecsysTokenRespPayload;
};
export type apiDszCreateRecsysTokenRespPayload = {
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: string]
     */
    jti: string;
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    /**
     * - [Go: string]
     */
    annotation: string;
    /**
     * - [Go: int64]
     */
    expiration_date: number;
    /**
     * - [Go: string]
     */
    audience: string;
    /**
     * - [Go: []string]
     */
    grants: Array<string>;
    /**
     * - [Go: string]
     */
    channel: string;
    /**
     * - [Go: string]
     */
    token: string;
};
export type apiDszCreateStoreParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszCreateStoreReq = {
    params: apiDszCreateStoreParams;
    payload: apiDszCreateStoreReqPayload;
};
export type apiDszCreateStoreReqPayload = {
    /**
     * - [Go: dszstore.DszStore]
     */
    store_id: apiDszCreateStoreReqPayloadStoreId;
};
export type apiDszCreateStoreReqPayloadStoreId = {
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: string]
     */
    name: string;
};
export type apiDszCreateStoreResp = object;
export type apiDszDeleteTokenParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszDeleteTokenQuery = {
    /**
     * - [Go: string]
     */
    token: string;
};
export type apiDszDeleteTokenReq = {
    params: apiDszDeleteTokenParams;
    query: apiDszDeleteTokenQuery;
};
export type apiDszDeleteTokenResp = object;
export type apiDszDomainGetParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszDomainGetQuery = {
    /**
     * - [Go: string]
     */
    store_id: string;
};
export type apiDszDomainGetReq = {
    params: apiDszDomainGetParams;
    query: apiDszDomainGetQuery;
};
export type apiDszDomainGetResp = {
    payload: apiDszDomainGetRespPayload;
};
export type apiDszDomainGetRespPayload = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    solutions: Array<apiDszDomainGetRespPayloadSolutionsElement>;
    /**
     * - [Go: string]
     */
    store_id: string;
};
export type apiDszDomainGetRespPayloadSolutionsElement = {
    /**
     * - [Go: solution.Solution]
     */
    solution: string;
    /**
     * - [Go: domain.Domain]
     */
    domain: string;
};
export type apiDszDomainSelectParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszDomainSelectReq = {
    params: apiDszDomainSelectParams;
    payload: apiDszDomainSelectReqPayload;
};
export type apiDszDomainSelectReqPayload = {
    /**
     * - [Go: domain.Domain]
     */
    domain: string;
    /**
     * - [Go: solution.Solution]
     */
    solution: string;
    /**
     * - [Go: string]
     */
    store_id: string;
};
export type apiDszDomainSelectResp = object;
export type apiDszGetPaymentStatusQuery = {
    /**
     * - [Go: lakedsz.Dataset] Id of the dataset that is waiting for the payment
     */
    dataset: string;
    /**
     * - [Go: string] User that is buying
     */
    user: string;
};
export type apiDszGetPaymentStatusReq = {
    query: apiDszGetPaymentStatusQuery;
};
export type apiDszGetPaymentStatusResp = {
    payload: apiDszGetPaymentStatusRespPayload;
};
export type apiDszGetPaymentStatusRespPayload = {
    /**
     * - [Go: string] Id of the dataset
     */
    dataset: string;
    /**
     * - [Go: string] Name of the dataset
     */
    dataset_name: string;
    /**
     * - [Go: string] Id of the payment on the payment provider
     */
    payment_id: string;
    /**
     * - [Go: string] paid, expired, open or unpaid. Only open and unpaid payments are still pending
     */
    payment_status: string;
    /**
     * - [Go: string] Payment provider
     */
    payment_type: string;
    /**
     * - [Go: string] User that is buying
     */
    user_id: string;
};
export type apiDszListDatasetsQuery = {
    /**
     * - [Go: string]
     */
    user: string;
};
export type apiDszListDatasetsReq = {
    query: apiDszListDatasetsQuery;
};
export type apiDszListDatasetsResp = {
    payload: apiDszListDatasetsRespPayload;
};
export type apiDszListDatasetsRespPayload = {
    datasets: Array<apiDszListDatasetsRespPayloadDatasetsElement>;
};
export type apiDszListDatasetsRespPayloadDatasetsElement = {
    grants: Array<apiDszListDatasetsRespPayloadDatasetsElementGrantsElement>;
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: string]
     */
    name: string;
};
export type apiDszListDatasetsRespPayloadDatasetsElementGrantsElement = string;
export type apiDszListIngestionTokensParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszListIngestionTokensReq = {
    params: apiDszListIngestionTokensParams;
};
export type apiDszListIngestionTokensResp = {
    payload: apiDszListIngestionTokensRespPayload;
};
export type apiDszListIngestionTokensRespPayload = object;
export type apiDszListPendingPaymentsQuery = {
    /**
     * - [Go: string] User that is buying
     */
    user: string;
};
export type apiDszListPendingPaymentsReq = {
    query: apiDszListPendingPaymentsQuery;
};
export type apiDszListPendingPaymentsResp = {
    payload: apiDszListPendingPaymentsRespPayload;
};
export type apiDszListPendingPaymentsRespPayload = {
    /**
     * - Datasets waiting for a payment
     */
    pending_payments: Array<apiDszListPendingPaymentsRespPayloadPendingPaymentsElement>;
};
export type apiDszListPendingPaymentsRespPayloadPendingPaymentsElement = {
    /**
     * - [Go: lakedsz.Dataset] Id of the dataset that is going to be created after the payment
     */
    dataset: string;
};
export type apiDszListRecsysTokensParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszListRecsysTokensReq = {
    params: apiDszListRecsysTokensParams;
};
export type apiDszListRecsysTokensResp = {
    payload: apiDszListRecsysTokensRespPayload;
};
export type apiDszListRecsysTokensRespPayload = object;
export type apiDszListStoresParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszListStoresReq = {
    params: apiDszListStoresParams;
};
export type apiDszListStoresResp = {
    payload: apiDszListStoresRespPayload;
};
export type apiDszListStoresRespPayload = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    stores: Array<apiDszListStoresRespPayloadStoresElement>;
};
export type apiDszListStoresRespPayloadStoresElement = {
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: string]
     */
    name: string;
};
export type apiDszModelGetParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset to generate signed URLs for.
     */
    dataset: string;
    /**
     * - [Go: string] Model name
     */
    model_name: string;
};
export type apiDszModelGetReq = {
    params: apiDszModelGetParams;
    payload: apiDszModelGetReqPayload;
};
export type apiDszModelGetReqPayload = {
    /**
     * - Model partition key/value pairs
     */
    model_partitions: Record<apiDszModelGetReqPayloadModelPartitionsKey, apiDszModelGetReqPayloadModelPartitionsValue>;
    /**
     * - [Go: string] Model version
     */
    model_version: string;
};
export type apiDszModelGetReqPayloadModelPartitionsKey = string;
export type apiDszModelGetReqPayloadModelPartitionsValue = string;
export type apiDszModelGetResp = {
    payload: apiDszModelGetRespPayload;
};
export type apiDszModelGetRespPayload = {
    /**
     * - Signed URLs
     */
    urls: Array<apiDszModelGetRespPayloadUrlsElement>;
};
export type apiDszModelGetRespPayloadUrlsElement = {
    /**
     * - [Go: string] File Name
     */
    name: string;
    /**
     * - [Go: string] signed URL.
     */
    url: string;
};
export type apiDszSignedUrlParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset to generate signed URLs for.
     */
    dataset: string;
};
export type apiDszSignedUrlReq = {
    params: apiDszSignedUrlParams;
    payload: apiDszSignedUrlReqPayload;
};
export type apiDszSignedUrlReqPayload = {
    /**
     * - List of paths and HTTP methods to generate signed URLs for.
     */
    paths: Array<apiDszSignedUrlReqPayloadPathsElement>;
};
export type apiDszSignedUrlReqPayloadPathsElement = {
    /**
     * - [Go: fszsignmethod.SignMethod] HTTP method (e.g. GET, PUT) for the signed URL.
     */
    method: string;
    /**
     * - [Go: laketbpathz.Path] File path within the dataset.
     */
    path: string;
};
export type apiDszSignedUrlResp = {
    payload: apiDszSignedUrlRespPayload;
};
export type apiDszSignedUrlRespPayload = {
    /**
     * - Signed URLs
     */
    urls: Array<apiDszSignedUrlRespPayloadUrlsElement>;
};
export type apiDszSignedUrlRespPayloadUrlsElement = {
    /**
     * - [Go: string] signed URL.
     */
    url: string;
};
export type apiDszStripeCheckoutReq = {
    payload: apiDszStripeCheckoutReqPayload;
};
export type apiDszStripeCheckoutReqPayload = {
    /**
     * - [Go: string] Url to go after a canceled checkout
     */
    cancel_url: string;
    /**
     * - [Go: string]
     */
    cnpj_hub: string;
    /**
     * - [Go: string]
     */
    contract_version: string;
    /**
     * - [Go: string] Customer email
     */
    customer_email: string;
    /**
     * - [Go: string] Dataset name
     */
    dataset_name: string;
    /**
     * - [Go: string]
     */
    id_campanha_hub: string;
    /**
     * - [Go: string]
     */
    id_solution_hub: string;
    /**
     * - Items being bought
     */
    line_items: Array<apiDszStripeCheckoutReqPayloadLineItemsElement>;
    /**
     * - [Go: string]
     */
    responsible_email_hub: string;
    /**
     * - [Go: string]
     */
    responsible_name_hub: string;
    /**
     * - [Go: int] Trial period in days
     */
    subscription_data_trial_period_days: number;
    /**
     * - [Go: string] Url to go after a successful checkout
     */
    success_url: string;
    /**
     * - [Go: string]
     */
    terms_accepted_at: string;
    /**
     * - [Go: string]
     */
    terms_version: string;
    /**
     * - [Go: string] User that is buying
     */
    user: string;
};
export type apiDszStripeCheckoutReqPayloadLineItemsElement = {
    /**
     * - [Go: string] Price id
     */
    price: string;
    /**
     * - [Go: int] Quantity
     */
    quantity: number;
};
export type apiDszStripeCheckoutResp = {
    payload: apiDszStripeCheckoutRespPayload;
};
export type apiDszStripeCheckoutRespPayload = {
    /**
     * - [Go: string] Checkout session id
     */
    id: string;
    /**
     * - [Go: string] Checkout session url
     */
    url: string;
};
export type apiDszTableGetParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset.
     */
    dataset: string;
    /**
     * - [Go: string] Path to the file without schema.
     */
    path: string;
};
export type apiDszTableGetReq = {
    params: apiDszTableGetParams;
};
export type apiDszTableGetResp = {
    headers: apiDszTableGetRespHeaders;
};
export type apiDszTableGetRespHeaders = {
    /**
     * - [Go: string] Redirect URL for the file.
     */
    location: string;
};
export type apiDszTableListParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset to list tables from.
     */
    dataset: string;
};
export type apiDszTableListQuery = {
    /**
     * - [Go: string] Pagination cursor.
     */
    from_cursor: string;
    /**
     * - [Go: int] Limit the number of results.
     */
    limist: number;
    /**
     * - [Go: laketbpathz.Path] Path to list.
     */
    path: string;
    /**
     * - [Go: bool] Whether to list recursively.
     */
    recursive: boolean;
    /**
     * - [Go: fszsignmethod.SignMethod] Whether to return signed URLs.
     */
    sign_method: string;
    /**
     * - [Go: bool] Whether to include file stats.
     */
    stat: boolean;
};
export type apiDszTableListReq = {
    params: apiDszTableListParams;
    query: apiDszTableListQuery;
};
export type apiDszTableListResp = {
    payload: apiDszTableListRespPayload;
};
export type apiDszTableListRespPayload = {
    files: Array<apiDszTableListRespPayloadFilesElement>;
    /**
     * - [Go: string] Cursor for the next page of results.
     */
    next_cursor: string;
};
export type apiDszTableListRespPayloadFilesElement = {
    /**
     * - [Go: laketbpathz.Path] write it
     */
    path: string;
    /**
     * - [Go: string] write it
     */
    signed_url: string;
    /**
     * - [Go: fsz.FileStat] write it
     */
    stat: dszFileStat;
};
export type apiIngestzGetUrlParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset that receives the uploaded files.
     */
    dataset: string;
};
export type apiIngestzGetUrlReq = {
    params: apiIngestzGetUrlParams;
    payload: apiIngestzGetUrlReqPayload;
};
export type apiIngestzGetUrlReqPayload = {
    /**
     * - [Go: int] Number of presigned upload URLs to generate.
     */
    amount: number;
    /**
     * - Partition key/value pairs that select the table partition the files are ingested into.
     */
    partitions: Record<apiIngestzGetUrlReqPayloadPartitionsKey, apiIngestzGetUrlReqPayloadPartitionsValue>;
    /**
     * - [Go: laketbnamez.TableName] Name of the table, inside the dataset, that receives the uploaded files.
     */
    table: string;
};
export type apiIngestzGetUrlReqPayloadPartitionsKey = string;
export type apiIngestzGetUrlReqPayloadPartitionsValue = string;
export type apiIngestzGetUrlResp = {
    payload: apiIngestzGetUrlRespPayload;
};
export type apiIngestzGetUrlRespPayload = {
    /**
     * - [Go: string] Ingestion token that identifies this ingestion and ties the uploaded files together.
     */
    ingest_id: string;
    /**
     * - Presigned PUT URLs, one per requested file; upload each file to its URL.
     */
    uploads: Array<apiIngestzGetUrlRespPayloadUploadsElement>;
};
export type apiIngestzGetUrlRespPayloadUploadsElement = string;
export type apiIngestzStreamRelevanceFashionCatalogParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset that receives the stream data.
     */
    dataset: string;
};
export type apiIngestzStreamRelevanceFashionCatalogReq = {
    params: apiIngestzStreamRelevanceFashionCatalogParams;
    payload: apiIngestzStreamRelevanceFashionCatalogReqPayload;
};
export type apiIngestzStreamRelevanceFashionCatalogReqPayload = {
    /**
     * - Generic stream data to ingest.
     */
    data: Array<apiIngestzStreamRelevanceFashionCatalogReqPayloadDataElement>;
};
export type apiIngestzStreamRelevanceFashionCatalogReqPayloadDataElement = {
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: bool]
     */
    inactive: boolean;
    /**
     * - [Go: string]
     */
    product_id: string;
    /**
     * - [Go: string]
     */
    sku_ds: string;
    /**
     * - [Go: string]
     */
    sku_id: string;
    /**
     * - [Go: string]
     */
    store_id: string;
};
export type apiIngestzStreamRelevanceFashionCatalogResp = object;
export type apiIngestzStreamRelevanceFashionEventParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset that receives the stream data.
     */
    dataset: string;
};
export type apiIngestzStreamRelevanceFashionEventReq = {
    params: apiIngestzStreamRelevanceFashionEventParams;
    payload: apiIngestzStreamRelevanceFashionEventReqPayload;
};
export type apiIngestzStreamRelevanceFashionEventReqPayload = {
    /**
     * - Generic stream data to ingest.
     */
    data: Array<apiIngestzStreamRelevanceFashionEventReqPayloadDataElement>;
};
export type apiIngestzStreamRelevanceFashionEventReqPayloadDataElement = {
    add_to_cart: apiIngestzStreamRelevanceFashionEventReqPayloadDataElementAddToCart;
    click: apiIngestzStreamRelevanceFashionEventReqPayloadDataElementClick;
    /**
     * - [Go: time.Time]
     */
    created_at: dszTime;
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: string]
     */
    ingested_at: string;
    purchase: apiIngestzStreamRelevanceFashionEventReqPayloadDataElementPurchase;
    recraw: apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRecraw;
    recshow: apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRecshow;
    remove_from_cart: apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRemoveFromCart;
    search: apiIngestzStreamRelevanceFashionEventReqPayloadDataElementSearch;
    /**
     * - [Go: string]
     */
    session_id: string;
    /**
     * - [Go: string]
     */
    store_id: string;
    /**
     * - [Go: string]
     */
    user_id: string;
};
export type apiIngestzStreamRelevanceFashionEventReqPayloadDataElementAddToCart = {
    /**
     * - [Go: float64]
     */
    price: number;
    /**
     * - [Go: string]
     */
    sku_id: string;
};
export type apiIngestzStreamRelevanceFashionEventReqPayloadDataElementClick = {
    /**
     * - [Go: float64]
     */
    price: number;
    /**
     * - [Go: string]
     */
    sku_id: string;
};
export type apiIngestzStreamRelevanceFashionEventReqPayloadDataElementPurchase = {
    /**
     * - [Go: string]
     */
    order_id: string;
    skus: Array<apiIngestzStreamRelevanceFashionEventReqPayloadDataElementPurchaseSkusElement>;
};
export type apiIngestzStreamRelevanceFashionEventReqPayloadDataElementPurchaseSkusElement = {
    /**
     * - [Go: int64]
     */
    qtty: number;
    /**
     * - [Go: string]
     */
    sku_id: string;
    /**
     * - [Go: float64]
     */
    unit_price: number;
};
export type apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRecraw = {
    /**
     * - [Go: string]
     */
    model_id: string;
    /**
     * - [Go: string]
     */
    payload: string;
    /**
     * - [Go: string]
     */
    rec_id: string;
};
export type apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRecshow = {
    /**
     * - [Go: string]
     */
    payload: string;
    /**
     * - [Go: string]
     */
    rec_id: string;
};
export type apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRemoveFromCart = {
    /**
     * - [Go: float64]
     */
    price: number;
    /**
     * - [Go: string]
     */
    sku_id: string;
};
export type apiIngestzStreamRelevanceFashionEventReqPayloadDataElementSearch = {
    /**
     * - [Go: string]
     */
    text: string;
};
export type apiIngestzStreamRelevanceFashionEventResp = object;
export type apiPipezGetParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    /**
     * - [Go: string]
     */
    id: string;
};
export type apiPipezGetReq = {
    params: apiPipezGetParams;
};
export type apiPipezGetResp = {
    payload: apiPipezGetRespPayload;
};
export type apiPipezGetRespPayload = object;
export type apiPipezListParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiPipezListQuery = {
    /**
     * - [Go: string]
     */
    cursor: string;
    /**
     * - [Go: int]
     */
    limit: number;
    /**
     * - [Go: string]
     */
    name: string;
    /**
     * - [Go: solutiondomain.SolutionDomain]
     */
    solution_domain: string;
    /**
     * - [Go: string]
     */
    status: string;
};
export type apiPipezListReq = {
    params: apiPipezListParams;
    query: apiPipezListQuery;
};
export type apiPipezListResp = {
    payload: apiPipezListRespPayload;
};
export type apiPipezListRespPayload = object;
export type apiPipezStartRelevanceFashionRelevanceFashionBatchIngestParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReq = {
    params: apiPipezStartRelevanceFashionRelevanceFashionBatchIngestParams;
    payload: apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayload;
};
export type apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayload = {
    params: apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayloadParams;
};
export type apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayloadParams = {
    /**
     * - [Go: string]
     */
    ingested_at: string;
    /**
     * - [Go: laketbnamez.TableName]
     */
    table: string;
};
export type apiPipezStartRelevanceFashionRelevanceFashionBatchIngestResp = {
    payload: apiPipezStartRelevanceFashionRelevanceFashionBatchIngestRespPayload;
};
export type apiPipezStartRelevanceFashionRelevanceFashionBatchIngestRespPayload = object;
export type apiPipezStartRelevanceFashionRelevanceFashionMainParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiPipezStartRelevanceFashionRelevanceFashionMainReq = {
    params: apiPipezStartRelevanceFashionRelevanceFashionMainParams;
    payload: apiPipezStartRelevanceFashionRelevanceFashionMainReqPayload;
};
export type apiPipezStartRelevanceFashionRelevanceFashionMainReqPayload = object;
export type apiPipezStartRelevanceFashionRelevanceFashionMainResp = {
    payload: apiPipezStartRelevanceFashionRelevanceFashionMainRespPayload;
};
export type apiPipezStartRelevanceFashionRelevanceFashionMainRespPayload = object;
export type apiSampleFractionParams = {
    /**
     * - [Go: float64] Fraction Denominator
     */
    denominator: number;
    /**
     * - [Go: float64] Fraction Numerator
     */
    numerator: number;
};
export type apiSampleFractionQuery = {
    /**
     * - [Go: int] Fraction max precision
     */
    precision: number;
};
export type apiSampleFractionReq = {
    params: apiSampleFractionParams;
    query: apiSampleFractionQuery;
    headers: apiSampleFractionReqHeaders;
    payload: apiSampleFractionReqPayload;
};
export type apiSampleFractionReqHeaders = {
    /**
     * - [Go: string] Sample of Trace Id
     */
    x_i6_trace_id: string;
};
export type apiSampleFractionReqPayload = {
    messages: Array<apiSampleFractionReqPayloadMessagesElement>;
    /**
     * - [Go: string] Sample reason of this fraction
     */
    reason: string;
};
export type apiSampleFractionReqPayloadMessagesElement = {
    /**
     * - [Go: string] message string
     */
    message: string;
};
export type apiSampleFractionResp = {
    headers: apiSampleFractionRespHeaders;
    payload: apiSampleFractionRespPayload;
};
export type apiSampleFractionRespHeaders = {
    /**
     * - [Go: string] Sample of any trace message
     */
    x_i6_trace_message: string;
};
export type apiSampleFractionRespPayload = {
    /**
     * - [Go: string] Human Fraction Representation
     */
    display: string;
    /**
     * - Output Messages
     */
    messages: Array<apiSampleFractionRespPayloadMessagesElement>;
    /**
     * - [Go: string] Fraction Result
     */
    result: string;
};
export type apiSampleFractionRespPayloadMessagesElement = string;
export type dszFileStat = {
    /**
     * - missing summary
     */
    url: string;
    /**
     * - missing summary
     */
    content_type: string;
    /**
     * - missing summary
     */
    md5: string;
    /**
     * - missing summary
     */
    size: string;
    /**
     * - missing summary
     */
    etag: string;
    /**
     * - missing summary
     */
    created_at: dszTime;
    /**
     * - missing summary
     */
    updated_at: dszTime;
};
export type dszTime = string;
export type sdkFuncProductRelevanceFashionDashAttachedRevenueInput = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    params: sdkFuncProductRelevanceFashionDashAttachedRevenueInputParams;
};
export type sdkFuncProductRelevanceFashionDashAttachedRevenueInputParams = {
    /**
     * - [Go: string]
     */
    max_year_month: string;
    /**
     * - [Go: string]
     */
    min_year_month: string;
};
export type sdkFuncProductRelevanceFashionDashAttachedRevenueOutput = {
    rows: Array<sdkFuncProductRelevanceFashionDashAttachedRevenueOutputRowsElement>;
};
export type sdkFuncProductRelevanceFashionDashAttachedRevenueOutputRowsElement = {
    /**
     * - [Go: float64]
     */
    attached_purchases: number;
    /**
     * - [Go: float64]
     */
    attached_revenue: number;
    /**
     * - [Go: float64]
     */
    attached_skus: number;
    /**
     * - [Go: float64]
     */
    avg_ticket: number;
};
export type sdkFuncProductRelevanceFashionDashAttachedRevenuePartitions = {
    /**
     * - [Go: string]
     */
    store_id: string;
};
export type sdkFuncProductRelevanceFashionDashAttachedRevenueReq = {
    input: sdkFuncProductRelevanceFashionDashAttachedRevenueInput;
    partitions: sdkFuncProductRelevanceFashionDashAttachedRevenuePartitions;
};
export type sdkFuncProductRelevanceFashionDashAttachedRevenueResp = {
    output: sdkFuncProductRelevanceFashionDashAttachedRevenueOutput;
};
export type sdkFuncProductRelevanceFashionDashFunnelInput = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    params: sdkFuncProductRelevanceFashionDashFunnelInputParams;
};
export type sdkFuncProductRelevanceFashionDashFunnelInputParams = {
    /**
     * - [Go: string]
     */
    max_year_month: string;
    /**
     * - [Go: string]
     */
    min_year_month: string;
};
export type sdkFuncProductRelevanceFashionDashFunnelOutput = {
    rows: Array<sdkFuncProductRelevanceFashionDashFunnelOutputRowsElement>;
};
export type sdkFuncProductRelevanceFashionDashFunnelOutputRowsElement = {
    /**
     * - [Go: string]
     */
    event_type: string;
    /**
     * - [Go: string]
     */
    from_rec: string;
    /**
     * - [Go: string]
     */
    qt_events: string;
};
export type sdkFuncProductRelevanceFashionDashFunnelPartitions = {
    /**
     * - [Go: string]
     */
    store_id: string;
};
export type sdkFuncProductRelevanceFashionDashFunnelReq = {
    input: sdkFuncProductRelevanceFashionDashFunnelInput;
    partitions: sdkFuncProductRelevanceFashionDashFunnelPartitions;
};
export type sdkFuncProductRelevanceFashionDashFunnelResp = {
    output: sdkFuncProductRelevanceFashionDashFunnelOutput;
};
export type sdkFuncProductRelevanceFashionFbtInput = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    skus: Array<sdkFuncProductRelevanceFashionFbtInputSkusElement>;
};
export type sdkFuncProductRelevanceFashionFbtInputSkusElement = {
    /**
     * - [Go: string]
     */
    sku_id: string;
};
export type sdkFuncProductRelevanceFashionFbtOutput = {
    results: Array<sdkFuncProductRelevanceFashionFbtOutputResultsElement>;
};
export type sdkFuncProductRelevanceFashionFbtOutputResultsElement = {
    /**
     * - [Go: float64]
     */
    rating: number;
    skus: Array<sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElement>;
};
export type sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElement = {
    /**
     * - [Go: string]
     */
    sku_id: string;
};
export type sdkFuncProductRelevanceFashionFbtPartitions = {
    /**
     * - [Go: string]
     */
    store_id: string;
};
export type sdkFuncProductRelevanceFashionFbtReq = {
    input: sdkFuncProductRelevanceFashionFbtInput;
    partitions: sdkFuncProductRelevanceFashionFbtPartitions;
};
export type sdkFuncProductRelevanceFashionFbtResp = {
    output: sdkFuncProductRelevanceFashionFbtOutput;
};
/**
 * apiDszCreateIngestionToken params
 * @typedef {object} apiDszCreateIngestionTokenParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszCreateIngestionToken Request
 * @typedef {object} apiDszCreateIngestionTokenReq
 * @property {apiDszCreateIngestionTokenParams} params
 * @property {apiDszCreateIngestionTokenReqPayload} payload
 */
/**
 * apiDszCreateIngestionToken reqPayload
 * @typedef {object} apiDszCreateIngestionTokenReqPayload
 * @property {string} annotation - [Go: string]
 */
/**
 * apiDszCreateIngestionToken Response
 * @typedef {object} apiDszCreateIngestionTokenResp
 * @property {apiDszCreateIngestionTokenRespPayload} payload
 */
/**
 * [Go: dsztoken.DatasetToken] apiDszCreateIngestionToken respPayload
 * @typedef {object} apiDszCreateIngestionTokenRespPayload
 * @property {string} id - [Go: string]
 * @property {string} jti - [Go: string]
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {string} annotation - [Go: string]
 * @property {number} expiration_date - [Go: int64]
 * @property {string} audience - [Go: string]
 * @property {Array<string>} grants - [Go: []string]
 * @property {string} channel - [Go: string]
 * @property {string} token - [Go: string]
 */
/**
 * apiDszCreateRecsysToken params
 * @typedef {object} apiDszCreateRecsysTokenParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszCreateRecsysToken Request
 * @typedef {object} apiDszCreateRecsysTokenReq
 * @property {apiDszCreateRecsysTokenParams} params
 * @property {apiDszCreateRecsysTokenReqPayload} payload
 */
/**
 * apiDszCreateRecsysToken reqPayload
 * @typedef {object} apiDszCreateRecsysTokenReqPayload
 * @property {string} annotation - [Go: string]
 * @property {string} channel - [Go: string]
 */
/**
 * apiDszCreateRecsysToken Response
 * @typedef {object} apiDszCreateRecsysTokenResp
 * @property {apiDszCreateRecsysTokenRespPayload} payload
 */
/**
 * [Go: dsztoken.DatasetToken] apiDszCreateRecsysToken respPayload
 * @typedef {object} apiDszCreateRecsysTokenRespPayload
 * @property {string} id - [Go: string]
 * @property {string} jti - [Go: string]
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {string} annotation - [Go: string]
 * @property {number} expiration_date - [Go: int64]
 * @property {string} audience - [Go: string]
 * @property {Array<string>} grants - [Go: []string]
 * @property {string} channel - [Go: string]
 * @property {string} token - [Go: string]
 */
/**
 * apiDszCreateStore params
 * @typedef {object} apiDszCreateStoreParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszCreateStore Request
 * @typedef {object} apiDszCreateStoreReq
 * @property {apiDszCreateStoreParams} params
 * @property {apiDszCreateStoreReqPayload} payload
 */
/**
 * apiDszCreateStore reqPayload
 * @typedef {object} apiDszCreateStoreReqPayload
 * @property {apiDszCreateStoreReqPayloadStoreId} store_id - [Go: dszstore.DszStore]
 */
/**
 * [Go: dszstore.DszStore]
 * @typedef {object} apiDszCreateStoreReqPayloadStoreId
 * @property {string} id - [Go: string]
 * @property {string} name - [Go: string]
 */
/**
 * apiDszCreateStore Response
 * @typedef {object} apiDszCreateStoreResp
 */
/**
 * apiDszDeleteToken params
 * @typedef {object} apiDszDeleteTokenParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszDeleteToken query
 * @typedef {object} apiDszDeleteTokenQuery
 * @property {string} token - [Go: string]
 */
/**
 * apiDszDeleteToken Request
 * @typedef {object} apiDszDeleteTokenReq
 * @property {apiDszDeleteTokenParams} params
 * @property {apiDszDeleteTokenQuery} query
 */
/**
 * apiDszDeleteToken Response
 * @typedef {object} apiDszDeleteTokenResp
 */
/**
 * apiDszDomainGet params
 * @typedef {object} apiDszDomainGetParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszDomainGet query
 * @typedef {object} apiDszDomainGetQuery
 * @property {string} store_id - [Go: string]
 */
/**
 * apiDszDomainGet Request
 * @typedef {object} apiDszDomainGetReq
 * @property {apiDszDomainGetParams} params
 * @property {apiDszDomainGetQuery} query
 */
/**
 * apiDszDomainGet Response
 * @typedef {object} apiDszDomainGetResp
 * @property {apiDszDomainGetRespPayload} payload
 */
/**
 * apiDszDomainGet respPayload
 * @typedef {object} apiDszDomainGetRespPayload
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {Array<apiDszDomainGetRespPayloadSolutionsElement>} solutions
 * @property {string} store_id - [Go: string]
 */
/**
 * [Go: dszapidomainsolutionget.SolutionDomain]
 * @typedef {object} apiDszDomainGetRespPayloadSolutionsElement
 * @property {string} solution - [Go: solution.Solution]
 * @property {string} domain - [Go: domain.Domain]
 */
/**
 * apiDszDomainSelect params
 * @typedef {object} apiDszDomainSelectParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszDomainSelect Request
 * @typedef {object} apiDszDomainSelectReq
 * @property {apiDszDomainSelectParams} params
 * @property {apiDszDomainSelectReqPayload} payload
 */
/**
 * apiDszDomainSelect reqPayload
 * @typedef {object} apiDszDomainSelectReqPayload
 * @property {string} domain - [Go: domain.Domain]
 * @property {string} solution - [Go: solution.Solution]
 * @property {string} store_id - [Go: string]
 */
/**
 * apiDszDomainSelect Response
 * @typedef {object} apiDszDomainSelectResp
 */
/**
 * apiDszGetPaymentStatus query
 * @typedef {object} apiDszGetPaymentStatusQuery
 * @property {string} dataset - [Go: lakedsz.Dataset] Id of the dataset that is waiting for the payment
 * @property {string} user - [Go: string] User that is buying
 */
/**
 * apiDszGetPaymentStatus Request
 * @typedef {object} apiDszGetPaymentStatusReq
 * @property {apiDszGetPaymentStatusQuery} query
 */
/**
 * apiDszGetPaymentStatus Response
 * @typedef {object} apiDszGetPaymentStatusResp
 * @property {apiDszGetPaymentStatusRespPayload} payload
 */
/**
 * apiDszGetPaymentStatus respPayload
 * @typedef {object} apiDszGetPaymentStatusRespPayload
 * @property {string} dataset - [Go: string] Id of the dataset
 * @property {string} dataset_name - [Go: string] Name of the dataset
 * @property {string} payment_id - [Go: string] Id of the payment on the payment provider
 * @property {string} payment_status - [Go: string] paid, expired, open or unpaid. Only open and unpaid payments are still pending
 * @property {string} payment_type - [Go: string] Payment provider
 * @property {string} user_id - [Go: string] User that is buying
 */
/**
 * apiDszListDatasets query
 * @typedef {object} apiDszListDatasetsQuery
 * @property {string} user - [Go: string]
 */
/**
 * apiDszListDatasets Request
 * @typedef {object} apiDszListDatasetsReq
 * @property {apiDszListDatasetsQuery} query
 */
/**
 * apiDszListDatasets Response
 * @typedef {object} apiDszListDatasetsResp
 * @property {apiDszListDatasetsRespPayload} payload
 */
/**
 * apiDszListDatasets respPayload
 * @typedef {object} apiDszListDatasetsRespPayload
 * @property {Array<apiDszListDatasetsRespPayloadDatasetsElement>} datasets
 */
/**
 * @typedef {object} apiDszListDatasetsRespPayloadDatasetsElement
 * @property {Array<apiDszListDatasetsRespPayloadDatasetsElementGrantsElement>} grants
 * @property {string} id - [Go: string]
 * @property {string} name - [Go: string]
 */
/**
 * [Go: string]
 * @typedef {string} apiDszListDatasetsRespPayloadDatasetsElementGrantsElement
 */
/**
 * apiDszListIngestionTokens params
 * @typedef {object} apiDszListIngestionTokensParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszListIngestionTokens Request
 * @typedef {object} apiDszListIngestionTokensReq
 * @property {apiDszListIngestionTokensParams} params
 */
/**
 * apiDszListIngestionTokens Response
 * @typedef {object} apiDszListIngestionTokensResp
 * @property {apiDszListIngestionTokensRespPayload} payload
 */
/**
 * [Go: dszapiingestiontokenslist.DszListIngestionTokensResp] apiDszListIngestionTokens respPayload
 * @typedef {object} apiDszListIngestionTokensRespPayload
 */
/**
 * apiDszListPendingPayments query
 * @typedef {object} apiDszListPendingPaymentsQuery
 * @property {string} user - [Go: string] User that is buying
 */
/**
 * apiDszListPendingPayments Request
 * @typedef {object} apiDszListPendingPaymentsReq
 * @property {apiDszListPendingPaymentsQuery} query
 */
/**
 * apiDszListPendingPayments Response
 * @typedef {object} apiDszListPendingPaymentsResp
 * @property {apiDszListPendingPaymentsRespPayload} payload
 */
/**
 * apiDszListPendingPayments respPayload
 * @typedef {object} apiDszListPendingPaymentsRespPayload
 * @property {Array<apiDszListPendingPaymentsRespPayloadPendingPaymentsElement>} pending_payments - Datasets waiting for a payment
 */
/**
 * @typedef {object} apiDszListPendingPaymentsRespPayloadPendingPaymentsElement
 * @property {string} dataset - [Go: lakedsz.Dataset] Id of the dataset that is going to be created after the payment
 */
/**
 * apiDszListRecsysTokens params
 * @typedef {object} apiDszListRecsysTokensParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszListRecsysTokens Request
 * @typedef {object} apiDszListRecsysTokensReq
 * @property {apiDszListRecsysTokensParams} params
 */
/**
 * apiDszListRecsysTokens Response
 * @typedef {object} apiDszListRecsysTokensResp
 * @property {apiDszListRecsysTokensRespPayload} payload
 */
/**
 * [Go: dszapirecsystokenslist.DszListRecsysTokensResp] apiDszListRecsysTokens respPayload
 * @typedef {object} apiDszListRecsysTokensRespPayload
 */
/**
 * apiDszListStores params
 * @typedef {object} apiDszListStoresParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszListStores Request
 * @typedef {object} apiDszListStoresReq
 * @property {apiDszListStoresParams} params
 */
/**
 * apiDszListStores Response
 * @typedef {object} apiDszListStoresResp
 * @property {apiDszListStoresRespPayload} payload
 */
/**
 * apiDszListStores respPayload
 * @typedef {object} apiDszListStoresRespPayload
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {Array<apiDszListStoresRespPayloadStoresElement>} stores
 */
/**
 * [Go: dszstore.DszStore]
 * @typedef {object} apiDszListStoresRespPayloadStoresElement
 * @property {string} id - [Go: string]
 * @property {string} name - [Go: string]
 */
/**
 * apiDszModelGet params
 * @typedef {object} apiDszModelGetParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset to generate signed URLs for.
 * @property {string} model_name - [Go: string] Model name
 */
/**
 * apiDszModelGet Request
 * @typedef {object} apiDszModelGetReq
 * @property {apiDszModelGetParams} params
 * @property {apiDszModelGetReqPayload} payload
 */
/**
 * apiDszModelGet reqPayload
 * @typedef {object} apiDszModelGetReqPayload
 * @property {Record<apiDszModelGetReqPayloadModelPartitionsKey, apiDszModelGetReqPayloadModelPartitionsValue>} model_partitions - Model partition key/value pairs
 * @property {string} model_version - [Go: string] Model version
 */
/**
 * [Go: string]
 * @typedef {string} apiDszModelGetReqPayloadModelPartitionsKey
 */
/**
 * [Go: string]
 * @typedef {string} apiDszModelGetReqPayloadModelPartitionsValue
 */
/**
 * apiDszModelGet Response
 * @typedef {object} apiDszModelGetResp
 * @property {apiDszModelGetRespPayload} payload
 */
/**
 * apiDszModelGet respPayload
 * @typedef {object} apiDszModelGetRespPayload
 * @property {Array<apiDszModelGetRespPayloadUrlsElement>} urls - Signed URLs
 */
/**
 * @typedef {object} apiDszModelGetRespPayloadUrlsElement
 * @property {string} name - [Go: string] File Name
 * @property {string} url - [Go: string] signed URL.
 */
/**
 * apiDszSignedUrl params
 * @typedef {object} apiDszSignedUrlParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset to generate signed URLs for.
 */
/**
 * apiDszSignedUrl Request
 * @typedef {object} apiDszSignedUrlReq
 * @property {apiDszSignedUrlParams} params
 * @property {apiDszSignedUrlReqPayload} payload
 */
/**
 * apiDszSignedUrl reqPayload
 * @typedef {object} apiDszSignedUrlReqPayload
 * @property {Array<apiDszSignedUrlReqPayloadPathsElement>} paths - List of paths and HTTP methods to generate signed URLs for.
 */
/**
 * Path and HTTP method specification for a signed URL.
 * @typedef {object} apiDszSignedUrlReqPayloadPathsElement
 * @property {string} method - [Go: fszsignmethod.SignMethod] HTTP method (e.g. GET, PUT) for the signed URL.
 * @property {string} path - [Go: laketbpathz.Path] File path within the dataset.
 */
/**
 * apiDszSignedUrl Response
 * @typedef {object} apiDszSignedUrlResp
 * @property {apiDszSignedUrlRespPayload} payload
 */
/**
 * apiDszSignedUrl respPayload
 * @typedef {object} apiDszSignedUrlRespPayload
 * @property {Array<apiDszSignedUrlRespPayloadUrlsElement>} urls - Signed URLs
 */
/**
 * @typedef {object} apiDszSignedUrlRespPayloadUrlsElement
 * @property {string} url - [Go: string] signed URL.
 */
/**
 * apiDszStripeCheckout Request
 * @typedef {object} apiDszStripeCheckoutReq
 * @property {apiDszStripeCheckoutReqPayload} payload
 */
/**
 * apiDszStripeCheckout reqPayload
 * @typedef {object} apiDszStripeCheckoutReqPayload
 * @property {string} cancel_url - [Go: string] Url to go after a canceled checkout
 * @property {string} cnpj_hub - [Go: string]
 * @property {string} contract_version - [Go: string]
 * @property {string} customer_email - [Go: string] Customer email
 * @property {string} dataset_name - [Go: string] Dataset name
 * @property {string} id_campanha_hub - [Go: string]
 * @property {string} id_solution_hub - [Go: string]
 * @property {Array<apiDszStripeCheckoutReqPayloadLineItemsElement>} line_items - Items being bought
 * @property {string} responsible_email_hub - [Go: string]
 * @property {string} responsible_name_hub - [Go: string]
 * @property {number} subscription_data_trial_period_days - [Go: int] Trial period in days
 * @property {string} success_url - [Go: string] Url to go after a successful checkout
 * @property {string} terms_accepted_at - [Go: string]
 * @property {string} terms_version - [Go: string]
 * @property {string} user - [Go: string] User that is buying
 */
/**
 * @typedef {object} apiDszStripeCheckoutReqPayloadLineItemsElement
 * @property {string} price - [Go: string] Price id
 * @property {number} quantity - [Go: int] Quantity
 */
/**
 * apiDszStripeCheckout Response
 * @typedef {object} apiDszStripeCheckoutResp
 * @property {apiDszStripeCheckoutRespPayload} payload
 */
/**
 * apiDszStripeCheckout respPayload
 * @typedef {object} apiDszStripeCheckoutRespPayload
 * @property {string} id - [Go: string] Checkout session id
 * @property {string} url - [Go: string] Checkout session url
 */
/**
 * apiDszTableGet params
 * @typedef {object} apiDszTableGetParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset.
 * @property {string} path - [Go: string] Path to the file without schema.
 */
/**
 * apiDszTableGet Request
 * @typedef {object} apiDszTableGetReq
 * @property {apiDszTableGetParams} params
 */
/**
 * apiDszTableGet Response
 * @typedef {object} apiDszTableGetResp
 * @property {apiDszTableGetRespHeaders} headers
 */
/**
 * apiDszTableGet respHeaders
 * @typedef {object} apiDszTableGetRespHeaders
 * @property {string} location - [Go: string] Redirect URL for the file.
 */
/**
 * apiDszTableList params
 * @typedef {object} apiDszTableListParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset to list tables from.
 */
/**
 * apiDszTableList query
 * @typedef {object} apiDszTableListQuery
 * @property {string} from_cursor - [Go: string] Pagination cursor.
 * @property {number} limist - [Go: int] Limit the number of results.
 * @property {string} path - [Go: laketbpathz.Path] Path to list.
 * @property {boolean} recursive - [Go: bool] Whether to list recursively.
 * @property {string} sign_method - [Go: fszsignmethod.SignMethod] Whether to return signed URLs.
 * @property {boolean} stat - [Go: bool] Whether to include file stats.
 */
/**
 * apiDszTableList Request
 * @typedef {object} apiDszTableListReq
 * @property {apiDszTableListParams} params
 * @property {apiDszTableListQuery} query
 */
/**
 * apiDszTableList Response
 * @typedef {object} apiDszTableListResp
 * @property {apiDszTableListRespPayload} payload
 */
/**
 * apiDszTableList respPayload
 * @typedef {object} apiDszTableListRespPayload
 * @property {Array<apiDszTableListRespPayloadFilesElement>} files
 * @property {string} next_cursor - [Go: string] Cursor for the next page of results.
 */
/**
 * File entry
 * @typedef {object} apiDszTableListRespPayloadFilesElement
 * @property {string} path - [Go: laketbpathz.Path] write it
 * @property {string} signed_url - [Go: string] write it
 * @property {dszFileStat} stat - [Go: fsz.FileStat] write it
 */
/**
 * apiIngestzGetUrl params
 * @typedef {object} apiIngestzGetUrlParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset that receives the uploaded files.
 */
/**
 * apiIngestzGetUrl Request
 * @typedef {object} apiIngestzGetUrlReq
 * @property {apiIngestzGetUrlParams} params
 * @property {apiIngestzGetUrlReqPayload} payload
 */
/**
 * apiIngestzGetUrl reqPayload
 * @typedef {object} apiIngestzGetUrlReqPayload
 * @property {number} amount - [Go: int] Number of presigned upload URLs to generate.
 * @property {Record<apiIngestzGetUrlReqPayloadPartitionsKey, apiIngestzGetUrlReqPayloadPartitionsValue>} partitions - Partition key/value pairs that select the table partition the files are ingested into.
 * @property {string} table - [Go: laketbnamez.TableName] Name of the table, inside the dataset, that receives the uploaded files.
 */
/**
 * [Go: string]
 * @typedef {string} apiIngestzGetUrlReqPayloadPartitionsKey
 */
/**
 * [Go: string]
 * @typedef {string} apiIngestzGetUrlReqPayloadPartitionsValue
 */
/**
 * apiIngestzGetUrl Response
 * @typedef {object} apiIngestzGetUrlResp
 * @property {apiIngestzGetUrlRespPayload} payload
 */
/**
 * apiIngestzGetUrl respPayload
 * @typedef {object} apiIngestzGetUrlRespPayload
 * @property {string} ingest_id - [Go: string] Ingestion token that identifies this ingestion and ties the uploaded files together.
 * @property {Array<apiIngestzGetUrlRespPayloadUploadsElement>} uploads - Presigned PUT URLs, one per requested file; upload each file to its URL.
 */
/**
 * [Go: string]
 * @typedef {string} apiIngestzGetUrlRespPayloadUploadsElement
 */
/**
 * apiIngestzStreamRelevanceFashionCatalog params
 * @typedef {object} apiIngestzStreamRelevanceFashionCatalogParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset that receives the stream data.
 */
/**
 * apiIngestzStreamRelevanceFashionCatalog Request
 * @typedef {object} apiIngestzStreamRelevanceFashionCatalogReq
 * @property {apiIngestzStreamRelevanceFashionCatalogParams} params
 * @property {apiIngestzStreamRelevanceFashionCatalogReqPayload} payload
 */
/**
 * apiIngestzStreamRelevanceFashionCatalog reqPayload
 * @typedef {object} apiIngestzStreamRelevanceFashionCatalogReqPayload
 * @property {Array<apiIngestzStreamRelevanceFashionCatalogReqPayloadDataElement>} data - Generic stream data to ingest.
 */
/**
 * @typedef {object} apiIngestzStreamRelevanceFashionCatalogReqPayloadDataElement
 * @property {string} id - [Go: string]
 * @property {boolean} inactive - [Go: bool]
 * @property {string} product_id - [Go: string]
 * @property {string} sku_ds - [Go: string]
 * @property {string} sku_id - [Go: string]
 * @property {string} store_id - [Go: string]
 */
/**
 * apiIngestzStreamRelevanceFashionCatalog Response
 * @typedef {object} apiIngestzStreamRelevanceFashionCatalogResp
 */
/**
 * apiIngestzStreamRelevanceFashionEvent params
 * @typedef {object} apiIngestzStreamRelevanceFashionEventParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset that receives the stream data.
 */
/**
 * apiIngestzStreamRelevanceFashionEvent Request
 * @typedef {object} apiIngestzStreamRelevanceFashionEventReq
 * @property {apiIngestzStreamRelevanceFashionEventParams} params
 * @property {apiIngestzStreamRelevanceFashionEventReqPayload} payload
 */
/**
 * apiIngestzStreamRelevanceFashionEvent reqPayload
 * @typedef {object} apiIngestzStreamRelevanceFashionEventReqPayload
 * @property {Array<apiIngestzStreamRelevanceFashionEventReqPayloadDataElement>} data - Generic stream data to ingest.
 */
/**
 * @typedef {object} apiIngestzStreamRelevanceFashionEventReqPayloadDataElement
 * @property {apiIngestzStreamRelevanceFashionEventReqPayloadDataElementAddToCart} add_to_cart
 * @property {apiIngestzStreamRelevanceFashionEventReqPayloadDataElementClick} click
 * @property {dszTime} created_at - [Go: time.Time]
 * @property {string} id - [Go: string]
 * @property {string} ingested_at - [Go: string]
 * @property {apiIngestzStreamRelevanceFashionEventReqPayloadDataElementPurchase} purchase
 * @property {apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRecraw} recraw
 * @property {apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRecshow} recshow
 * @property {apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRemoveFromCart} remove_from_cart
 * @property {apiIngestzStreamRelevanceFashionEventReqPayloadDataElementSearch} search
 * @property {string} session_id - [Go: string]
 * @property {string} store_id - [Go: string]
 * @property {string} user_id - [Go: string]
 */
/**
 * @typedef {object} apiIngestzStreamRelevanceFashionEventReqPayloadDataElementAddToCart
 * @property {number} price - [Go: float64]
 * @property {string} sku_id - [Go: string]
 */
/**
 * @typedef {object} apiIngestzStreamRelevanceFashionEventReqPayloadDataElementClick
 * @property {number} price - [Go: float64]
 * @property {string} sku_id - [Go: string]
 */
/**
 * @typedef {object} apiIngestzStreamRelevanceFashionEventReqPayloadDataElementPurchase
 * @property {string} order_id - [Go: string]
 * @property {Array<apiIngestzStreamRelevanceFashionEventReqPayloadDataElementPurchaseSkusElement>} skus
 */
/**
 * @typedef {object} apiIngestzStreamRelevanceFashionEventReqPayloadDataElementPurchaseSkusElement
 * @property {number} qtty - [Go: int64]
 * @property {string} sku_id - [Go: string]
 * @property {number} unit_price - [Go: float64]
 */
/**
 * @typedef {object} apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRecraw
 * @property {string} model_id - [Go: string]
 * @property {string} payload - [Go: string]
 * @property {string} rec_id - [Go: string]
 */
/**
 * @typedef {object} apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRecshow
 * @property {string} payload - [Go: string]
 * @property {string} rec_id - [Go: string]
 */
/**
 * @typedef {object} apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRemoveFromCart
 * @property {number} price - [Go: float64]
 * @property {string} sku_id - [Go: string]
 */
/**
 * @typedef {object} apiIngestzStreamRelevanceFashionEventReqPayloadDataElementSearch
 * @property {string} text - [Go: string]
 */
/**
 * apiIngestzStreamRelevanceFashionEvent Response
 * @typedef {object} apiIngestzStreamRelevanceFashionEventResp
 */
/**
 * apiPipezGet params
 * @typedef {object} apiPipezGetParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {string} id - [Go: string]
 */
/**
 * apiPipezGet Request
 * @typedef {object} apiPipezGetReq
 * @property {apiPipezGetParams} params
 */
/**
 * apiPipezGet Response
 * @typedef {object} apiPipezGetResp
 * @property {apiPipezGetRespPayload} payload
 */
/**
 * [Go: pipezget.PipezGetResp] apiPipezGet respPayload
 * @typedef {object} apiPipezGetRespPayload
 */
/**
 * apiPipezList params
 * @typedef {object} apiPipezListParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiPipezList query
 * @typedef {object} apiPipezListQuery
 * @property {string} cursor - [Go: string]
 * @property {number} limit - [Go: int]
 * @property {string} name - [Go: string]
 * @property {string} solution_domain - [Go: solutiondomain.SolutionDomain]
 * @property {string} status - [Go: string]
 */
/**
 * apiPipezList Request
 * @typedef {object} apiPipezListReq
 * @property {apiPipezListParams} params
 * @property {apiPipezListQuery} query
 */
/**
 * apiPipezList Response
 * @typedef {object} apiPipezListResp
 * @property {apiPipezListRespPayload} payload
 */
/**
 * [Go: pipezlist.PipezListResp] apiPipezList respPayload
 * @typedef {object} apiPipezListRespPayload
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionBatchIngest params
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionBatchIngestParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionBatchIngest Request
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReq
 * @property {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestParams} params
 * @property {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayload} payload
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionBatchIngest reqPayload
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayload
 * @property {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayloadParams} params
 */
/**
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayloadParams
 * @property {string} ingested_at - [Go: string]
 * @property {string} table - [Go: laketbnamez.TableName]
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionBatchIngest Response
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionBatchIngestResp
 * @property {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestRespPayload} payload
 */
/**
 * [Go: pipezstart.PipezStartResp] apiPipezStartRelevanceFashionRelevanceFashionBatchIngest respPayload
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionBatchIngestRespPayload
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionMain params
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionMainParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionMain Request
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionMainReq
 * @property {apiPipezStartRelevanceFashionRelevanceFashionMainParams} params
 * @property {apiPipezStartRelevanceFashionRelevanceFashionMainReqPayload} payload
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionMain reqPayload
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionMainReqPayload
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionMain Response
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionMainResp
 * @property {apiPipezStartRelevanceFashionRelevanceFashionMainRespPayload} payload
 */
/**
 * [Go: pipezstart.PipezStartResp] apiPipezStartRelevanceFashionRelevanceFashionMain respPayload
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionMainRespPayload
 */
/**
 * apiSampleFraction params
 * @typedef {object} apiSampleFractionParams
 * @property {number} denominator - [Go: float64] Fraction Denominator
 * @property {number} numerator - [Go: float64] Fraction Numerator
 */
/**
 * apiSampleFraction query
 * @typedef {object} apiSampleFractionQuery
 * @property {number} precision - [Go: int] Fraction max precision
 */
/**
 * apiSampleFraction Request
 * @typedef {object} apiSampleFractionReq
 * @property {apiSampleFractionParams} params
 * @property {apiSampleFractionQuery} query
 * @property {apiSampleFractionReqHeaders} headers
 * @property {apiSampleFractionReqPayload} payload
 */
/**
 * apiSampleFraction reqHeaders
 * @typedef {object} apiSampleFractionReqHeaders
 * @property {string} x_i6_trace_id - [Go: string] Sample of Trace Id
 */
/**
 * apiSampleFraction reqPayload
 * @typedef {object} apiSampleFractionReqPayload
 * @property {Array<apiSampleFractionReqPayloadMessagesElement>} messages
 * @property {string} reason - [Go: string] Sample reason of this fraction
 */
/**
 * message
 * @typedef {object} apiSampleFractionReqPayloadMessagesElement
 * @property {string} message - [Go: string] message string
 */
/**
 * apiSampleFraction Response
 * @typedef {object} apiSampleFractionResp
 * @property {apiSampleFractionRespHeaders} headers
 * @property {apiSampleFractionRespPayload} payload
 */
/**
 * apiSampleFraction respHeaders
 * @typedef {object} apiSampleFractionRespHeaders
 * @property {string} x_i6_trace_message - [Go: string] Sample of any trace message
 */
/**
 * apiSampleFraction respPayload
 * @typedef {object} apiSampleFractionRespPayload
 * @property {string} display - [Go: string] Human Fraction Representation
 * @property {Array<apiSampleFractionRespPayloadMessagesElement>} messages - Output Messages
 * @property {string} result - [Go: string] Fraction Result
 */
/**
 * [Go: string]
 * @typedef {string} apiSampleFractionRespPayloadMessagesElement
 */
/**
 * @typedef {object} dszFileStat
 * @property {string} url - missing summary
 * @property {string} content_type - missing summary
 * @property {string} md5 - missing summary
 * @property {string} size - missing summary
 * @property {string} etag - missing summary
 * @property {dszTime} created_at - missing summary
 * @property {dszTime} updated_at - missing summary
 */
/**
 * Missing Summary
 * @typedef {string} dszTime
 */
/**
 * sdkFuncProductRelevanceFashionDashAttachedRevenue input
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenueInput
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {sdkFuncProductRelevanceFashionDashAttachedRevenueInputParams} params
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenueInputParams
 * @property {string} max_year_month - [Go: string]
 * @property {string} min_year_month - [Go: string]
 */
/**
 * sdkFuncProductRelevanceFashionDashAttachedRevenue output
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenueOutput
 * @property {Array<sdkFuncProductRelevanceFashionDashAttachedRevenueOutputRowsElement>} rows
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenueOutputRowsElement
 * @property {number} attached_purchases - [Go: float64]
 * @property {number} attached_revenue - [Go: float64]
 * @property {number} attached_skus - [Go: float64]
 * @property {number} avg_ticket - [Go: float64]
 */
/**
 * sdkFuncProductRelevanceFashionDashAttachedRevenue partitions
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenuePartitions
 * @property {string} store_id - [Go: string]
 */
/**
 * sdkFuncProductRelevanceFashionDashAttachedRevenue Request
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenueReq
 * @property {sdkFuncProductRelevanceFashionDashAttachedRevenueInput} input
 * @property {sdkFuncProductRelevanceFashionDashAttachedRevenuePartitions} partitions
 */
/**
 * sdkFuncProductRelevanceFashionDashAttachedRevenue Response
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenueResp
 * @property {sdkFuncProductRelevanceFashionDashAttachedRevenueOutput} output
 */
/**
 * sdkFuncProductRelevanceFashionDashFunnel input
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelInput
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {sdkFuncProductRelevanceFashionDashFunnelInputParams} params
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelInputParams
 * @property {string} max_year_month - [Go: string]
 * @property {string} min_year_month - [Go: string]
 */
/**
 * sdkFuncProductRelevanceFashionDashFunnel output
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelOutput
 * @property {Array<sdkFuncProductRelevanceFashionDashFunnelOutputRowsElement>} rows
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelOutputRowsElement
 * @property {string} event_type - [Go: string]
 * @property {string} from_rec - [Go: string]
 * @property {string} qt_events - [Go: string]
 */
/**
 * sdkFuncProductRelevanceFashionDashFunnel partitions
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelPartitions
 * @property {string} store_id - [Go: string]
 */
/**
 * sdkFuncProductRelevanceFashionDashFunnel Request
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelReq
 * @property {sdkFuncProductRelevanceFashionDashFunnelInput} input
 * @property {sdkFuncProductRelevanceFashionDashFunnelPartitions} partitions
 */
/**
 * sdkFuncProductRelevanceFashionDashFunnel Response
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelResp
 * @property {sdkFuncProductRelevanceFashionDashFunnelOutput} output
 */
/**
 * sdkFuncProductRelevanceFashionFbt input
 * @typedef {object} sdkFuncProductRelevanceFashionFbtInput
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {Array<sdkFuncProductRelevanceFashionFbtInputSkusElement>} skus
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionFbtInputSkusElement
 * @property {string} sku_id - [Go: string]
 */
/**
 * sdkFuncProductRelevanceFashionFbt output
 * @typedef {object} sdkFuncProductRelevanceFashionFbtOutput
 * @property {Array<sdkFuncProductRelevanceFashionFbtOutputResultsElement>} results
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionFbtOutputResultsElement
 * @property {number} rating - [Go: float64]
 * @property {Array<sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElement>} skus
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElement
 * @property {string} sku_id - [Go: string]
 */
/**
 * sdkFuncProductRelevanceFashionFbt partitions
 * @typedef {object} sdkFuncProductRelevanceFashionFbtPartitions
 * @property {string} store_id - [Go: string]
 */
/**
 * sdkFuncProductRelevanceFashionFbt Request
 * @typedef {object} sdkFuncProductRelevanceFashionFbtReq
 * @property {sdkFuncProductRelevanceFashionFbtInput} input
 * @property {sdkFuncProductRelevanceFashionFbtPartitions} partitions
 */
/**
 * sdkFuncProductRelevanceFashionFbt Response
 * @typedef {object} sdkFuncProductRelevanceFashionFbtResp
 * @property {sdkFuncProductRelevanceFashionFbtOutput} output
 */
declare class Apis {
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs an Ingest client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     *
     *
     *
     *
     * @param {apiDszDomainGetReq} req
     * @returns {Promise<apiDszDomainGetResp>}
     */
    dszDomainGet(req: apiDszDomainGetReq): Promise<apiDszDomainGetResp>;
    /**
     *
     *
     *
     *
     * @param {apiDszListDatasetsReq} req
     * @returns {Promise<apiDszListDatasetsResp>}
     */
    dszListDatasets(req: apiDszListDatasetsReq): Promise<apiDszListDatasetsResp>;
    /**
     *
     *
     *
     *
     * @param {apiDszCreateRecsysTokenReq} req
     * @returns {Promise<apiDszCreateRecsysTokenResp>}
     */
    dszCreateRecsysToken(req: apiDszCreateRecsysTokenReq): Promise<apiDszCreateRecsysTokenResp>;
    /**
     * Get Payment Status
     *
     * Checks the payment of a dataset. When it is paid the dataset is created and granted to the user.
     *
     * @param {apiDszGetPaymentStatusReq} req
     * @returns {Promise<apiDszGetPaymentStatusResp>}
     */
    dszGetPaymentStatus(req: apiDszGetPaymentStatusReq): Promise<apiDszGetPaymentStatusResp>;
    /**
     * Stream Ingestion
     *
     * Ingests stream data into a target dataset table.
     *
     * @param {apiIngestzStreamRelevanceFashionEventReq} req
     * @returns {Promise<apiIngestzStreamRelevanceFashionEventResp>}
     */
    ingestzStreamRelevanceFashionEvent(req: apiIngestzStreamRelevanceFashionEventReq): Promise<apiIngestzStreamRelevanceFashionEventResp>;
    /**
     * Get Dataset Signed URLs
     *
     * Generates presigned URLs for accessing or mutating files in the specified dataset.
     *
     * @param {apiDszSignedUrlReq} req
     * @returns {Promise<apiDszSignedUrlResp>}
     */
    dszSignedUrl(req: apiDszSignedUrlReq): Promise<apiDszSignedUrlResp>;
    /**
     *
     *
     *
     *
     * @param {apiPipezGetReq} req
     * @returns {Promise<apiPipezGetResp>}
     */
    pipezGet(req: apiPipezGetReq): Promise<apiPipezGetResp>;
    /**
     *
     *
     *
     *
     * @param {apiDszCreateStoreReq} req
     * @returns {Promise<apiDszCreateStoreResp>}
     */
    dszCreateStore(req: apiDszCreateStoreReq): Promise<apiDszCreateStoreResp>;
    /**
     *
     *
     *
     *
     * @param {apiDszCreateIngestionTokenReq} req
     * @returns {Promise<apiDszCreateIngestionTokenResp>}
     */
    dszCreateIngestionToken(req: apiDszCreateIngestionTokenReq): Promise<apiDszCreateIngestionTokenResp>;
    /**
     * Sample Fraction
     *
     * Sample API that performs a fraction operation
     *
     * @param {apiSampleFractionReq} req
     * @returns {Promise<apiSampleFractionResp>}
     */
    sampleFraction(req: apiSampleFractionReq): Promise<apiSampleFractionResp>;
    /**
     *
     *
     *
     *
     * @param {apiPipezStartRelevanceFashionRelevanceFashionMainReq} req
     * @returns {Promise<apiPipezStartRelevanceFashionRelevanceFashionMainResp>}
     */
    pipezStartRelevanceFashionRelevanceFashionMain(req: apiPipezStartRelevanceFashionRelevanceFashionMainReq): Promise<apiPipezStartRelevanceFashionRelevanceFashionMainResp>;
    /**
     *
     *
     *
     *
     * @param {apiDszDomainSelectReq} req
     * @returns {Promise<apiDszDomainSelectResp>}
     */
    dszDomainSelect(req: apiDszDomainSelectReq): Promise<apiDszDomainSelectResp>;
    /**
     *
     *
     *
     *
     * @param {apiDszListStoresReq} req
     * @returns {Promise<apiDszListStoresResp>}
     */
    dszListStores(req: apiDszListStoresReq): Promise<apiDszListStoresResp>;
    /**
     * Get Model Signed URLs
     *
     * Generates presigned URLs for accessing model files in the specified dataset.
     *
     * @param {apiDszModelGetReq} req
     * @returns {Promise<apiDszModelGetResp>}
     */
    dszModelGet(req: apiDszModelGetReq): Promise<apiDszModelGetResp>;
    /**
     * Create Stripe Checkout
     *
     * Creates a Stripe checkout session for a subscription and returns its id and url.
     *
     * @param {apiDszStripeCheckoutReq} req
     * @returns {Promise<apiDszStripeCheckoutResp>}
     */
    dszStripeCheckout(req: apiDszStripeCheckoutReq): Promise<apiDszStripeCheckoutResp>;
    /**
     * Get Ingestion Upload URLs
     *
     * Generates presigned PUT URLs and an ingestion token for uploading files into a target dataset table and partitions.
     *
     * @param {apiIngestzGetUrlReq} req
     * @returns {Promise<apiIngestzGetUrlResp>}
     */
    ingestzGetUrl(req: apiIngestzGetUrlReq): Promise<apiIngestzGetUrlResp>;
    /**
     * Get Dataset Table File
     *
     * Get table file by redirecting to its signed URL.
     *
     * @param {apiDszTableGetReq} req
     * @returns {Promise<apiDszTableGetResp>}
     */
    dszTableGet(req: apiDszTableGetReq): Promise<apiDszTableGetResp>;
    /**
     * List Dataset Tables
     *
     * Lists files and tables in the specified dataset.
     *
     * @param {apiDszTableListReq} req
     * @returns {Promise<apiDszTableListResp>}
     */
    dszTableList(req: apiDszTableListReq): Promise<apiDszTableListResp>;
    /**
     *
     *
     *
     *
     * @param {apiDszListIngestionTokensReq} req
     * @returns {Promise<apiDszListIngestionTokensResp>}
     */
    dszListIngestionTokens(req: apiDszListIngestionTokensReq): Promise<apiDszListIngestionTokensResp>;
    /**
     *
     *
     *
     *
     * @param {apiDszListRecsysTokensReq} req
     * @returns {Promise<apiDszListRecsysTokensResp>}
     */
    dszListRecsysTokens(req: apiDszListRecsysTokensReq): Promise<apiDszListRecsysTokensResp>;
    /**
     *
     *
     *
     *
     * @param {apiDszDeleteTokenReq} req
     * @returns {Promise<apiDszDeleteTokenResp>}
     */
    dszDeleteToken(req: apiDszDeleteTokenReq): Promise<apiDszDeleteTokenResp>;
    /**
     * List Pending Payments
     *
     * Lists the datasets of a user that are waiting for a payment.
     *
     * @param {apiDszListPendingPaymentsReq} req
     * @returns {Promise<apiDszListPendingPaymentsResp>}
     */
    dszListPendingPayments(req: apiDszListPendingPaymentsReq): Promise<apiDszListPendingPaymentsResp>;
    /**
     * Stream Ingestion
     *
     * Ingests stream data into a target dataset table.
     *
     * @param {apiIngestzStreamRelevanceFashionCatalogReq} req
     * @returns {Promise<apiIngestzStreamRelevanceFashionCatalogResp>}
     */
    ingestzStreamRelevanceFashionCatalog(req: apiIngestzStreamRelevanceFashionCatalogReq): Promise<apiIngestzStreamRelevanceFashionCatalogResp>;
    /**
     *
     *
     *
     *
     * @param {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReq} req
     * @returns {Promise<apiPipezStartRelevanceFashionRelevanceFashionBatchIngestResp>}
     */
    pipezStartRelevanceFashionRelevanceFashionBatchIngest(req: apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReq): Promise<apiPipezStartRelevanceFashionRelevanceFashionBatchIngestResp>;
    /**
     *
     *
     *
     *
     * @param {apiPipezListReq} req
     * @returns {Promise<apiPipezListResp>}
     */
    pipezList(req: apiPipezListReq): Promise<apiPipezListResp>;
}
export { Apis };
declare class SdkFuncs {
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs an SdkFuncs instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * @param {sdkFuncProductRelevanceFashionDashAttachedRevenueReq} req
     * @returns {Promise<sdkFuncProductRelevanceFashionDashAttachedRevenueOutput>}
     */
    productRelevanceFashionDashAttachedRevenueV1(req: sdkFuncProductRelevanceFashionDashAttachedRevenueReq): Promise<sdkFuncProductRelevanceFashionDashAttachedRevenueOutput>;
    /**
     * @param {sdkFuncProductRelevanceFashionFbtReq} req
     * @returns {Promise<sdkFuncProductRelevanceFashionFbtOutput>}
     */
    productRelevanceFashionFbtV1(req: sdkFuncProductRelevanceFashionFbtReq): Promise<sdkFuncProductRelevanceFashionFbtOutput>;
    /**
     * @param {sdkFuncProductRelevanceFashionDashFunnelReq} req
     * @returns {Promise<sdkFuncProductRelevanceFashionDashFunnelOutput>}
     */
    productRelevanceFashionDashFunnelV1(req: sdkFuncProductRelevanceFashionDashFunnelReq): Promise<sdkFuncProductRelevanceFashionDashFunnelOutput>;
}
export { SdkFuncs };
/**
 * @fileoverview Service container managing SDK service instances and configuration.
 */
import { Invoker } from "../invoker/invoker.js";
import { Auth } from "../auth/auth.js";
import { Ingest } from "../ingest/ingest.js";
import { Apis, SdkFuncs } from "../sdkapis/sdkapis.js";
import { Infer } from "../infer/infer.js";
import { Dash } from "../dash/dash.js";
export type I6SdkConfig = import("../index.js").I6SdkConfig;
/**
 * @typedef {import("../index.js").I6SdkConfig} I6SdkConfig
 */
/**
 * Service container that instantiates and provides access to SDK service clients.
 * Every accessor returns a new client sharing this container's config and dispatcher.
 */
declare class Services {
    _dispatcher: EventTarget;
    /**
     * @private
     * @type {I6SdkConfig}
     */
    _config;
    /**
     * Constructs a Services instance.
     * @param {I6SdkConfig} config - Configuration object for the SDK services.
     */
    constructor(config: I6SdkConfig);
    /**
     * Returns the SDK configuration.
     * @returns {I6SdkConfig} The configuration object.
     */
    config(): I6SdkConfig;
    /**
     * Registers an event listener on the internal event dispatcher.
     * @param {string} evt - The event type or name to listen for.
     * @param {EventListenerOrEventListenerObject|Function} fn - The callback function or event listener object invoked when the event occurs.
     * @returns {void}
     */
    bind(evt: string, fn: EventListenerOrEventListenerObject | Function): void;
    /**
     * Creates and returns an Invoker service instance.
     * @returns {Invoker} An instance of the Invoker client.
     */
    invoker(): Invoker;
    /**
     * Creates and returns an Auth service instance.
     * @returns {Auth} An instance of the Auth client.
     */
    auth(): Auth;
    /**
     * Creates and returns an Ingest service instance.
     * @returns {Ingest} An instance of the Ingest client.
     */
    ingest(): Ingest;
    /**
     * Creates and returns an Infer service instance.
     * @returns {Infer} An instance of the Infer client.
     */
    infer(): Infer;
    /**
     * Creates and returns a Dash service instance.
     * @returns {Dash} An instance of the Dash client.
     */
    dash(): Dash;
    /**
     * Creates and returns an Apis service instance.
     * @returns {Apis} An instance of the generated Apis client.
     */
    apis(): Apis;
    /**
    * Creates and returns a Funcs service instance.
    * @returns {SdkFuncs} An instance of the generated SdkFuncs client.
    */
    funcs(): SdkFuncs;
}
export { Services };
/**
 * @fileoverview The LiteRT side of infer: loads the tflite model and runs it. Everything that touches the
 * LiteRT library (runtime, model, tensors) is in this file. The caller only gives data and gets values back.
 */
export type FileRef = import("../internal/fs/fs.js").FileRef;
export type ModelInput = {
    /**
     * - Flat values; their count must be the product of `shape`.
     */
    data: number[];
    /**
     * - Shape of `data`.
     */
    shape: number[];
};
/**
 * Loads the LiteRT runtime (once) and the tflite model. Everything LiteRT stays inside this file. The file is only
 * read and compiled when its version changed since the last call.
 * @param {Object} opts
 * @param {FileRef} opts.ref - The downloaded .tflite file.
 * @param {string} [opts.wasmUrl] - URL of the folder with the LiteRT wasm files. Defaults to the jsdelivr copy.
 * @returns {Promise<Object>} The compiled model, to give to `runModel` and `describeModel`.
 * @throws {I6Error} With code "asset" if the file is not a tflite file, "model" if the runtime or the model cannot be loaded.
 */
declare function loadModel(opts: {
    ref: FileRef;
    wasmUrl?: string;
}): Promise<Object>;
/**
 * Names, dtypes and shapes of what the model takes and returns.
 * @param {Object} model - The compiled model, from `loadModel`.
 * @returns {{inputs: Object[], outputs: Object[]}}
 */
declare function describeModel(model: Object): {
    inputs: Object[];
    outputs: Object[];
};
/**
 * Checks one input against the model's shape.
 * @param {string} name - Input name, for error messages.
 * @param {ModelInput} input - What the caller gave.
 * @param {number[]} modelShape - Shape of the model input (-1 is free).
 * @returns {{flat: number[], shape: number[]}}
 * @throws {I6Error} With code "invalid_argument" if the data does not fit the model's shape.
 */
declare function toTensorData(name: string, input: ModelInput, modelShape: number[]): {
    flat: number[];
    shape: number[];
};
/**
 * Runs the model. The caller only gives data: every LiteRT tensor is created and freed here.
 * Every model input must be in `inputs` under its exact name.
 * @param {Object} model - The compiled model, from loadModel.
 * @param {Record<string, ModelInput>} inputs - Input name -> data.
 * @returns {Promise<Record<string, ArrayLike<number>>>} Output name -> values, for every output of the model.
 * @throws {I6Error} With code "invalid_argument" if an input is missing or its data does not fit the model, "model" if the run fails.
 */
declare function runModel(model: Object, inputs: Record<string, ModelInput>): Promise<Record<string, ArrayLike<number>>>;
export { loadModel, describeModel, runModel, toTensorData };
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
     * @private
     * @param {InferOptions} opts - Inference options.
     * @returns {Promise<{sqlite: string, tflite: string}>} Download URLs of the files.
     * @throws {I6Error} With code "asset" if the API gave no URL for a file.
     */
    private _assetUrls;
}
export { Infer };
/**
 * @fileoverview HTTP client for sending API requests to i6 services.
 */
export type Services = import("../services/services.js").Services;
export type InvokeOptions = {
    /**
     * - The full URL to request. If omitted, defaults to `${baseUrl}/${path}`.
     */
    url?: string;
    /**
     * - The path to append to the baseUrl if `url` is not provided.
     */
    path?: string;
    /**
     * - Key-value pairs to append as query parameters.
     */
    query?: Record<string, any>;
    /**
     * - JSON-serializable body data. If provided, sets Content-Type header to application/json and serializes to body.
     */
    json?: any;
    /**
     * - HTTP method (e.g., 'GET', 'POST', 'PUT', 'DELETE').
     */
    method?: string;
    /**
     * - HTTP headers for the request.
     */
    headers?: HeadersInit;
    /**
     * - HTTP request body.
     */
    body?: BodyInit | null;
    /**
     * - Request credentials mode (e.g., 'include', 'same-origin', 'omit').
     */
    credentials?: RequestCredentials;
    /**
     * - Request mode (e.g., 'cors', 'no-cors', 'same-origin').
     */
    mode?: RequestMode;
    /**
     * - An AbortSignal to cancel the request.
     */
    signal?: AbortSignal | null;
};
/**
 * @typedef {import("../services/services.js").Services} Services
 */
/**
 * Options for sending HTTP requests via the Invoker.
 * @typedef {Object} InvokeOptions
 * @property {string} [url] - The full URL to request. If omitted, defaults to `${baseUrl}/${path}`.
 * @property {string} [path] - The path to append to the baseUrl if `url` is not provided.
 * @property {Record<string, any>} [query] - Key-value pairs to append as query parameters.
 * @property {*} [json] - JSON-serializable body data. If provided, sets Content-Type header to application/json and serializes to body.
 * @property {string} [method] - HTTP method (e.g., 'GET', 'POST', 'PUT', 'DELETE').
 * @property {HeadersInit} [headers] - HTTP headers for the request.
 * @property {BodyInit|null} [body] - HTTP request body.
 * @property {RequestCredentials} [credentials] - Request credentials mode (e.g., 'include', 'same-origin', 'omit').
 * @property {RequestMode} [mode] - Request mode (e.g., 'cors', 'no-cors', 'same-origin').
 * @property {AbortSignal|null} [signal] - An AbortSignal to cancel the request.
 */
/**
 * Invoker client for executing HTTP requests against the i6 API.
 */
declare class Invoker {
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs an Invoker instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * Sends an HTTP request using the Fetch API.
     *
     * @param {InvokeOptions} opts - Request options including path/URL, query params, and fetch options.
     * @param {string} [opts.url] - The full URL to request. If omitted, defaults to `${baseUrl}/${path}`.
     * @param {string} [opts.path] - The path to append to the baseUrl if `url` is not provided.
     * @param {Record<string, any>} [opts.query] - Key-value pairs to append as query parameters.
     * @param {*} [opts.json] - JSON-serializable body data. If provided, sets Content-Type header to application/json and serializes to body.
     * Credentials are always set to "include" so the session cookie is sent. Note that `opts`
     * is modified (credentials, and headers/body when `json` is given). An HTTP error status
     * does not throw; check `ok` on the returned Response.
     * @returns {Promise<Response>} A promise that resolves to the fetch Response.
     * @throws {TypeError} If the network request fails (from fetch).
     */
    invoke(opts: InvokeOptions): Promise<Response>;
}
export { Invoker };
/**
 * @fileoverview Error types thrown by the i6 Web Legacy SDK.
 */
export type I6ErrorCode = "http" | "network" | "invalid_argument" | "no_upload_url" | "asset" | "model" | "query";
/**
 * @typedef {"http"|"network"|"invalid_argument"|"no_upload_url"|"asset"|"model"|"query"} I6ErrorCode
 */
/**
 * Error thrown by the SDK when a call fails.
 *
 * `code` tells what kind of failure it was, so callers can branch on it instead of parsing
 * the message. `status` and `body` are set for `"http"` failures.
 */
declare class I6Error extends Error {
    /** @type {I6ErrorCode|undefined} */
    code: I6ErrorCode | undefined;
    /** @type {number|undefined} */
    status: number | undefined;
    /** @type {*} */
    body: any;
    /**
     * @param {string} message - Human readable description.
     * @param {Object} [details]
     * @param {I6ErrorCode} [details.code] - Failure kind. Defaults to "http" when a status is given.
     * @param {number} [details.status] - HTTP status code, when the server answered.
     * @param {*} [details.body] - Error body of the response (parsed JSON, or raw text).
     * @param {*} [details.cause] - The underlying error, if any.
     */
    constructor(message: string, { code, status, body, cause }?: {
        code?: I6ErrorCode;
        status?: number;
        body?: any;
        cause?: any;
    });
    /**
     * Builds an "http" error from a failed generated-client result ({status, error}).
     * @param {string} message
     * @param {{status: number, error?: *}} result
     * @returns {I6Error}
     */
    static fromResult(message: string, result: {
        status: number;
        error?: any;
    }): I6Error;
}
export { I6Error };
/**
 * @fileoverview Queries an i6 dash in the browser: downloads the dash's sqlite, runs the named query
 * `dash-${dashName}` on it and returns its result as is. Nothing here is dash specific.
 *
 * Set `window.I6_DEBUG = true` to see what happens in the console.
 */
export type Services = import("../services/services.js").Services;
export type DashOptions = {
    /**
     * - Dash name (e.g. "product-relevance-fashion-dash-funnel"); names the cached sqlite and the named query.
     */
    dashName: string;
    /**
     * - Partitions of the dash, name -> value (e.g. `{ store_id: "s1", version: "v1" }`).
     */
    partitions: Record<string, string>;
    /**
     * - Dataset that holds the dash file.
     */
    dataset: string;
    /**
     * - Query input, any JSON. Bound as `?1` of the named query.
     */
    params: any;
    /**
     * - Tests only: URL of the sqlite (must answer HEAD with an etag). Default: the model API.
     */
    sqliteUrl?: string;
};
/**
 * Dash client.
 */
declare class Dash {
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs a Dash client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * Downloads the dash sqlite (cached by etag), runs the named query `dash-${dashName}` with `params` and returns its result.
     * @param {DashOptions} opts - Dash options.
     * @returns {Promise<*>} The `ret` of the named query.
     * @throws {I6Error} With code "invalid_argument" if opts is malformed, "asset" if the download fails,
     *   "query" if the sqlite fails.
     */
    query(opts: DashOptions): Promise<any>;
    /**
     * Finds where the dash sqlite is: the signed URL of the model API (like Infer), unless opts has `sqliteUrl` (tests).
     * @private
     * @param {DashOptions} opts - Dash options.
     * @returns {Promise<string>} Download URL of the sqlite.
     * @throws {I6Error} With code "asset" if the API gave no URL.
     */
    private _sqliteUrl;
}
export { Dash };
/**
 * @fileoverview Main entry point for the i6 Web Legacy SDK.
 */
import { I6Error } from "./errors.js";
export type I6SdkConfig = {
    /**
     * - Base URL of the i6 server. Defaults to the sandbox environment.
     */
    baseUrl?: string;
};
/**
 * Main SDK class providing access to i6 services.
 */
declare class I6Sdk {
    /**
     * @private
     * @type {Services}
     */
    _service;
    _config: {
        baseUrl?: string;
    };
    /**
     * Constructs an instance of the i6 SDK.
     * @param {I6SdkConfig} [config] - Configuration options for the SDK.
     */
    constructor(config?: I6SdkConfig);
    /**
     * Returns an Ingest service instance.
     * @returns {Ingest} An instance of the Ingest client.
     */
    ingest(): Ingest;
    /**
     * Returns an Infer service instance, which runs an i6 model in the browser and returns the result.
     * @returns {Infer} An instance of the Infer client.
     */
    infer(): Infer;
    /**
     * Returns a Dash service instance, which queries an i6 dash in the browser and returns the result.
     * @returns {Dash} An instance of the Dash client.
     */
    dash(): Dash;
    /**
     * Returns an Auth service instance.
     * @returns {Auth} An instance of the Auth client.
     */
    auth(): Auth;
    /**
     * Returns the Apis service instance, one typed method per i6 server API.
     * Each call resolves with `{status, ok, payload?, error?}` and does not throw on an HTTP error.
     * @returns {Apis} An instance of the generated Apis client.
     */
    apis(): Apis;
    /**
     * Returns the Funcs service instance.
     * @returns {SdkFuncs} An instance of the generated Apis client.
     */
    funcs(): SdkFuncs;
    /**
     * Registers an event listener on the SDK's internal event dispatcher (an EventTarget).
     * @param {string} evt - The event type or name to listen for.
     * @param {EventListenerOrEventListenerObject|Function} fn - The callback function or event listener object invoked when the event occurs.
     * @returns {void}
     */
    bind(evt: string, fn: EventListenerOrEventListenerObject | Function): void;
}
declare namespace I6Sdk {
    export { I6Error };
}
export { I6Sdk, I6Error };
/**
 * @fileoverview Ingest client for uploading files to the ingestion service.
 */
export type Services = import("../services/services.js").Services;
export type Partitions = Record<string, string>;
export type GetUrlParams = {
    /**
     * - Dataset name.
     */
    dataset: string;
    /**
     * - Inbox table name.
     */
    table: string;
    /**
     * - Values for the table partitions, except the ingest id one.
     */
    partitions: Partitions;
};
export type UploadProgress = {
    /**
     * - Bytes sent so far.
     */
    loaded: number;
    /**
     * - Total bytes to send (the file size when the browser can't tell).
     */
    total: number;
    /**
     * - Progress from 0 to 100.
     */
    percent: number;
};
export type UploadParams = {
    /**
     * - Dataset the file is ingested into.
     */
    dataset: string;
    /**
     * - Inbox table name.
     */
    table: string;
    /**
     * - Values for the table partitions, except the ingest id one.
     */
    partitions: Partitions;
    /**
     * - The single file to upload.
     */
    file: File;
    /**
     * - Called as the file is sent.
     */
    onProgress?: (progress: UploadProgress) => void;
    /**
     * - Aborts the upload; the promise then rejects with the signal's reason (an AbortError by default).
     */
    signal?: AbortSignal;
    /**
     * - Content-Type of the PUT. Defaults to the file's own type.
     */
    contentType?: string;
};
export type UploadResult = {
    /**
     * - Id the server assigned to this ingest.
     */
    ingestId: string;
};
/**
 * @typedef {import("../services/services.js").Services} Services
 */
/**
 * Key-value mapping representing dataset table partition values, except the ingest ID.
 * @typedef {Record<string, string>} Partitions
 */
/**
 * Parameters for requesting a signed upload URL from the ingest service.
 * @typedef {Object} GetUrlParams
 * @property {string} dataset - Dataset name.
 * @property {string} table - Inbox table name.
 * @property {Partitions} partitions - Values for the table partitions, except the ingest id one.
 */
/**
 * Progress of an upload in flight.
 * @typedef {Object} UploadProgress
 * @property {number} loaded - Bytes sent so far.
 * @property {number} total - Total bytes to send (the file size when the browser can't tell).
 * @property {number} percent - Progress from 0 to 100.
 */
/**
 * Parameters for uploading a single file to the ingest service.
 * @typedef {Object} UploadParams
 * @property {string} dataset - Dataset the file is ingested into.
 * @property {string} table - Inbox table name.
 * @property {Partitions} partitions - Values for the table partitions, except the ingest id one.
 * @property {File} file - The single file to upload.
 * @property {(progress: UploadProgress) => void} [onProgress] - Called as the file is sent.
 * @property {AbortSignal} [signal] - Aborts the upload; the promise then rejects with the signal's reason (an AbortError by default).
 * @property {string} [contentType] - Content-Type of the PUT. Defaults to the file's own type.
 */
/**
 * Result of a successful upload.
 * @typedef {Object} UploadResult
 * @property {string} ingestId - Id the server assigned to this ingest.
 */
/**
 * Client for handling file uploads to the ingest service.
 */
declare class Ingest {
    #private;
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs an Ingest client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * Asks ingestz for a signed upload URL (ingestz-get-url API) and uploads a single file to it.
     * @param {UploadParams} params - Upload parameters.
     * @returns {Promise<UploadResult>} Resolves with the ingest id on a successful upload.
     * @throws {I6Error} With code "invalid_argument" if file is not a single File, "http" or
     *   "network" if a request fails. Rejects with an AbortError if `signal` aborts.
     */
    upload({ dataset, table, partitions, file, onProgress, signal, contentType }: UploadParams): Promise<UploadResult>;
    /**
     * Gets one signed PUT URL from the ingestz-get-url API.
     * @private
     * @param {GetUrlParams} params - Parameters for requesting the upload URL.
     * @returns {Promise<{ingestId: string, url: string}>} The ingest id and the signed PUT URL.
     * @throws {I6Error} If the request fails or no upload URL is returned.
     */
    private #getUrl;
    /**
     * Uploads a file to a signed PUT URL using XMLHttpRequest (fetch has no upload progress).
     * @private
     * @param {string} signedPutUrl - The signed URL to PUT the file to.
     * @param {File} file - The file to upload.
     * @param {Pick<UploadParams, "onProgress"|"signal"|"contentType">} opts
     * @returns {Promise<void>} Resolves on a successful upload, rejects on network or HTTP error or abort.
     */
    private #put;
}
export { Ingest };
