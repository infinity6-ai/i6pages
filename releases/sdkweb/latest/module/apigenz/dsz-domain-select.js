export async function dszDomainSelect(services, params) {
  const resp = await services.invoker().invoke({
    method: "POST",
    path: `api/ds/solution-domain-select/dataset/${encodeURIComponent(String(params.dataset))}`,
    json: { domain: params.domain, solution: params.solution, store: params.store }
  });
  const result = { status: resp.status, ok: resp.ok };
  if (!resp.ok) {
    const text = await resp.text();
    try {
      result.error = JSON.parse(text);
    } catch {
      result.error = text;
    }
  }
  return result;
}
