import { fs } from "../fs/fs.js";
import { debugLogger } from "../debug/debug.js";
const debug = debugLogger("downloader");
function httpError(message, status) {
  return Object.assign(new Error(message), { status });
}
class Downloader {
  constructor() {
    this.downloads = /* @__PURE__ */ new Map();
  }
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
  async update(opts) {
    if (!opts || !opts.name) throw new TypeError("downloader: opts.name is required");
    if (!opts.url) throw new TypeError("downloader: opts.url is required");
    const current = await fs.get({ name: opts.name });
    if (opts.minPreloadTime === void 0) {
      debug(`${opts.name}: checking for updates (blocking)`);
      return this._startDownload(opts);
    }
    const lastChecked = current ? new Date(current.checkedAt || current.version).getTime() : 0;
    const age = current ? (Date.now() - lastChecked) / 1e3 : Infinity;
    if (!current) {
      debug(`${opts.name}: no cached file, downloading...`);
      return this._startDownload(opts);
    }
    if (age >= opts.minPreloadTime) {
      debug(`${opts.name}: stale file (age: ${Math.round(age)}s >= minPreloadTime: ${opts.minPreloadTime}s), starting background update`);
      this._startDownload(opts);
    } else {
      debug(`${opts.name}: fresh file (age: ${Math.round(age)}s < minPreloadTime: ${opts.minPreloadTime}s), using cached`, current);
    }
    return current;
  }
  /**
   * Starts an in-flight download or re-uses an existing one.
   * @param {Object} opts
   * @returns {Promise<FileRef>}
   * @private
   */
  _startDownload(opts) {
    if (this.downloads.has(opts.name)) {
      debug(`${opts.name}: reusing in-flight download promise`);
      return this.downloads.get(opts.name);
    }
    const promise = this._fetchAndUpdate(opts).finally(() => {
      this.downloads.delete(opts.name);
    });
    promise.catch((err) => {
      debug(`${opts.name}: background update failed`, err);
    });
    this.downloads.set(opts.name, promise);
    return promise;
  }
  /**
   * @param {Object} opts
   * @param {string} opts.name
   * @param {string} opts.url
   * @returns {Promise<FileRef>}
   * @private
   */
  async _fetchAndUpdate(opts) {
    const head = await fetch(opts.url, { method: "HEAD" });
    if (!head.ok) throw httpError(`downloader: HEAD ${opts.url} failed (${head.status})`, head.status);
    const etag = head.headers.get("etag");
    if (!etag) throw new Error("downloader: no etag in HEAD response");
    const current = await fs.get({ name: opts.name });
    if (current && current.etag === etag) {
      debug(`${opts.name}: remote etag matches released version (${etag}), touching checkedat.txt`);
      const checkedAt = await fs.touch({ name: opts.name });
      return { ...current, checkedAt };
    }
    debug(`${opts.name}: new etag detected (${etag}), downloading from ${opts.url}`);
    const ref = await fs.create({ name: opts.name, etag });
    let success = false;
    try {
      const response = await fetch(opts.url);
      if (!response.ok) throw httpError(`downloader: GET ${opts.url} failed (${response.status})`, response.status);
      let dir = await navigator.storage.getDirectory();
      for (const segment of (await fs.resolve(ref)).split("/")) {
        dir = segment === "blob.bin" ? await dir.getFileHandle(segment, { create: true }) : await dir.getDirectoryHandle(segment);
      }
      await response.body.pipeTo(await dir.createWritable());
      success = true;
    } finally {
      if (!success) {
        debug(`${opts.name}: download failed or aborted, discarding unreleased version`, ref.version);
        await fs.discard(ref);
      }
    }
    const released = await fs.release(ref);
    debug(`${opts.name}: released new version`, released);
    return released;
  }
}
const downloader = new Downloader();
export { downloader };
