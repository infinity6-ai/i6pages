export async function ingestzGetUrl(services, params) {
  const resp = await services.invoker().invoke({
    method: "POST",
    path: `api/ingest/get-url/dataset/${encodeURIComponent(String(params.dataset))}`,
    json: { amount: params.amount, partitions: params.partitions, table: params.table }
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
