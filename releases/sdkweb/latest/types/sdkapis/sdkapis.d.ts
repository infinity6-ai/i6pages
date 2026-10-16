/**
 * @typedef {import("../services/services.js").Services} Services
 */
export type Services = import("../services/services.js").Services;
export type apiDszCreateIngestionTokenParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszCreateIngestionTokenReq = {
    params: apiDszCreateIngestionTokenParams;
    payload: apiDszCreateIngestionTokenReqPayload;
};
export type apiDszCreateIngestionTokenReqPayload = {
    /**
     * - [Go: string]
     */
    annotation: string;
};
export type apiDszCreateIngestionTokenResp = {
    payload: apiDszCreateIngestionTokenRespPayload;
};
export type apiDszCreateIngestionTokenRespPayload = {
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: string]
     */
    jti: string;
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    /**
     * - [Go: string]
     */
    annotation: string;
    /**
     * - [Go: int64]
     */
    expiration_date: number;
    /**
     * - [Go: string]
     */
    audience: string;
    /**
     * - [Go: []string]
     */
    grants: Array<string>;
    /**
     * - [Go: string]
     */
    channel: string;
    /**
     * - [Go: string]
     */
    token: string;
};
export type apiDszCreateRecsysTokenParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszCreateRecsysTokenReq = {
    params: apiDszCreateRecsysTokenParams;
    payload: apiDszCreateRecsysTokenReqPayload;
};
export type apiDszCreateRecsysTokenReqPayload = {
    /**
     * - [Go: string]
     */
    annotation: string;
    /**
     * - [Go: string]
     */
    channel: string;
};
export type apiDszCreateRecsysTokenResp = {
    payload: apiDszCreateRecsysTokenRespPayload;
};
export type apiDszCreateRecsysTokenRespPayload = {
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: string]
     */
    jti: string;
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    /**
     * - [Go: string]
     */
    annotation: string;
    /**
     * - [Go: int64]
     */
    expiration_date: number;
    /**
     * - [Go: string]
     */
    audience: string;
    /**
     * - [Go: []string]
     */
    grants: Array<string>;
    /**
     * - [Go: string]
     */
    channel: string;
    /**
     * - [Go: string]
     */
    token: string;
};
export type apiDszCreateStoreParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszCreateStoreReq = {
    params: apiDszCreateStoreParams;
    payload: apiDszCreateStoreReqPayload;
};
export type apiDszCreateStoreReqPayload = {
    /**
     * - [Go: dszstore.DszStore]
     */
    store_id: apiDszCreateStoreReqPayloadStoreId;
};
export type apiDszCreateStoreReqPayloadStoreId = {
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: string]
     */
    name: string;
};
export type apiDszCreateStoreResp = object;
export type apiDszDatasetSolutionsParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszDatasetSolutionsReq = {
    params: apiDszDatasetSolutionsParams;
};
export type apiDszDatasetSolutionsResp = {
    payload: apiDszDatasetSolutionsRespPayload;
};
export type apiDszDatasetSolutionsRespPayload = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    solutions: Array<apiDszDatasetSolutionsRespPayloadSolutionsElement>;
};
export type apiDszDatasetSolutionsRespPayloadSolutionsElement = string;
export type apiDszDeleteTokenParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszDeleteTokenQuery = {
    /**
     * - [Go: string]
     */
    token: string;
};
export type apiDszDeleteTokenReq = {
    params: apiDszDeleteTokenParams;
    query: apiDszDeleteTokenQuery;
};
export type apiDszDeleteTokenResp = object;
export type apiDszDomainGetParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszDomainGetQuery = {
    /**
     * - [Go: string]
     */
    store_id: string;
};
export type apiDszDomainGetReq = {
    params: apiDszDomainGetParams;
    query: apiDszDomainGetQuery;
};
export type apiDszDomainGetResp = {
    payload: apiDszDomainGetRespPayload;
};
export type apiDszDomainGetRespPayload = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    solutions: Array<apiDszDomainGetRespPayloadSolutionsElement>;
    /**
     * - [Go: string]
     */
    store_id: string;
};
export type apiDszDomainGetRespPayloadSolutionsElement = {
    /**
     * - [Go: solution.Solution]
     */
    solution: string;
    /**
     * - [Go: domain.Domain]
     */
    domain: string;
};
export type apiDszDomainSelectParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszDomainSelectReq = {
    params: apiDszDomainSelectParams;
    payload: apiDszDomainSelectReqPayload;
};
export type apiDszDomainSelectReqPayload = {
    /**
     * - [Go: domain.Domain]
     */
    domain: string;
    /**
     * - [Go: solution.Solution]
     */
    solution: string;
    /**
     * - [Go: string]
     */
    store_id: string;
};
export type apiDszDomainSelectResp = object;
export type apiDszGetPaymentStatusQuery = {
    /**
     * - [Go: lakedsz.Dataset] Id of the dataset that is waiting for the payment
     */
    dataset: string;
    /**
     * - [Go: string] User that is buying
     */
    user: string;
};
export type apiDszGetPaymentStatusReq = {
    query: apiDszGetPaymentStatusQuery;
};
export type apiDszGetPaymentStatusResp = {
    payload: apiDszGetPaymentStatusRespPayload;
};
export type apiDszGetPaymentStatusRespPayload = {
    /**
     * - [Go: string] Id of the dataset
     */
    dataset: string;
    /**
     * - [Go: string] Name of the dataset
     */
    dataset_name: string;
    /**
     * - [Go: string] Id of the payment on the payment provider
     */
    payment_id: string;
    /**
     * - [Go: string] paid, expired, open or unpaid. Only open and unpaid payments are still pending
     */
    payment_status: string;
    /**
     * - [Go: string] Payment provider
     */
    payment_type: string;
    /**
     * - [Go: string] User that is buying
     */
    user_id: string;
};
export type apiDszListDatasetsQuery = {
    /**
     * - [Go: string]
     */
    user: string;
};
export type apiDszListDatasetsReq = {
    query: apiDszListDatasetsQuery;
};
export type apiDszListDatasetsResp = {
    payload: apiDszListDatasetsRespPayload;
};
export type apiDszListDatasetsRespPayload = {
    datasets: Array<apiDszListDatasetsRespPayloadDatasetsElement>;
};
export type apiDszListDatasetsRespPayloadDatasetsElement = {
    grants: Array<apiDszListDatasetsRespPayloadDatasetsElementGrantsElement>;
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: string]
     */
    name: string;
};
export type apiDszListDatasetsRespPayloadDatasetsElementGrantsElement = string;
export type apiDszListIngestionTokensParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszListIngestionTokensReq = {
    params: apiDszListIngestionTokensParams;
};
export type apiDszListIngestionTokensResp = {
    payload: apiDszListIngestionTokensRespPayload;
};
export type apiDszListIngestionTokensRespPayload = object;
export type apiDszListPendingPaymentsQuery = {
    /**
     * - [Go: string] User that is buying
     */
    user: string;
};
export type apiDszListPendingPaymentsReq = {
    query: apiDszListPendingPaymentsQuery;
};
export type apiDszListPendingPaymentsResp = {
    payload: apiDszListPendingPaymentsRespPayload;
};
export type apiDszListPendingPaymentsRespPayload = {
    /**
     * - Datasets waiting for a payment
     */
    pending_payments: Array<apiDszListPendingPaymentsRespPayloadPendingPaymentsElement>;
};
export type apiDszListPendingPaymentsRespPayloadPendingPaymentsElement = {
    /**
     * - [Go: lakedsz.Dataset] Id of the dataset that is going to be created after the payment
     */
    dataset: string;
};
export type apiDszListRecsysTokensParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszListRecsysTokensReq = {
    params: apiDszListRecsysTokensParams;
};
export type apiDszListRecsysTokensResp = {
    payload: apiDszListRecsysTokensRespPayload;
};
export type apiDszListRecsysTokensRespPayload = object;
export type apiDszListStoresParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszListStoresReq = {
    params: apiDszListStoresParams;
};
export type apiDszListStoresResp = {
    payload: apiDszListStoresRespPayload;
};
export type apiDszListStoresRespPayload = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    stores: Array<apiDszListStoresRespPayloadStoresElement>;
};
export type apiDszListStoresRespPayloadStoresElement = {
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: string]
     */
    name: string;
};
export type apiDszModelGetParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset to generate signed URLs for.
     */
    dataset: string;
    /**
     * - [Go: string] Model name
     */
    model_name: string;
};
export type apiDszModelGetReq = {
    params: apiDszModelGetParams;
    payload: apiDszModelGetReqPayload;
};
export type apiDszModelGetReqPayload = {
    /**
     * - Model partition key/value pairs
     */
    model_partitions: Record<apiDszModelGetReqPayloadModelPartitionsKey, apiDszModelGetReqPayloadModelPartitionsValue>;
    /**
     * - [Go: string] Model version
     */
    model_version: string;
};
export type apiDszModelGetReqPayloadModelPartitionsKey = string;
export type apiDszModelGetReqPayloadModelPartitionsValue = string;
export type apiDszModelGetResp = {
    payload: apiDszModelGetRespPayload;
};
export type apiDszModelGetRespPayload = {
    /**
     * - Signed URLs
     */
    urls: Array<apiDszModelGetRespPayloadUrlsElement>;
};
export type apiDszModelGetRespPayloadUrlsElement = {
    /**
     * - [Go: string] File Name
     */
    name: string;
    /**
     * - [Go: string] signed URL.
     */
    url: string;
};
export type apiDszSignedUrlParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset to generate signed URLs for.
     */
    dataset: string;
};
export type apiDszSignedUrlReq = {
    params: apiDszSignedUrlParams;
    payload: apiDszSignedUrlReqPayload;
};
export type apiDszSignedUrlReqPayload = {
    /**
     * - List of paths and HTTP methods to generate signed URLs for.
     */
    paths: Array<apiDszSignedUrlReqPayloadPathsElement>;
};
export type apiDszSignedUrlReqPayloadPathsElement = {
    /**
     * - [Go: fszsignmethod.SignMethod] HTTP method (e.g. GET, PUT) for the signed URL.
     */
    method: string;
    /**
     * - [Go: laketbpathz.Path] File path within the dataset.
     */
    path: string;
};
export type apiDszSignedUrlResp = {
    payload: apiDszSignedUrlRespPayload;
};
export type apiDszSignedUrlRespPayload = {
    /**
     * - Signed URLs
     */
    urls: Array<apiDszSignedUrlRespPayloadUrlsElement>;
};
export type apiDszSignedUrlRespPayloadUrlsElement = {
    /**
     * - [Go: string] signed URL.
     */
    url: string;
};
export type apiDszStripeCheckoutReq = {
    payload: apiDszStripeCheckoutReqPayload;
};
export type apiDszStripeCheckoutReqPayload = {
    /**
     * - [Go: string] Url to go after a canceled checkout
     */
    cancel_url: string;
    /**
     * - [Go: string]
     */
    cnpj_hub: string;
    /**
     * - [Go: string]
     */
    contract_version: string;
    /**
     * - [Go: string] Customer email
     */
    customer_email: string;
    /**
     * - [Go: string] Dataset name
     */
    dataset_name: string;
    /**
     * - [Go: string]
     */
    id_campanha_hub: string;
    /**
     * - [Go: string]
     */
    id_solution_hub: string;
    /**
     * - Items being bought
     */
    line_items: Array<apiDszStripeCheckoutReqPayloadLineItemsElement>;
    /**
     * - [Go: string]
     */
    responsible_email_hub: string;
    /**
     * - [Go: string]
     */
    responsible_name_hub: string;
    /**
     * - [Go: int] Trial period in days
     */
    subscription_data_trial_period_days: number;
    /**
     * - [Go: string] Url to go after a successful checkout
     */
    success_url: string;
    /**
     * - [Go: string]
     */
    terms_accepted_at: string;
    /**
     * - [Go: string]
     */
    terms_version: string;
    /**
     * - [Go: string] User that is buying
     */
    user: string;
};
export type apiDszStripeCheckoutReqPayloadLineItemsElement = {
    /**
     * - [Go: string] Price id
     */
    price: string;
    /**
     * - [Go: int] Quantity
     */
    quantity: number;
};
export type apiDszStripeCheckoutResp = {
    payload: apiDszStripeCheckoutRespPayload;
};
export type apiDszStripeCheckoutRespPayload = {
    /**
     * - [Go: string] Checkout session id
     */
    id: string;
    /**
     * - [Go: string] Checkout session url
     */
    url: string;
};
export type apiDszTableGetParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset.
     */
    dataset: string;
    /**
     * - [Go: string] Path to the file without schema.
     */
    path: string;
};
export type apiDszTableGetReq = {
    params: apiDszTableGetParams;
};
export type apiDszTableGetResp = {
    headers: apiDszTableGetRespHeaders;
};
export type apiDszTableGetRespHeaders = {
    /**
     * - [Go: string] Redirect URL for the file.
     */
    location: string;
};
export type apiDszTableListParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset to list tables from.
     */
    dataset: string;
};
export type apiDszTableListQuery = {
    /**
     * - [Go: string] Pagination cursor.
     */
    from_cursor: string;
    /**
     * - [Go: int] Limit the number of results.
     */
    limist: number;
    /**
     * - [Go: laketbpathz.Path] Path to list.
     */
    path: string;
    /**
     * - [Go: bool] Whether to list recursively.
     */
    recursive: boolean;
    /**
     * - [Go: fszsignmethod.SignMethod] Whether to return signed URLs.
     */
    sign_method: string;
    /**
     * - [Go: bool] Whether to include file stats.
     */
    stat: boolean;
};
export type apiDszTableListReq = {
    params: apiDszTableListParams;
    query: apiDszTableListQuery;
};
export type apiDszTableListResp = {
    payload: apiDszTableListRespPayload;
};
export type apiDszTableListRespPayload = {
    files: Array<apiDszTableListRespPayloadFilesElement>;
    /**
     * - [Go: string] Cursor for the next page of results.
     */
    next_cursor: string;
};
export type apiDszTableListRespPayloadFilesElement = {
    /**
     * - [Go: laketbpathz.Path] write it
     */
    path: string;
    /**
     * - [Go: string] write it
     */
    signed_url: string;
    /**
     * - [Go: fsz.FileStat] write it
     */
    stat: dszFileStat;
};
export type apiIngestzGetUrlParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset that receives the uploaded files.
     */
    dataset: string;
};
export type apiIngestzGetUrlReq = {
    params: apiIngestzGetUrlParams;
    payload: apiIngestzGetUrlReqPayload;
};
export type apiIngestzGetUrlReqPayload = {
    /**
     * - [Go: int] Number of presigned upload URLs to generate.
     */
    amount: number;
    /**
     * - Partition key/value pairs that select the table partition the files are ingested into.
     */
    partitions: Record<apiIngestzGetUrlReqPayloadPartitionsKey, apiIngestzGetUrlReqPayloadPartitionsValue>;
    /**
     * - [Go: laketbnamez.TableName] Name of the table, inside the dataset, that receives the uploaded files.
     */
    table: string;
};
export type apiIngestzGetUrlReqPayloadPartitionsKey = string;
export type apiIngestzGetUrlReqPayloadPartitionsValue = string;
export type apiIngestzGetUrlResp = {
    payload: apiIngestzGetUrlRespPayload;
};
export type apiIngestzGetUrlRespPayload = {
    /**
     * - [Go: string] Ingestion token that identifies this ingestion and ties the uploaded files together.
     */
    ingest_id: string;
    /**
     * - Presigned PUT URLs, one per requested file; upload each file to its URL.
     */
    uploads: Array<apiIngestzGetUrlRespPayloadUploadsElement>;
};
export type apiIngestzGetUrlRespPayloadUploadsElement = string;
export type apiIngestzLastBatchSummaryParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset that receives the uploaded files.
     */
    dataset: string;
};
export type apiIngestzLastBatchSummaryQuery = {
    /**
     * - [Go: string] Store ID associated with the ingestion.
     */
    store_id: string;
    /**
     * - [Go: laketbnamez.TableName] Name of the table inside the dataset.
     */
    table: string;
};
export type apiIngestzLastBatchSummaryReq = {
    params: apiIngestzLastBatchSummaryParams;
    query: apiIngestzLastBatchSummaryQuery;
};
export type apiIngestzLastBatchSummaryResp = {
    payload: apiIngestzLastBatchSummaryRespPayload;
};
export type apiIngestzLastBatchSummaryRespPayload = {
    /**
     * - Summaries of distinct and null counts per column.
     */
    column_summaries: Array<apiIngestzLastBatchSummaryRespPayloadColumnSummariesElement>;
    /**
     * - [Go: string] Timestamp when the batch was successfully ingested.
     */
    ingested_at: string;
    /**
     * - [Go: int] Total number of successfully ingested rows.
     */
    row_count: number;
    /**
     * - [Go: string] Store ID associated with the ingestion.
     */
    store_id: string;
};
export type apiIngestzLastBatchSummaryRespPayloadColumnSummariesElement = {
    /**
     * - [Go: string] Name of the column.
     */
    column_name: string;
    /**
     * - [Go: int] Number of distinct values in the column.
     */
    distinct_count: number;
    /**
     * - [Go: int] Number of null values in the column.
     */
    null_count: number;
};
export type apiIngestzStreamRelevanceFashionCatalogParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset that receives the stream data.
     */
    dataset: string;
};
export type apiIngestzStreamRelevanceFashionCatalogReq = {
    params: apiIngestzStreamRelevanceFashionCatalogParams;
    payload: apiIngestzStreamRelevanceFashionCatalogReqPayload;
};
export type apiIngestzStreamRelevanceFashionCatalogReqPayload = {
    /**
     * - Generic stream data to ingest.
     */
    data: Array<apiIngestzStreamRelevanceFashionCatalogReqPayloadDataElement>;
};
export type apiIngestzStreamRelevanceFashionCatalogReqPayloadDataElement = {
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: bool]
     */
    inactive: boolean;
    /**
     * - [Go: string]
     */
    product_id: string;
    /**
     * - [Go: string]
     */
    sku_ds: string;
    /**
     * - [Go: string]
     */
    sku_id: string;
    /**
     * - [Go: string]
     */
    store_id: string;
};
export type apiIngestzStreamRelevanceFashionCatalogResp = object;
export type apiIngestzStreamRelevanceFashionEventParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset that receives the stream data.
     */
    dataset: string;
};
export type apiIngestzStreamRelevanceFashionEventReq = {
    params: apiIngestzStreamRelevanceFashionEventParams;
    payload: apiIngestzStreamRelevanceFashionEventReqPayload;
};
export type apiIngestzStreamRelevanceFashionEventReqPayload = {
    /**
     * - Generic stream data to ingest.
     */
    data: Array<apiIngestzStreamRelevanceFashionEventReqPayloadDataElement>;
};
export type apiIngestzStreamRelevanceFashionEventReqPayloadDataElement = {
    add_to_cart: apiIngestzStreamRelevanceFashionEventReqPayloadDataElementAddToCart;
    click: apiIngestzStreamRelevanceFashionEventReqPayloadDataElementClick;
    /**
     * - [Go: time.Time]
     */
    created_at: dszTime;
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: string]
     */
    ingested_at: string;
    purchase: apiIngestzStreamRelevanceFashionEventReqPayloadDataElementPurchase;
    recraw: apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRecraw;
    recshow: apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRecshow;
    remove_from_cart: apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRemoveFromCart;
    search: apiIngestzStreamRelevanceFashionEventReqPayloadDataElementSearch;
    /**
     * - [Go: string]
     */
    session_id: string;
    /**
     * - [Go: string]
     */
    store_id: string;
    /**
     * - [Go: string]
     */
    user_id: string;
};
export type apiIngestzStreamRelevanceFashionEventReqPayloadDataElementAddToCart = {
    /**
     * - [Go: float64]
     */
    price: number;
    /**
     * - [Go: string]
     */
    sku_id: string;
};
export type apiIngestzStreamRelevanceFashionEventReqPayloadDataElementClick = {
    /**
     * - [Go: float64]
     */
    price: number;
    /**
     * - [Go: string]
     */
    sku_id: string;
};
export type apiIngestzStreamRelevanceFashionEventReqPayloadDataElementPurchase = {
    /**
     * - [Go: string]
     */
    order_id: string;
    skus: Array<apiIngestzStreamRelevanceFashionEventReqPayloadDataElementPurchaseSkusElement>;
};
export type apiIngestzStreamRelevanceFashionEventReqPayloadDataElementPurchaseSkusElement = {
    /**
     * - [Go: int64]
     */
    qtty: number;
    /**
     * - [Go: string]
     */
    sku_id: string;
    /**
     * - [Go: float64]
     */
    unit_price: number;
};
export type apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRecraw = {
    /**
     * - [Go: string]
     */
    model_id: string;
    /**
     * - [Go: string]
     */
    payload: string;
    /**
     * - [Go: string]
     */
    rec_id: string;
};
export type apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRecshow = {
    /**
     * - [Go: string]
     */
    payload: string;
    /**
     * - [Go: string]
     */
    rec_id: string;
};
export type apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRemoveFromCart = {
    /**
     * - [Go: float64]
     */
    price: number;
    /**
     * - [Go: string]
     */
    sku_id: string;
};
export type apiIngestzStreamRelevanceFashionEventReqPayloadDataElementSearch = {
    /**
     * - [Go: string]
     */
    text: string;
};
export type apiIngestzStreamRelevanceFashionEventResp = object;
export type apiPipezGetParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    /**
     * - [Go: string]
     */
    id: string;
};
export type apiPipezGetReq = {
    params: apiPipezGetParams;
};
export type apiPipezGetResp = {
    payload: apiPipezGetRespPayload;
};
export type apiPipezGetRespPayload = {
    pipeline: apiPipezGetRespPayloadPipeline;
};
export type apiPipezGetRespPayloadPipeline = {
    /**
     * - [Go: string]
     */
    concurrent_id: string;
    /**
     * - [Go: string]
     */
    dataset: string;
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: string]
     */
    name: string;
    /**
     * - [Go: solutiondomain.SolutionDomain]
     */
    solution_domain: string;
    states: Array<apiPipezGetRespPayloadPipelineStatesElement>;
};
export type apiPipezGetRespPayloadPipelineStatesElement = {
    /**
     * - [Go: string]
     */
    created_at: string;
    params: Record<apiPipezGetRespPayloadPipelineStatesElementParamsKey, apiPipezGetRespPayloadPipelineStatesElementParamsValue>;
    /**
     * - [Go: string]
     */
    status: string;
};
export type apiPipezGetRespPayloadPipelineStatesElementParamsKey = string;
export type apiPipezGetRespPayloadPipelineStatesElementParamsValue = any;
export type apiPipezListParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiPipezListQuery = {
    /**
     * - [Go: string]
     */
    cursor: string;
    /**
     * - [Go: int]
     */
    limit: number;
    /**
     * - [Go: string]
     */
    name: string;
    /**
     * - [Go: solutiondomain.SolutionDomain]
     */
    solution_domain: string;
    /**
     * - [Go: string]
     */
    status: string;
};
export type apiPipezListReq = {
    params: apiPipezListParams;
    query: apiPipezListQuery;
};
export type apiPipezListResp = {
    payload: apiPipezListRespPayload;
};
export type apiPipezListRespPayload = object;
export type apiPipezStartRelevanceFashionRelevanceFashionBatchIngestParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReq = {
    params: apiPipezStartRelevanceFashionRelevanceFashionBatchIngestParams;
    payload: apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayload;
};
export type apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayload = {
    params: apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayloadParams;
};
export type apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayloadParams = {
    /**
     * - [Go: string]
     */
    ingest_id: string;
    /**
     * - [Go: laketbnamez.TableName]
     */
    table: string;
};
export type apiPipezStartRelevanceFashionRelevanceFashionBatchIngestResp = {
    payload: apiPipezStartRelevanceFashionRelevanceFashionBatchIngestRespPayload;
};
export type apiPipezStartRelevanceFashionRelevanceFashionBatchIngestRespPayload = {
    /**
     * - [Go: string]
     */
    id: string;
};
export type apiPipezStartRelevanceFashionRelevanceFashionMainParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiPipezStartRelevanceFashionRelevanceFashionMainReq = {
    params: apiPipezStartRelevanceFashionRelevanceFashionMainParams;
    payload: apiPipezStartRelevanceFashionRelevanceFashionMainReqPayload;
};
export type apiPipezStartRelevanceFashionRelevanceFashionMainReqPayload = object;
export type apiPipezStartRelevanceFashionRelevanceFashionMainResp = {
    payload: apiPipezStartRelevanceFashionRelevanceFashionMainRespPayload;
};
export type apiPipezStartRelevanceFashionRelevanceFashionMainRespPayload = {
    /**
     * - [Go: string]
     */
    id: string;
};
export type apiSampleFractionParams = {
    /**
     * - [Go: float64] Fraction Denominator
     */
    denominator: number;
    /**
     * - [Go: float64] Fraction Numerator
     */
    numerator: number;
};
export type apiSampleFractionQuery = {
    /**
     * - [Go: int] Fraction max precision
     */
    precision: number;
};
export type apiSampleFractionReq = {
    params: apiSampleFractionParams;
    query: apiSampleFractionQuery;
    headers: apiSampleFractionReqHeaders;
    payload: apiSampleFractionReqPayload;
};
export type apiSampleFractionReqHeaders = {
    /**
     * - [Go: string] Sample of Trace Id
     */
    x_i6_trace_id: string;
};
export type apiSampleFractionReqPayload = {
    messages: Array<apiSampleFractionReqPayloadMessagesElement>;
    /**
     * - [Go: string] Sample reason of this fraction
     */
    reason: string;
};
export type apiSampleFractionReqPayloadMessagesElement = {
    /**
     * - [Go: string] message string
     */
    message: string;
};
export type apiSampleFractionResp = {
    headers: apiSampleFractionRespHeaders;
    payload: apiSampleFractionRespPayload;
};
export type apiSampleFractionRespHeaders = {
    /**
     * - [Go: string] Sample of any trace message
     */
    x_i6_trace_message: string;
};
export type apiSampleFractionRespPayload = {
    /**
     * - [Go: string] Human Fraction Representation
     */
    display: string;
    /**
     * - Output Messages
     */
    messages: Array<apiSampleFractionRespPayloadMessagesElement>;
    /**
     * - [Go: string] Fraction Result
     */
    result: string;
};
export type apiSampleFractionRespPayloadMessagesElement = string;
export type dszFileStat = {
    /**
     * - missing summary
     */
    url: string;
    /**
     * - missing summary
     */
    content_type: string;
    /**
     * - missing summary
     */
    md5: string;
    /**
     * - missing summary
     */
    size: string;
    /**
     * - missing summary
     */
    etag: string;
    /**
     * - missing summary
     */
    created_at: dszTime;
    /**
     * - missing summary
     */
    updated_at: dszTime;
};
export type dszTime = string;
export type sdkFuncProductRelevanceFashionDashAttachedRevenueInput = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    params: sdkFuncProductRelevanceFashionDashAttachedRevenueInputParams;
};
export type sdkFuncProductRelevanceFashionDashAttachedRevenueInputParams = {
    /**
     * - [Go: string]
     */
    max_year_month: string;
    /**
     * - [Go: string]
     */
    min_year_month: string;
};
export type sdkFuncProductRelevanceFashionDashAttachedRevenueOutput = {
    rows: Array<sdkFuncProductRelevanceFashionDashAttachedRevenueOutputRowsElement>;
};
export type sdkFuncProductRelevanceFashionDashAttachedRevenueOutputRowsElement = {
    /**
     * - [Go: float64]
     */
    attached_purchases: number;
    /**
     * - [Go: float64]
     */
    attached_revenue: number;
    /**
     * - [Go: float64]
     */
    attached_skus: number;
    /**
     * - [Go: float64]
     */
    avg_ticket: number;
};
export type sdkFuncProductRelevanceFashionDashAttachedRevenuePartitions = {
    /**
     * - [Go: string]
     */
    store_id: string;
};
export type sdkFuncProductRelevanceFashionDashAttachedRevenueReq = {
    input: sdkFuncProductRelevanceFashionDashAttachedRevenueInput;
    partitions: sdkFuncProductRelevanceFashionDashAttachedRevenuePartitions;
};
export type sdkFuncProductRelevanceFashionDashAttachedRevenueResp = {
    output: sdkFuncProductRelevanceFashionDashAttachedRevenueOutput;
};
export type sdkFuncProductRelevanceFashionDashFunnelInput = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    params: sdkFuncProductRelevanceFashionDashFunnelInputParams;
};
export type sdkFuncProductRelevanceFashionDashFunnelInputParams = {
    /**
     * - [Go: string]
     */
    max_year_month: string;
    /**
     * - [Go: string]
     */
    min_year_month: string;
};
export type sdkFuncProductRelevanceFashionDashFunnelOutput = {
    rows: Array<sdkFuncProductRelevanceFashionDashFunnelOutputRowsElement>;
};
export type sdkFuncProductRelevanceFashionDashFunnelOutputRowsElement = {
    /**
     * - [Go: string]
     */
    event_type: string;
    /**
     * - [Go: string]
     */
    from_rec: string;
    /**
     * - [Go: string]
     */
    qt_events: string;
};
export type sdkFuncProductRelevanceFashionDashFunnelPartitions = {
    /**
     * - [Go: string]
     */
    store_id: string;
};
export type sdkFuncProductRelevanceFashionDashFunnelReq = {
    input: sdkFuncProductRelevanceFashionDashFunnelInput;
    partitions: sdkFuncProductRelevanceFashionDashFunnelPartitions;
};
export type sdkFuncProductRelevanceFashionDashFunnelResp = {
    output: sdkFuncProductRelevanceFashionDashFunnelOutput;
};
export type sdkFuncProductRelevanceFashionFbtInput = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    skus: Array<sdkFuncProductRelevanceFashionFbtInputSkusElement>;
};
export type sdkFuncProductRelevanceFashionFbtInputSkusElement = {
    /**
     * - [Go: string]
     */
    sku_id: string;
};
export type sdkFuncProductRelevanceFashionFbtOutput = {
    results: Array<sdkFuncProductRelevanceFashionFbtOutputResultsElement>;
};
export type sdkFuncProductRelevanceFashionFbtOutputResultsElement = {
    /**
     * - [Go: float64]
     */
    rating: number;
    skus: Array<sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElement>;
};
export type sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElement = {
    /**
     * - [Go: string]
     */
    sku_id: string;
};
export type sdkFuncProductRelevanceFashionFbtPartitions = {
    /**
     * - [Go: string]
     */
    store_id: string;
};
export type sdkFuncProductRelevanceFashionFbtReq = {
    input: sdkFuncProductRelevanceFashionFbtInput;
    partitions: sdkFuncProductRelevanceFashionFbtPartitions;
};
export type sdkFuncProductRelevanceFashionFbtResp = {
    output: sdkFuncProductRelevanceFashionFbtOutput;
};
/**
 * apiDszCreateIngestionToken params
 * @typedef {object} apiDszCreateIngestionTokenParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszCreateIngestionToken Request
 * @typedef {object} apiDszCreateIngestionTokenReq
 * @property {apiDszCreateIngestionTokenParams} params
 * @property {apiDszCreateIngestionTokenReqPayload} payload
 */
