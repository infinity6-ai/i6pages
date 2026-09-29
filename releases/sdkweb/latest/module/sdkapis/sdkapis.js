class Apis {
  /**
   * Constructs an Ingest client instance.
   * @param {Services} services - The services manager instance.
   */
  constructor(services) {
    this._services = services;
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiSamplefractionReq} req
   * @returns {Promise<apiSamplefractionResp>}
   */
  async samplefraction(req) {
    const resp = await this._services.invoker().invoke({
      method: "POST",
      path: `api/gox/routez/sample/fraction/${encodeURIComponent(String(req.params.numerator))}/${encodeURIComponent(String(req.params.denominator))}`,
      query: req.query,
      headers: req.headers,
      json: req.payload
    });
    const result = { status: resp.status, ok: resp.ok };
    if (resp.ok) {
      result.payload = await resp.json();
    }
    if (!resp.ok) {
      const text = await resp.text();
      try {
        result.error = JSON.parse(text);
      } catch {
        result.error = text;
      }
    }
    return result;
  }
  /**
   * Get Ingestion Upload URLs
   * 
   * Generates presigned PUT URLs and an ingestion token for uploading files into a target dataset table and partitions.
   * 
   * @param {apiIngestzGetUrlReq} req
   * @returns {Promise<apiIngestzGetUrlResp>}
   */
  async ingestzGetUrl(req) {
    const resp = await this._services.invoker().invoke({
      method: "POST",
      path: `api/ingest/get-url/dataset/${encodeURIComponent(String(req.params.dataset))}`,
      json: req.payload
    });
    const result = { status: resp.status, ok: resp.ok };
    if (resp.ok) {
      result.payload = await resp.json();
    }
    if (!resp.ok) {
      const text = await resp.text();
      try {
        result.error = JSON.parse(text);
      } catch {
        result.error = text;
      }
    }
    return result;
  }
}
export { Apis };
