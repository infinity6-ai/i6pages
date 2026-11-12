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
  const ref = await downloader.update({ name, url });
  debug(`${name} is ready`, ref);
  return ref;
}
export { partitionsKey, isPartitions, downloadFile };
