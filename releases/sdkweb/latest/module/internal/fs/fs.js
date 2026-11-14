import { debugLogger } from "../debug/debug.js";
const debug = debugLogger("fs");
const base = "i6/fs";
const getDirIfExists = async (parent, name) => {
  try {
    return await parent.getDirectoryHandle(name);
  } catch (e) {
    if (e.name === "NotFoundError") return null;
    throw e;
  }
};
const getFileIfExists = async (parent, name) => {
  try {
    return await parent.getFileHandle(name);
  } catch (e) {
    if (e.name === "NotFoundError") return null;
    throw e;
  }
};
const readTextIfExists = async (dir, fileName) => {
  const fileHandle = await getFileIfExists(dir, fileName);
  if (!fileHandle) return null;
  return (await fileHandle.getFile()).text();
};
const removeEntryIfExists = async (dir, name, opts) => {
  try {
    await dir.removeEntry(name, opts);
    return true;
  } catch (e) {
    if (e.name === "NotFoundError") return false;
    throw e;
  }
};
const readText = async (dir, fileName) => (await (await dir.getFileHandle(fileName)).getFile()).text();
const writeFile = async (dir, fileName, data) => {
  const writable = await (await dir.getFileHandle(fileName, { create: true })).createWritable();
  await writable.write(data);
  await writable.close();
};
const baseDir = async () => {
  let dir = await navigator.storage.getDirectory();
  for (const segment of base.split("/")) {
    dir = await dir.getDirectoryHandle(segment);
  }
  return dir;
};
const baseDirIfExists = async () => {
  let dir = await navigator.storage.getDirectory();
  for (const segment of base.split("/")) {
    dir = await getDirIfExists(dir, segment);
    if (!dir) return null;
  }
  return dir;
};
class FS {
  /**
   * Removes the versions older than version.txt, and the whole file if it is left empty.
   * Without version.txt no version is removed.
   * @param {Object} opts
   * @param {string} opts.name - required
   * @returns {Promise<void>}
   */
  async cleanFile(opts) {
    if (!opts || !opts.name) throw new TypeError("fs: opts.name is required");
    const parent = await baseDirIfExists();
    if (!parent) return;
    const dir = await getDirIfExists(parent, opts.name);
    if (!dir) return;
    const versionText = await readTextIfExists(dir, "version.txt");
    const released = versionText ? "v" + versionText : null;
    for await (const [entryName, entry] of dir.entries()) {
      if (released && entry.kind === "directory" && entryName < released) {
        await removeEntryIfExists(dir, entryName, { recursive: true });
      }
    }
    for await (const _ of dir.entries()) return;
    await removeEntryIfExists(parent, opts.name);
  }
  /**
   * Cleans all files, see cleanFile.
   * @returns {Promise<void>}
   */
  async clean() {
    const parent = await baseDirIfExists();
    if (!parent) return;
    const names = [];
    for await (const [entryName, entry] of parent.entries()) {
      if (entry.kind === "directory") names.push(entryName);
    }
    for (const name of names) {
      await this.cleanFile({ name });
    }
  }
  /**
   * Resolves a version of a file.
   * @param {Object} opts
   * @param {string} opts.name - required
   * @param {string} [opts.version] - defaults to the content of version.txt
   * @returns {Promise<FileRef|null>} a new full FileRef, or null if it does not exist.
   */
  async get(opts) {
    if (!opts || !opts.name) throw new TypeError("fs: opts.name is required");
    const baseHandle = await baseDirIfExists();
    if (!baseHandle) return null;
    const dir = await getDirIfExists(baseHandle, opts.name);
    if (!dir) return null;
    const releasedVersion = await readTextIfExists(dir, "version.txt");
    const version = opts.version || releasedVersion;
    if (!version) return null;
    const versionDir = await getDirIfExists(dir, "v" + version);
    if (!versionDir) return null;
    const etag = await readTextIfExists(versionDir, "etag.txt");
    const res = {
      name: opts.name,
      version,
      etag
    };
    if (!opts.version || opts.version === releasedVersion) {
      const checkedAt = await readTextIfExists(dir, "checkedat.txt");
      if (checkedAt) res.checkedAt = checkedAt;
    }
    return res;
  }
  /**
   * Creates a new version, unless the latest version already has this etag.
   * The new version is not released.
   * @param {Object} opts
   * @param {string} opts.name - required
   * @param {string} opts.etag - required
   * @returns {Promise<FileRef>} a new full FileRef.
   */
  async create(opts) {
    if (!opts || !opts.name) throw new TypeError("fs: opts.name is required");
    if (!opts.etag) throw new TypeError("fs: opts.etag is required");
    let dir = await navigator.storage.getDirectory();
    for (const segment of [...base.split("/"), opts.name]) {
      dir = await dir.getDirectoryHandle(segment, { create: true });
    }
    let latest = null;
    for await (const [entryName, entry] of dir.entries()) {
      if (entry.kind === "directory" && entryName.startsWith("v") && (!latest || entryName > latest)) latest = entryName;
    }
    if (latest) {
      const latestDir = await getDirIfExists(dir, latest);
      if (latestDir && await readTextIfExists(latestDir, "etag.txt") === opts.etag) {
        return { name: opts.name, version: latest.substring(1), etag: opts.etag };
      }
    }
    const version = (/* @__PURE__ */ new Date()).toISOString();
    const versionDir = await dir.getDirectoryHandle("v" + version, { create: true });
    await writeFile(versionDir, "etag.txt", opts.etag);
    return { name: opts.name, version, etag: opts.etag };
  }
  /**
   * Returns the bin file path, full (with base). Does not check that it exists, see get.
   * @param {Object} opts
   * @param {string} opts.name - required
   * @param {string} opts.version - required
   * @returns {Promise<string>} e.g. "i6/fs/{name}/v{version}/blob.bin"
   */
  async resolve(opts) {
    if (!opts || !opts.name) throw new TypeError("fs: opts.name is required");
    if (!opts.version) throw new TypeError("fs: opts.version is required");
    return `${base}/${opts.name}/v${opts.version}/blob.bin`;
  }
  /**
   * Reads the content (blob.bin) of a version.
   * @param {Object} opts
   * @param {string} opts.name - required
   * @param {string} opts.version - required
   * @returns {Promise<Uint8Array>} the bytes of the file.
   * @throws {DOMException} NotFoundError if the version or its blob does not exist.
   */
  async read(opts) {
    if (!opts || !opts.name) throw new TypeError("fs: opts.name is required");
    if (!opts.version) throw new TypeError("fs: opts.version is required");
    let dir = await navigator.storage.getDirectory();
    for (const segment of [...base.split("/"), opts.name, "v" + opts.version]) {
      dir = await dir.getDirectoryHandle(segment);
    }
    const file = await (await dir.getFileHandle("blob.bin")).getFile();
    return new Uint8Array(await file.arrayBuffer());
  }
  /**
   * Makes a version the current one (version.txt), sets checkedat.txt, then cleans older versions.
   * @param {Object} opts
   * @param {string} opts.name - required
   * @param {string} opts.version - required, must exist
   * @returns {Promise<FileRef>} a new full FileRef of the released version.
   */
  async release(opts) {
    if (!opts || !opts.name) throw new TypeError("fs: opts.name is required");
    if (!opts.version) throw new TypeError("fs: opts.version is required");
    const ref = await this.get(opts);
    if (!ref) throw new Error(`fs: version ${opts.version} of ${opts.name} does not exist`);
    const dir = await (await baseDir()).getDirectoryHandle(opts.name);
    await writeFile(dir, "version.txt", opts.version);
    const checkedAt = await this.touch(opts);
    await this.cleanFile(opts);
    debug(`released ${opts.name} v${opts.version}`, { etag: ref.etag, checkedAt });
    return { ...ref, checkedAt };
  }
  /**
   * Updates checkedat.txt to now (or opts.checkedAt), marking the file as recently checked.
   * @param {Object} opts
   * @param {string} opts.name - required
   * @param {string} [opts.checkedAt] - ISO timestamp, defaults to now
   * @returns {Promise<string>} the timestamp written.
   */
  async touch(opts) {
    if (!opts || !opts.name) throw new TypeError("fs: opts.name is required");
    const parent = await baseDirIfExists();
    if (!parent) throw new Error(`fs: file ${opts.name} does not exist`);
    const dir = await getDirIfExists(parent, opts.name);
    if (!dir) throw new Error(`fs: file ${opts.name} does not exist`);
    const checkedAt = opts.checkedAt || (/* @__PURE__ */ new Date()).toISOString();
    await writeFile(dir, "checkedat.txt", checkedAt);
    debug(`touched ${opts.name}`, checkedAt);
    return checkedAt;
  }
  /**
   * Removes a version that was never released (e.g. its download failed). Does nothing if it does not exist.
   * @param {Object} opts
   * @param {string} opts.name - required
   * @param {string} opts.version - required, must not be the released one
   * @returns {Promise<void>}
   */
  async discard(opts) {
    if (!opts || !opts.name) throw new TypeError("fs: opts.name is required");
    if (!opts.version) throw new TypeError("fs: opts.version is required");
    const baseHandle = await baseDirIfExists();
    if (!baseHandle) return;
    const dir = await getDirIfExists(baseHandle, opts.name);
    if (!dir) return;
    if (await readTextIfExists(dir, "version.txt") === opts.version) {
      throw new Error(`fs: version ${opts.version} of ${opts.name} is the released one`);
    }
    await removeEntryIfExists(dir, "v" + opts.version, { recursive: true });
    debug(`discarded unreleased version ${opts.name} v${opts.version}`);
  }
}
const fs = new FS();
export { fs };
