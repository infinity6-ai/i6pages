export type IngestzGetUrlParams = {
    dataset: string;
    amount: number;
    partitions: Record<string, string>;
    table: any;
};
export type IngestzGetUrlResult = {
    /**
     * - HTTP status code.
     */
    status: number;
    /**
     * - true when the status is 2xx.
     */
    ok: boolean;
    /**
     * - Parsed JSON body, present only when ok.
     */
    body?: {
        ingest_id: string;
        uploads: string[];
    };
    /**
     * - Error body (parsed JSON, or raw text when not JSON), present only when not ok.
     */
    error?: any;
};
/**
 * @typedef {Object} IngestzGetUrlParams
 * @property {string} dataset
 * @property {number} amount
 * @property {Record<string, string>} partitions
 * @property {*} table
 */
/**
 * @typedef {Object} IngestzGetUrlResult
 * @property {number} status - HTTP status code.
 * @property {boolean} ok - true when the status is 2xx.
 * @property {{ingest_id: string, uploads: string[]}} [body] - Parsed JSON body, present only when ok.
 * @property {*} [error] - Error body (parsed JSON, or raw text when not JSON), present only when not ok.
 */
/**
 * @param {import("../services/services.js").Services} services
 * @param {IngestzGetUrlParams} params
 * @returns {Promise<IngestzGetUrlResult>}
 */
export declare function ingestzGetUrl(services: import("../services/services.js").Services, params: IngestzGetUrlParams): Promise<IngestzGetUrlResult>;