/**
 * apiDszCreateIngestionToken reqPayload
 * @typedef {object} apiDszCreateIngestionTokenReqPayload
 * @property {string} annotation - [Go: string]
 */
/**
 * apiDszCreateIngestionToken Response
 * @typedef {object} apiDszCreateIngestionTokenResp
 * @property {apiDszCreateIngestionTokenRespPayload} payload
 */
/**
 * [Go: dsztoken.DatasetToken] apiDszCreateIngestionToken respPayload
 * @typedef {object} apiDszCreateIngestionTokenRespPayload
 * @property {string} id - [Go: string]
 * @property {string} jti - [Go: string]
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {string} annotation - [Go: string]
 * @property {number} expiration_date - [Go: int64]
 * @property {string} audience - [Go: string]
 * @property {Array<string>} grants - [Go: []string]
 * @property {string} channel - [Go: string]
 * @property {string} token - [Go: string]
 */
/**
 * apiDszCreateRecsysToken params
 * @typedef {object} apiDszCreateRecsysTokenParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszCreateRecsysToken Request
 * @typedef {object} apiDszCreateRecsysTokenReq
 * @property {apiDszCreateRecsysTokenParams} params
 * @property {apiDszCreateRecsysTokenReqPayload} payload
 */
/**
 * apiDszCreateRecsysToken reqPayload
 * @typedef {object} apiDszCreateRecsysTokenReqPayload
 * @property {string} annotation - [Go: string]
 * @property {string} channel - [Go: string]
 */
