class Apis {
  /**
   * Constructs an Ingest client instance.
   * @param {Services} services - The services manager instance.
   */
  constructor(services) {
    this._services = services;
  }
  /**
   * List Store Displays
   * 
   * Lists all active store displays configured for a store under a specific dataset.
   * 
   * @param {apiDszStoreDisplayListReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszStoreDisplayListResp>>}
   */
  async dszStoreDisplayList(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/display/list`,
      query: req.query,
      opts
    });
  }
  /**
   * Revoke Dataset Refresh Token
   * 
   * Instantly revokes a machine dataset refresh token by JTI.
   * 
   * @param {apiUserDatasetTokenRefreshDeleteReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserDatasetTokenRefreshDeleteResp>>}
   */
  async userDatasetTokenRefreshDelete(req, opts) {
    opts = opts || {};
    opts.labels = {
      "servname": "userz",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "DELETE",
      url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/dataset-refresh-token/${encodeURIComponent(String(req.params.dataset))}/jti/${encodeURIComponent(String(req.params.jti))}`,
      headers: req.headers,
      opts
    });
  }
  /**
   * Get Dataset Signed URLs
   * 
   * Generates presigned URLs for accessing or mutating files in the specified dataset.
   * 
   * @param {apiDszSignedUrlReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszSignedUrlResp>>}
   */
  async dszSignedUrl(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/signed-url`,
      json: req.payload,
      opts
    });
  }
  /**
   * Get Pipeline
   * 
   * Gets a pipeline of a dataset by its id.
   * 
   * @param {apiPipezGetReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiPipezGetResp>>}
   */
  async pipezGet(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/pipe/dataset/${encodeURIComponent(String(req.params.dataset))}/id/${encodeURIComponent(String(req.params.id))}`,
      opts
    });
  }
  /**
   * List Active Dataset Solutions
   * 
   * Lists all active solutions configured for a specific dataset.
   * 
   * @param {apiDszDatasetSolutionsReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszDatasetSolutionsResp>>}
   */
  async dszDatasetSolutions(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/solutions`,
      opts
    });
  }
  /**
   * List Ingestion Tokens
   * 
   * Lists all active data ingestion tokens for a specific dataset.
   * 
   * @param {apiDszListIngestionTokensReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszListIngestionTokensResp>>}
   */
  async dszListIngestionTokens(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/ingestiontoken/list`,
      opts
    });
  }
  /**
   * Email and Password Sign-In
   * 
   * Authenticates an email and password against Identity Platform, enforcing confirmed emails and minting a PKCE code.
   * 
   * @param {apiUserAuthPasswordSigninReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthPasswordSigninResp>>}
   */
  async userAuthPasswordSignin(req, opts) {
    opts = opts || {};
    opts.labels = {
      "servname": "userz",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/auth/signin/password`,
      json: req.payload,
      opts
    });
  }
  /**
   * Get Ingestion Upload URLs
   * 
   * Generates presigned PUT URLs and an ingestion token for uploading files into a target dataset table and partitions.
   * 
   * @param {apiIngestzGetUrlReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiIngestzGetUrlResp>>}
   */
  async ingestzGetUrl(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ingest/dataset/${encodeURIComponent(String(req.params.dataset))}/get-url`,
      json: req.payload,
      opts
    });
  }
  /**
   * List Dataset Tables
   * 
   * Lists files and tables in the specified dataset.
   * 
   * @param {apiDszTableListReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszTableListResp>>}
   */
  async dszTableList(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/table-list`,
      query: req.query,
      opts
    });
  }
  /**
   * List Recsys Tokens
   * 
   * Lists all active recommendation system tokens for a specific dataset.
   * 
   * @param {apiDszListRecsysTokensReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszListRecsysTokensResp>>}
   */
  async dszListRecsysTokens(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/recsystoken/list`,
      opts
    });
  }
  /**
   * Get Subscription
   * 
   * Gets the plan and the status of the Stripe subscription of a dataset product/solution. The payload is empty for contracts without Stripe.
   * 
   * @param {apiDszGetSubscriptionReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszGetSubscriptionResp>>}
   */
  async dszGetSubscription(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/solution/${encodeURIComponent(String(req.params.solution))}/subscription`,
      opts
    });
  }
  /**
   * List Payments
   * 
   * Lists the Stripe payments (invoices) of a dataset. The list is empty for datasets without a Stripe customer.
   * 
   * @param {apiDszListPaymentsReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszListPaymentsResp>>}
   */
  async dszListPayments(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/payments`,
      opts
    });
  }
  /**
   * Device Token Polling & Exchange
   * 
   * Polled by CLI clients to check status and exchange an authorized device code for active user tokens.
   * 
   * @param {apiUserAuthDeviceTokenReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthDeviceTokenResp>>}
   */
  async userAuthDeviceToken(req, opts) {
    opts = opts || {};
    opts.labels = {
      "servname": "userz",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/auth/device/token`,
      json: req.payload,
      opts
    });
  }
  /**
   * Google Sign-In Credential Exchange
   * 
   * Verifies a Google OAuth ID token via Identity Platform and mints a single-use PKCE code.
   * 
   * @param {apiUserAuthGoogleReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthGoogleResp>>}
   */
  async userAuthGoogle(req, opts) {
    opts = opts || {};
    opts.labels = {
      "servname": "userz",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/auth/google`,
      json: req.payload,
      opts
    });
  }
  /**
   * Current User Profile
   * 
   * Retrieves current authenticated user identity profile metadata.
   * 
   * @param {apiUserAuthMeReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthMeResp>>}
   */
  async userAuthMe(req, opts) {
    opts = opts || {};
    opts.labels = {
      "servname": "userz",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "GET",
      url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/auth/me`,
      headers: req.headers,
      opts
    });
  }
  /**
   * Event Ingestion
   * 
   * Ingests events data into a target dataset table.
   * 
   * @param {apiIngestzEventRelevanceFashionCatalogReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiIngestzEventRelevanceFashionCatalogResp>>}
   */
  async ingestzEventRelevanceFashionCatalog(req, opts) {
    opts = opts || {};
    opts.labels = {
      "sinkable": "true",
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ingest/dataset/${encodeURIComponent(String(req.params.dataset))}/event/relevance-fashion-catalog/text.txt`,
      json: req.payload,
      opts,
      sinkable: true
    });
  }
  /**
   * Event Ingestion
   * 
   * Ingests events data into a target dataset table.
   * 
   * @param {apiIngestzEventRelevanceFashionEventReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiIngestzEventRelevanceFashionEventResp>>}
   */
  async ingestzEventRelevanceFashionEvent(req, opts) {
    opts = opts || {};
    opts.labels = {
      "sinkable": "true",
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ingest/dataset/${encodeURIComponent(String(req.params.dataset))}/event/relevance-fashion-event/text.txt`,
      json: req.payload,
      opts,
      sinkable: true
    });
  }
  /**
   * Get Dataset Table File
   * 
   * Get table file by redirecting to its signed URL.
   * 
   * @param {apiDszTableGetReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszTableGetResp>>}
   */
  async dszTableGet(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/table-file/{path...}`,
      opts
    });
  }
  /**
   * Load Table File as JSON
   * 
   * Load a table file from the datalake as JSON and return it.
   * 
   * @param {apiDszResultLastBatchSummaryReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszResultLastBatchSummaryResp>>}
   */
  async dszResultLastBatchSummary(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/results/last-batch-summary`,
      query: req.query,
      opts
    });
  }
  /**
   * Create Store Display
   * 
   * Creates a store display configuration mapping for a store under a specific dataset.
   * 
   * @param {apiDszStoreDisplayCreateReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszStoreDisplayCreateResp>>}
   */
  async dszStoreDisplayCreate(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/display/create`,
      json: req.payload,
      opts
    });
  }
  /**
   * Create Recsys Token
   * 
   * Creates a read/recommendation token for the recommendation system associated with a specific dataset.
   * 
   * @param {apiDszCreateRecsysTokenReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszCreateRecsysTokenResp>>}
   */
  async dszCreateRecsysToken(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/recsystoken/create`,
      json: req.payload,
      opts
    });
  }
  /**
   * List Dataset Refresh Tokens
   * 
   * Lists all active machine refresh tokens provisioned for a dataset.
   * 
   * @param {apiUserDatasetTokenRefreshListReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserDatasetTokenRefreshListResp>>}
   */
  async userDatasetTokenRefreshList(req, opts) {
    opts = opts || {};
    opts.labels = {
      "servname": "userz",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "GET",
      url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/dataset-refresh-token/${encodeURIComponent(String(req.params.dataset))}`,
      headers: req.headers,
      opts
    });
  }
  /**
   * Sample Fraction
   * 
   * Sample API that performs a fraction operation
   * 
   * @param {apiSampleFractionReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiSampleFractionResp>>}
   */
  async sampleFraction(req, opts) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/gox/routez/sample/fraction/${encodeURIComponent(String(req.params.numerator))}/${encodeURIComponent(String(req.params.denominator))}`,
      query: req.query,
      headers: req.headers,
      json: req.payload,
      opts
    });
  }
  /**
   * Get Model Metadata
   * 
   * Gets the input and output tensors of a model version.
   * 
   * @param {apiTfzModelMetadataReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiTfzModelMetadataResp>>}
   */
  async tfzModelMetadata(req, opts) {
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/metadata/${encodeURIComponent(String(req.params.model_name))}/${encodeURIComponent(String(req.params.version))}`,
      opts
    });
  }
  /**
   * List Plans
   * 
   * Lists the plans a subscription of a solution can be switched to, with the price data from Stripe.
   * 
   * @param {apiDszListPlansReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszListPlansResp>>}
   */
  async dszListPlans(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "user",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/solution/${encodeURIComponent(String(req.params.solution))}/plans`,
      opts
    });
  }
  /**
   * Update Subscription Plan
   * 
   * Updates the plan (price) of the Stripe subscription for a dataset product/solution.
   * 
   * @param {apiDszUpdateSubscriptionPlanReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszUpdateSubscriptionPlanResp>>}
   */
  async dszUpdateSubscriptionPlan(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/solution/${encodeURIComponent(String(req.params.solution))}/subscription/plan`,
      json: req.payload,
      opts
    });
  }
  /**
   * Device Authorization Code Initiation
   * 
   * Initiates an RFC 8628 device authorization flow for CLI and remote headless SSH sessions.
   * 
   * @param {apiUserAuthDeviceCodeReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthDeviceCodeResp>>}
   */
  async userAuthDeviceCode(req, opts) {
    opts = opts || {};
    opts.labels = {
      "servname": "userz",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/auth/device/code`,
      json: req.payload,
      opts
    });
  }
  /**
   * PKCE Authorization Code Exchange
   * 
   * Exchanges a PKCE authorization code and verifier for user access and refresh tokens.
   * 
   * @param {apiUserAuthExchangeReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthExchangeResp>>}
   */
  async userAuthExchange(req, opts) {
    opts = opts || {};
    opts.labels = {
      "servname": "userz",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/auth/exchange`,
      json: req.payload,
      opts
    });
  }
  /**
   * Password Reset Email Dispatch
   * 
   * Dispatches an out-of-band password reset email via Identity Platform.
   * 
   * @param {apiUserAuthPasswordResetReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthPasswordResetResp>>}
   */
  async userAuthPasswordReset(req, opts) {
    opts = opts || {};
    opts.labels = {
      "servname": "userz",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/auth/password/reset`,
      json: req.payload,
      opts
    });
  }
  /**
   * Create Dataset Access Token
   * 
   * Mints a short-lived dataset access token for an authenticated user.
   * 
   * @param {apiUserDatasetTokenAccessCreateReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserDatasetTokenAccessCreateResp>>}
   */
  async userDatasetTokenAccessCreate(req, opts) {
    opts = opts || {};
    opts.labels = {
      "servname": "userz",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/dataset-access-token/${encodeURIComponent(String(req.params.dataset))}`,
      headers: req.headers,
      json: req.payload,
      opts
    });
  }
  /**
   * Activate Pipeline Scheduler
   * 
   * Activates a scheduler for a pipeline on a dataset.
   * 
   * @param {apiPipezSchedulerActivateRelevanceFashionRelevanceFashionMainReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiPipezSchedulerActivateRelevanceFashionRelevanceFashionMainResp>>}
   */
  async pipezSchedulerActivateRelevanceFashionRelevanceFashionMain(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/pipe/dataset/${encodeURIComponent(String(req.params.dataset))}/scheduler/activate/relevance_fashion/relevance-fashion-main`,
      json: req.payload,
      opts
    });
  }
  /**
   * Deactivate Pipeline Scheduler
   * 
   * Deactivates a scheduler for a pipeline on a dataset.
   * 
   * @param {apiPipezSchedulerDeactivateRelevanceFashionRelevanceFashionMainReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiPipezSchedulerDeactivateRelevanceFashionRelevanceFashionMainResp>>}
   */
  async pipezSchedulerDeactivateRelevanceFashionRelevanceFashionMain(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/pipe/dataset/${encodeURIComponent(String(req.params.dataset))}/scheduler/deactivate/relevance_fashion/relevance-fashion-main`,
      json: req.payload,
      opts
    });
  }
  /**
   * List Pipelines
   * 
   * Lists the pipelines of a dataset, optionally filtered, with cursor pagination.
   * 
   * @param {apiPipezListReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiPipezListResp>>}
   */
  async pipezList(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/pipe/dataset/${encodeURIComponent(String(req.params.dataset))}/list`,
      query: req.query,
      opts
    });
  }
  /**
   * List Datasets
   * 
   * Lists all datasets available to the user.
   * 
   * @param {apiDszListDatasetsReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszListDatasetsResp>>}
   */
  async dszListDatasets(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "user",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/user-id/${encodeURIComponent(String(req.params.userId))}/datasets`,
      opts
    });
  }
  /**
   * Delete Token
   * 
   * Deletes (revokes) a specific token (e.g. ingestion or recsys token) associated with a dataset.
   * 
   * @param {apiDszDeleteTokenReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszDeleteTokenResp>>}
   */
  async dszDeleteToken(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "DELETE",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/token/delete`,
      query: req.query,
      opts
    });
  }
  /**
   * Create Stripe Checkout
   * 
   * Creates a Stripe checkout session for a subscription and returns its id and url.
   * 
   * @param {apiDszStripeCheckoutReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszStripeCheckoutResp>>}
   */
  async dszStripeCheckout(req, opts) {
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/stripe/checkout`,
      json: req.payload,
      opts
    });
  }
  /**
   * Human User Session Refresh
   * 
   * Exchanges a human user refresh token for fresh access and rotated refresh tokens.
   * 
   * @param {apiUserAuthRefreshReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthRefreshResp>>}
   */
  async userAuthRefresh(req, opts) {
    opts = opts || {};
    opts.labels = {
      "servname": "userz",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/refresh-user`,
      json: req.payload,
      opts
    });
  }
  /**
   * Start Pipeline
   * 
   * Starts a pipeline on a dataset with the given params and returns its id.
   * 
   * @param {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiPipezStartRelevanceFashionRelevanceFashionBatchIngestResp>>}
   */
  async pipezStartRelevanceFashionRelevanceFashionBatchIngest(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/pipe/dataset/${encodeURIComponent(String(req.params.dataset))}/start/relevance_fashion/relevance-fashion-batch-ingest`,
      json: req.payload,
      opts
    });
  }
  /**
   * Create Store
   * 
   * Creates a store configuration under a specific dataset.
   * 
   * @param {apiDszCreateStoreReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszCreateStoreResp>>}
   */
  async dszCreateStore(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/create`,
      json: req.payload,
      opts
    });
  }
  /**
   * Get Solution Domain
   * 
   * Retrieves the active solutions and their corresponding domains for a given store in a dataset.
   * 
   * @param {apiDszDomainGetReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszDomainGetResp>>}
   */
  async dszDomainGet(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/solution-domain`,
      query: req.query,
      opts
    });
  }
  /**
   * Create Ingestion Token
   * 
   * Creates a write token for data ingestion into a specific dataset.
   * 
   * @param {apiDszCreateIngestionTokenReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszCreateIngestionTokenResp>>}
   */
  async dszCreateIngestionToken(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/ingestiontoken/create`,
      json: req.payload,
      opts
    });
  }
  /**
   * Model Predict
   * 
   * Runs a prediction of a dataset model version on the inference service (tfinfer), sending the model inputs and the model partitions and returning the model outputs.
   * 
   * @param {apiTfzModelPredictReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiTfzModelPredictResp>>}
   */
  async tfzModelPredict(req, opts) {
    opts = opts || {};
    opts.labels = {
      "servname": "tfinfer",
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      url: `${this._services.config().servUrls?.["tfinfer"] ?? this._services.config().baseUrl}/api/model/dataset/${encodeURIComponent(String(req.params.dataset))}/${encodeURIComponent(String(req.params.model_name))}/${encodeURIComponent(String(req.params.version))}/predict`,
      json: req.payload,
      opts
    });
  }
  /**
   * Create Customer Portal
   * 
   * Creates a Stripe billing portal session URL where the user can manage cards, auto-renew, and plans.
   * 
   * @param {apiDszCreateCustomerPortalReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszCreateCustomerPortalResp>>}
   */
  async dszCreateCustomerPortal(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/portal`,
      json: req.payload,
      opts
    });
  }
  /**
   * Human User Session Logout
   * 
   * Revokes an active human user session by marking the refresh token and its token family as revoked in userzsession.
   * 
   * @param {apiUserAuthLogoutReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthLogoutResp>>}
   */
  async userAuthLogout(req, opts) {
    opts = opts || {};
    opts.labels = {
      "servname": "userz",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/auth/logout`,
      json: req.payload,
      opts
    });
  }
  /**
   * Email and Password Sign-Up
   * 
   * Registers a new user with Identity Platform and dispatches a verification email.
   * 
   * @param {apiUserAuthPasswordSignupReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserAuthPasswordSignupResp>>}
   */
  async userAuthPasswordSignup(req, opts) {
    opts = opts || {};
    opts.labels = {
      "servname": "userz",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/auth/signup/password`,
      json: req.payload,
      opts
    });
  }
  /**
   * Load Table File as JSON
   * 
   * Load a table file from the datalake as JSON and return it.
   * 
   * @param {apiDszResultRelevanceFashionCatalogReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszResultRelevanceFashionCatalogResp>>}
   */
  async dszResultRelevanceFashionCatalog(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/results/relevance-fashion-catalog`,
      query: req.query,
      opts
    });
  }
  /**
   * Start Pipeline
   * 
   * Starts a pipeline on a dataset with the given params and returns its id.
   * 
   * @param {apiPipezStartRelevanceFashionRelevanceFashionMainReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiPipezStartRelevanceFashionRelevanceFashionMainResp>>}
   */
  async pipezStartRelevanceFashionRelevanceFashionMain(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/pipe/dataset/${encodeURIComponent(String(req.params.dataset))}/start/relevance_fashion/relevance-fashion-main`,
      json: req.payload,
      opts
    });
  }
  /**
   * List Stores
   * 
   * Lists all stores configured under a specific dataset.
   * 
   * @param {apiDszListStoresReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszListStoresResp>>}
   */
  async dszListStores(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "GET",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/list`,
      opts
    });
  }
  /**
   * Get Model Signed URLs
   * 
   * Generates presigned URLs for accessing model files in the specified dataset.
   * 
   * @param {apiDszModelGetReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszModelGetResp>>}
   */
  async dszModelGet(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/model/dataset/${encodeURIComponent(String(req.params.dataset))}/signed-get/${encodeURIComponent(String(req.params.model_name))}`,
      json: req.payload,
      opts
    });
  }
  /**
   * Update Payment Auto Renew
   * 
   * Turns auto renew on or off for the Stripe subscription of a dataset product/solution.
   * 
   * @param {apiDszUpdatePaymentAutoRenewReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiDszUpdatePaymentAutoRenewResp>>}
   */
  async dszUpdatePaymentAutoRenew(req, opts) {
    opts = opts || {};
    opts.labels = {
      "token_types": "dataset",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/solution/${encodeURIComponent(String(req.params.solution))}/payment/autorenew`,
      json: req.payload,
      opts
    });
  }
  /**
   * Attenuate Dataset Access Token
   * 
   * Derives an in-flight attenuated child access token with dropped privileges from an active access token.
   * 
   * @param {apiUserDatasetTokenAccessAttenuateReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserDatasetTokenAccessAttenuateResp>>}
   */
  async userDatasetTokenAccessAttenuate(req, opts) {
    opts = opts || {};
    opts.labels = {
      "servname": "userz",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/attenuate`,
      headers: req.headers,
      json: req.payload,
      opts
    });
  }
  /**
   * Refresh Dataset Access Token
   * 
   * Refreshes and attenuates a dataset access token using an Ed25519 signature assertion.
   * 
   * @param {apiUserDatasetTokenRefreshReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserDatasetTokenRefreshResp>>}
   */
  async userDatasetTokenRefresh(req, opts) {
    opts = opts || {};
    opts.labels = {
      "servname": "userz",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/refresh-dataset`,
      headers: req.headers,
      json: req.payload,
      opts
    });
  }
  /**
   * Create Dataset Refresh Token
   * 
   * Provisions a long-lived machine dataset refresh token with an Ed25519 keypair.
   * 
   * @param {apiUserDatasetTokenRefreshCreateReq} req
   * @param {ServiceOptions} [opts]
   * @returns {Promise<import("../invoker/invoker.js").Resp<apiUserDatasetTokenRefreshCreateResp>>}
   */
  async userDatasetTokenRefreshCreate(req, opts) {
    opts = opts || {};
    opts.labels = {
      "servname": "userz",
      ...opts.labels || {}
    };
    return this._services.invoker().invokeResult({
      method: "POST",
      url: `${this._services.config().servUrls?.["userz"] ?? this._services.config().baseUrl}/api/userz/dataset-refresh-token/${encodeURIComponent(String(req.params.dataset))}`,
      headers: req.headers,
      json: req.payload,
      opts
    });
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
}
export { SdkFuncs };
