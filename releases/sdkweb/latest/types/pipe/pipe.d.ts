/**
 * @fileoverview Pipe client for starting pipelines.
 */
export type Services = import("../services/services.js").Services;
export type StartParams = {
    /**
     * - Dataset the pipe runs on.
     */
    dataset: string;
    /**
     * - Name of the pipe to start.
     */
    pipename: string;
    /**
     * - Pipe parameters.
     */
    params?: {
        name: string;
        value: string;
    }[];
    /**
     * - Solution/domain the pipe runs in.
     */
    solutionDomain: any;
};
export type StartResult = {
    /**
     * - Id of the started pipe run.
     */
    id: string;
};
/**
 * @typedef {import("../services/services.js").Services} Services
 */
/**
 * Parameters for starting a pipe.
 * @typedef {Object} StartParams
 * @property {string} dataset - Dataset the pipe runs on.
 * @property {string} pipename - Name of the pipe to start.
 * @property {{name: string, value: string}[]} [params] - Pipe parameters.
 * @property {*} solutionDomain - Solution/domain the pipe runs in.
 */
/**
 * Result of a successful start.
 * @typedef {Object} StartResult
 * @property {string} id - Id of the started pipe run.
 */
/**
 * Client for starting pipes.
 */
declare class Pipe {
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs a Pipe client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * Starts a pipe (pipez-start API).
     * @param {StartParams} params - Start parameters.
     * @returns {Promise<StartResult>} The id of the started run.
     * @throws {I6Error} If the request fails.
     */
    start({ dataset, pipename, params, solutionDomain }: StartParams): Promise<StartResult>;
}
export { Pipe };
