class Apis {
  /**
   * Constructs an Ingest client instance.
   * @param {Services} services - The services manager instance.
   */
  constructor(services) {
    this._services = services;
  }
  /**
   * List Plans
   * 
   * Lists the plans a subscription of a solution can be switched to, with the price data from Stripe.
   * 
   * @param {apiDszListPlansReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiDszListPlansResp>>}
   */
  async dszListPlans(req, opts) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/solution/${encodeURIComponent(String(req.params.solution))}/plans`,
      opts
    }, "payload");
  }
  /**
   * Start Pipeline
   * 
   * Starts a pipeline on a dataset with the given params and returns its id.
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
   * Get Pipeline
   * 
   * Gets a pipeline of a dataset by its id.
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
   * List Store Displays
   * 
   * Lists all active store displays configured for a store under a specific dataset.
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
   * Model Predict
   * 
   * Runs a prediction of a dataset model version on the inference service (tfinfer), sending the model inputs and the model partitions and returning the model outputs.
   * 
   * @param {apiTfzModelPredictReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiTfzModelPredictResp>>}
   */
  async tfzModelPredict(req, opts) {
    return this._services.invoker().invokeResult({
      method: "POST",
      url: `${this._services.config().servUrls?.["tfinfer"] ?? this._services.config().baseUrl}/api/model/dataset/${encodeURIComponent(String(req.params.dataset))}/${encodeURIComponent(String(req.params.model_name))}/${encodeURIComponent(String(req.params.version))}/predict`,
      json: req.payload,
      opts
    }, "payload");
  }
  /**
   * Get Subscription
   * 
   * Gets the plan and the status of the Stripe subscription of a dataset product/solution. The payload is empty for contracts without Stripe.
   * 
   * @param {apiDszGetSubscriptionReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiDszGetSubscriptionResp>>}
   */
  async dszGetSubscription(req, opts) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/solution/${encodeURIComponent(String(req.params.solution))}/subscription`,
      opts
    }, "payload");
  }
  /**
   * List Pipelines
   * 
   * Lists the pipelines of a dataset, optionally filtered, with cursor pagination.
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
   * Create Store
   * 
   * Creates a store configuration under a specific dataset.
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
   * List Ingestion Tokens
   * 
   * Lists all active data ingestion tokens for a specific dataset.
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
   * Create Store Display
   * 
   * Creates a store display configuration mapping for a store under a specific dataset.
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
   * List Active Dataset Solutions
   * 
   * Lists all active solutions configured for a specific dataset.
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
   * Create Customer Portal
   * 
   * Creates a Stripe billing portal session URL where the user can manage cards, auto-renew, and plans.
   * 
   * @param {apiDszCreateCustomerPortalReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiDszCreateCustomerPortalResp>>}
   */
  async dszCreateCustomerPortal(req, opts) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/portal`,
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
   * Delete Token
   * 
   * Deletes (revokes) a specific token (e.g. ingestion or recsys token) associated with a dataset.
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
   * Update Subscription Plan
   * 
   * Updates the plan (price) of the Stripe subscription for a dataset product/solution.
   * 
   * @param {apiDszUpdateSubscriptionPlanReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiDszUpdateSubscriptionPlanResp>>}
   */
  async dszUpdateSubscriptionPlan(req, opts) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/solution/${encodeURIComponent(String(req.params.solution))}/subscription/plan`,
      json: req.payload,
      opts
    }, "body");
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
      method: "POST",
      path: `api/ingest/dataset/${encodeURIComponent(String(req.params.dataset))}/event/relevance-fashion-event/text.txt`,
      json: req.payload,
      opts,
      sinkable: true
    }, "body");
  }
  /**
   * Load Table File as JSON
   * 
   * Load a table file from the datalake as JSON and return it.
   * 
   * @param {apiDszResultLastBatchSummaryReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiDszResultLastBatchSummaryResp>>}
   */
  async dszResultLastBatchSummary(req, opts) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/results/last-batch-summary`,
      query: req.query,
      opts
    }, "payload");
  }
  /**
   * List Stores
   * 
   * Lists all stores configured under a specific dataset.
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
   * List Recsys Tokens
   * 
   * Lists all active recommendation system tokens for a specific dataset.
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
   * Update Payment Auto Renew
   * 
   * Turns auto renew on or off for the Stripe subscription of a dataset product/solution.
   * 
   * @param {apiDszUpdatePaymentAutoRenewReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiDszUpdatePaymentAutoRenewResp>>}
   */
  async dszUpdatePaymentAutoRenew(req, opts) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/solution/${encodeURIComponent(String(req.params.solution))}/payment/autorenew`,
      json: req.payload,
      opts
    }, "body");
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
   * Create Ingestion Token
   * 
   * Creates a write token for data ingestion into a specific dataset.
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
  /**
   * Create Recsys Token
   * 
   * Creates a read/recommendation token for the recommendation system associated with a specific dataset.
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
      method: "POST",
      path: `api/ingest/dataset/${encodeURIComponent(String(req.params.dataset))}/event/relevance-fashion-catalog/text.txt`,
      json: req.payload,
      opts,
      sinkable: true
    }, "body");
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
   * Start Pipeline
   * 
   * Starts a pipeline on a dataset with the given params and returns its id.
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
   * List Datasets
   * 
   * Lists all datasets available to the user.
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
   * List Payments
   * 
   * Lists the Stripe payments (invoices) of a dataset. The list is empty for datasets without a Stripe customer.
   * 
   * @param {apiDszListPaymentsReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../errors.js").I6Result<apiDszListPaymentsResp>>}
   */
  async dszListPayments(req, opts) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/payments`,
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
   * Get Funnel
   * 
   * Gets the event counts of the recommendation funnel for a store and period.
   * 
   * @param {sdkFuncProductRelevanceFashionDashFunnelReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<sdkFuncProductRelevanceFashionDashFunnelOutput>}
   */
  async productRelevanceFashionDashFunnelV1(req, opts) {
    const dash = this._services.dash();
    const ret = await dash.query({
      dataset: req.input.dataset,
      dashName: "product-relevance-fashion-dash-funnel",
      params: req.input,
      partitions: { "version": "v1", ...req.partitions },
      serviceOpts: opts
    });
    return ret;
  }
  /**
   * Get Attached Revenue
   * 
   * Gets the revenue attached to recommendations for a store and period.
   * 
   * @param {sdkFuncProductRelevanceFashionDashAttachedRevenueReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<sdkFuncProductRelevanceFashionDashAttachedRevenueOutput>}
   */
  async productRelevanceFashionDashAttachedRevenueV1(req, opts) {
    const dash = this._services.dash();
    const ret = await dash.query({
      dataset: req.input.dataset,
      dashName: "product-relevance-fashion-dash-attached-revenue",
      params: req.input,
      partitions: { "version": "v1", ...req.partitions },
      serviceOpts: opts
    });
    return ret;
  }
  /**
   * List Showcase Categories
   * 
   * Lists the showcase categories of a store.
   * 
   * @param {sdkFuncProductRelevanceFashionDashListShowcaseCategoriesReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<sdkFuncProductRelevanceFashionDashListShowcaseCategoriesOutput>}
   */
  async productRelevanceFashionDashListShowcaseCategoriesV1(req, opts) {
    const dash = this._services.dash();
    const ret = await dash.query({
      dataset: req.input.dataset,
      dashName: "product-relevance-fashion-dash-list-showcase-categories",
      partitions: { "version": "v1", ...req.partitions },
      serviceOpts: opts
    });
    return ret;
  }
  /**
   * Get Metrics by Category
   * 
   * Gets the metrics impacted by recommendations by showcase category for a store and period.
   * 
   * @param {sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<sdkFuncProductRelevanceFashionDashImpactedMetricsByShowcaseCategoryOutput>}
   */
  async productRelevanceFashionDashImpactedMetricsByShowcaseCategoryV1(req, opts) {
    const dash = this._services.dash();
    const ret = await dash.query({
      dataset: req.input.dataset,
      dashName: "product-relevance-fashion-dash-impacted-metrics-by-showcase-category",
      params: req.input,
      partitions: { "version": "v1", ...req.partitions },
      serviceOpts: opts
    });
    return ret;
  }
  /**
   * Get Metrics by SKU
   * 
   * Gets the metrics impacted by recommendations by SKU for a store and period.
   * 
   * @param {sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<sdkFuncProductRelevanceFashionDashImpactedMetricsBySkuOutput>}
   */
  async productRelevanceFashionDashImpactedMetricsBySkuV1(req, opts) {
    const dash = this._services.dash();
    const ret = await dash.query({
      dataset: req.input.dataset,
      dashName: "product-relevance-fashion-dash-impacted-metrics-by-sku",
      params: req.input,
      partitions: { "version": "v1", ...req.partitions },
      serviceOpts: opts
    });
    return ret;
  }
  /**
   * Get Coverage
   * 
   * Gets the recommendation coverage of the catalog for a store and period.
   * 
   * @param {sdkFuncProductRelevanceFashionDashCoverageReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<sdkFuncProductRelevanceFashionDashCoverageOutput>}
   */
  async productRelevanceFashionDashCoverageV1(req, opts) {
    const dash = this._services.dash();
    const ret = await dash.query({
      dataset: req.input.dataset,
      dashName: "product-relevance-fashion-dash-coverage",
      params: req.input,
      partitions: { "version": "v1", ...req.partitions },
      serviceOpts: opts
    });
    return ret;
  }
  /**
   * Get Bought Together
   * 
   * Infers the SKUs frequently bought together with the given SKUs for a store.
   * 
   * @param {sdkFuncProductRelevanceFashionFbtReq} req
   * @param {(req: sdkFuncProductRelevanceFashionFbtReq, results: sdkFuncProductRelevanceFashionFbtOutput) => Promise<sdkFuncProductRelevanceFashionFbtSelected>} [selectResults] - picks which of the recommended skus are shown and may attach your own data to each in enriched; default: for each result, in order, the first sku not in req.input.skus (the cart) and not already picked, with the rating of that result; no duplicates, and results with no such sku are skipped
   * @param {ServiceOptions} [opts]
   * @returns {Promise<sdkFuncProductRelevanceFashionFbtSelected>}
   */
  async productRelevanceFashionFbtV1(req, selectResults, opts) {
    const infer = this._services.infer();
    const results = await infer.run({
      dataset: req.input.dataset,
      modelName: "relevance-fashion-fbt",
      params: req.input,
      partitions: { "version": "v1", ...req.partitions },
      sessionId: req.input.session_id,
      userId: req.input.user_id,
      serviceOpts: opts
    });
    return infer.selectResults({
      dataset: req.input.dataset,
      modelName: "relevance-fashion-fbt",
      modelVersion: "v1",
      storeId: req.partitions.store_id,
      req,
      results,
      recId: results.rec_id,
      sessionId: req.input.session_id,
      userId: req.input.user_id,
      selectResults,
      serviceOpts: opts
    });
  }
}
export { SdkFuncs };
