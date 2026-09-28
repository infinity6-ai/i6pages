export type PipezStartParams = {
    dataset: string;
    params: {
        name: string;
        value: string;
    }[];
    pipename: string;
    solution_domain: any;
};
export type PipezStartResult = {
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
        id: string;
    };
    /**
     * - Error body (parsed JSON, or raw text when not JSON), present only when not ok.
     */
    error?: any;
};
/**
 * @typedef {Object} PipezStartParams
 * @property {string} dataset
 * @property {{name: string, value: string}[]} params
 * @property {string} pipename
 * @property {*} solution_domain
 */
/**
 * @typedef {Object} PipezStartResult
 * @property {number} status - HTTP status code.
 * @property {boolean} ok - true when the status is 2xx.
 * @property {{id: string}} [body] - Parsed JSON body, present only when ok.
 * @property {*} [error] - Error body (parsed JSON, or raw text when not JSON), present only when not ok.
 */
/**
 * @param {import("../services/services.js").Services} services
 * @param {PipezStartParams} params
 * @returns {Promise<PipezStartResult>}
 */
export declare function pipezStart(services: import("../services/services.js").Services, params: PipezStartParams): Promise<PipezStartResult>;
