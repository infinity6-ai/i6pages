class Apis {
  /**
   * Constructs an Ingest client instance.
   * @param {Services} services - The services manager instance.
   */
  constructor(services) {
    this._services = services;
  }
  /**
   * Stream Ingestion
   * 
   * Ingests stream data into a target dataset table.
   * 
   * @param {apiIngestzStreamRelevanceFashionCatalogReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiIngestzStreamRelevanceFashionCatalogResp>>}
   */
  async ingestzStreamRelevanceFashionCatalog(req, opts) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ingest/dataset/${encodeURIComponent(String(req.params.dataset))}/stream/relevance-fashion-catalog`,
      json: req.payload,
      opts
    }, "payload");
  }
  /**
   * Stream Ingestion
   * 
   * Ingests stream data into a target dataset table.
   * 
   * @param {apiIngestzStreamRelevanceFashionEventReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiIngestzStreamRelevanceFashionEventResp>>}
   */
  async ingestzStreamRelevanceFashionEvent(req, opts) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ingest/dataset/${encodeURIComponent(String(req.params.dataset))}/stream/relevance-fashion-event`,
      json: req.payload,
      opts
    }, "payload");
  }
  /**
   * Event Ingestion
   * 
   * Ingests events data into a target dataset table.
   * 
   * @param {apiIngestzEventRelevanceFashionCatalogReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiIngestzEventRelevanceFashionCatalogResp>>}
   */
  async ingestzEventRelevanceFashionCatalog(req, opts) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ingest/dataset/${encodeURIComponent(String(req.params.dataset))}/event/relevance-fashion-catalog/text.txt`,
      query: req.query,
      opts
    }, "payload");
  }
  /**
   * Get Last Successful Ingestion Data Summary
   * 
   * Returns the date of ingestion, rows count and distinct and null columns count
   * 
   * @param {apiIngestzLastBatchSummaryReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiIngestzLastBatchSummaryResp>>}
   */
  async ingestzLastBatchSummary(req, opts) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ingest/dataset/${encodeURIComponent(String(req.params.dataset))}/last-batch`,
      query: req.query,
      opts
    }, "payload");
  }
  /**
   * Get Dataset Table File
   * 
   * Get table file by redirecting to its signed URL.
   * 
   * @param {apiDszTableGetReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiDszTableGetResp>>}
   */
  async dszTableGet(req, opts) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/table-file/{path...}`,
      opts
    }, "body");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiPipezGetReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiPipezGetResp>>}
   */
  async pipezGet(req, opts) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/pipe/dataset/${encodeURIComponent(String(req.params.dataset))}/id/${encodeURIComponent(String(req.params.id))}`,
      opts
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszListStoresReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiDszListStoresResp>>}
   */
  async dszListStores(req, opts) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/list`,
      opts
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszCreateRecsysTokenReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiDszCreateRecsysTokenResp>>}
   */
  async dszCreateRecsysToken(req, opts) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/recsystoken/create`,
      json: req.payload,
      opts
    }, "payload");
  }
  /**
   * Get Dataset Signed URLs
   * 
   * Generates presigned URLs for accessing or mutating files in the specified dataset.
   * 
   * @param {apiDszSignedUrlReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiDszSignedUrlResp>>}
   */
  async dszSignedUrl(req, opts) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/signed-url`,
      json: req.payload,
      opts
    }, "payload");
  }
  /**
   * List Dataset Tables
   * 
   * Lists files and tables in the specified dataset.
   * 
   * @param {apiDszTableListReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiDszTableListResp>>}
   */
  async dszTableList(req, opts) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/table-list`,
      query: req.query,
      opts
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszListDatasetsReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiDszListDatasetsResp>>}
   */
  async dszListDatasets(req, opts) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/datasets`,
      query: req.query,
      opts
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszDatasetSolutionsReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiDszDatasetSolutionsResp>>}
   */
  async dszDatasetSolutions(req, opts) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/solutions`,
      opts
    }, "payload");
  }
  /**
   * Create Stripe Checkout
   * 
   * Creates a Stripe checkout session for a subscription and returns its id and url.
   * 
   * @param {apiDszStripeCheckoutReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiDszStripeCheckoutResp>>}
   */
  async dszStripeCheckout(req, opts) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/stripe/checkout`,
      json: req.payload,
      opts
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiPipezStartRelevanceFashionRelevanceFashionBatchIngestResp>>}
   */
  async pipezStartRelevanceFashionRelevanceFashionBatchIngest(req, opts) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/pipe/dataset/${encodeURIComponent(String(req.params.dataset))}/start/relevance_fashion/relevance-fashion-batch-ingest`,
      json: req.payload,
      opts
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiPipezStartRelevanceFashionRelevanceFashionMainReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiPipezStartRelevanceFashionRelevanceFashionMainResp>>}
   */
  async pipezStartRelevanceFashionRelevanceFashionMain(req, opts) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/pipe/dataset/${encodeURIComponent(String(req.params.dataset))}/start/relevance_fashion/relevance-fashion-main`,
      json: req.payload,
      opts
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiPipezListReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiPipezListResp>>}
   */
  async pipezList(req, opts) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/pipe/dataset/${encodeURIComponent(String(req.params.dataset))}/list`,
      query: req.query,
      opts
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszStoreDisplayListReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiDszStoreDisplayListResp>>}
   */
  async dszStoreDisplayList(req, opts) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/display/list`,
      query: req.query,
      opts
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszCreateStoreReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiDszCreateStoreResp>>}
   */
  async dszCreateStore(req, opts) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/create`,
      json: req.payload,
      opts
    }, "body");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszListRecsysTokensReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiDszListRecsysTokensResp>>}
   */
  async dszListRecsysTokens(req, opts) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/recsystoken/list`,
      opts
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszDeleteTokenReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiDszDeleteTokenResp>>}
   */
  async dszDeleteToken(req, opts) {
    return this._services.invoker().invokeResult({
      method: "DELETE",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/token/delete`,
      query: req.query,
      opts
    }, "body");
  }
  /**
   * Get Model Signed URLs
   * 
   * Generates presigned URLs for accessing model files in the specified dataset.
   * 
   * @param {apiDszModelGetReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiDszModelGetResp>>}
   */
  async dszModelGet(req, opts) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/model/dataset/${encodeURIComponent(String(req.params.dataset))}/signed-get/${encodeURIComponent(String(req.params.model_name))}`,
      json: req.payload,
      opts
    }, "payload");
  }
  /**
   * Sample Fraction
   * 
   * Sample API that performs a fraction operation
   * 
   * @param {apiSampleFractionReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiSampleFractionResp>>}
   */
  async sampleFraction(req, opts) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/gox/routez/sample/fraction/${encodeURIComponent(String(req.params.numerator))}/${encodeURIComponent(String(req.params.denominator))}`,
      query: req.query,
      headers: req.headers,
      json: req.payload,
      opts
    }, "payload");
  }
  /**
   * Get Ingestion Upload URLs
   * 
   * Generates presigned PUT URLs and an ingestion token for uploading files into a target dataset table and partitions.
   * 
   * @param {apiIngestzGetUrlReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiIngestzGetUrlResp>>}
   */
  async ingestzGetUrl(req, opts) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ingest/dataset/${encodeURIComponent(String(req.params.dataset))}/get-url`,
      json: req.payload,
      opts
    }, "payload");
  }
  /**
   * Event Ingestion
   * 
   * Ingests events data into a target dataset table.
   * 
   * @param {apiIngestzEventRelevanceFashionEventReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiIngestzEventRelevanceFashionEventResp>>}
   */
  async ingestzEventRelevanceFashionEvent(req, opts) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ingest/dataset/${encodeURIComponent(String(req.params.dataset))}/event/relevance-fashion-event/text.txt`,
      query: req.query,
      opts
    }, "payload");
  }
  /**
   * Load Table File as JSON
   * 
   * Load a table file from the datalake as JSON and return it.
   * 
   * @param {apiDszResultRelevanceFashionCatalogReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiDszResultRelevanceFashionCatalogResp>>}
   */
  async dszResultRelevanceFashionCatalog(req, opts) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/results/relevance-fashion-catalog`,
      query: req.query,
      opts
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszStoreDisplayCreateReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiDszStoreDisplayCreateResp>>}
   */
  async dszStoreDisplayCreate(req, opts) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/display/create`,
      json: req.payload,
      opts
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszListIngestionTokensReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiDszListIngestionTokensResp>>}
   */
  async dszListIngestionTokens(req, opts) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/ingestiontoken/list`,
      opts
    }, "payload");
  }
  /**
   * 
   * 
   * 
   * 
   * @param {apiDszCreateIngestionTokenReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiDszCreateIngestionTokenResp>>}
   */
  async dszCreateIngestionToken(req, opts) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/ingestiontoken/create`,
      json: req.payload,
      opts
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
   * @param {sdkFuncProductRelevanceFashionFbtReq} req
   * @param {(req: sdkFuncProductRelevanceFashionFbtReq, results: sdkFuncProductRelevanceFashionFbtOutput) => Promise<sdkFuncProductRelevanceFashionFbtSelected>} [selectResults] - picks which of the recommended skus are shown and may attach your own data to each in enriched; default: for each result, in order, the first sku not in req.input.skus (the cart) and not already picked, with the rating of that result; no duplicates, and results with no such sku are skipped
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
}
export { SdkFuncs };
