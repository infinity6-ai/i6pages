class Apis {
  /**
   * Constructs an Ingest client instance.
   * @param {Services} services - The services manager instance.
   */
  constructor(services) {
    this._services = services;
  }
  /**
   * List Dataset Tables
   * 
   * Lists files and tables in the specified dataset.
   * 
   * @param {apiDszTableListReq} req
   * @returns {Promise<apiDszTableListResp>}
   */
  async dszTableList(req) {
    const resp = await this._services.invoker().invoke({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/table-list`,
      query: req.query
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
   * 
   * 
   * 
   * 
   * @param {apiDszCreateStoreReq} req
   * @returns {Promise<apiDszCreateStoreResp>}
   */
  async dszCreateStore(req) {
    const resp = await this._services.invoker().invoke({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/create`,
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
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszListIngestionTokensReq} req
   * @returns {Promise<apiDszListIngestionTokensResp>}
   */
  async dszListIngestionTokens(req) {
    const resp = await this._services.invoker().invoke({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/ingestiontoken/list`
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
   * 
   * 
   * 
   * 
   * @param {apiDszCreateIngestionTokenReq} req
   * @returns {Promise<apiDszCreateIngestionTokenResp>}
   */
  async dszCreateIngestionToken(req) {
    const resp = await this._services.invoker().invoke({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/ingestiontoken/create`,
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
   * 
   * 
   * 
   * 
   * @param {apiDszListRecsysTokensReq} req
   * @returns {Promise<apiDszListRecsysTokensResp>}
   */
  async dszListRecsysTokens(req) {
    const resp = await this._services.invoker().invoke({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/recsystoken/list`
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
   * 
   * 
   * 
   * 
   * @param {apiDszDeleteTokenReq} req
   * @returns {Promise<apiDszDeleteTokenResp>}
   */
  async dszDeleteToken(req) {
    const resp = await this._services.invoker().invoke({
      method: "DELETE",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/token/delete`,
      query: req.query
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
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszDomainSelectReq} req
   * @returns {Promise<apiDszDomainSelectResp>}
   */
  async dszDomainSelect(req) {
    const resp = await this._services.invoker().invoke({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/solution-domain`,
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
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszListStoresReq} req
   * @returns {Promise<apiDszListStoresResp>}
   */
  async dszListStores(req) {
    const resp = await this._services.invoker().invoke({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/list`
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
   * Get Model Signed URLs
   * 
   * Generates presigned URLs for accessing model files in the specified dataset.
   * 
   * @param {apiDszModelGetReq} req
   * @returns {Promise<apiDszModelGetResp>}
   */
  async dszModelGet(req) {
    const resp = await this._services.invoker().invoke({
      method: "POST",
      path: `api/model/dataset/${encodeURIComponent(String(req.params.dataset))}/signed-get/${encodeURIComponent(String(req.params.model_name))}`,
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
   * Get Dataset Table File
   * 
   * Get table file by redirecting to its signed URL.
   * 
   * @param {apiDszTableGetReq} req
   * @returns {Promise<apiDszTableGetResp>}
   */
  async dszTableGet(req) {
    const resp = await this._services.invoker().invoke({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/table-file/{path...}`
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
  /**
   * 
   * 
   * 
   * 
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
   * 
   * 
   * 
   * 
   * @param {apiDszCreateRecsysTokenReq} req
   * @returns {Promise<apiDszCreateRecsysTokenResp>}
   */
  async dszCreateRecsysToken(req) {
    const resp = await this._services.invoker().invoke({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/recsystoken/create`,
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
      path: `api/ingest/dataset/${encodeURIComponent(String(req.params.dataset))}/get-url`,
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
   * Stream Ingestion
   * 
   * Ingests stream data into a target dataset table.
   * 
   * @param {apiIngestzStreamRelevanceFashionCatalogReq} req
   * @returns {Promise<apiIngestzStreamRelevanceFashionCatalogResp>}
   */
  async ingestzStreamRelevanceFashionCatalog(req) {
    const resp = await this._services.invoker().invoke({
      method: "POST",
      path: `api/ingest/dataset/${encodeURIComponent(String(req.params.dataset))}/stream/relevance-fashion-catalog`,
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
  /**
   * Get Dataset Signed URLs
   * 
   * Generates presigned URLs for accessing or mutating files in the specified dataset.
   * 
   * @param {apiDszSignedUrlReq} req
   * @returns {Promise<apiDszSignedUrlResp>}
   */
  async dszSignedUrl(req) {
    const resp = await this._services.invoker().invoke({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/signed-url`,
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
   * 
   * 
   * 
   * 
   * @param {apiDszDomainGetReq} req
   * @returns {Promise<apiDszDomainGetResp>}
   */
  async dszDomainGet(req) {
    const resp = await this._services.invoker().invoke({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/solution-domain`,
      query: req.query
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
   * 
   * 
   * 
   * 
   * @param {apiDszListDatasetsReq} req
   * @returns {Promise<apiDszListDatasetsResp>}
   */
  async dszListDatasets(req) {
    const resp = await this._services.invoker().invoke({
      method: "GET",
      path: `api/dsz/datasets`,
      query: req.query
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
   * Sample Fraction
   * 
   * Sample API that performs a fraction operation
   * 
   * @param {apiSampleFractionReq} req
   * @returns {Promise<apiSampleFractionResp>}
   */
  async sampleFraction(req) {
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
   * Stream Ingestion
   * 
   * Ingests stream data into a target dataset table.
   * 
   * @param {apiIngestzStreamRelevanceFashionEventReq} req
   * @returns {Promise<apiIngestzStreamRelevanceFashionEventResp>}
   */
  async ingestzStreamRelevanceFashionEvent(req) {
    const resp = await this._services.invoker().invoke({
      method: "POST",
      path: `api/ingest/dataset/${encodeURIComponent(String(req.params.dataset))}/stream/relevance-fashion-event`,
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
class SdkFuncs {
  /**
   * Constructs an SdkFuncs instance.
   * @param {Services} services - The services manager instance.
   */
  constructor(services) {
    this._services = services;
  }
  /**
   * @param {sdkFuncProductRelevanceFashionFbtReq} req
   * @returns {Promise<sdkFuncProductRelevanceFashionFbtResp>}
   */
  async productRelevanceFashionFbt(req) {
    const infer = this._services.infer();
    const ret = await infer.run({
      dataset: req.input.dataset,
      modelName: req.input.model_name,
      params: req.input,
      partitions: req.partitions
    });
    return ret;
  }
  /**
   * @param {sdkFuncProductRelevanceFashionDashFunnelReq} req
   * @returns {Promise<sdkFuncProductRelevanceFashionDashFunnelResp>}
   */
  async productRelevanceFashionDashFunnel(req) {
    console.log(req);
    return {};
  }
}
export { SdkFuncs };
