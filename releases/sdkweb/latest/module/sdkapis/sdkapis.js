class Apis {
  /**
   * Constructs an Ingest client instance.
   * @param {Services} services - The services manager instance.
   */
  constructor(services) {
    this._services = services;
  }
  /**
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
  /**
   * @param {apiPipezStartReq} req
   * @returns {Promise<apiPipezStartResp>}
   */
  async pipezStart(req) {
    const resp = await this._services.invoker().invoke({
      method: "POST",
      path: `api/pipe/start/dataset/${encodeURIComponent(String(req.params.dataset))}`,
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
   * @param {apiDszDomainSelectReq} req
   * @returns {Promise<apiDszDomainSelectResp>}
   */
  async dszDomainSelect(req) {
    const resp = await this._services.invoker().invoke({
      method: "POST",
      path: `api/ds/solution-domain-select/dataset/${encodeURIComponent(String(req.params.dataset))}`,
      json: req.payload
    });
    const result = { status: resp.status, ok: resp.ok };
    if (resp.ok) {
      result.body = await resp.json();
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
