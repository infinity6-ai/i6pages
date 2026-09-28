declare class Downloader {
    /**
     * Download the file by name if necessary (checking etag)
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.url - required
     * @returns {Promise<FileRef>} the FileRef of the downloaded file (basically to get the version)
    */
    update(opts: {
        name: string;
        url: string;
    }): Promise<FileRef>;
}
declare const downloader: Downloader;
export { downloader };
