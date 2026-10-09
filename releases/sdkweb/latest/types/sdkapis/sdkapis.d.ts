/**
 * @typedef {import("../services/services.js").Services} Services
 */
export type Services = import("../services/services.js").Services;
export type apiDszCreateIngestionTokenParams = {
    dataset: string;
};
export type apiDszCreateIngestionTokenReq = {
    params: apiDszCreateIngestionTokenParams;
    payload: apiDszCreateIngestionTokenReqPayload;
};
export type apiDszCreateIngestionTokenReqPayload = {
    annotation: string;
};
export type apiDszCreateIngestionTokenResp = {
    payload: apiDszCreateIngestionTokenRespPayload;
};
export type apiDszCreateIngestionTokenRespPayload = {
    id: string;
    jti: string;
    dataset: string;
    annotation: string;
    expiration_date: number;
    audience: string;
    grants: Array<string>;
    channel: string;
    token: string;
};
export type apiDszCreateRecsysTokenParams = {
    dataset: string;
};
export type apiDszCreateRecsysTokenReq = {
    params: apiDszCreateRecsysTokenParams;
    payload: apiDszCreateRecsysTokenReqPayload;
};
export type apiDszCreateRecsysTokenReqPayload = {
    annotation: string;
    channel: string;
};
export type apiDszCreateRecsysTokenResp = {
    payload: apiDszCreateRecsysTokenRespPayload;
};
export type apiDszCreateRecsysTokenRespPayload = {
    id: string;
    jti: string;
    dataset: string;
    annotation: string;
    expiration_date: number;
    audience: string;
    grants: Array<string>;
    channel: string;
    token: string;
};
export type apiDszCreateStoreParams = {
    dataset: string;
};
export type apiDszCreateStoreReq = {
    params: apiDszCreateStoreParams;
    payload: apiDszCreateStoreReqPayload;
};
export type apiDszCreateStoreReqPayload = {
    store_id: object;
};
export type apiDszCreateStoreResp = object;
export type apiDszDeleteTokenParams = {
    dataset: string;
};
export type apiDszDeleteTokenQuery = {
    token: string;
};
export type apiDszDeleteTokenReq = {
    params: apiDszDeleteTokenParams;
    query: apiDszDeleteTokenQuery;
};
export type apiDszDeleteTokenResp = object;
export type apiDszDomainGetParams = {
    dataset: string;
};
export type apiDszDomainGetQuery = {
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
    dataset: string;
    solutions: Array<apiDszDomainGetRespPayloadSolutionsElement>;
    store_id: string;
};
export type apiDszDomainGetRespPayloadSolutionsElement = {
    solution: string;
    domain: string;
};
export type apiDszDomainSelectParams = {
    dataset: string;
};
export type apiDszDomainSelectReq = {
    params: apiDszDomainSelectParams;
    payload: apiDszDomainSelectReqPayload;
};
export type apiDszDomainSelectReqPayload = {
    domain: string;
    solution: string;
    store_id: string;
};
export type apiDszDomainSelectResp = object;
export type apiDszListDatasetsQuery = {
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
    id: string;
    name: string;
};
export type apiDszListDatasetsRespPayloadDatasetsElementGrantsElement = string;
export type apiDszListIngestionTokensParams = {
    dataset: string;
};
export type apiDszListIngestionTokensReq = {
    params: apiDszListIngestionTokensParams;
};
export type apiDszListIngestionTokensResp = {
    payload: apiDszListIngestionTokensRespPayload;
};
export type apiDszListIngestionTokensRespPayload = object;
export type apiDszListRecsysTokensParams = {
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
    dataset: string;
};
export type apiDszListStoresReq = {
    params: apiDszListStoresParams;
};
export type apiDszListStoresResp = {
    payload: apiDszListStoresRespPayload;
};
export type apiDszListStoresRespPayload = {
    dataset: string;
    stores: Array<apiDszListStoresRespPayloadStoresElement>;
};
export type apiDszListStoresRespPayloadStoresElement = {
    id: string;
    name: string;
};
export type apiDszModelGetParams = {
    /**
     * - Name of the dataset to generate signed URLs for.
     */
    dataset: string;
    /**
     * - Model name
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
     * - Model version
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
     * - File Name
     */
    name: string;
    /**
     * - signed URL.
     */
    url: string;
};
export type apiDszSignedUrlParams = {
    /**
     * - Name of the dataset to generate signed URLs for.
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
     * - HTTP method (e.g. GET, PUT) for the signed URL.
     */
    method: string;
    /**
     * - File path within the dataset.
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
     * - signed URL.
     */
    url: string;
};
export type apiDszTableGetParams = {
    /**
     * - Name of the dataset.
     */
    dataset: string;
    /**
     * - Path to the file without schema.
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
     * - Redirect URL for the file.
     */
    location: string;
};
export type apiDszTableListParams = {
    /**
     * - Name of the dataset to list tables from.
     */
    dataset: string;
};
export type apiDszTableListQuery = {
    /**
     * - Pagination cursor.
     */
    from_cursor: string;
    /**
     * - Limit the number of results.
     */
    limist: number;
    /**
     * - Path to list.
     */
    path: string;
    /**
     * - Whether to list recursively.
     */
    recursive: boolean;
    /**
     * - Whether to return signed URLs.
     */
    sign_method: string;
    /**
     * - Whether to include file stats.
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
     * - Cursor for the next page of results.
     */
    next_cursor: string;
};
export type apiDszTableListRespPayloadFilesElement = {
    /**
     * - write it
     */
    path: string;
    /**
     * - write it
     */
    signed_url: string;
    /**
     * - write it
     */
    stat: dszFileStat;
};
export type apiIngestzGetUrlParams = {
    /**
     * - Name of the dataset that receives the uploaded files.
     */
    dataset: string;
};
export type apiIngestzGetUrlReq = {
    params: apiIngestzGetUrlParams;
    payload: apiIngestzGetUrlReqPayload;
};
export type apiIngestzGetUrlReqPayload = {
    /**
     * - Number of presigned upload URLs to generate.
     */
    amount: number;
    /**
     * - Partition key/value pairs that select the table partition the files are ingested into.
     */
    partitions: Record<apiIngestzGetUrlReqPayloadPartitionsKey, apiIngestzGetUrlReqPayloadPartitionsValue>;
    /**
     * - Name of the table, inside the dataset, that receives the uploaded files.
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
     * - Ingestion token that identifies this ingestion and ties the uploaded files together.
     */
    ingest_id: string;
    /**
     * - Presigned PUT URLs, one per requested file; upload each file to its URL.
     */
    uploads: Array<apiIngestzGetUrlRespPayloadUploadsElement>;
};
export type apiIngestzGetUrlRespPayloadUploadsElement = string;
export type apiIngestzStreamRelevanceFashionCatalogParams = {
    /**
     * - Name of the dataset that receives the stream data.
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
    id: string;
    inactive: boolean;
    product_id: string;
    sku_ds: string;
    sku_id: string;
    store_id: string;
};
export type apiIngestzStreamRelevanceFashionCatalogResp = object;
export type apiIngestzStreamRelevanceFashionEventParams = {
    /**
     * - Name of the dataset that receives the stream data.
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
    add_to_cart: object;
    click: object;
    created_at: dszTime;
    id: string;
    p: string;
    purchase: object;
    recraw: object;
    recshow: object;
    remove_from_cart: object;
    search: object;
    session_id: string;
    store_id: string;
    user_id: string;
};
export type apiIngestzStreamRelevanceFashionEventReqPayloadDataElementPurchaseSkusElement = {
    qtty: number;
    sku_id: string;
    unit_price: number;
};
export type apiIngestzStreamRelevanceFashionEventResp = object;
export type apiPipezStartParams = {
    dataset: string;
};
export type apiPipezStartReq = {
    params: apiPipezStartParams;
    payload: apiPipezStartReqPayload;
};
export type apiPipezStartReqPayload = {
    params: Array<apiPipezStartReqPayloadParamsElement>;
    pipename: string;
    solution_domain: string;
};
export type apiPipezStartReqPayloadParamsElement = object;
export type apiPipezStartResp = {
    payload: apiPipezStartRespPayload;
};
export type apiPipezStartRespPayload = object;
export type apiSampleFractionParams = {
    /**
     * - Fraction Denominator
     */
    denominator: number;
    /**
     * - Fraction Numerator
     */
    numerator: number;
};
export type apiSampleFractionQuery = {
    /**
     * - Fraction max precision
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
     * - Sample of Trace Id
     */
    x_i6_trace_id: string;
};
export type apiSampleFractionReqPayload = {
    messages: Array<apiSampleFractionReqPayloadMessagesElement>;
    /**
     * - Sample reason of this fraction
     */
    reason: string;
};
export type apiSampleFractionReqPayloadMessagesElement = {
    /**
     * - message string
     */
    message: string;
};
export type apiSampleFractionResp = {
    headers: apiSampleFractionRespHeaders;
    payload: apiSampleFractionRespPayload;
};
export type apiSampleFractionRespHeaders = {
    /**
     * - Sample of any trace message
     */
    x_i6_trace_message: string;
};
export type apiSampleFractionRespPayload = {
    /**
     * - Human Fraction Representation
     */
    display: string;
    /**
     * - Output Messages
     */
    messages: Array<apiSampleFractionRespPayloadMessagesElement>;
    /**
     * - Fraction Result
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
export type sdkFuncProductRelevanceFashionDashFunnelInput = {
    dataset: string;
    params: object;
};
export type sdkFuncProductRelevanceFashionDashFunnelOutput = {
    results: object;
};
export type sdkFuncProductRelevanceFashionDashFunnelOutputResultsRowsElement = {
    event_type: string;
    from_rec: string;
    qt_events: string;
};
export type sdkFuncProductRelevanceFashionDashFunnelPartitions = {
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
    dataset: string;
    skus: Array<sdkFuncProductRelevanceFashionFbtInputSkusElement>;
};
export type sdkFuncProductRelevanceFashionFbtInputSkusElement = {
    sku_id: string;
};
export type sdkFuncProductRelevanceFashionFbtOutput = {
    results: Array<sdkFuncProductRelevanceFashionFbtOutputResultsElement>;
};
export type sdkFuncProductRelevanceFashionFbtOutputResultsElement = {
    rating: string;
    skus: Array<sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElement>;
};
export type sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElement = {
    sku_id: string;
};
export type sdkFuncProductRelevanceFashionFbtPartitions = {
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
 * @property {string} dataset
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
 * @property {string} annotation
 */
/**
 * apiDszCreateIngestionToken Response
 * @typedef {object} apiDszCreateIngestionTokenResp
 * @property {apiDszCreateIngestionTokenRespPayload} payload
 */
/**
 * apiDszCreateIngestionToken respPayload
 * @typedef {object} apiDszCreateIngestionTokenRespPayload
 * @property {string} id
 * @property {string} jti
 * @property {string} dataset
 * @property {string} annotation
 * @property {number} expiration_date
 * @property {string} audience
 * @property {Array<string>} grants
 * @property {string} channel
 * @property {string} token
 */
/**
 * apiDszCreateRecsysToken params
 * @typedef {object} apiDszCreateRecsysTokenParams
 * @property {string} dataset
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
 * @property {string} annotation
 * @property {string} channel
 */
/**
 * apiDszCreateRecsysToken Response
 * @typedef {object} apiDszCreateRecsysTokenResp
 * @property {apiDszCreateRecsysTokenRespPayload} payload
 */
/**
 * apiDszCreateRecsysToken respPayload
 * @typedef {object} apiDszCreateRecsysTokenRespPayload
 * @property {string} id
 * @property {string} jti
 * @property {string} dataset
 * @property {string} annotation
 * @property {number} expiration_date
 * @property {string} audience
 * @property {Array<string>} grants
 * @property {string} channel
 * @property {string} token
 */
/**
 * apiDszCreateStore params
 * @typedef {object} apiDszCreateStoreParams
 * @property {string} dataset
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
 * @property {object} store_id
 */
/**
 * apiDszCreateStore Response
 * @typedef {object} apiDszCreateStoreResp
 */
/**
 * apiDszDeleteToken params
 * @typedef {object} apiDszDeleteTokenParams
 * @property {string} dataset
 */
/**
 * apiDszDeleteToken query
 * @typedef {object} apiDszDeleteTokenQuery
 * @property {string} token
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
 * @property {string} dataset
 */
/**
 * apiDszDomainGet query
 * @typedef {object} apiDszDomainGetQuery
 * @property {string} store_id
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
 * @property {string} dataset
 * @property {Array<apiDszDomainGetRespPayloadSolutionsElement>} solutions
 * @property {string} store_id
 */
/**
 * @typedef {object} apiDszDomainGetRespPayloadSolutionsElement
 * @property {string} solution
 * @property {string} domain
 */
/**
 * apiDszDomainSelect params
 * @typedef {object} apiDszDomainSelectParams
 * @property {string} dataset
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
 * @property {string} domain
 * @property {string} solution
 * @property {string} store_id
 */
/**
 * apiDszDomainSelect Response
 * @typedef {object} apiDszDomainSelectResp
 */
/**
 * apiDszListDatasets query
 * @typedef {object} apiDszListDatasetsQuery
 * @property {string} user
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
 * @property {string} id
 * @property {string} name
 */
/**
 * @typedef {string} apiDszListDatasetsRespPayloadDatasetsElementGrantsElement
 */
/**
 * apiDszListIngestionTokens params
 * @typedef {object} apiDszListIngestionTokensParams
 * @property {string} dataset
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
 */
/**
 * apiDszListRecsysTokens params
 * @typedef {object} apiDszListRecsysTokensParams
 * @property {string} dataset
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
 */
/**
 * apiDszListStores params
 * @typedef {object} apiDszListStoresParams
 * @property {string} dataset
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
 * @property {string} dataset
 * @property {Array<apiDszListStoresRespPayloadStoresElement>} stores
 */
/**
 * @typedef {object} apiDszListStoresRespPayloadStoresElement
 * @property {string} id
 * @property {string} name
 */
/**
 * apiDszModelGet params
 * @typedef {object} apiDszModelGetParams
 * @property {string} dataset - Name of the dataset to generate signed URLs for.
 * @property {string} model_name - Model name
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
 * @property {string} model_version - Model version
 */
/**
 * @typedef {string} apiDszModelGetReqPayloadModelPartitionsKey
 */
/**
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
 * @property {string} name - File Name
 * @property {string} url - signed URL.
 */
/**
 * apiDszSignedUrl params
 * @typedef {object} apiDszSignedUrlParams
 * @property {string} dataset - Name of the dataset to generate signed URLs for.
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
 * @property {string} method - HTTP method (e.g. GET, PUT) for the signed URL.
 * @property {string} path - File path within the dataset.
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
 * @property {string} url - signed URL.
 */
/**
 * apiDszTableGet params
 * @typedef {object} apiDszTableGetParams
 * @property {string} dataset - Name of the dataset.
 * @property {string} path - Path to the file without schema.
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
 * @property {string} location - Redirect URL for the file.
 */
/**
 * apiDszTableList params
 * @typedef {object} apiDszTableListParams
 * @property {string} dataset - Name of the dataset to list tables from.
 */
/**
 * apiDszTableList query
 * @typedef {object} apiDszTableListQuery
 * @property {string} from_cursor - Pagination cursor.
 * @property {number} limist - Limit the number of results.
 * @property {string} path - Path to list.
 * @property {boolean} recursive - Whether to list recursively.
 * @property {string} sign_method - Whether to return signed URLs.
 * @property {boolean} stat - Whether to include file stats.
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
 * @property {string} next_cursor - Cursor for the next page of results.
 */
/**
 * File entry
 * @typedef {object} apiDszTableListRespPayloadFilesElement
 * @property {string} path - write it
 * @property {string} signed_url - write it
 * @property {dszFileStat} stat - write it
 */
/**
 * apiIngestzGetUrl params
 * @typedef {object} apiIngestzGetUrlParams
 * @property {string} dataset - Name of the dataset that receives the uploaded files.
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
 * @property {number} amount - Number of presigned upload URLs to generate.
 * @property {Record<apiIngestzGetUrlReqPayloadPartitionsKey, apiIngestzGetUrlReqPayloadPartitionsValue>} partitions - Partition key/value pairs that select the table partition the files are ingested into.
 * @property {string} table - Name of the table, inside the dataset, that receives the uploaded files.
 */
/**
 * @typedef {string} apiIngestzGetUrlReqPayloadPartitionsKey
 */
/**
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
 * @property {string} ingest_id - Ingestion token that identifies this ingestion and ties the uploaded files together.
 * @property {Array<apiIngestzGetUrlRespPayloadUploadsElement>} uploads - Presigned PUT URLs, one per requested file; upload each file to its URL.
 */
/**
 * @typedef {string} apiIngestzGetUrlRespPayloadUploadsElement
 */
/**
 * apiIngestzStreamRelevanceFashionCatalog params
 * @typedef {object} apiIngestzStreamRelevanceFashionCatalogParams
 * @property {string} dataset - Name of the dataset that receives the stream data.
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
 * @property {string} id
 * @property {boolean} inactive
 * @property {string} product_id
 * @property {string} sku_ds
 * @property {string} sku_id
 * @property {string} store_id
 */
/**
 * apiIngestzStreamRelevanceFashionCatalog Response
 * @typedef {object} apiIngestzStreamRelevanceFashionCatalogResp
 */
/**
 * apiIngestzStreamRelevanceFashionEvent params
 * @typedef {object} apiIngestzStreamRelevanceFashionEventParams
 * @property {string} dataset - Name of the dataset that receives the stream data.
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
 * @property {object} add_to_cart
 * @property {object} click
 * @property {dszTime} created_at
 * @property {string} id
 * @property {string} p
 * @property {object} purchase
 * @property {object} recraw
 * @property {object} recshow
 * @property {object} remove_from_cart
 * @property {object} search
 * @property {string} session_id
 * @property {string} store_id
 * @property {string} user_id
 */
/**
 * @typedef {object} apiIngestzStreamRelevanceFashionEventReqPayloadDataElementPurchaseSkusElement
 * @property {number} qtty
 * @property {string} sku_id
 * @property {number} unit_price
 */
/**
 * apiIngestzStreamRelevanceFashionEvent Response
 * @typedef {object} apiIngestzStreamRelevanceFashionEventResp
 */
/**
 * apiPipezStart params
 * @typedef {object} apiPipezStartParams
 * @property {string} dataset
 */
/**
 * apiPipezStart Request
 * @typedef {object} apiPipezStartReq
 * @property {apiPipezStartParams} params
 * @property {apiPipezStartReqPayload} payload
 */
/**
 * apiPipezStart reqPayload
 * @typedef {object} apiPipezStartReqPayload
 * @property {Array<apiPipezStartReqPayloadParamsElement>} params
 * @property {string} pipename
 * @property {string} solution_domain
 */
/**
 * @typedef {object} apiPipezStartReqPayloadParamsElement
 */
/**
 * apiPipezStart Response
 * @typedef {object} apiPipezStartResp
 * @property {apiPipezStartRespPayload} payload
 */
/**
 * apiPipezStart respPayload
 * @typedef {object} apiPipezStartRespPayload
 */
/**
 * apiSampleFraction params
 * @typedef {object} apiSampleFractionParams
 * @property {number} denominator - Fraction Denominator
 * @property {number} numerator - Fraction Numerator
 */
/**
 * apiSampleFraction query
 * @typedef {object} apiSampleFractionQuery
 * @property {number} precision - Fraction max precision
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
 * @property {string} x_i6_trace_id - Sample of Trace Id
 */
/**
 * apiSampleFraction reqPayload
 * @typedef {object} apiSampleFractionReqPayload
 * @property {Array<apiSampleFractionReqPayloadMessagesElement>} messages
 * @property {string} reason - Sample reason of this fraction
 */
/**
 * message
 * @typedef {object} apiSampleFractionReqPayloadMessagesElement
 * @property {string} message - message string
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
 * @property {string} x_i6_trace_message - Sample of any trace message
 */
/**
 * apiSampleFraction respPayload
 * @typedef {object} apiSampleFractionRespPayload
 * @property {string} display - Human Fraction Representation
 * @property {Array<apiSampleFractionRespPayloadMessagesElement>} messages - Output Messages
 * @property {string} result - Fraction Result
 */
/**
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
 * sdkFuncProductRelevanceFashionDashFunnel input
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelInput
 * @property {string} dataset
 * @property {object} params
 */
/**
 * sdkFuncProductRelevanceFashionDashFunnel output
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelOutput
 * @property {object} results
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelOutputResultsRowsElement
 * @property {string} event_type
 * @property {string} from_rec
 * @property {string} qt_events
 */
/**
 * sdkFuncProductRelevanceFashionDashFunnel partitions
 * @typedef {object} sdkFuncProductRelevanceFashionDashFunnelPartitions
 * @property {string} store_id
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
 * @property {string} dataset
 * @property {Array<sdkFuncProductRelevanceFashionFbtInputSkusElement>} skus
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionFbtInputSkusElement
 * @property {string} sku_id
 */
/**
 * sdkFuncProductRelevanceFashionFbt output
 * @typedef {object} sdkFuncProductRelevanceFashionFbtOutput
 * @property {Array<sdkFuncProductRelevanceFashionFbtOutputResultsElement>} results
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionFbtOutputResultsElement
 * @property {string} rating
 * @property {Array<sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElement>} skus
 */
/**
 * @typedef {object} sdkFuncProductRelevanceFashionFbtOutputResultsElementSkusElement
 * @property {string} sku_id
 */
/**
 * sdkFuncProductRelevanceFashionFbt partitions
 * @typedef {object} sdkFuncProductRelevanceFashionFbtPartitions
 * @property {string} store_id
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
     * @param {apiIngestzStreamRelevanceFashionEventReq} req
     * @returns {Promise<apiIngestzStreamRelevanceFashionEventResp>}
     */
    ingestzStreamRelevanceFashionEvent(req: apiIngestzStreamRelevanceFashionEventReq): Promise<apiIngestzStreamRelevanceFashionEventResp>;
    /**
     *
     *
     *
     *
     * @param {apiDszListDatasetsReq} req
     * @returns {Promise<apiDszListDatasetsResp>}
     */
    dszListDatasets(req: apiDszListDatasetsReq): Promise<apiDszListDatasetsResp>;
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
     *
     *
     *
     *
     * @param {apiDszListRecsysTokensReq} req
     * @returns {Promise<apiDszListRecsysTokensResp>}
     */
    dszListRecsysTokens(req: apiDszListRecsysTokensReq): Promise<apiDszListRecsysTokensResp>;
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
     * @param {apiDszCreateStoreReq} req
     * @returns {Promise<apiDszCreateStoreResp>}
     */
    dszCreateStore(req: apiDszCreateStoreReq): Promise<apiDszCreateStoreResp>;
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
     * @param {apiDszDomainGetReq} req
     * @returns {Promise<apiDszDomainGetResp>}
     */
    dszDomainGet(req: apiDszDomainGetReq): Promise<apiDszDomainGetResp>;
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
     * @param {apiDszListIngestionTokensReq} req
     * @returns {Promise<apiDszListIngestionTokensResp>}
     */
    dszListIngestionTokens(req: apiDszListIngestionTokensReq): Promise<apiDszListIngestionTokensResp>;
    /**
     *
     *
     *
     *
     * @param {apiPipezStartReq} req
     * @returns {Promise<apiPipezStartResp>}
     */
    pipezStart(req: apiPipezStartReq): Promise<apiPipezStartResp>;
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
     * @param {apiDszCreateRecsysTokenReq} req
     * @returns {Promise<apiDszCreateRecsysTokenResp>}
     */
    dszCreateRecsysToken(req: apiDszCreateRecsysTokenReq): Promise<apiDszCreateRecsysTokenResp>;
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
     * Get Model Signed URLs
     *
     * Generates presigned URLs for accessing model files in the specified dataset.
     *
     * @param {apiDszModelGetReq} req
     * @returns {Promise<apiDszModelGetResp>}
     */
    dszModelGet(req: apiDszModelGetReq): Promise<apiDszModelGetResp>;
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
     * @returns {Promise<sdkFuncProductRelevanceFashionFbtResp>}
     */
    productRelevanceFashionFbtV1(req: sdkFuncProductRelevanceFashionFbtReq): Promise<sdkFuncProductRelevanceFashionFbtResp>;
    /**
     * @param {sdkFuncProductRelevanceFashionDashFunnelReq} req
     * @returns {Promise<sdkFuncProductRelevanceFashionDashFunnelResp>}
     */
    productRelevanceFashionDashFunnelV1(req: sdkFuncProductRelevanceFashionDashFunnelReq): Promise<sdkFuncProductRelevanceFashionDashFunnelResp>;
}
export { SdkFuncs };
