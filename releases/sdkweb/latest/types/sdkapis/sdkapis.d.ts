/**
 * dszDomainSelect Request
 * @typedef {object} dszDomainSelectReq
 * @property {dszDomainSelectparams} params
 * @property {dszDomainSelectreqPayload} payload
 */
export type dszDomainSelectReq = {
    params: dszDomainSelectparams;
    payload: dszDomainSelectreqPayload;
};
export type dszDomainSelectResp = object;
export type dszDomainSelectparams = {
    dataset: string;
};
export type dszDomainSelectreqPayload = {
    domain: string;
    solution: string;
    store: string;
};
export type ingestzGetUrlReq = {
    params: ingestzGetUrlparams;
    payload: ingestzGetUrlreqPayload;
};
export type ingestzGetUrlResp = {
    payload: ingestzGetUrlrespPayload;
};
export type ingestzGetUrlparams = {
    dataset: string;
};
export type ingestzGetUrlreqPayload = {
    amount: number;
    partitions: Record<string, string>;
    table: string;
};
export type ingestzGetUrlrespPayload = object;
export type pipezStartReq = {
    params: pipezStartparams;
    payload: pipezStartreqPayload;
};
export type pipezStartResp = {
    payload: pipezStartrespPayload;
};
export type pipezStartparams = {
    dataset: string;
};
export type pipezStartreqPayload = {
    params: Array<object>;
    pipename: string;
    solution_domain: string;
};
export type pipezStartrespPayload = object;
export type samplefractionReq = {
    params: samplefractionparams;
    query: samplefractionquery;
    headers: samplefractionreqHeaders;
    payload: samplefractionreqPayload;
};
export type samplefractionResp = {
    headers: samplefractionrespHeaders;
    payload: samplefractionrespPayload;
};
export type samplefractionparams = {
    denominator: number;
    numerator: number;
};
export type samplefractionquery = {
    precision: number;
};
export type samplefractionreqHeaders = {
    x_i6_trace_id: string;
};
export type samplefractionreqPayload = {
    reason: string;
};
export type samplefractionrespHeaders = {
    x_i6_trace_message: string;
};
export type samplefractionrespPayload = {
    display: string;
    result: string;
};
/**
 * dszDomainSelect Response
 * @typedef {object} dszDomainSelectResp
 */
/**
 * @typedef {object} dszDomainSelectparams
 * @property {string} dataset
 */
/**
 * @typedef {object} dszDomainSelectreqPayload
 * @property {string} domain
 * @property {string} solution
 * @property {string} store
 */
/**
 * ingestzGetUrl Request
 * @typedef {object} ingestzGetUrlReq
 * @property {ingestzGetUrlparams} params
 * @property {ingestzGetUrlreqPayload} payload
 */
/**
 * ingestzGetUrl Response
 * @typedef {object} ingestzGetUrlResp
 * @property {ingestzGetUrlrespPayload} payload
 */
/**
 * @typedef {object} ingestzGetUrlparams
 * @property {string} dataset
 */
/**
 * @typedef {object} ingestzGetUrlreqPayload
 * @property {number} amount
 * @property {Record<string, string>} partitions
 * @property {string} table
 */
/**
 * @typedef {object} ingestzGetUrlrespPayload
 */
/**
 * pipezStart Request
 * @typedef {object} pipezStartReq
 * @property {pipezStartparams} params
 * @property {pipezStartreqPayload} payload
 */
/**
 * pipezStart Response
 * @typedef {object} pipezStartResp
 * @property {pipezStartrespPayload} payload
 */
/**
 * @typedef {object} pipezStartparams
 * @property {string} dataset
 */
/**
 * @typedef {object} pipezStartreqPayload
 * @property {Array<object>} params
 * @property {string} pipename
 * @property {string} solution_domain
 */
/**
 * @typedef {object} pipezStartrespPayload
 */
/**
 * samplefraction Request
 * @typedef {object} samplefractionReq
 * @property {samplefractionparams} params
 * @property {samplefractionquery} query
 * @property {samplefractionreqHeaders} headers
 * @property {samplefractionreqPayload} payload
 */
/**
 * samplefraction Response
 * @typedef {object} samplefractionResp
 * @property {samplefractionrespHeaders} headers
 * @property {samplefractionrespPayload} payload
 */
/**
 * @typedef {object} samplefractionparams
 * @property {number} denominator
 * @property {number} numerator
 */
/**
 * @typedef {object} samplefractionquery
 * @property {number} precision
 */
/**
 * @typedef {object} samplefractionreqHeaders
 * @property {string} x_i6_trace_id
 */
/**
 * @typedef {object} samplefractionreqPayload
 * @property {string} reason
 */
/**
 * @typedef {object} samplefractionrespHeaders
 * @property {string} x_i6_trace_message
 */
/**
 * @typedef {object} samplefractionrespPayload
 * @property {string} display
 * @property {string} result
 */
/**
 * @param {import("../services/services.js").Services} services
 * @param {samplefractionReq} req
 * @returns {Promise<samplefractionResp>}
 */
export declare function samplefraction(services: import("../services/services.js").Services, req: samplefractionReq): Promise<samplefractionResp>;
/**
 * @param {import("../services/services.js").Services} services
 * @param {ingestzGetUrlReq} req
 * @returns {Promise<ingestzGetUrlResp>}
 */
export declare function ingestzGetUrl(services: import("../services/services.js").Services, req: ingestzGetUrlReq): Promise<ingestzGetUrlResp>;
/**
 * @param {import("../services/services.js").Services} services
 * @param {pipezStartReq} req
 * @returns {Promise<pipezStartResp>}
 */
export declare function pipezStart(services: import("../services/services.js").Services, req: pipezStartReq): Promise<pipezStartResp>;
/**
 * @param {import("../services/services.js").Services} services
 * @param {dszDomainSelectReq} req
 * @returns {Promise<dszDomainSelectResp>}
 */
export declare function dszDomainSelect(services: import("../services/services.js").Services, req: dszDomainSelectReq): Promise<dszDomainSelectResp>;
