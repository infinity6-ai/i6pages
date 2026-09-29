/**
 * @typedef {import("../services/services.js").Services} Services
 */
export type Services = import("../services/services.js").Services;
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
    partitions: Record<string, string>;
    /**
     * - Name of the table, inside the dataset, that receives the uploaded files.
     */
    table: string;
};
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
    uploads: Array<string>;
};
export type apiSamplefractionParams = {
    denominator: number;
    numerator: number;
};
export type apiSamplefractionQuery = {
    precision: number;
};
export type apiSamplefractionReq = {
    params: apiSamplefractionParams;
    query: apiSamplefractionQuery;
    headers: apiSamplefractionReqHeaders;
    payload: apiSamplefractionReqPayload;
};
export type apiSamplefractionReqHeaders = {
    x_i6_trace_id: string;
};
export type apiSamplefractionReqPayload = {
    reason: string;
};
export type apiSamplefractionResp = {
    headers: apiSamplefractionRespHeaders;
    payload: apiSamplefractionRespPayload;
};
export type apiSamplefractionRespHeaders = {
    x_i6_trace_message: string;
};
export type apiSamplefractionRespPayload = {
    display: string;
    result: string;
};
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
 * @property {Record<string, string>} partitions - Partition key/value pairs that select the table partition the files are ingested into.
 * @property {string} table - Name of the table, inside the dataset, that receives the uploaded files.
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
 * @property {Array<string>} uploads - Presigned PUT URLs, one per requested file; upload each file to its URL.
 */
/**
 * apiSamplefraction params
 * @typedef {object} apiSamplefractionParams
 * @property {number} denominator
 * @property {number} numerator
 */
/**
 * apiSamplefraction query
 * @typedef {object} apiSamplefractionQuery
 * @property {number} precision
 */
/**
 * apiSamplefraction Request
 * @typedef {object} apiSamplefractionReq
 * @property {apiSamplefractionParams} params
 * @property {apiSamplefractionQuery} query
 * @property {apiSamplefractionReqHeaders} headers
 * @property {apiSamplefractionReqPayload} payload
 */
/**
 * apiSamplefraction reqHeaders
 * @typedef {object} apiSamplefractionReqHeaders
 * @property {string} x_i6_trace_id
 */
/**
 * apiSamplefraction reqPayload
 * @typedef {object} apiSamplefractionReqPayload
 * @property {string} reason
 */
/**
 * apiSamplefraction Response
 * @typedef {object} apiSamplefractionResp
 * @property {apiSamplefractionRespHeaders} headers
 * @property {apiSamplefractionRespPayload} payload
 */
/**
 * apiSamplefraction respHeaders
 * @typedef {object} apiSamplefractionRespHeaders
 * @property {string} x_i6_trace_message
 */
/**
 * apiSamplefraction respPayload
 * @typedef {object} apiSamplefractionRespPayload
 * @property {string} display
 * @property {string} result
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
     * @param {apiSamplefractionReq} req
     * @returns {Promise<apiSamplefractionResp>}
     */
    samplefraction(req: apiSamplefractionReq): Promise<apiSamplefractionResp>;
    /**
     * Get Ingestion Upload URLs
     *
     * Generates presigned PUT URLs and an ingestion token for uploading files into a target dataset table and partitions.
     *
     * @param {apiIngestzGetUrlReq} req
     * @returns {Promise<apiIngestzGetUrlResp>}
     */
    ingestzGetUrl(req: apiIngestzGetUrlReq): Promise<apiIngestzGetUrlResp>;
}
export { Apis };
