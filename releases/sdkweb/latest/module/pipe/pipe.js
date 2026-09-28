import { pipezStart } from "../sdkapis/sdkapis.js";
import { I6Error } from "../errors.js";
class Pipe {
  /**
   * Constructs a Pipe client instance.
   * @param {Services} services - The services manager instance.
   */
  constructor(services) {
    this._services = services;
  }
  /**
   * Starts a pipe (pipez-start API).
   * @param {StartParams} params - Start parameters.
   * @returns {Promise<StartResult>} The id of the started run.
   * @throws {I6Error} If the request fails.
   */
  async start({ dataset, pipename, params = [], solutionDomain }) {
    const resp = await pipezStart(this._services, {
      params: { dataset },
      payload: { pipename, params, solution_domain: solutionDomain }
    });
    if (!resp.ok) {
      throw I6Error.fromResult("Start pipe failed", resp);
    }
    return { id: resp.payload.id };
  }
}
export { Pipe };
