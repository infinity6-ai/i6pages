import { I6Error } from "../../errors.js";
import { downloader } from "../downloader/downloader.js";
function partitionsKey(partitions) {
  return Object.entries(partitions).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, value]) => encodeURIComponent(`${key}=${value}`)).join("-");
}
function isPartitions(partitions) {
  return !!partitions && typeof partitions === "object" && !Array.isArray(partitions) && Object.values(partitions).every((v) => typeof v === "string");
}
async function downloadFile(name, url) {
  try {
    const ref = await downloader.update({ name, url });
    if (globalThis.I6_DEBUG) console.log(`assets: ${name} is ready`, ref);
    return ref;
  } catch (cause) {
    throw new I6Error(`could not get ${url}: ${cause.message}`, { code: "asset", cause });
  }
}
export { partitionsKey, isPartitions, downloadFile };
