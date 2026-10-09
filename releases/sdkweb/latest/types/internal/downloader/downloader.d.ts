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
