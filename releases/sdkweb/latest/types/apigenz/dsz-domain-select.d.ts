export type DszDomainSelectParams = {
    dataset: string;
    domain: any;
    solution: any;
    store: string;
};
export type DszDomainSelectResult = {
    /**
     * - HTTP status code.
     */
    status: number;
    /**
     * - true when the status is 2xx.
     */
    ok: boolean;
    /**
     * - Error body (parsed JSON, or raw text when not JSON), present only when not ok.
     */
    error?: any;
};
/**
 * @typedef {Object} DszDomainSelectParams
 * @property {string} dataset
 * @property {*} domain
 * @property {*} solution
 * @property {string} store
 */
/**
 * @typedef {Object} DszDomainSelectResult
 * @property {number} status - HTTP status code.
 * @property {boolean} ok - true when the status is 2xx.
 * @property {*} [error] - Error body (parsed JSON, or raw text when not JSON), present only when not ok.
 */
/**
 * @param {import("../services/services.js").Services} services
 * @param {DszDomainSelectParams} params
 * @returns {Promise<DszDomainSelectResult>}
 */
export declare function dszDomainSelect(services: import("../services/services.js").Services, params: DszDomainSelectParams): Promise<DszDomainSelectResult>;
