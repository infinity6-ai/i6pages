class Apis {
  /**
   * Constructs an Ingest client instance.
   * @param {Services} services - The services manager instance.
   */
  constructor(services) {
    this._services = services;
  }
  /**
   * Sample Fraction
   * 
   * Sample API that performs a fraction operation
   * 
   * @param {apiSampleFractionReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiSampleFractionResp>>}
   */
  async sampleFraction(req) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/gox/routez/sample/fraction/${encodeURIComponent(String(req.params.numerator))}/${encodeURIComponent(String(req.params.denominator))}`,
      query: req.query,
      headers: req.headers,
      json: req.payload
    }, "payload");
  }
  /**
   * Get Ingestion Upload URLs
   * 
   * Generates presigned PUT URLs and an ingestion token for uploading files into a target dataset table and partitions.
   * 
   * @param {apiIngestzGetUrlReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiIngestzGetUrlResp>>}
   */
  async ingestzGetUrl(req) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ingest/dataset/${encodeURIComponent(String(req.params.dataset))}/get-url`,
      json: req.payload
    }, "payload");
  }
  /**
   * List Dataset Tables
   * 
   * Lists files and tables in the specified dataset.
   * 
   * @param {apiDszTableListReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiDszTableListResp>>}
   */
  async dszTableList(req) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/table-list`,
      query: req.query
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiPipezGetReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiPipezGetResp>>}
   */
  async pipezGet(req) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/pipe/dataset/${encodeURIComponent(String(req.params.dataset))}/id/${encodeURIComponent(String(req.params.id))}`
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszCreateIngestionTokenReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiDszCreateIngestionTokenResp>>}
   */
  async dszCreateIngestionToken(req) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/ingestiontoken/create`,
      json: req.payload
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszDeleteTokenReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiDszDeleteTokenResp>>}
   */
  async dszDeleteToken(req) {
    return this._services.invoker().invokeResult({
      method: "DELETE",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/token/delete`,
      query: req.query
    }, "body");
  }
  /**
   * Stream Ingestion
   * 
   * Ingests stream data into a target dataset table.
   * 
   * @param {apiIngestzStreamRelevanceFashionCatalogReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiIngestzStreamRelevanceFashionCatalogResp>>}
   */
  async ingestzStreamRelevanceFashionCatalog(req) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ingest/dataset/${encodeURIComponent(String(req.params.dataset))}/stream/relevance-fashion-catalog`,
      json: req.payload
    }, "payload");
  }
  /**
   * Stream Ingestion
   * 
   * Ingests stream data into a target dataset table.
   * 
   * @param {apiIngestzStreamRelevanceFashionEventReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiIngestzStreamRelevanceFashionEventResp>>}
   */
  async ingestzStreamRelevanceFashionEvent(req) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ingest/dataset/${encodeURIComponent(String(req.params.dataset))}/stream/relevance-fashion-event`,
      json: req.payload
    }, "payload");
  }
  /**
   * Get Last Successful Ingestion Data Summary
   * 
   * Returns the date of ingestion, rows count and distinct and null columns count
   * 
   * @param {apiIngestzLastBatchSummaryReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiIngestzLastBatchSummaryResp>>}
   */
  async ingestzLastBatchSummary(req) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ingest/dataset/${encodeURIComponent(String(req.params.dataset))}/last-batch`,
      query: req.query
    }, "payload");
  }
  /**
   * Get Dataset Signed URLs
   * 
   * Generates presigned URLs for accessing or mutating files in the specified dataset.
   * 
   * @param {apiDszSignedUrlReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiDszSignedUrlResp>>}
   */
  async dszSignedUrl(req) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/signed-url`,
      json: req.payload
    }, "payload");
  }
  /**
   * Get Dataset Table File
   * 
   * Get table file by redirecting to its signed URL.
   * 
   * @param {apiDszTableGetReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiDszTableGetResp>>}
   */
  async dszTableGet(req) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/table-file/{path...}`
    }, "body");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszStoreDisplayCreateReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiDszStoreDisplayCreateResp>>}
   */
  async dszStoreDisplayCreate(req) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/display/create`,
      json: req.payload
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszListStoresReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiDszListStoresResp>>}
   */
  async dszListStores(req) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/list`
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszDatasetSolutionsReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiDszDatasetSolutionsResp>>}
   */
  async dszDatasetSolutions(req) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/solutions`
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiPipezStartRelevanceFashionRelevanceFashionBatchIngestResp>>}
   */
  async pipezStartRelevanceFashionRelevanceFashionBatchIngest(req) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/pipe/dataset/${encodeURIComponent(String(req.params.dataset))}/start/relevance_fashion/relevance-fashion-batch-ingest`,
      json: req.payload
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiPipezStartRelevanceFashionRelevanceFashionMainReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiPipezStartRelevanceFashionRelevanceFashionMainResp>>}
   */
  async pipezStartRelevanceFashionRelevanceFashionMain(req) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/pipe/dataset/${encodeURIComponent(String(req.params.dataset))}/start/relevance_fashion/relevance-fashion-main`,
      json: req.payload
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiPipezListReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiPipezListResp>>}
   */
  async pipezList(req) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/pipe/dataset/${encodeURIComponent(String(req.params.dataset))}/list`,
      query: req.query
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszListDatasetsReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiDszListDatasetsResp>>}
   */
  async dszListDatasets(req) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/datasets`,
      query: req.query
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszListIngestionTokensReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiDszListIngestionTokensResp>>}
   */
  async dszListIngestionTokens(req) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/ingestiontoken/list`
    }, "payload");
  }
  /**
   * Create Stripe Checkout
   * 
   * Creates a Stripe checkout session for a subscription and returns its id and url.
   * 
   * @param {apiDszStripeCheckoutReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiDszStripeCheckoutResp>>}
   */
  async dszStripeCheckout(req) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/stripe/checkout`,
      json: req.payload
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszStoreDisplayListReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiDszStoreDisplayListResp>>}
   */
  async dszStoreDisplayList(req) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/display/list`,
      query: req.query
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszCreateStoreReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiDszCreateStoreResp>>}
   */
  async dszCreateStore(req) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/create`,
      json: req.payload
    }, "body");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszListRecsysTokensReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiDszListRecsysTokensResp>>}
   */
  async dszListRecsysTokens(req) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/recsystoken/list`
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszCreateRecsysTokenReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiDszCreateRecsysTokenResp>>}
   */
  async dszCreateRecsysToken(req) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/recsystoken/create`,
      json: req.payload
    }, "payload");
  }
  /**
   * Get Model Signed URLs
   * 
   * Generates presigned URLs for accessing model files in the specified dataset.
   * 
   * @param {apiDszModelGetReq} req
   * @returns {Promise<import("../errors.js").I6Result<apiDszModelGetResp>>}
   */
  async dszModelGet(req) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/model/dataset/${encodeURIComponent(String(req.params.dataset))}/signed-get/${encodeURIComponent(String(req.params.model_name))}`,
      json: req.payload
    }, "payload");
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
   * @param {sdkFuncProductRelevanceFashionDashFunnelReq} req
   * @returns {Promise<sdkFuncProductRelevanceFashionDashFunnelOutput>}
   */
  async productRelevanceFashionDashFunnelV1(req) {
    const dash = this._services.dash();
    const ret = await dash.query({
      dataset: req.input.dataset,
      dashName: "product-relevance-fashion-dash-funnel",
      params: req.input,
      partitions: { "version": "v1", ...req.partitions }
    });
    return ret;
  }
  /**
   * @param {sdkFuncProductRelevanceFashionDashAttachedRevenueReq} req
   * @returns {Promise<sdkFuncProductRelevanceFashionDashAttachedRevenueOutput>}
   */
  async productRelevanceFashionDashAttachedRevenueV1(req) {
    const dash = this._services.dash();
    const ret = await dash.query({
      dataset: req.input.dataset,
      dashName: "product-relevance-fashion-dash-attached-revenue",
      params: req.input,
      partitions: { "version": "v1", ...req.partitions }
    });
    return ret;
  }
  /**
   * @param {sdkFuncProductRelevanceFashionFbtReq} req
   * @param {(req: sdkFuncProductRelevanceFashionFbtReq, results: sdkFuncProductRelevanceFashionFbtOutput) => Promise<sdkFuncProductRelevanceFashionFbtSelected>} selectResults - picks which of the recommended skus are shown
   * @returns {Promise<sdkFuncProductRelevanceFashionFbtSelected>}
   */
  async productRelevanceFashionFbtV1(req, selectResults) {
    const infer = this._services.infer();
    const results = await infer.run({
      dataset: req.input.dataset,
      modelName: "relevance-fashion-fbt",
      params: req.input,
      partitions: { "version": "v1", ...req.partitions }
    });
    return infer.selectResults({
      dataset: req.input.dataset,
      modelName: "relevance-fashion-fbt",
      modelVersion: "v1",
      storeId: req.partitions.store_id,
      req,
      results,
      recId: results.rec_id,
      selectResults
    });
  }
}
export { SdkFuncs };