/**
 * apiDszCreateRecsysToken Response
 * @typedef {object} apiDszCreateRecsysTokenResp
 * @property {apiDszCreateRecsysTokenRespPayload} payload
 */
/**
 * [Go: dsztoken.DatasetToken] apiDszCreateRecsysToken respPayload
 * @typedef {object} apiDszCreateRecsysTokenRespPayload
 * @property {string} id - [Go: string]
 * @property {string} jti - [Go: string]
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {string} annotation - [Go: string]
 * @property {number} expiration_date - [Go: int64]
 * @property {string} audience - [Go: string]
 * @property {Array<string>} grants - [Go: []string]
 * @property {string} channel - [Go: string]
 * @property {string} token - [Go: string]
 */
/**
 * apiDszCreateStore params
 * @typedef {object} apiDszCreateStoreParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszCreateStore Request
 * @typedef {object} apiDszCreateStoreReq
 * @property {apiDszCreateStoreParams} params
 * @property {apiDszCreateStoreReqPayload} payload
 */
/**
 * apiDszCreateStore reqPayload
 * @typedef {object} apiDszCreateStoreReqPayload
 * @property {apiDszCreateStoreReqPayloadStoreId} store_id - [Go: dszstore.DszStore]
 */
/**
 * [Go: dszstore.DszStore]
 * @typedef {object} apiDszCreateStoreReqPayloadStoreId
 * @property {string} id - [Go: string]
 * @property {string} name - [Go: string]
 */
