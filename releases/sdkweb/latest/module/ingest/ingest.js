import { apiIngestzGetUrl } from "../sdkapis/sdkapis.js";
import { I6Error } from "../errors.js";
class Ingest {
  /**
   * Constructs an Ingest client instance.
   * @param {Services} services - The services manager instance.
   */
  constructor(services) {
    this._services = services;
  }
  /**
   * Asks ingestz for a signed upload URL (ingestz-get-url API) and uploads a single file to it.
   * @param {UploadParams} params - Upload parameters.
   * @returns {Promise<UploadResult>} Resolves with the ingest id on a successful upload.
   * @throws {I6Error} With code "invalid_argument" if file is not a single File, "http" or
   *   "network" if a request fails. Rejects with an AbortError if `signal` aborts.
   */
  async upload({ dataset, table, partitions, file, onProgress, signal, contentType }) {
    if (!(file instanceof File)) {
      throw new I6Error("file must be a single File.", { code: "invalid_argument" });
    }
    signal?.throwIfAborted();
    const { ingestId, url } = await this.#getUrl({ dataset, table, partitions });
    signal?.throwIfAborted();
    await this.#put(url, file, { onProgress, signal, contentType });
    return { ingestId };
  }
  /**
   * Gets one signed PUT URL from the ingestz-get-url API.
   * @private
   * @param {GetUrlParams} params - Parameters for requesting the upload URL.
   * @returns {Promise<{ingestId: string, url: string}>} The ingest id and the signed PUT URL.
   * @throws {I6Error} If the request fails or no upload URL is returned.
   */
  async #getUrl({ dataset, table, partitions }) {
    const resp = await ingestzGetUrl(this._services, {
      params: { dataset },
      payload: { table, partitions, amount: 1 }
    });
    if (!resp.ok) {
      throw I6Error.fromResult("Get upload URL failed", resp);
    }
    const uploads = resp.payload?.uploads;
    if (!uploads?.[0]) {
      throw new I6Error("Get upload URL returned no upload URL.", { code: "no_upload_url" });
    }
    return { ingestId: resp.payload.ingest_id, url: uploads[0] };
  }
  /**
   * Uploads a file to a signed PUT URL using XMLHttpRequest (fetch has no upload progress).
   * @private
   * @param {string} signedPutUrl - The signed URL to PUT the file to.
   * @param {File} file - The file to upload.
   * @param {Pick<UploadParams, "onProgress"|"signal"|"contentType">} opts
   * @returns {Promise<void>} Resolves on a successful upload, rejects on network or HTTP error or abort.
   */
  #put(signedPutUrl, file, { onProgress, signal, contentType }) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const abort = () => xhr.abort();
      const abortError = () => signal?.reason ?? new DOMException("Upload aborted.", "AbortError");
      const done = (fn, arg) => {
        signal?.removeEventListener("abort", abort);
        fn(arg);
      };
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          done(resolve);
        } else {
          done(reject, new I6Error(`Upload failed with status ${xhr.status}`, {
            code: "http",
            status: xhr.status,
            body: xhr.responseText
          }));
        }
      });
      xhr.addEventListener("error", () => {
        done(reject, new I6Error("Network error occurred during upload.", { code: "network" }));
      });
      xhr.addEventListener("abort", () => {
        done(reject, abortError());
      });
      if (onProgress) {
        xhr.upload.addEventListener("progress", (e) => {
          const total = e.lengthComputable ? e.total : file.size;
          onProgress({
            loaded: e.loaded,
            total,
            percent: total > 0 ? e.loaded / total * 100 : 100
          });
        });
      }
      xhr.open("PUT", signedPutUrl, true);
      if (contentType) {
        xhr.setRequestHeader("Content-Type", contentType);
      }
      signal?.addEventListener("abort", abort, { once: true });
      xhr.send(file);
    });
  }
}
export { Ingest };
