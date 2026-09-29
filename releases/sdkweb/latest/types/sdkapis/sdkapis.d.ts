/**
 * @typedef {import("../services/services.js").Services} Services
 */
export type Services = import("../services/services.js").Services;
export type apiDszDomainSelectReq = {
    params: apiDszDomainSelectparams;
    payload: apiDszDomainSelectreqPayload;
};
export type apiDszDomainSelectResp = object;
export type apiDszDomainSelectparams = {
    dataset: string;
};
export type apiDszDomainSelectreqPayload = {
    domain: string;
    solution: string;
    store: string;
};
export type apiIngestzGetUrlReq = {
    params: apiIngestzGetUrlparams;
    payload: apiIngestzGetUrlreqPayload;
};
export type apiIngestzGetUrlResp = {
    payload: apiIngestzGetUrlrespPayload;
};
export type apiIngestzGetUrlparams = {
    dataset: string;
};
export type apiIngestzGetUrlreqPayload = {
    amount: number;
    partitions: Record<string, string>;
    table: string;
};
export type apiIngestzGetUrlrespPayload = object;
export type apiPipezStartReq = {
    params: apiPipezStartparams;
    payload: apiPipezStartreqPayload;
};
export type apiPipezStartResp = {
    payload: apiPipezStartrespPayload;
};
export type apiPipezStartparams = {
    dataset: string;
};
export type apiPipezStartreqPayload = {
    params: Array<object>;
    pipename: string;
    solution_domain: string;
};
export type apiPipezStartrespPayload = object;
export type apiSamplefractionReq = {
    params: apiSamplefractionparams;
    query: apiSamplefractionquery;
    headers: apiSamplefractionreqHeaders;
    payload: apiSamplefractionreqPayload;
};
export type apiSamplefractionResp = {
    headers: apiSamplefractionrespHeaders;
    payload: apiSamplefractionrespPayload;
};
export type apiSamplefractionparams = {
    denominator: number;
    numerator: number;
};
export type apiSamplefractionquery = {
    precision: number;
};
export type apiSamplefractionreqHeaders = {
    x_i6_trace_id: string;
};
export type apiSamplefractionreqPayload = {
    reason: string;
};
export type apiSamplefractionrespHeaders = {
    x_i6_trace_message: string;
};
export type apiSamplefractionrespPayload = {
    display: string;
    result: string;
};
/**
 * apiDszDomainSelect Request
 * @typedef {object} apiDszDomainSelectReq
 * @property {apiDszDomainSelectparams} params
 * @property {apiDszDomainSelectreqPayload} payload
 */
/**
 * apiDszDomainSelect Response
 * @typedef {object} apiDszDomainSelectResp
 */
/**
 * @typedef {object} apiDszDomainSelectparams
 * @property {string} dataset
 */
/**
 * @typedef {object} apiDszDomainSelectreqPayload
 * @property {string} domain
 * @property {string} solution
 * @property {string} store
 */
/**
 * apiIngestzGetUrl Request
 * @typedef {object} apiIngestzGetUrlReq
 * @property {apiIngestzGetUrlparams} params
 * @property {apiIngestzGetUrlreqPayload} payload
 */
/**
 * apiIngestzGetUrl Response
 * @typedef {object} apiIngestzGetUrlResp
 * @property {apiIngestzGetUrlrespPayload} payload
 */
/**
 * @typedef {object} apiIngestzGetUrlparams
 * @property {string} dataset
 */
/**
 * @typedef {object} apiIngestzGetUrlreqPayload
 * @property {number} amount
 * @property {Record<string, string>} partitions
 * @property {string} table
 */
/**
 * @typedef {object} apiIngestzGetUrlrespPayload
 */
/**
 * apiPipezStart Request
 * @typedef {object} apiPipezStartReq
 * @property {apiPipezStartparams} params
 * @property {apiPipezStartreqPayload} payload
 */
/**
 * apiPipezStart Response
 * @typedef {object} apiPipezStartResp
 * @property {apiPipezStartrespPayload} payload
 */
/**
 * @typedef {object} apiPipezStartparams
 * @property {string} dataset
 */
/**
 * @typedef {object} apiPipezStartreqPayload
 * @property {Array<object>} params
 * @property {string} pipename
 * @property {string} solution_domain
 */
/**
 * @typedef {object} apiPipezStartrespPayload
 */
/**
 * apiSamplefraction Request
 * @typedef {object} apiSamplefractionReq
 * @property {apiSamplefractionparams} params
 * @property {apiSamplefractionquery} query
 * @property {apiSamplefractionreqHeaders} headers
 * @property {apiSamplefractionreqPayload} payload
 */
/**
 * apiSamplefraction Response
 * @typedef {object} apiSamplefractionResp
 * @property {apiSamplefractionrespHeaders} headers
 * @property {apiSamplefractionrespPayload} payload
 */
/**
 * @typedef {object} apiSamplefractionparams
 * @property {number} denominator
 * @property {number} numerator
 */
/**
 * @typedef {object} apiSamplefractionquery
 * @property {number} precision
 */
/**
 * @typedef {object} apiSamplefractionreqHeaders
 * @property {string} x_i6_trace_id
 */
/**
 * @typedef {object} apiSamplefractionreqPayload
 * @property {string} reason
 */
/**
 * @typedef {object} apiSamplefractionrespHeaders
 * @property {string} x_i6_trace_message
 */
/**
 * @typedef {object} apiSamplefractionrespPayload
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
     * @param {apiSamplefractionReq} req
     * @returns {Promise<apiSamplefractionResp>}
     */
    samplefraction(req: apiSamplefractionReq): Promise<apiSamplefractionResp>;
    /**
     * @param {apiIngestzGetUrlReq} req
     * @returns {Promise<apiIngestzGetUrlResp>}
     */
    ingestzGetUrl(req: apiIngestzGetUrlReq): Promise<apiIngestzGetUrlResp>;
    /**
     * @param {apiPipezStartReq} req
     * @returns {Promise<apiPipezStartResp>}
     */
    pipezStart(req: apiPipezStartReq): Promise<apiPipezStartResp>;
    /**
     * @param {apiDszDomainSelectReq} req
     * @returns {Promise<apiDszDomainSelectResp>}
     */
    dszDomainSelect(req: apiDszDomainSelectReq): Promise<apiDszDomainSelectResp>;
}
export { Apis };