/**
 * apiDszCreateStore Response
 * @typedef {object} apiDszCreateStoreResp
 */
/**
 * apiDszDatasetSolutions params
 * @typedef {object} apiDszDatasetSolutionsParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszDatasetSolutions Request
 * @typedef {object} apiDszDatasetSolutionsReq
 * @property {apiDszDatasetSolutionsParams} params
 */
/**
 * apiDszDatasetSolutions Response
 * @typedef {object} apiDszDatasetSolutionsResp
 * @property {apiDszDatasetSolutionsRespPayload} payload
 */
/**
 * apiDszDatasetSolutions respPayload
 * @typedef {object} apiDszDatasetSolutionsRespPayload
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {Array<apiDszDatasetSolutionsRespPayloadSolutionsElement>} solutions
 */
/**
 * [Go: solution.Solution]
 * @typedef {string} apiDszDatasetSolutionsRespPayloadSolutionsElement
 */
/**
 * apiDszDeleteToken params
 * @typedef {object} apiDszDeleteTokenParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszDeleteToken query
 * @typedef {object} apiDszDeleteTokenQuery
 * @property {string} token - [Go: string]
 */
/**
 * apiDszDeleteToken Request
 * @typedef {object} apiDszDeleteTokenReq
 * @property {apiDszDeleteTokenParams} params
 * @property {apiDszDeleteTokenQuery} query
 */
/**
 * apiDszDeleteToken Response
 * @typedef {object} apiDszDeleteTokenResp
 */
/**
 * apiDszDomainGet params
 * @typedef {object} apiDszDomainGetParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszDomainGet query
 * @typedef {object} apiDszDomainGetQuery
 * @property {string} store_id - [Go: string]
 */
/**
 * apiDszDomainGet Request
 * @typedef {object} apiDszDomainGetReq
 * @property {apiDszDomainGetParams} params
 * @property {apiDszDomainGetQuery} query
 */
/**
 * apiDszDomainGet Response
 * @typedef {object} apiDszDomainGetResp
 * @property {apiDszDomainGetRespPayload} payload
 */
/**
 * apiDszDomainGet respPayload
 * @typedef {object} apiDszDomainGetRespPayload
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {Array<apiDszDomainGetRespPayloadSolutionsElement>} solutions
 * @property {string} store_id - [Go: string]
 */
/**
 * [Go: dszapidomainsolutionget.SolutionDomain]
 * @typedef {object} apiDszDomainGetRespPayloadSolutionsElement
 * @property {string} solution - [Go: solution.Solution]
 * @property {string} domain - [Go: domain.Domain]
 */
/**
 * apiDszDomainSelect params
 * @typedef {object} apiDszDomainSelectParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszDomainSelect Request
 * @typedef {object} apiDszDomainSelectReq
 * @property {apiDszDomainSelectParams} params
 * @property {apiDszDomainSelectReqPayload} payload
 */
/**
 * apiDszDomainSelect reqPayload
 * @typedef {object} apiDszDomainSelectReqPayload
 * @property {string} domain - [Go: domain.Domain]
 * @property {string} solution - [Go: solution.Solution]
 * @property {string} store_id - [Go: string]
 */
/**
 * apiDszDomainSelect Response
 * @typedef {object} apiDszDomainSelectResp
 */
/**
 * apiDszGetPaymentStatus query
 * @typedef {object} apiDszGetPaymentStatusQuery
 * @property {string} dataset - [Go: lakedsz.Dataset] Id of the dataset that is waiting for the payment
 * @property {string} user - [Go: string] User that is buying
 */
/**
 * apiDszGetPaymentStatus Request
 * @typedef {object} apiDszGetPaymentStatusReq
 * @property {apiDszGetPaymentStatusQuery} query
 */
/**
 * apiDszGetPaymentStatus Response
 * @typedef {object} apiDszGetPaymentStatusResp
 * @property {apiDszGetPaymentStatusRespPayload} payload
 */
/**
 * apiDszGetPaymentStatus respPayload
 * @typedef {object} apiDszGetPaymentStatusRespPayload
 * @property {string} dataset - [Go: string] Id of the dataset
 * @property {string} dataset_name - [Go: string] Name of the dataset
 * @property {string} payment_id - [Go: string] Id of the payment on the payment provider
 * @property {string} payment_status - [Go: string] paid, expired, open or unpaid. Only open and unpaid payments are still pending
 * @property {string} payment_type - [Go: string] Payment provider
 * @property {string} user_id - [Go: string] User that is buying
 */
/**
 * apiDszListDatasets query
 * @typedef {object} apiDszListDatasetsQuery
 * @property {string} user - [Go: string]
 */
/**
 * apiDszListDatasets Request
 * @typedef {object} apiDszListDatasetsReq
 * @property {apiDszListDatasetsQuery} query
 */
/**
 * apiDszListDatasets Response
 * @typedef {object} apiDszListDatasetsResp
 * @property {apiDszListDatasetsRespPayload} payload
 */
