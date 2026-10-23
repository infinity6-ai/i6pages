import { I6Error } from "../../errors.js";
import { downloader } from "../downloader/downloader.js";
import { debugLogger } from "../debug/debug.js";
const debug = debugLogger("assets");
function partitionsKey(partitions) {
  return Object.entries(partitions).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, value]) => encodeURIComponent(`${key}=${value}`)).join("-");
}
function isPartitions(partitions) {
  return !!partitions && typeof partitions === "object" && !Array.isArray(partitions) && Object.values(partitions).every((v) => typeof v === "string");
}
async function downloadFile(name, url) {
  try {
    const ref = await downloader.update({ name, url });
    debug(`${name} is ready`, ref);
    return ref;
  } catch (cause) {
    throw new I6Error(`could not get ${url}: ${cause.message}`, { code: "asset", status: cause.status, cause });
  }
}
export { partitionsKey, isPartitions, downloadFile };
