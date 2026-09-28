/**
 * @fileoverview Dataset client for selecting the solution domain of a dataset.
 */
export type Services = import("../services/services.js").Services;
export type SelectDomainParams = {
    /**
     * - Dataset to configure.
     */
    dataset: string;
    /**
     * - Domain to select.
     */
    domain: any;
    /**
     * - Solution the domain belongs to.
     */
    solution: any;
    /**
     * - Store the selection applies to.
     */
    store: string;
};
/**
 * @typedef {import("../services/services.js").Services} Services
 */
/**
 * Parameters for selecting a solution domain.
 * @typedef {Object} SelectDomainParams
 * @property {string} dataset - Dataset to configure.
 * @property {*} domain - Domain to select.
 * @property {*} solution - Solution the domain belongs to.
 * @property {string} store - Store the selection applies to.
 */
/**
 * Client for dataset operations.
 */
declare class Dataset {
    /**
     * @private
     * @type {Services}
     */
    _services;
    /**
     * Constructs a Dataset client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services: Services);
    /**
     * Selects the solution domain of a dataset (dsz-domain-select API).
     * @param {SelectDomainParams} params - Selection parameters.
     * @returns {Promise<void>} Resolves when the domain is selected.
     * @throws {I6Error} If the request fails.
     */
    selectDomain({ dataset, domain, solution, store }: SelectDomainParams): Promise<void>;
}
export { Dataset };