/**
 * apiDszListDatasets respPayload
 * @typedef {object} apiDszListDatasetsRespPayload
 * @property {Array<apiDszListDatasetsRespPayloadDatasetsElement>} datasets
 */
/**
 * @typedef {object} apiDszListDatasetsRespPayloadDatasetsElement
 * @property {Array<apiDszListDatasetsRespPayloadDatasetsElementGrantsElement>} grants
 * @property {string} id - [Go: string]
 * @property {string} name - [Go: string]
 */
/**
 * [Go: string]
 * @typedef {string} apiDszListDatasetsRespPayloadDatasetsElementGrantsElement
 */
/**
 * apiDszListIngestionTokens params
 * @typedef {object} apiDszListIngestionTokensParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszListIngestionTokens Request
 * @typedef {object} apiDszListIngestionTokensReq
 * @property {apiDszListIngestionTokensParams} params
 */
/**
 * apiDszListIngestionTokens Response
 * @typedef {object} apiDszListIngestionTokensResp
 * @property {apiDszListIngestionTokensRespPayload} payload
 */
/**
 * [Go: dszapiingestiontokenslist.DszListIngestionTokensResp] apiDszListIngestionTokens respPayload
 * @typedef {object} apiDszListIngestionTokensRespPayload
 */
/**
 * apiDszListPendingPayments query
 * @typedef {object} apiDszListPendingPaymentsQuery
 * @property {string} user - [Go: string] User that is buying
 */
/**
 * apiDszListPendingPayments Request
 * @typedef {object} apiDszListPendingPaymentsReq
 * @property {apiDszListPendingPaymentsQuery} query
 */
/**
 * apiDszListPendingPayments Response
 * @typedef {object} apiDszListPendingPaymentsResp
 * @property {apiDszListPendingPaymentsRespPayload} payload
 */
/**
 * apiDszListPendingPayments respPayload
 * @typedef {object} apiDszListPendingPaymentsRespPayload
 * @property {Array<apiDszListPendingPaymentsRespPayloadPendingPaymentsElement>} pending_payments - Datasets waiting for a payment
 */
/**
 * @typedef {object} apiDszListPendingPaymentsRespPayloadPendingPaymentsElement
 * @property {string} dataset - [Go: lakedsz.Dataset] Id of the dataset that is going to be created after the payment
 */
/**
 * apiDszListRecsysTokens params
 * @typedef {object} apiDszListRecsysTokensParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszListRecsysTokens Request
 * @typedef {object} apiDszListRecsysTokensReq
 * @property {apiDszListRecsysTokensParams} params
 */
/**
 * apiDszListRecsysTokens Response
 * @typedef {object} apiDszListRecsysTokensResp
 * @property {apiDszListRecsysTokensRespPayload} payload
 */
/**
 * [Go: dszapirecsystokenslist.DszListRecsysTokensResp] apiDszListRecsysTokens respPayload
 * @typedef {object} apiDszListRecsysTokensRespPayload
 */
/**
 * apiDszListStores params
 * @typedef {object} apiDszListStoresParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszListStores Request
 * @typedef {object} apiDszListStoresReq
 * @property {apiDszListStoresParams} params
 */
/**
 * apiDszListStores Response
 * @typedef {object} apiDszListStoresResp
 * @property {apiDszListStoresRespPayload} payload
 */
/**
 * apiDszListStores respPayload
 * @typedef {object} apiDszListStoresRespPayload
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {Array<apiDszListStoresRespPayloadStoresElement>} stores
 */
/**
 * [Go: dszstore.DszStore]
 * @typedef {object} apiDszListStoresRespPayloadStoresElement
 * @property {string} id - [Go: string]
 * @property {string} name - [Go: string]
 */
/**
 * apiDszModelGet params
 * @typedef {object} apiDszModelGetParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset to generate signed URLs for.
 * @property {string} model_name - [Go: string] Model name
 */
/**
 * apiDszModelGet Request
 * @typedef {object} apiDszModelGetReq
 * @property {apiDszModelGetParams} params
 * @property {apiDszModelGetReqPayload} payload
 */
/**
 * apiDszModelGet reqPayload
 * @typedef {object} apiDszModelGetReqPayload
 * @property {Record<apiDszModelGetReqPayloadModelPartitionsKey, apiDszModelGetReqPayloadModelPartitionsValue>} model_partitions - Model partition key/value pairs
 * @property {string} model_version - [Go: string] Model version
 */
/**
 * [Go: string]
 * @typedef {string} apiDszModelGetReqPayloadModelPartitionsKey
 */
/**
 * [Go: string]
 * @typedef {string} apiDszModelGetReqPayloadModelPartitionsValue
 */
/**
 * apiDszModelGet Response
 * @typedef {object} apiDszModelGetResp
 * @property {apiDszModelGetRespPayload} payload
 */
/**
 * apiDszModelGet respPayload
 * @typedef {object} apiDszModelGetRespPayload
 * @property {Array<apiDszModelGetRespPayloadUrlsElement>} urls - Signed URLs
 */
/**
 * @typedef {object} apiDszModelGetRespPayloadUrlsElement
 * @property {string} name - [Go: string] File Name
 * @property {string} url - [Go: string] signed URL.
 */
/**
 * apiDszSignedUrl params
 * @typedef {object} apiDszSignedUrlParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset to generate signed URLs for.
 */
/**
 * apiDszSignedUrl Request
 * @typedef {object} apiDszSignedUrlReq
 * @property {apiDszSignedUrlParams} params
 * @property {apiDszSignedUrlReqPayload} payload
 */
/**
 * apiDszSignedUrl reqPayload
 * @typedef {object} apiDszSignedUrlReqPayload
 * @property {Array<apiDszSignedUrlReqPayloadPathsElement>} paths - List of paths and HTTP methods to generate signed URLs for.
 */
/**
 * Path and HTTP method specification for a signed URL.
 * @typedef {object} apiDszSignedUrlReqPayloadPathsElement
 * @property {string} method - [Go: fszsignmethod.SignMethod] HTTP method (e.g. GET, PUT) for the signed URL.
 * @property {string} path - [Go: laketbpathz.Path] File path within the dataset.
 */
/**
 * apiDszSignedUrl Response
 * @typedef {object} apiDszSignedUrlResp
 * @property {apiDszSignedUrlRespPayload} payload
 */
/**
 * apiDszSignedUrl respPayload
 * @typedef {object} apiDszSignedUrlRespPayload
 * @property {Array<apiDszSignedUrlRespPayloadUrlsElement>} urls - Signed URLs
 */
/**
 * @typedef {object} apiDszSignedUrlRespPayloadUrlsElement
 * @property {string} url - [Go: string] signed URL.
 */
/**
 * apiDszStripeCheckout Request
 * @typedef {object} apiDszStripeCheckoutReq
 * @property {apiDszStripeCheckoutReqPayload} payload
 */
/**
 * apiDszStripeCheckout reqPayload
 * @typedef {object} apiDszStripeCheckoutReqPayload
 * @property {string} cancel_url - [Go: string] Url to go after a canceled checkout
 * @property {string} cnpj_hub - [Go: string]
 * @property {string} contract_version - [Go: string]
 * @property {string} customer_email - [Go: string] Customer email
 * @property {string} dataset_name - [Go: string] Dataset name
 * @property {string} id_campanha_hub - [Go: string]
 * @property {string} id_solution_hub - [Go: string]
 * @property {Array<apiDszStripeCheckoutReqPayloadLineItemsElement>} line_items - Items being bought
 * @property {string} responsible_email_hub - [Go: string]
 * @property {string} responsible_name_hub - [Go: string]
 * @property {number} subscription_data_trial_period_days - [Go: int] Trial period in days
 * @property {string} success_url - [Go: string] Url to go after a successful checkout
 * @property {string} terms_accepted_at - [Go: string]
 * @property {string} terms_version - [Go: string]
 * @property {string} user - [Go: string] User that is buying
 */
/**
 * @typedef {object} apiDszStripeCheckoutReqPayloadLineItemsElement
 * @property {string} price - [Go: string] Price id
 * @property {number} quantity - [Go: int] Quantity
 */
/**
 * apiDszStripeCheckout Response
 * @typedef {object} apiDszStripeCheckoutResp
 * @property {apiDszStripeCheckoutRespPayload} payload
 */
/**
 * apiDszStripeCheckout respPayload
 * @typedef {object} apiDszStripeCheckoutRespPayload
 * @property {string} id - [Go: string] Checkout session id
 * @property {string} url - [Go: string] Checkout session url
 */
/**
 * apiDszTableGet params
 * @typedef {object} apiDszTableGetParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset.
 * @property {string} path - [Go: string] Path to the file without schema.
 */
/**
 * apiDszTableGet Request
 * @typedef {object} apiDszTableGetReq
 * @property {apiDszTableGetParams} params
 */
/**
 * apiDszTableGet Response
 * @typedef {object} apiDszTableGetResp
 * @property {apiDszTableGetRespHeaders} headers
 */
/**
 * apiDszTableGet respHeaders
 * @typedef {object} apiDszTableGetRespHeaders
 * @property {string} location - [Go: string] Redirect URL for the file.
 */
/**
 * apiDszTableList params
 * @typedef {object} apiDszTableListParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset to list tables from.
 */
/**
 * apiDszTableList query
 * @typedef {object} apiDszTableListQuery
 * @property {string} from_cursor - [Go: string] Pagination cursor.
 * @property {number} limist - [Go: int] Limit the number of results.
 * @property {string} path - [Go: laketbpathz.Path] Path to list.
 * @property {boolean} recursive - [Go: bool] Whether to list recursively.
 * @property {string} sign_method - [Go: fszsignmethod.SignMethod] Whether to return signed URLs.
 * @property {boolean} stat - [Go: bool] Whether to include file stats.
 */
/**
 * apiDszTableList Request
 * @typedef {object} apiDszTableListReq
 * @property {apiDszTableListParams} params
 * @property {apiDszTableListQuery} query
 */
