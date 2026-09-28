export async function pipezStart(services, params) {
  const resp = await services.invoker().invoke({
    method: "POST",
    path: `api/pipe/start/dataset/${encodeURIComponent(String(params.dataset))}`,
    json: { params: params.params, pipename: params.pipename, solution_domain: params.solution_domain }
  });
  const result = { status: resp.status, ok: resp.ok };
  if (resp.ok) {
    result.body = await resp.json();
  }
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
