import { fs } from "../fs/fs.js";
class Downloader {
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
  async update(opts) {
    if (!opts || !opts.name) throw new TypeError("downloader: opts.name is required");
    if (!opts.url) throw new TypeError("downloader: opts.url is required");
    const head = await fetch(opts.url, { method: "HEAD" });
    if (!head.ok) throw new Error(`downloader: HEAD ${opts.url} failed (${head.status})`);
    const etag = head.headers.get("etag");
    if (!etag) throw new Error("downloader: no etag in HEAD response");
    const current = await fs.get({ name: opts.name });
    if (current && current.etag === etag) return current;
    const ref = await fs.create({ name: opts.name, etag, data: "" });
    let success = false;
    try {
      const response = await fetch(opts.url);
      if (!response.ok) throw new Error(`downloader: GET ${opts.url} failed (${response.status})`);
      let dir = await navigator.storage.getDirectory();
      for (const segment of (await fs.resolve(ref)).split("/")) {
        dir = segment === "blob.bin" ? await dir.getFileHandle(segment, { create: true }) : await dir.getDirectoryHandle(segment);
      }
      await response.body.pipeTo(await dir.createWritable());
      success = true;
    } finally {
      if (!success) {
        await fs.discard(ref).catch(() => {
        });
      }
    }
    return fs.release(ref);
  }
}
const downloader = new Downloader();
export { downloader };