/**
 * apiDszTableList Response
 * @typedef {object} apiDszTableListResp
 * @property {apiDszTableListRespPayload} payload
 */
/**
 * apiDszTableList respPayload
 * @typedef {object} apiDszTableListRespPayload
 * @property {Array<apiDszTableListRespPayloadFilesElement>} files
 * @property {string} next_cursor - [Go: string] Cursor for the next page of results.
 */
/**
 * File entry
 * @typedef {object} apiDszTableListRespPayloadFilesElement
 * @property {string} path - [Go: laketbpathz.Path] write it
 * @property {string} signed_url - [Go: string] write it
 * @property {dszFileStat} stat - [Go: fsz.FileStat] write it
 */
/**
 * apiIngestzGetUrl params
 * @typedef {object} apiIngestzGetUrlParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset that receives the uploaded files.
 */
/**
 * apiIngestzGetUrl Request
 * @typedef {object} apiIngestzGetUrlReq
 * @property {apiIngestzGetUrlParams} params
 * @property {apiIngestzGetUrlReqPayload} payload
 */
/**
 * apiIngestzGetUrl reqPayload
 * @typedef {object} apiIngestzGetUrlReqPayload
 * @property {number} amount - [Go: int] Number of presigned upload URLs to generate.
 * @property {Record<apiIngestzGetUrlReqPayloadPartitionsKey, apiIngestzGetUrlReqPayloadPartitionsValue>} partitions - Partition key/value pairs that select the table partition the files are ingested into.
 * @property {string} table - [Go: laketbnamez.TableName] Name of the table, inside the dataset, that receives the uploaded files.
 */
/**
 * [Go: string]
 * @typedef {string} apiIngestzGetUrlReqPayloadPartitionsKey
 */
/**
 * [Go: string]
 * @typedef {string} apiIngestzGetUrlReqPayloadPartitionsValue
 */
/**
 * apiIngestzGetUrl Response
 * @typedef {object} apiIngestzGetUrlResp
 * @property {apiIngestzGetUrlRespPayload} payload
 */
/**
 * apiIngestzGetUrl respPayload
 * @typedef {object} apiIngestzGetUrlRespPayload
 * @property {string} ingest_id - [Go: string] Ingestion token that identifies this ingestion and ties the uploaded files together.
 * @property {Array<apiIngestzGetUrlRespPayloadUploadsElement>} uploads - Presigned PUT URLs, one per requested file; upload each file to its URL.
 */
/**
 * [Go: string]
 * @typedef {string} apiIngestzGetUrlRespPayloadUploadsElement
 */
/**
 * apiIngestzLastBatchSummary params
 * @typedef {object} apiIngestzLastBatchSummaryParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset that receives the uploaded files.
 */
/**
 * apiIngestzLastBatchSummary query
 * @typedef {object} apiIngestzLastBatchSummaryQuery
 * @property {string} store_id - [Go: string] Store ID associated with the ingestion.
 * @property {string} table - [Go: laketbnamez.TableName] Name of the table inside the dataset.
 */
/**
 * apiIngestzLastBatchSummary Request
 * @typedef {object} apiIngestzLastBatchSummaryReq
 * @property {apiIngestzLastBatchSummaryParams} params
 * @property {apiIngestzLastBatchSummaryQuery} query
 */
/**
 * apiIngestzLastBatchSummary Response
 * @typedef {object} apiIngestzLastBatchSummaryResp
 * @property {apiIngestzLastBatchSummaryRespPayload} payload
 */
/**
 * apiIngestzLastBatchSummary respPayload
 * @typedef {object} apiIngestzLastBatchSummaryRespPayload
 * @property {Array<apiIngestzLastBatchSummaryRespPayloadColumnSummariesElement>} column_summaries - Summaries of distinct and null counts per column.
 * @property {string} ingested_at - [Go: string] Timestamp when the batch was successfully ingested.
 * @property {number} row_count - [Go: int] Total number of successfully ingested rows.
 * @property {string} store_id - [Go: string] Store ID associated with the ingestion.
 */
/**
 * @typedef {object} apiIngestzLastBatchSummaryRespPayloadColumnSummariesElement
 * @property {string} column_name - [Go: string] Name of the column.
 * @property {number} distinct_count - [Go: int] Number of distinct values in the column.
 * @property {number} null_count - [Go: int] Number of null values in the column.
 */
/**
 * apiIngestzStreamRelevanceFashionCatalog params
 * @typedef {object} apiIngestzStreamRelevanceFashionCatalogParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset that receives the stream data.
 */
/**
 * apiIngestzStreamRelevanceFashionCatalog Request
 * @typedef {object} apiIngestzStreamRelevanceFashionCatalogReq
 * @property {apiIngestzStreamRelevanceFashionCatalogParams} params
 * @property {apiIngestzStreamRelevanceFashionCatalogReqPayload} payload
 */
/**
 * apiIngestzStreamRelevanceFashionCatalog reqPayload
 * @typedef {object} apiIngestzStreamRelevanceFashionCatalogReqPayload
 * @property {Array<apiIngestzStreamRelevanceFashionCatalogReqPayloadDataElement>} data - Generic stream data to ingest.
 */
/**
 * @typedef {object} apiIngestzStreamRelevanceFashionCatalogReqPayloadDataElement
 * @property {string} id - [Go: string]
 * @property {boolean} inactive - [Go: bool]
 * @property {string} product_id - [Go: string]
 * @property {string} sku_ds - [Go: string]
 * @property {string} sku_id - [Go: string]
 * @property {string} store_id - [Go: string]
 */
/**
 * apiIngestzStreamRelevanceFashionCatalog Response
 * @typedef {object} apiIngestzStreamRelevanceFashionCatalogResp
 */
/**
 * apiIngestzStreamRelevanceFashionEvent params
 * @typedef {object} apiIngestzStreamRelevanceFashionEventParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset that receives the stream data.
 */
/**
 * apiIngestzStreamRelevanceFashionEvent Request
 * @typedef {object} apiIngestzStreamRelevanceFashionEventReq
 * @property {apiIngestzStreamRelevanceFashionEventParams} params
 * @property {apiIngestzStreamRelevanceFashionEventReqPayload} payload
 */
/**
 * apiIngestzStreamRelevanceFashionEvent reqPayload
 * @typedef {object} apiIngestzStreamRelevanceFashionEventReqPayload
 * @property {Array<apiIngestzStreamRelevanceFashionEventReqPayloadDataElement>} data - Generic stream data to ingest.
 */
/**
 * @typedef {object} apiIngestzStreamRelevanceFashionEventReqPayloadDataElement
 * @property {apiIngestzStreamRelevanceFashionEventReqPayloadDataElementAddToCart} add_to_cart
 * @property {apiIngestzStreamRelevanceFashionEventReqPayloadDataElementClick} click
 * @property {dszTime} created_at - [Go: time.Time]
 * @property {string} id - [Go: string]
 * @property {string} ingested_at - [Go: string]
 * @property {apiIngestzStreamRelevanceFashionEventReqPayloadDataElementPurchase} purchase
 * @property {apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRecraw} recraw
 * @property {apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRecshow} recshow
 * @property {apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRemoveFromCart} remove_from_cart
 * @property {apiIngestzStreamRelevanceFashionEventReqPayloadDataElementSearch} search
 * @property {string} session_id - [Go: string]
 * @property {string} store_id - [Go: string]
 * @property {string} user_id - [Go: string]
 */
/**
 * @typedef {object} apiIngestzStreamRelevanceFashionEventReqPayloadDataElementAddToCart
 * @property {number} price - [Go: float64]
 * @property {string} sku_id - [Go: string]
 */
/**
 * @typedef {object} apiIngestzStreamRelevanceFashionEventReqPayloadDataElementClick
 * @property {number} price - [Go: float64]
 * @property {string} sku_id - [Go: string]
 */
/**
 * @typedef {object} apiIngestzStreamRelevanceFashionEventReqPayloadDataElementPurchase
 * @property {string} order_id - [Go: string]
 * @property {Array<apiIngestzStreamRelevanceFashionEventReqPayloadDataElementPurchaseSkusElement>} skus
 */
/**
 * @typedef {object} apiIngestzStreamRelevanceFashionEventReqPayloadDataElementPurchaseSkusElement
 * @property {number} qtty - [Go: int64]
 * @property {string} sku_id - [Go: string]
 * @property {number} unit_price - [Go: float64]
 */
/**
 * @typedef {object} apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRecraw
 * @property {string} model_id - [Go: string]
 * @property {string} payload - [Go: string]
 * @property {string} rec_id - [Go: string]
 */
/**
 * @typedef {object} apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRecshow
 * @property {string} payload - [Go: string]
 * @property {string} rec_id - [Go: string]
 */
/**
 * @typedef {object} apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRemoveFromCart
 * @property {number} price - [Go: float64]
 * @property {string} sku_id - [Go: string]
 */
/**
 * @typedef {object} apiIngestzStreamRelevanceFashionEventReqPayloadDataElementSearch
 * @property {string} text - [Go: string]
 */
/**
 * apiIngestzStreamRelevanceFashionEvent Response
 * @typedef {object} apiIngestzStreamRelevanceFashionEventResp
 */
/**
 * apiPipezGet params
 * @typedef {object} apiPipezGetParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {string} id - [Go: string]
 */
/**
 * apiPipezGet Request
 * @typedef {object} apiPipezGetReq
 * @property {apiPipezGetParams} params
 */
/**
 * apiPipezGet Response
 * @typedef {object} apiPipezGetResp
 * @property {apiPipezGetRespPayload} payload
 */
/**
 * apiPipezGet respPayload
 * @typedef {object} apiPipezGetRespPayload
 * @property {apiPipezGetRespPayloadPipeline} pipeline
 */
