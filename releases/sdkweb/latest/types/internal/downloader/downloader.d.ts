/**
 * @fileoverview Keeps a remote file cached in the browser's file system (see fs.js),
 * downloading it only when its etag changes.
 */
export type FileRef = import('../fs/fs.js').FileRef;
/**
 * Downloads remote files into the versioned file store. Use the `downloader` singleton.
 */
declare class Downloader {
    /** @type {Map<string, Promise<FileRef>>} */
    downloads: Map<string, Promise<FileRef>>;
    constructor();
    /**
     * Downloads or revalidates the file by name.
     * If minPreloadTime is specified:
     *   - If no file exists, downloads and awaits the new file.
     *   - If a file exists and is older than minPreloadTime, starts updating in the background and returns the existing file immediately.
     *   - If a file exists and is newer than minPreloadTime, returns the existing file immediately without network requests.
     * If minPreloadTime is omitted, always performs an update check and waits for it (legacy behavior).
     * @param {Object} opts
     * @param {string} opts.name - required, name to store the file under (see fs.js)
     * @param {string} opts.url - required, URL of the file; must answer HEAD with an etag
     * @param {number} [opts.minPreloadTime] - optional, seconds before triggering a background update check
     * @returns {Promise<FileRef>} the FileRef of the up-to-date file (basically to get the version)
     * @throws {TypeError} If name or url is missing.
     * @throws {Error} If the HEAD or GET request fails, or the HEAD response has no etag.
     *   When the server answered, the error has `status` (the HTTP status code).
    */
    update(opts: {
        name: string;
        url: string;
        minPreloadTime?: number;
    }): Promise<FileRef>;
    /**
     * Starts an in-flight download or re-uses an existing one.
     * @param {Object} opts
     * @returns {Promise<FileRef>}
     * @private
     */
    private _startDownload;
    /**
     * @param {Object} opts
     * @param {string} opts.name
     * @param {string} opts.url
     * @returns {Promise<FileRef>}
     * @private
     */
    private _fetchAndUpdate;
}
/** Shared Downloader instance. */
declare const downloader: Downloader;
export { downloader };
