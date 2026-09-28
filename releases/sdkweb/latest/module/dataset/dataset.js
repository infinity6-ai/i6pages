import { dszDomainSelect } from "../sdkapis/sdkapis.js";
import { I6Error } from "../errors.js";
class Dataset {
  /**
   * Constructs a Dataset client instance.
   * @param {Services} services - The services manager instance.
   */
  constructor(services) {
    this._services = services;
  }
  /**
   * Selects the solution domain of a dataset (dsz-domain-select API).
   * @param {SelectDomainParams} params - Selection parameters.
   * @returns {Promise<void>} Resolves when the domain is selected.
   * @throws {I6Error} If the request fails.
   */
  async selectDomain({ dataset, domain, solution, store }) {
    const resp = await dszDomainSelect(this._services, {
      params: { dataset },
      payload: { domain, solution, store }
    });
    if (!resp.ok) {
      throw I6Error.fromResult("Select domain failed", resp);
    }
  }
}
export { Dataset };