/**
 * @typedef {object} apiPipezGetRespPayloadPipeline
 * @property {string} concurrent_id - [Go: string]
 * @property {string} dataset - [Go: string]
 * @property {string} id - [Go: string]
 * @property {string} name - [Go: string]
 * @property {string} solution_domain - [Go: solutiondomain.SolutionDomain]
 * @property {Array<apiPipezGetRespPayloadPipelineStatesElement>} states
 */
/**
 * @typedef {object} apiPipezGetRespPayloadPipelineStatesElement
 * @property {string} created_at - [Go: string]
 * @property {Record<apiPipezGetRespPayloadPipelineStatesElementParamsKey, apiPipezGetRespPayloadPipelineStatesElementParamsValue>} params
 * @property {string} status - [Go: string]
 */
/**
 * [Go: string]
 * @typedef {string} apiPipezGetRespPayloadPipelineStatesElementParamsKey
 */
/**
 * [Go: any]
 * @typedef {any} apiPipezGetRespPayloadPipelineStatesElementParamsValue
 */
/**
 * apiPipezList params
 * @typedef {object} apiPipezListParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiPipezList query
 * @typedef {object} apiPipezListQuery
 * @property {string} cursor - [Go: string]
 * @property {number} limit - [Go: int]
 * @property {string} name - [Go: string]
 * @property {string} solution_domain - [Go: solutiondomain.SolutionDomain]
 * @property {string} status - [Go: string]
 */
/**
 * apiPipezList Request
 * @typedef {object} apiPipezListReq
 * @property {apiPipezListParams} params
 * @property {apiPipezListQuery} query
 */
/**
 * apiPipezList Response
 * @typedef {object} apiPipezListResp
 * @property {apiPipezListRespPayload} payload
 */
/**
 * [Go: pipezlist.PipezListResp] apiPipezList respPayload
 * @typedef {object} apiPipezListRespPayload
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionBatchIngest params
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionBatchIngestParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionBatchIngest Request
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReq
 * @property {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestParams} params
 * @property {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayload} payload
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionBatchIngest reqPayload
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayload
 * @property {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayloadParams} params
 */
/**
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReqPayloadParams
 * @property {string} ingest_id - [Go: string]
 * @property {string} table - [Go: laketbnamez.TableName]
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionBatchIngest Response
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionBatchIngestResp
 * @property {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestRespPayload} payload
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionBatchIngest respPayload
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionBatchIngestRespPayload
 * @property {string} id - [Go: string]
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionMain params
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionMainParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionMain Request
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionMainReq
 * @property {apiPipezStartRelevanceFashionRelevanceFashionMainParams} params
 * @property {apiPipezStartRelevanceFashionRelevanceFashionMainReqPayload} payload
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionMain reqPayload
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionMainReqPayload
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionMain Response
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionMainResp
 * @property {apiPipezStartRelevanceFashionRelevanceFashionMainRespPayload} payload
 */
/**
 * apiPipezStartRelevanceFashionRelevanceFashionMain respPayload
 * @typedef {object} apiPipezStartRelevanceFashionRelevanceFashionMainRespPayload
 * @property {string} id - [Go: string]
 */
/**
 * apiSampleFraction params
 * @typedef {object} apiSampleFractionParams
 * @property {number} denominator - [Go: float64] Fraction Denominator
 * @property {number} numerator - [Go: float64] Fraction Numerator
 */
/**
 * apiSampleFraction query
 * @typedef {object} apiSampleFractionQuery
 * @property {number} precision - [Go: int] Fraction max precision
 */
/**
 * apiSampleFraction Request
 * @typedef {object} apiSampleFractionReq
 * @property {apiSampleFractionParams} params
 * @property {apiSampleFractionQuery} query
 * @property {apiSampleFractionReqHeaders} headers
 * @property {apiSampleFractionReqPayload} payload
 */
/**
 * apiSampleFraction reqHeaders
 * @typedef {object} apiSampleFractionReqHeaders
 * @property {string} x_i6_trace_id - [Go: string] Sample of Trace Id
 */
/**
 * apiSampleFraction reqPayload
 * @typedef {object} apiSampleFractionReqPayload
 * @property {Array<apiSampleFractionReqPayloadMessagesElement>} messages
 * @property {string} reason - [Go: string] Sample reason of this fraction
 */
/**
 * message
 * @typedef {object} apiSampleFractionReqPayloadMessagesElement
 * @property {string} message - [Go: string] message string
 */
/**
 * apiSampleFraction Response
 * @typedef {object} apiSampleFractionResp
 * @property {apiSampleFractionRespHeaders} headers
 * @property {apiSampleFractionRespPayload} payload
 */
/**
 * apiSampleFraction respHeaders
 * @typedef {object} apiSampleFractionRespHeaders
 * @property {string} x_i6_trace_message - [Go: string] Sample of any trace message
 */
/**
 * apiSampleFraction respPayload
 * @typedef {object} apiSampleFractionRespPayload
 * @property {string} display - [Go: string] Human Fraction Representation
 * @property {Array<apiSampleFractionRespPayloadMessagesElement>} messages - Output Messages
 * @property {string} result - [Go: string] Fraction Result
 */
/**
 * [Go: string]
 * @typedef {string} apiSampleFractionRespPayloadMessagesElement
 */
/**
 * @typedef {object} dszFileStat
 * @property {string} url - missing summary
 * @property {string} content_type - missing summary
 * @property {string} md5 - missing summary
 * @property {string} size - missing summary
 * @property {string} etag - missing summary
 * @property {dszTime} created_at - missing summary
 * @property {dszTime} updated_at - missing summary
 */
/**
 * Missing Summary
 * @typedef {string} dszTime
 */
/**
 * sdkFuncProductRelevanceFashionDashAttachedRevenue input
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenueInput
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {sdkFuncProductRelevanceFashionDashAttachedRevenueInputParams} params
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenueInputParams
 * @property {string} max_year_month - [Go: string]
 * @property {string} min_year_month - [Go: string]
 */
/**
 * sdkFuncProductRelevanceFashionDashAttachedRevenue output
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenueOutput
 * @property {Array<sdkFuncProductRelevanceFashionDashAttachedRevenueOutputRowsElement>} rows
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenueOutputRowsElement
 * @property {number} attached_purchases - [Go: float64]
 * @property {number} attached_revenue - [Go: float64]
 * @property {number} attached_skus - [Go: float64]
 * @property {number} avg_ticket - [Go: float64]
 */
/**
 * sdkFuncProductRelevanceFashionDashAttachedRevenue partitions
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenuePartitions
 * @property {string} store_id - [Go: string]
 */
/**
 * sdkFuncProductRelevanceFashionDashAttachedRevenue Request
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenueReq
 * @property {sdkFuncProductRelevanceFashionDashAttachedRevenueInput} input
 * @property {sdkFuncProductRelevanceFashionDashAttachedRevenuePartitions} partitions
 */
/**
 * sdkFuncProductRelevanceFashionDashAttachedRevenue Response
 * @typedef {object} sdkFuncProductRelevanceFashionDashAttachedRevenueResp
 * @property {sdkFuncProductRelevanceFashionDashAttachedRevenueOutput} output
 */
/**
 * sdkFuncProductRelevanceFashionDashFunnel input
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelInput
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {sdkFuncProductRelevanceFashionDashFunnelInputParams} params
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelInputParams
 * @property {string} max_year_month - [Go: string]
 * @property {string} min_year_month - [Go: string]
 */
/**
 * sdkFuncProductRelevanceFashionDashFunnel output
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelOutput
 * @property {Array<sdkFuncProductRelevanceFashionDashFunnelOutputRowsElement>} rows
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelOutputRowsElement
 * @property {string} event_type - [Go: string]
 * @property {string} from_rec - [Go: string]
 * @property {string} qt_events - [Go: string]
 */
/**
 * sdkFuncProductRelevanceFashionDashFunnel partitions
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelPartitions
 * @property {string} store_id - [Go: string]
 */
/**
 * sdkFuncProductRelevanceFashionDashFunnel Request
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelReq
 * @property {sdkFuncProductRelevanceFashionDashFunnelInput} input
 * @property {sdkFuncProductRelevanceFashionDashFunnelPartitions} partitions
 */
/**
 * sdkFuncProductRelevanceFashionDashFunnel Response
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelResp
 * @property {sdkFuncProductRelevanceFashionDashFunnelOutput} output
 */
/**
 * sdkFuncProductRelevanceFashionFbt input
 * @typedef {object} sdkFuncProductRelevanceFashionFbtInput
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {Array<sdkFuncProductRelevanceFashionFbtInputSkusElement>} skus
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionFbtInputSkusElement
 * @property {string} sku_id - [Go: string]
 */
/**
 * sdkFuncProductRelevanceFashionFbt output
 * @typedef {object} sdkFuncProductRelevanceFashionFbtOutput
 * @property {Array<sdkFuncProductRelevanceFashionFbtOutputResultsElement>} results
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionFbtOutputResultsElement
 * @property {number} rating - [Go: float64]
 * @property {Array<sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElement>} skus
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElement
 * @property {string} sku_id - [Go: string]
 */
/**
 * sdkFuncProductRelevanceFashionFbt partitions
 * @typedef {object} sdkFuncProductRelevanceFashionFbtPartitions
 * @property {string} store_id - [Go: string]
 */
/**
 * sdkFuncProductRelevanceFashionFbt Request
 * @typedef {object} sdkFuncProductRelevanceFashionFbtReq
 * @property {sdkFuncProductRelevanceFashionFbtInput} input
 * @property {sdkFuncProductRelevanceFashionFbtPartitions} partitions
 */
/**
 * sdkFuncProductRelevanceFashionFbt Response
 * @typedef {object} sdkFuncProductRelevanceFashionFbtResp
 * @property {sdkFuncProductRelevanceFashionFbtOutput} output
 */
