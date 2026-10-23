/**
 * @typedef {import("../services/services.js").Services} Services
 */
export type Services = import("../services/services.js").Services;
export type ServiceOptions = import("../invoker/invoker.js").ServiceOptions;
export type i6JsonEmbedded<T> = T;
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
    annotation: string;
    /**
     * - [Go: string]
     */
    audience: string;
    /**
     * - [Go: string]
     */
    channel: string;
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    /**
     * - [Go: int64]
     */
    expiration_date: number;
    grants: Array<apiDszCreateIngestionTokenRespPayloadGrantsElement>;
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: string]
     */
    jti: string;
    /**
     * - [Go: string]
     */
    token: string;
};
export type apiDszCreateIngestionTokenRespPayloadGrantsElement = string;
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
    annotation: string;
    /**
     * - [Go: string]
     */
    audience: string;
    /**
     * - [Go: string]
     */
    channel: string;
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    /**
     * - [Go: int64]
     */
    expiration_date: number;
    grants: Array<apiDszCreateRecsysTokenRespPayloadGrantsElement>;
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: string]
     */
    jti: string;
    /**
     * - [Go: string]
     */
    token: string;
};
export type apiDszCreateRecsysTokenRespPayloadGrantsElement = string;
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
    store: apiDszCreateStoreReqPayloadStore;
};
export type apiDszCreateStoreReqPayloadStore = {
    /**
     * - [Go: storeid.StoreId]
     */
    id: string;
    /**
     * - [Go: string]
     */
    name: string;
    solution_domains: Array<apiDszCreateStoreReqPayloadStoreSolutionDomainsElement>;
};
export type apiDszCreateStoreReqPayloadStoreSolutionDomainsElement = string;
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
export type apiDszListIngestionTokensRespPayload = {
    tokens: Array<apiDszListIngestionTokensRespPayloadTokensElement>;
};
export type apiDszListIngestionTokensRespPayloadTokensElement = {
    /**
     * - [Go: string]
     */
    annotation: string;
    /**
     * - [Go: string]
     */
    audience: string;
    /**
     * - [Go: string]
     */
    channel: string;
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    /**
     * - [Go: int64]
     */
    expiration_date: number;
    grants: Array<apiDszListIngestionTokensRespPayloadTokensElementGrantsElement>;
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: string]
     */
    jti: string;
    /**
     * - [Go: string]
     */
    token: string;
};
export type apiDszListIngestionTokensRespPayloadTokensElementGrantsElement = string;
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
export type apiDszListRecsysTokensRespPayload = {
    tokens: Array<apiDszListRecsysTokensRespPayloadTokensElement>;
};
export type apiDszListRecsysTokensRespPayloadTokensElement = {
    /**
     * - [Go: string]
     */
    annotation: string;
    /**
     * - [Go: string]
     */
    audience: string;
    /**
     * - [Go: string]
     */
    channel: string;
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    /**
     * - [Go: int64]
     */
    expiration_date: number;
    grants: Array<apiDszListRecsysTokensRespPayloadTokensElementGrantsElement>;
    /**
     * - [Go: string]
     */
    id: string;
    /**
     * - [Go: string]
     */
    jti: string;
    /**
     * - [Go: string]
     */
    token: string;
};
export type apiDszListRecsysTokensRespPayloadTokensElementGrantsElement = string;
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
     * - [Go: storeid.StoreId]
     */
    id: string;
    /**
     * - [Go: string]
     */
    name: string;
    solution_domains: Array<apiDszListStoresRespPayloadStoresElementSolutionDomainsElement>;
};
export type apiDszListStoresRespPayloadStoresElementSolutionDomainsElement = string;
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
export type apiDszResultRelevanceFashionCatalogParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset.
     */
    dataset: string;
};
export type apiDszResultRelevanceFashionCatalogQuery = {
    /**
     * - [Go: storeid.StoreId] Store ID to query.
     */
    store_id: string;
};
export type apiDszResultRelevanceFashionCatalogReq = {
    params: apiDszResultRelevanceFashionCatalogParams;
    query: apiDszResultRelevanceFashionCatalogQuery;
};
export type apiDszResultRelevanceFashionCatalogResp = {
    payload: apiDszResultRelevanceFashionCatalogRespPayload;
};
export type apiDszResultRelevanceFashionCatalogRespPayload = {
    /**
     * - Generic table data loaded from the datalake file.
     */
    data: Array<apiDszResultRelevanceFashionCatalogRespPayloadDataElement>;
};
export type apiDszResultRelevanceFashionCatalogRespPayloadDataElement = {
    /**
     * - [Go: string]
     */
    sku_ds: string;
    /**
     * - [Go: string]
     */
    sku_id: string;
    /**
     * - [Go: storeid.StoreId]
     */
    store_id: string;
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
export type apiDszStoreDisplayCreateParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszStoreDisplayCreateReq = {
    params: apiDszStoreDisplayCreateParams;
    payload: apiDszStoreDisplayCreateReqPayload;
};
export type apiDszStoreDisplayCreateReqPayload = {
    display: apiDszStoreDisplayCreateReqPayloadDisplay;
    /**
     * - [Go: storeid.StoreId]
     */
    store_id: string;
};
export type apiDszStoreDisplayCreateReqPayloadDisplay = {
    /**
     * - [Go: storedisplayid.StoreDisplayId]
     */
    id: string;
    /**
     * - [Go: string]
     */
    model_name: string;
    /**
     * - [Go: string]
     */
    name: string;
};
export type apiDszStoreDisplayCreateResp = {
    payload: apiDszStoreDisplayCreateRespPayload;
};
export type apiDszStoreDisplayCreateRespPayload = {
    display: apiDszStoreDisplayCreateRespPayloadDisplay;
};
export type apiDszStoreDisplayCreateRespPayloadDisplay = {
    /**
     * - [Go: storedisplayid.StoreDisplayId]
     */
    id: string;
    /**
     * - [Go: string]
     */
    name: string;
};
export type apiDszStoreDisplayListParams = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
};
export type apiDszStoreDisplayListQuery = {
    /**
     * - [Go: storeid.StoreId]
     */
    store_id: string;
};
export type apiDszStoreDisplayListReq = {
    params: apiDszStoreDisplayListParams;
    query: apiDszStoreDisplayListQuery;
};
export type apiDszStoreDisplayListResp = {
    payload: apiDszStoreDisplayListRespPayload;
};
export type apiDszStoreDisplayListRespPayload = {
    /**
     * - [Go: lakedsz.Dataset]
     */
    dataset: string;
    displays: Array<apiDszStoreDisplayListRespPayloadDisplaysElement>;
    /**
     * - [Go: storeid.StoreId]
     */
    store_id: string;
};
export type apiDszStoreDisplayListRespPayloadDisplaysElement = {
    /**
     * - [Go: storedisplayid.StoreDisplayId]
     */
    id: string;
    /**
     * - [Go: string]
     */
    name: string;
};
export type apiDszStripeCheckoutReq = {
    payload: apiDszStripeCheckoutReqPayload;
};
export type apiDszStripeCheckoutReqPayload = {
    /**
     * - [Go: string] Base64 state token with the trial days and the metadata of the checkout; the service parses it
     */
    campaign_state: string;
    /**
     * - [Go: string] Url to go after a canceled checkout
     */
    cancel_url: string;
    /**
     * - [Go: string] Dataset name
     */
    dataset_name: string;
    /**
     * - [Go: string] Document of the buyer
     */
    document: string;
    /**
     * - [Go: string] Email of the buyer used in Stripe
     */
    payment_email: string;
    /**
     * - [Go: string] Phone of the buyer
     */
    payment_phone: string;
    /**
     * - [Go: string] Lookup key of the Stripe price of the plan to buy; the service gets the price id from the Stripe prices api
     */
    plan: string;
    /**
     * - [Go: string] Url to go after a successful checkout
     */
    success_url: string;
};
export type apiDszStripeCheckoutResp = {
    payload: apiDszStripeCheckoutRespPayload;
};
export type apiDszStripeCheckoutRespPayload = {
    /**
     * - [Go: lakedsz.Dataset] Dataset that is going to be created after the payment; its id starts with ds
     */
    dataset: string;
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
export type apiIngestzEventRelevanceFashionCatalogParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset that receives the stream data.
     */
    dataset: string;
};
export type apiIngestzEventRelevanceFashionCatalogQuery = {
    payload: i6JsonEmbedded<apiIngestzEventRelevanceFashionCatalogQueryPayload>;
};
export type apiIngestzEventRelevanceFashionCatalogQueryPayload = {
    rows: Array<apiIngestzEventRelevanceFashionCatalogQueryPayloadRowsElement>;
};
export type apiIngestzEventRelevanceFashionCatalogQueryPayloadRowsElement = {
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
export type apiIngestzEventRelevanceFashionCatalogReq = {
    params: apiIngestzEventRelevanceFashionCatalogParams;
    query: apiIngestzEventRelevanceFashionCatalogQuery;
};
export type apiIngestzEventRelevanceFashionCatalogResp = {
    payload: apiIngestzEventRelevanceFashionCatalogRespPayload;
};
export type apiIngestzEventRelevanceFashionCatalogRespPayload = {
    /**
     * - [Go: int]
     */
    count: number;
};
export type apiIngestzEventRelevanceFashionEventParams = {
    /**
     * - [Go: lakedsz.Dataset] Name of the dataset that receives the stream data.
     */
    dataset: string;
};
export type apiIngestzEventRelevanceFashionEventQuery = {
    payload: i6JsonEmbedded<apiIngestzEventRelevanceFashionEventQueryPayload>;
};
export type apiIngestzEventRelevanceFashionEventQueryPayload = {
    rows: Array<apiIngestzEventRelevanceFashionEventQueryPayloadRowsElement>;
};
export type apiIngestzEventRelevanceFashionEventQueryPayloadRowsElement = {
    add_to_cart: apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementAddToCart;
    click: apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementClick;
    /**
     * - [Go: time.Time]
     */
    created_at: dszTime;
    /**
     * - [Go: bigquery.NullString]
     */
    display_id: string;
    /**
     * - [Go: string]
     */
    id: string;
    purchase: apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementPurchase;
    recraw: apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementRecraw;
    recshow: apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementRecshow;
    remove_from_cart: apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementRemoveFromCart;
    search: apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementSearch;
    /**
     * - [Go: string]
     */
    session_id: string;
    /**
     * - [Go: string]
     */
    store_id: string;
    /**
     * - [Go: bigquery.NullString]
     */
    user_id: string;
};
export type apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementAddToCart = {
    /**
     * - [Go: float64]
     */
    price: number;
    /**
     * - [Go: string]
     */
    sku_id: string;
};
export type apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementClick = {
    /**
     * - [Go: float64]
     */
    price: number;
    /**
     * - [Go: string]
     */
    sku_id: string;
};
export type apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementPurchase = {
    /**
     * - [Go: string]
     */
    order_id: string;
    skus: Array<apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementPurchaseSkusElement>;
};
export type apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementPurchaseSkusElement = {
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
export type apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementRecraw = {
    /**
     * - [Go: string]
     */
    model_id: string;
    /**
     * - [Go: string]
     */
    model_version: string;
    /**
     * - [Go: string]
     */
    payload: string;
    /**
     * - [Go: string]
     */
    rec_id: string;
};
export type apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementRecshow = {
    /**
     * - [Go: string]
     */
    model_id: string;
    /**
     * - [Go: string]
     */
    model_version: string;
    /**
     * - [Go: string]
     */
    payload: string;
    /**
     * - [Go: string]
     */
    rec_id: string;
};
export type apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementRemoveFromCart = {
    /**
     * - [Go: float64]
     */
    price: number;
    /**
     * - [Go: string]
     */
    sku_id: string;
};
export type apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementSearch = {
    /**
     * - [Go: string]
     */
    text: string;
};
export type apiIngestzEventRelevanceFashionEventReq = {
    params: apiIngestzEventRelevanceFashionEventParams;
    query: apiIngestzEventRelevanceFashionEventQuery;
};
export type apiIngestzEventRelevanceFashionEventResp = {
    payload: apiIngestzEventRelevanceFashionEventRespPayload;
};
export type apiIngestzEventRelevanceFashionEventRespPayload = {
    /**
     * - [Go: int]
     */
    count: number;
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
     * - [Go: storeid.StoreId] Store ID associated with the ingestion.
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
     * - [Go: storeid.StoreId] Store ID associated with the ingestion.
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
export type apiIngestzStreamRelevanceFashionCatalogResp = {
    payload: apiIngestzStreamRelevanceFashionCatalogRespPayload;
};
export type apiIngestzStreamRelevanceFashionCatalogRespPayload = {
    /**
     * - [Go: int]
     */
    count: number;
};
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
     * - [Go: bigquery.NullString]
     */
    display_id: string;
    /**
     * - [Go: string]
     */
    id: string;
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
     * - [Go: bigquery.NullString]
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
    model_version: string;
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
    model_id: string;
    /**
     * - [Go: string]
     */
    model_version: string;
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
export type apiIngestzStreamRelevanceFashionEventResp = {
    payload: apiIngestzStreamRelevanceFashionEventRespPayload;
};
export type apiIngestzStreamRelevanceFashionEventRespPayload = {
    /**
     * - [Go: int]
     */
    count: number;
};
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
export type apiPipezListRespPayload = {
    /**
     * - [Go: string]
     */
    cursor: string;
    pipelines: Array<apiPipezListRespPayloadPipelinesElement>;
};
export type apiPipezListRespPayloadPipelinesElement = {
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
    states: Array<apiPipezListRespPayloadPipelinesElementStatesElement>;
};
export type apiPipezListRespPayloadPipelinesElementStatesElement = {
    /**
     * - [Go: string]
     */
    created_at: string;
    params: Record<apiPipezListRespPayloadPipelinesElementStatesElementParamsKey, apiPipezListRespPayloadPipelinesElementStatesElementParamsValue>;
    /**
     * - [Go: string]
     */
    status: string;
};
export type apiPipezListRespPayloadPipelinesElementStatesElementParamsKey = string;
export type apiPipezListRespPayloadPipelinesElementStatesElementParamsValue = any;
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
    smsg: apiSampleFractionQuerySmsg;
};
export type apiSampleFractionQuerySmsg = {
    /**
     * - [Go: string] message string
     */
    message: string;
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
    x_i6_smsg: apiSampleFractionRespHeadersXI6Smsg;
    /**
     * - [Go: string] Sample of any trace message
     */
    x_i6_trace_message: string;
};
export type apiSampleFractionRespHeadersXI6Smsg = {
    /**
     * - [Go: string] message string
     */
    message: string;
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
export type sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElementEnriched = {
    /**
     * - Id of the sku. Required; the only field sent to i6 (in the recshow event)
     */
    sku_id: string;
    /**
     * - Model rating, higher is more relevant. The default selectResults sets the rating of the result the sku was picked from
     */
    rating: number;
    /**
     * - Optional: any data your selectResults attaches to the sku (e.g. name, price, image). Returned to you as is, never sent to i6. The default selectResults does not set it
     */
    enriched: any;
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
export type sdkFuncProductRelevanceFashionFbtSelected = {
    /**
     * - Skus to show, in the order selectResults returned them
     */
    results: Array<sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElementEnriched>;
};
/**
 * @typedef {import("../invoker/invoker.js").ServiceOptions} ServiceOptions
 */
/**
 * @template T
 * @typedef {T} i6JsonEmbedded
 */
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
 * apiDszCreateIngestionToken respPayload
 * @typedef {object} apiDszCreateIngestionTokenRespPayload
 * @property {string} annotation - [Go: string]
 * @property {string} audience - [Go: string]
 * @property {string} channel - [Go: string]
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {number} expiration_date - [Go: int64]
 * @property {Array<apiDszCreateIngestionTokenRespPayloadGrantsElement>} grants
 * @property {string} id - [Go: string]
 * @property {string} jti - [Go: string]
 * @property {string} token - [Go: string]
 */
/**
 * [Go: string]
 * @typedef {string} apiDszCreateIngestionTokenRespPayloadGrantsElement
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
 * apiDszCreateRecsysToken respPayload
 * @typedef {object} apiDszCreateRecsysTokenRespPayload
 * @property {string} annotation - [Go: string]
 * @property {string} audience - [Go: string]
 * @property {string} channel - [Go: string]
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {number} expiration_date - [Go: int64]
 * @property {Array<apiDszCreateRecsysTokenRespPayloadGrantsElement>} grants
 * @property {string} id - [Go: string]
 * @property {string} jti - [Go: string]
 * @property {string} token - [Go: string]
 */
/**
 * [Go: string]
 * @typedef {string} apiDszCreateRecsysTokenRespPayloadGrantsElement
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
 * @property {apiDszCreateStoreReqPayloadStore} store
 */
/**
 * @typedef {object} apiDszCreateStoreReqPayloadStore
 * @property {string} id - [Go: storeid.StoreId]
 * @property {string} name - [Go: string]
 * @property {Array<apiDszCreateStoreReqPayloadStoreSolutionDomainsElement>} solution_domains
 */
/**
 * [Go: solutiondomain.SolutionDomain]
 * @typedef {string} apiDszCreateStoreReqPayloadStoreSolutionDomainsElement
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
 * apiDszListIngestionTokens respPayload
 * @typedef {object} apiDszListIngestionTokensRespPayload
 * @property {Array<apiDszListIngestionTokensRespPayloadTokensElement>} tokens
 */
/**
 * @typedef {object} apiDszListIngestionTokensRespPayloadTokensElement
 * @property {string} annotation - [Go: string]
 * @property {string} audience - [Go: string]
 * @property {string} channel - [Go: string]
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {number} expiration_date - [Go: int64]
 * @property {Array<apiDszListIngestionTokensRespPayloadTokensElementGrantsElement>} grants
 * @property {string} id - [Go: string]
 * @property {string} jti - [Go: string]
 * @property {string} token - [Go: string]
 */
/**
 * [Go: string]
 * @typedef {string} apiDszListIngestionTokensRespPayloadTokensElementGrantsElement
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
 * apiDszListRecsysTokens respPayload
 * @typedef {object} apiDszListRecsysTokensRespPayload
 * @property {Array<apiDszListRecsysTokensRespPayloadTokensElement>} tokens
 */
/**
 * @typedef {object} apiDszListRecsysTokensRespPayloadTokensElement
 * @property {string} annotation - [Go: string]
 * @property {string} audience - [Go: string]
 * @property {string} channel - [Go: string]
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {number} expiration_date - [Go: int64]
 * @property {Array<apiDszListRecsysTokensRespPayloadTokensElementGrantsElement>} grants
 * @property {string} id - [Go: string]
 * @property {string} jti - [Go: string]
 * @property {string} token - [Go: string]
 */
/**
 * [Go: string]
 * @typedef {string} apiDszListRecsysTokensRespPayloadTokensElementGrantsElement
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
 * @typedef {object} apiDszListStoresRespPayloadStoresElement
 * @property {string} id - [Go: storeid.StoreId]
 * @property {string} name - [Go: string]
 * @property {Array<apiDszListStoresRespPayloadStoresElementSolutionDomainsElement>} solution_domains
 */
/**
 * [Go: solutiondomain.SolutionDomain]
 * @typedef {string} apiDszListStoresRespPayloadStoresElementSolutionDomainsElement
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
 * apiDszResultRelevanceFashionCatalog params
 * @typedef {object} apiDszResultRelevanceFashionCatalogParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset.
 */
/**
 * apiDszResultRelevanceFashionCatalog query
 * @typedef {object} apiDszResultRelevanceFashionCatalogQuery
 * @property {string} store_id - [Go: storeid.StoreId] Store ID to query.
 */
/**
 * apiDszResultRelevanceFashionCatalog Request
 * @typedef {object} apiDszResultRelevanceFashionCatalogReq
 * @property {apiDszResultRelevanceFashionCatalogParams} params
 * @property {apiDszResultRelevanceFashionCatalogQuery} query
 */
/**
 * apiDszResultRelevanceFashionCatalog Response
 * @typedef {object} apiDszResultRelevanceFashionCatalogResp
 * @property {apiDszResultRelevanceFashionCatalogRespPayload} payload
 */
/**
 * apiDszResultRelevanceFashionCatalog respPayload
 * @typedef {object} apiDszResultRelevanceFashionCatalogRespPayload
 * @property {Array<apiDszResultRelevanceFashionCatalogRespPayloadDataElement>} data - Generic table data loaded from the datalake file.
 */
/**
 * @typedef {object} apiDszResultRelevanceFashionCatalogRespPayloadDataElement
 * @property {string} sku_ds - [Go: string]
 * @property {string} sku_id - [Go: string]
 * @property {string} store_id - [Go: storeid.StoreId]
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
 * apiDszStoreDisplayCreate params
 * @typedef {object} apiDszStoreDisplayCreateParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszStoreDisplayCreate Request
 * @typedef {object} apiDszStoreDisplayCreateReq
 * @property {apiDszStoreDisplayCreateParams} params
 * @property {apiDszStoreDisplayCreateReqPayload} payload
 */
/**
 * apiDszStoreDisplayCreate reqPayload
 * @typedef {object} apiDszStoreDisplayCreateReqPayload
 * @property {apiDszStoreDisplayCreateReqPayloadDisplay} display
 * @property {string} store_id - [Go: storeid.StoreId]
 */
/**
 * @typedef {object} apiDszStoreDisplayCreateReqPayloadDisplay
 * @property {string} id - [Go: storedisplayid.StoreDisplayId]
 * @property {string} model_name - [Go: string]
 * @property {string} name - [Go: string]
 */
/**
 * apiDszStoreDisplayCreate Response
 * @typedef {object} apiDszStoreDisplayCreateResp
 * @property {apiDszStoreDisplayCreateRespPayload} payload
 */
/**
 * apiDszStoreDisplayCreate respPayload
 * @typedef {object} apiDszStoreDisplayCreateRespPayload
 * @property {apiDszStoreDisplayCreateRespPayloadDisplay} display
 */
/**
 * @typedef {object} apiDszStoreDisplayCreateRespPayloadDisplay
 * @property {string} id - [Go: storedisplayid.StoreDisplayId]
 * @property {string} name - [Go: string]
 */
/**
 * apiDszStoreDisplayList params
 * @typedef {object} apiDszStoreDisplayListParams
 * @property {string} dataset - [Go: lakedsz.Dataset]
 */
/**
 * apiDszStoreDisplayList query
 * @typedef {object} apiDszStoreDisplayListQuery
 * @property {string} store_id - [Go: storeid.StoreId]
 */
/**
 * apiDszStoreDisplayList Request
 * @typedef {object} apiDszStoreDisplayListReq
 * @property {apiDszStoreDisplayListParams} params
 * @property {apiDszStoreDisplayListQuery} query
 */
/**
 * apiDszStoreDisplayList Response
 * @typedef {object} apiDszStoreDisplayListResp
 * @property {apiDszStoreDisplayListRespPayload} payload
 */
/**
 * apiDszStoreDisplayList respPayload
 * @typedef {object} apiDszStoreDisplayListRespPayload
 * @property {string} dataset - [Go: lakedsz.Dataset]
 * @property {Array<apiDszStoreDisplayListRespPayloadDisplaysElement>} displays
 * @property {string} store_id - [Go: storeid.StoreId]
 */
/**
 * @typedef {object} apiDszStoreDisplayListRespPayloadDisplaysElement
 * @property {string} id - [Go: storedisplayid.StoreDisplayId]
 * @property {string} name - [Go: string]
 */
/**
 * apiDszStripeCheckout Request
 * @typedef {object} apiDszStripeCheckoutReq
 * @property {apiDszStripeCheckoutReqPayload} payload
 */
/**
 * apiDszStripeCheckout reqPayload
 * @typedef {object} apiDszStripeCheckoutReqPayload
 * @property {string} campaign_state - [Go: string] Base64 state token with the trial days and the metadata of the checkout; the service parses it
 * @property {string} cancel_url - [Go: string] Url to go after a canceled checkout
 * @property {string} dataset_name - [Go: string] Dataset name
 * @property {string} document - [Go: string] Document of the buyer
 * @property {string} payment_email - [Go: string] Email of the buyer used in Stripe
 * @property {string} payment_phone - [Go: string] Phone of the buyer
 * @property {string} plan - [Go: string] Lookup key of the Stripe price of the plan to buy; the service gets the price id from the Stripe prices api
 * @property {string} success_url - [Go: string] Url to go after a successful checkout
 */
/**
 * apiDszStripeCheckout Response
 * @typedef {object} apiDszStripeCheckoutResp
 * @property {apiDszStripeCheckoutRespPayload} payload
 */
/**
 * apiDszStripeCheckout respPayload
 * @typedef {object} apiDszStripeCheckoutRespPayload
 * @property {string} dataset - [Go: lakedsz.Dataset] Dataset that is going to be created after the payment; its id starts with ds
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
 * apiIngestzEventRelevanceFashionCatalog params
 * @typedef {object} apiIngestzEventRelevanceFashionCatalogParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset that receives the stream data.
 */
/**
 * apiIngestzEventRelevanceFashionCatalog query
 * @typedef {object} apiIngestzEventRelevanceFashionCatalogQuery
 * @property {i6JsonEmbedded<apiIngestzEventRelevanceFashionCatalogQueryPayload>} payload
 */
/**
 * @typedef {object} apiIngestzEventRelevanceFashionCatalogQueryPayload
 * @property {Array<apiIngestzEventRelevanceFashionCatalogQueryPayloadRowsElement>} rows
 */
/**
 * @typedef {object} apiIngestzEventRelevanceFashionCatalogQueryPayloadRowsElement
 * @property {string} id - [Go: string]
 * @property {boolean} inactive - [Go: bool]
 * @property {string} product_id - [Go: string]
 * @property {string} sku_ds - [Go: string]
 * @property {string} sku_id - [Go: string]
 * @property {string} store_id - [Go: string]
 */
/**
 * apiIngestzEventRelevanceFashionCatalog Request
 * @typedef {object} apiIngestzEventRelevanceFashionCatalogReq
 * @property {apiIngestzEventRelevanceFashionCatalogParams} params
 * @property {apiIngestzEventRelevanceFashionCatalogQuery} query
 */
/**
 * apiIngestzEventRelevanceFashionCatalog Response
 * @typedef {object} apiIngestzEventRelevanceFashionCatalogResp
 * @property {apiIngestzEventRelevanceFashionCatalogRespPayload} payload
 */
/**
 * apiIngestzEventRelevanceFashionCatalog respPayload
 * @typedef {object} apiIngestzEventRelevanceFashionCatalogRespPayload
 * @property {number} count - [Go: int]
 */
/**
 * apiIngestzEventRelevanceFashionEvent params
 * @typedef {object} apiIngestzEventRelevanceFashionEventParams
 * @property {string} dataset - [Go: lakedsz.Dataset] Name of the dataset that receives the stream data.
 */
/**
 * apiIngestzEventRelevanceFashionEvent query
 * @typedef {object} apiIngestzEventRelevanceFashionEventQuery
 * @property {i6JsonEmbedded<apiIngestzEventRelevanceFashionEventQueryPayload>} payload
 */
/**
 * @typedef {object} apiIngestzEventRelevanceFashionEventQueryPayload
 * @property {Array<apiIngestzEventRelevanceFashionEventQueryPayloadRowsElement>} rows
 */
/**
 * @typedef {object} apiIngestzEventRelevanceFashionEventQueryPayloadRowsElement
 * @property {apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementAddToCart} add_to_cart
 * @property {apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementClick} click
 * @property {dszTime} created_at - [Go: time.Time]
 * @property {string} display_id - [Go: bigquery.NullString]
 * @property {string} id - [Go: string]
 * @property {apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementPurchase} purchase
 * @property {apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementRecraw} recraw
 * @property {apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementRecshow} recshow
 * @property {apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementRemoveFromCart} remove_from_cart
 * @property {apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementSearch} search
 * @property {string} session_id - [Go: string]
 * @property {string} store_id - [Go: string]
 * @property {string} user_id - [Go: bigquery.NullString]
 */
/**
 * @typedef {object} apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementAddToCart
 * @property {number} price - [Go: float64]
 * @property {string} sku_id - [Go: string]
 */
/**
 * @typedef {object} apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementClick
 * @property {number} price - [Go: float64]
 * @property {string} sku_id - [Go: string]
 */
/**
 * @typedef {object} apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementPurchase
 * @property {string} order_id - [Go: string]
 * @property {Array<apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementPurchaseSkusElement>} skus
 */
/**
 * @typedef {object} apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementPurchaseSkusElement
 * @property {number} qtty - [Go: int64]
 * @property {string} sku_id - [Go: string]
 * @property {number} unit_price - [Go: float64]
 */
/**
 * @typedef {object} apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementRecraw
 * @property {string} model_id - [Go: string]
 * @property {string} model_version - [Go: string]
 * @property {string} payload - [Go: string]
 * @property {string} rec_id - [Go: string]
 */
/**
 * @typedef {object} apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementRecshow
 * @property {string} model_id - [Go: string]
 * @property {string} model_version - [Go: string]
 * @property {string} payload - [Go: string]
 * @property {string} rec_id - [Go: string]
 */
/**
 * @typedef {object} apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementRemoveFromCart
 * @property {number} price - [Go: float64]
 * @property {string} sku_id - [Go: string]
 */
/**
 * @typedef {object} apiIngestzEventRelevanceFashionEventQueryPayloadRowsElementSearch
 * @property {string} text - [Go: string]
 */
/**
 * apiIngestzEventRelevanceFashionEvent Request
 * @typedef {object} apiIngestzEventRelevanceFashionEventReq
 * @property {apiIngestzEventRelevanceFashionEventParams} params
 * @property {apiIngestzEventRelevanceFashionEventQuery} query
 */
/**
 * apiIngestzEventRelevanceFashionEvent Response
 * @typedef {object} apiIngestzEventRelevanceFashionEventResp
 * @property {apiIngestzEventRelevanceFashionEventRespPayload} payload
 */
/**
 * apiIngestzEventRelevanceFashionEvent respPayload
 * @typedef {object} apiIngestzEventRelevanceFashionEventRespPayload
 * @property {number} count - [Go: int]
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
 * @property {string} store_id - [Go: storeid.StoreId] Store ID associated with the ingestion.
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
 * @property {string} store_id - [Go: storeid.StoreId] Store ID associated with the ingestion.
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
 * @property {apiIngestzStreamRelevanceFashionCatalogRespPayload} payload
 */
/**
 * apiIngestzStreamRelevanceFashionCatalog respPayload
 * @typedef {object} apiIngestzStreamRelevanceFashionCatalogRespPayload
 * @property {number} count - [Go: int]
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
 * @property {string} display_id - [Go: bigquery.NullString]
 * @property {string} id - [Go: string]
 * @property {apiIngestzStreamRelevanceFashionEventReqPayloadDataElementPurchase} purchase
 * @property {apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRecraw} recraw
 * @property {apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRecshow} recshow
 * @property {apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRemoveFromCart} remove_from_cart
 * @property {apiIngestzStreamRelevanceFashionEventReqPayloadDataElementSearch} search
 * @property {string} session_id - [Go: string]
 * @property {string} store_id - [Go: string]
 * @property {string} user_id - [Go: bigquery.NullString]
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
 * @property {string} model_version - [Go: string]
 * @property {string} payload - [Go: string]
 * @property {string} rec_id - [Go: string]
 */
/**
 * @typedef {object} apiIngestzStreamRelevanceFashionEventReqPayloadDataElementRecshow
 * @property {string} model_id - [Go: string]
 * @property {string} model_version - [Go: string]
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
 * @property {apiIngestzStreamRelevanceFashionEventRespPayload} payload
 */
/**
 * apiIngestzStreamRelevanceFashionEvent respPayload
 * @typedef {object} apiIngestzStreamRelevanceFashionEventRespPayload
 * @property {number} count - [Go: int]
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
 * apiPipezList respPayload
 * @typedef {object} apiPipezListRespPayload
 * @property {string} cursor - [Go: string]
 * @property {Array<apiPipezListRespPayloadPipelinesElement>} pipelines
 */
/**
 * @typedef {object} apiPipezListRespPayloadPipelinesElement
 * @property {string} concurrent_id - [Go: string]
 * @property {string} dataset - [Go: string]
 * @property {string} id - [Go: string]
 * @property {string} name - [Go: string]
 * @property {string} solution_domain - [Go: solutiondomain.SolutionDomain]
 * @property {Array<apiPipezListRespPayloadPipelinesElementStatesElement>} states
 */
/**
 * @typedef {object} apiPipezListRespPayloadPipelinesElementStatesElement
 * @property {string} created_at - [Go: string]
 * @property {Record<apiPipezListRespPayloadPipelinesElementStatesElementParamsKey, apiPipezListRespPayloadPipelinesElementStatesElementParamsValue>} params
 * @property {string} status - [Go: string]
 */
/**
 * [Go: string]
 * @typedef {string} apiPipezListRespPayloadPipelinesElementStatesElementParamsKey
 */
/**
 * [Go: any]
 * @typedef {any} apiPipezListRespPayloadPipelinesElementStatesElementParamsValue
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
 * @property {apiSampleFractionQuerySmsg} smsg
 */
/**
 * @typedef {object} apiSampleFractionQuerySmsg
 * @property {string} message - [Go: string] message string
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
 * @property {apiSampleFractionRespHeadersXI6Smsg} x_i6_smsg
 * @property {string} x_i6_trace_message - [Go: string] Sample of any trace message
 */
/**
 * @typedef {object} apiSampleFractionRespHeadersXI6Smsg
 * @property {string} message - [Go: string] message string
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
 * One recommended sku to show, as picked by selectResults
 * @typedef {object} sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElementEnriched
 * @property {string} sku_id - Id of the sku. Required; the only field sent to i6 (in the recshow event)
 * @property {number} rating - Model rating, higher is more relevant. The default selectResults sets the rating of the result the sku was picked from
 * @property {*} enriched - Optional: any data your selectResults attaches to the sku (e.g. name, price, image). Returned to you as is, never sent to i6. The default selectResults does not set it
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
/**
 * sdkFuncProductRelevanceFashionFbt Selected: the skus to show, as returned by selectResults
 * @typedef {object} sdkFuncProductRelevanceFashionFbtSelected
 * @property {Array<sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElementEnriched>} results - Skus to show, in the order selectResults returned them
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
     * Stream Ingestion
     *
     * Ingests stream data into a target dataset table.
     *
     * @param {apiIngestzStreamRelevanceFashionEventReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiIngestzStreamRelevanceFashionEventResp>>}
     */
    ingestzStreamRelevanceFashionEvent(req: apiIngestzStreamRelevanceFashionEventReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiIngestzStreamRelevanceFashionEventResp>>;
    /**
     *
     *
     *
     *
     * @param {apiPipezGetReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiPipezGetResp>>}
     */
    pipezGet(req: apiPipezGetReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiPipezGetResp>>;
    /**
     *
     *
     *
     *
     * @param {apiDszListDatasetsReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszListDatasetsResp>>}
     */
    dszListDatasets(req: apiDszListDatasetsReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszListDatasetsResp>>;
    /**
     *
     *
     *
     *
     * @param {apiDszListRecsysTokensReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszListRecsysTokensResp>>}
     */
    dszListRecsysTokens(req: apiDszListRecsysTokensReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszListRecsysTokensResp>>;
    /**
     *
     *
     *
     *
     * @param {apiDszDeleteTokenReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszDeleteTokenResp>>}
     */
    dszDeleteToken(req: apiDszDeleteTokenReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszDeleteTokenResp>>;
    /**
     * Sample Fraction
     *
     * Sample API that performs a fraction operation
     *
     * @param {apiSampleFractionReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiSampleFractionResp>>}
     */
    sampleFraction(req: apiSampleFractionReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiSampleFractionResp>>;
    /**
     * Get Dataset Signed URLs
     *
     * Generates presigned URLs for accessing or mutating files in the specified dataset.
     *
     * @param {apiDszSignedUrlReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszSignedUrlResp>>}
     */
    dszSignedUrl(req: apiDszSignedUrlReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszSignedUrlResp>>;
    /**
     * Load Table File as JSON
     *
     * Load a table file from the datalake as JSON and return it.
     *
     * @param {apiDszResultRelevanceFashionCatalogReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszResultRelevanceFashionCatalogResp>>}
     */
    dszResultRelevanceFashionCatalog(req: apiDszResultRelevanceFashionCatalogReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszResultRelevanceFashionCatalogResp>>;
    /**
     *
     *
     *
     *
     * @param {apiPipezListReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiPipezListResp>>}
     */
    pipezList(req: apiPipezListReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiPipezListResp>>;
    /**
     *
     *
     *
     *
     * @param {apiDszStoreDisplayCreateReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszStoreDisplayCreateResp>>}
     */
    dszStoreDisplayCreate(req: apiDszStoreDisplayCreateReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszStoreDisplayCreateResp>>;
    /**
     *
     *
     *
     *
     * @param {apiDszStoreDisplayListReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszStoreDisplayListResp>>}
     */
    dszStoreDisplayList(req: apiDszStoreDisplayListReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszStoreDisplayListResp>>;
    /**
     *
     *
     *
     *
     * @param {apiDszDatasetSolutionsReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszDatasetSolutionsResp>>}
     */
    dszDatasetSolutions(req: apiDszDatasetSolutionsReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszDatasetSolutionsResp>>;
    /**
     *
     *
     *
     *
     * @param {apiDszCreateRecsysTokenReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszCreateRecsysTokenResp>>}
     */
    dszCreateRecsysToken(req: apiDszCreateRecsysTokenReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszCreateRecsysTokenResp>>;
    /**
     * Get Last Successful Ingestion Data Summary
     *
     * Returns the date of ingestion, rows count and distinct and null columns count
     *
     * @param {apiIngestzLastBatchSummaryReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiIngestzLastBatchSummaryResp>>}
     */
    ingestzLastBatchSummary(req: apiIngestzLastBatchSummaryReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiIngestzLastBatchSummaryResp>>;
    /**
     * Get Dataset Table File
     *
     * Get table file by redirecting to its signed URL.
     *
     * @param {apiDszTableGetReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszTableGetResp>>}
     */
    dszTableGet(req: apiDszTableGetReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszTableGetResp>>;
    /**
     * List Dataset Tables
     *
     * Lists files and tables in the specified dataset.
     *
     * @param {apiDszTableListReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszTableListResp>>}
     */
    dszTableList(req: apiDszTableListReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszTableListResp>>;
    /**
     *
     *
     *
     *
     * @param {apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiPipezStartRelevanceFashionRelevanceFashionBatchIngestResp>>}
     */
    pipezStartRelevanceFashionRelevanceFashionBatchIngest(req: apiPipezStartRelevanceFashionRelevanceFashionBatchIngestReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiPipezStartRelevanceFashionRelevanceFashionBatchIngestResp>>;
    /**
     *
     *
     *
     *
     * @param {apiDszCreateStoreReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszCreateStoreResp>>}
     */
    dszCreateStore(req: apiDszCreateStoreReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszCreateStoreResp>>;
    /**
     *
     *
     *
     *
     * @param {apiDszCreateIngestionTokenReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszCreateIngestionTokenResp>>}
     */
    dszCreateIngestionToken(req: apiDszCreateIngestionTokenReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszCreateIngestionTokenResp>>;
    /**
     * Get Model Signed URLs
     *
     * Generates presigned URLs for accessing model files in the specified dataset.
     *
     * @param {apiDszModelGetReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszModelGetResp>>}
     */
    dszModelGet(req: apiDszModelGetReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszModelGetResp>>;
    /**
     * Create Stripe Checkout
     *
     * Creates a Stripe checkout session for a subscription and returns its id and url.
     *
     * @param {apiDszStripeCheckoutReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszStripeCheckoutResp>>}
     */
    dszStripeCheckout(req: apiDszStripeCheckoutReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszStripeCheckoutResp>>;
    /**
     * Stream Ingestion
     *
     * Ingests stream data into a target dataset table.
     *
     * @param {apiIngestzStreamRelevanceFashionCatalogReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiIngestzStreamRelevanceFashionCatalogResp>>}
     */
    ingestzStreamRelevanceFashionCatalog(req: apiIngestzStreamRelevanceFashionCatalogReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiIngestzStreamRelevanceFashionCatalogResp>>;
    /**
     * Event Ingestion
     *
     * Ingests events data into a target dataset table.
     *
     * @param {apiIngestzEventRelevanceFashionCatalogReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiIngestzEventRelevanceFashionCatalogResp>>}
     */
    ingestzEventRelevanceFashionCatalog(req: apiIngestzEventRelevanceFashionCatalogReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiIngestzEventRelevanceFashionCatalogResp>>;
    /**
     * Event Ingestion
     *
     * Ingests events data into a target dataset table.
     *
     * @param {apiIngestzEventRelevanceFashionEventReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiIngestzEventRelevanceFashionEventResp>>}
     */
    ingestzEventRelevanceFashionEvent(req: apiIngestzEventRelevanceFashionEventReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiIngestzEventRelevanceFashionEventResp>>;
    /**
     *
     *
     *
     *
     * @param {apiPipezStartRelevanceFashionRelevanceFashionMainReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiPipezStartRelevanceFashionRelevanceFashionMainResp>>}
     */
    pipezStartRelevanceFashionRelevanceFashionMain(req: apiPipezStartRelevanceFashionRelevanceFashionMainReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiPipezStartRelevanceFashionRelevanceFashionMainResp>>;
    /**
     *
     *
     *
     *
     * @param {apiDszListStoresReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszListStoresResp>>}
     */
    dszListStores(req: apiDszListStoresReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszListStoresResp>>;
    /**
     *
     *
     *
     *
     * @param {apiDszListIngestionTokensReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiDszListIngestionTokensResp>>}
     */
    dszListIngestionTokens(req: apiDszListIngestionTokensReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiDszListIngestionTokensResp>>;
    /**
     * Get Ingestion Upload URLs
     *
     * Generates presigned PUT URLs and an ingestion token for uploading files into a target dataset table and partitions.
     *
     * @param {apiIngestzGetUrlReq} req
     * @param {ServiceOptions} [opts]
     * @returns {Promise<import("../errors.js").I6Result<apiIngestzGetUrlResp>>}
     */
    ingestzGetUrl(req: apiIngestzGetUrlReq, opts?: ServiceOptions): Promise<import("../errors.js").I6Result<apiIngestzGetUrlResp>>;
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
     * @param {sdkFuncProductRelevanceFashionFbtReq} req
     * @param {(req: sdkFuncProductRelevanceFashionFbtReq, results: sdkFuncProductRelevanceFashionFbtOutput) => Promise<sdkFuncProductRelevanceFashionFbtSelected>} [selectResults] - picks which of the recommended skus are shown and may attach your own data to each in enriched; default: for each result, in order, the first sku not in req.input.skus (the cart) and not already picked, with the rating of that result; no duplicates, and results with no such sku are skipped
     * @returns {Promise<sdkFuncProductRelevanceFashionFbtSelected>}
     */
    productRelevanceFashionFbtV1(req: sdkFuncProductRelevanceFashionFbtReq, selectResults?: (req: sdkFuncProductRelevanceFashionFbtReq, results: sdkFuncProductRelevanceFashionFbtOutput) => Promise<sdkFuncProductRelevanceFashionFbtSelected>): Promise<sdkFuncProductRelevanceFashionFbtSelected>;
    /**
     * @param {sdkFuncProductRelevanceFashionDashFunnelReq} req
     * @returns {Promise<sdkFuncProductRelevanceFashionDashFunnelOutput>}
     */
    productRelevanceFashionDashFunnelV1(req: sdkFuncProductRelevanceFashionDashFunnelReq): Promise<sdkFuncProductRelevanceFashionDashFunnelOutput>;
    /**
     * @param {sdkFuncProductRelevanceFashionDashAttachedRevenueReq} req
     * @returns {Promise<sdkFuncProductRelevanceFashionDashAttachedRevenueOutput>}
     */
    productRelevanceFashionDashAttachedRevenueV1(req: sdkFuncProductRelevanceFashionDashAttachedRevenueReq): Promise<sdkFuncProductRelevanceFashionDashAttachedRevenueOutput>;
}
export { SdkFuncs };
