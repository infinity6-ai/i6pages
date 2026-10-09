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