declare class Apis {
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs an Ingest client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     *
     *
     *
     *
     * @param {apiDszListIngestionTokensReq} req
     * @returns {Promise<apiDszListIngestionTokensResp>}
     */
    dszListIngestionTokens(req: apiDszListIngestionTokensReq): Promise<apiDszListIngestionTokensResp>;
    /**
     * Get Model Signed URLs
     *
     * Generates presigned URLs for accessing model files in the specified dataset.
     *
     * @param {apiDszModelGetReq} req
     * @returns {Promise<apiDszModelGetResp>}
     */
    dszModelGet(req: apiDszModelGetReq): Promise<apiDszModelGetResp>;
    /**
     * List Pending Payments
     *
     * Lists the datasets of a user that are waiting for a payment.
     *
     * @param {apiDszListPendingPaymentsReq} req
     * @returns {Promise<apiDszListPendingPaymentsResp>}
     */
    dszListPendingPayments(req: apiDszListPendingPaymentsReq): Promise<apiDszListPendingPaymentsResp>;
    /**
     * Stream Ingestion
     *
     * Ingests stream data into a target dataset table.
     *
     * @param {apiIngestzStreamRelevanceFashionEventReq} req
     * @returns {Promise<apiIngestzStreamRelevanceFashionEventResp>}
     */
    ingestzStreamRelevanceFashionEvent(req: apiIngestzStreamRelevanceFashionEventReq): Promise<apiIngestzStreamRelevanceFashionEventResp>;
    /**
     * Get Dataset Signed URLs
     *
     * Generates presigned URLs for accessing or mutating files in the specified dataset.
     *
     * @param {apiDszSignedUrlReq} req
     * @returns {Promise<apiDszSignedUrlResp>}
     */
    dszSignedUrl(req: apiDszSignedUrlReq): Promise<apiDszSignedUrlResp>;
    /**
     * List Dataset Tables
     *
     * Lists files and tables in the specified dataset.
     *
     * @param {apiDszTableListReq} req
     * @returns {Promise<apiDszTableListResp>}
     */
    dszTableList(req: apiDszTableListReq): Promise<apiDszTableListResp>;
    /**
     *
     *
     *
     *
     * @param {apiPipezStartRelevanceFashionRelevanceFashionMainReq} req
     * @returns {Promise<apiPipezStartRelevanceFashionRelevanceFashionMainResp>}
     */
    pipezStartRelevanceFashionRelevanceFashionMain(req: apiPipezStartRelevanceFashionRelevanceFashionMainReq): Promise<apiPipezStartRelevanceFashionRelevanceFashionMainResp>;
    /**
     *
     *
     *
     *
     * @param {apiPipezListReq} req
     * @returns {Promise<apiPipezListResp>}
     */
    pipezList(req: apiPipezListReq): Promise<apiPipezListResp>;
    /**
     *
     *
     *
     *
     * @param {apiDszCreateStoreReq} req
     * @returns {Promise<apiDszCreateStoreResp>}
     */
    dszCreateStore(req: apiDszCreateStoreReq): Promise<apiDszCreateStoreResp>;
    /**
     *
     *
     *
     *
     * @param {apiDszDatasetSolutionsReq} req
     * @returns {Promise<apiDszDatasetSolutionsResp>}
     */
    dszDatasetSolutions(req: apiDszDatasetSolutionsReq): Promise<apiDszDatasetSolutionsResp>;
    /**
     *
     *
     *
     *
     * @param {apiDszCreateIngestionTokenReq} req
     * @returns {Promise<apiDszCreateIngestionTokenResp>}
     */
    dszCreateIngestionToken(req: apiDszCreateIngestionTokenReq): Promise<apiDszCreateIngestionTokenResp>;
    /**
     * Get Last Successful Ingestion Data Summary
     *
     * Returns the date of ingestion, rows count and distinct and null columns count
     *
     * @param {apiIngestzLastBatchSummaryReq} req
     * @returns {Promise<apiIngestzLastBatchSummaryResp>}
     */
    ingestzLastBatchSummary(req: apiIngestzLastBatchSummaryReq): Promise<apiIngestzLastBatchSummaryResp>;
    /**
     *
     *
     *
     *
     * @param {apiDszDomainSelectReq} req
     * @returns {Promise<apiDszDomainSelectResp>}
     */
    dszDomainSelect(req: apiDszDomainSelectReq): Promise<apiDszDomainSelectResp>;
    /**
     *
     *
     *
     *
     * @param {apiDszListRecsysTokensReq} req
     * @returns {Promise<apiDszListRecsysTokensResp>}
     */
    dszListRecsysTokens(req: apiDszListRecsysTokensReq): Promise<apiDszListRecsysTokensResp>;
    /**
     *
     *
     *
     *
     * @param {apiDszCreateRecsysTokenReq} req
     * @returns {Promise<apiDszCreateRecsysTokenResp>}
     */
    dszCreateRecsysToken(req: apiDszCreateRecsysTokenReq): Promise<apiDszCreateRecsysTokenResp>;
    /**
     * Get Payment Status
     *
     * Checks the payment of a dataset. When it is paid the dataset is created and granted to the user.
     *
     * @param {apiDszGetPaymentStatusReq} req
     * @returns {Promise<apiDszGetPaymentStatusResp>}
     */
    dszGetPaymentStatus(req: apiDszGetPaymentStatusReq): Promise<apiDszGetPaymentStatusResp>;
    /**
     *
     *
     *
     *
     * @param {apiPipezGetReq} req
     * @returns {Promise<apiPipezGetResp>}
     */
    pipezGet(req: apiPipezGetReq): Promise<apiPipezGetResp>;
    /**
     *
     *
     *
     *
     * @param {apiDszDomainGetReq} req
     * @returns {Promise<apiDszDomainGetResp>}
     */
    dszDomainGet(req: apiDszDomainGetReq): Promise<apiDszDomainGetResp>;
    /**
     * Get Ingestion Upload URLs
     *
     * Generates presigned PUT URLs and an ingestion token for uploading files into a target dataset table and partitions.
     *
     * @param {apiIngestzGetUrlReq} req
     * @returns {Promise<apiIngestzGetUrlResp>}
     */
    ingestzGetUrl(req: apiIngestzGetUrlReq): Promise<apiIngestzGetUrlResp>;
    /**
     * Stream Ingestion
     *
     * Ingests stream data into a target dataset table.
     *
     * @param {apiIngestzStreamRelevanceFashionCatalogReq} req
     * @returns {Promise<apiIngestzStreamRelevanceFashionCatalogResp>}
     */
    ingestzStreamRelevanceFashionCatalog(req: apiIngestzStreamRelevanceFashionCatalogReq): Promise<apiIngestzStreamRelevanceFashionCatalogResp>;
    /**
     * Get Dataset Table File
     *
     * Get table file by redirecting to its signed URL.
     *
     * @param {apiDszTableGetReq} req
     * @returns {Promise<apiDszTableGetResp>}
     */
    dszTableGet(req: apiDszTableGetReq): Promise<apiDszTableGetResp>;
    /**
     *
     *
     *
     *
     * @param {apiDszDeleteTokenReq} req
     * @returns {Promise<apiDszDeleteTokenResp>}
     */
    dszDeleteToken(req: apiDszDeleteTokenReq): Promise<apiDszDeleteTokenResp>;
    /**
     * Create Stripe Checkout
     *
     * Creates a Stripe checkout session for a subscription and returns its id and url.
     *
     * @param {apiDszStripeCheckoutReq} req
     * @returns {Promise<apiDszStripeCheckoutResp>}
     */
    dszStripeCheckout(req: apiDszStripeCheckoutReq): Promise<apiDszStripeCheckoutResp>;
    /**
     * Sample Fraction
     *
     * Sample API that performs a fraction operation
     *
     * @param {apiSampleFractionReq} req
     * @returns {Promise<apiSampleFractionResp>}
     */
    sampleFraction(req: apiSampleFractionReq): Promise<apiSampleFractionResp>;
    /**
     *
     *
     *
     *
     * @param {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReq} req
     * @returns {Promise<apiPipezStartRelevanceFashionRelevanceFashionBatchIngestResp>}
     */
    pipezStartRelevanceFashionRelevanceFashionBatchIngest(req: apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReq): Promise<apiPipezStartRelevanceFashionRelevanceFashionBatchIngestResp>;
    /**
     *
     *
     *
     *
     * @param {apiDszListStoresReq} req
     * @returns {Promise<apiDszListStoresResp>}
     */
    dszListStores(req: apiDszListStoresReq): Promise<apiDszListStoresResp>;
    /**
     *
     *
     *
     *
     * @param {apiDszListDatasetsReq} req
     * @returns {Promise<apiDszListDatasetsResp>}
     */
    dszListDatasets(req: apiDszListDatasetsReq): Promise<apiDszListDatasetsResp>;
}
export { Apis };
declare class SdkFuncs {
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs an SdkFuncs instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * @param {sdkFuncProductRelevanceFashionDashAttachedRevenueReq} req
     * @returns {Promise<sdkFuncProductRelevanceFashionDashAttachedRevenueOutput>}
     */
    productRelevanceFashionDashAttachedRevenueV1(req: sdkFuncProductRelevanceFashionDashAttachedRevenueReq): Promise<sdkFuncProductRelevanceFashionDashAttachedRevenueOutput>;
    /**
     * @param {sdkFuncProductRelevanceFashionFbtReq} req
     * @returns {Promise<sdkFuncProductRelevanceFashionFbtOutput>}
     */
    productRelevanceFashionFbtV1(req: sdkFuncProductRelevanceFashionFbtReq): Promise<sdkFuncProductRelevanceFashionFbtOutput>;
    /**
     * @param {sdkFuncProductRelevanceFashionDashFunnelReq} req
     * @returns {Promise<sdkFuncProductRelevanceFashionDashFunnelOutput>}
     */
    productRelevanceFashionDashFunnelV1(req: sdkFuncProductRelevanceFashionDashFunnelReq): Promise<sdkFuncProductRelevanceFashionDashFunnelOutput>;
}
export { SdkFuncs };
