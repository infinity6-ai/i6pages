export async function ingestzGetUrl(services, req) {
  const resp = await services.invoker().invoke({
    method: "POST",
    path: `api/ingest/get-url/dataset/${encodeURIComponent(String(req.params.dataset))}`,
    json: req.payload
  });
  const result = { status: resp.status, ok: resp.ok };
  if (resp.ok) {
    result.payload = await resp.json();
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
export async function pipezStart(services, req) {
  const resp = await services.invoker().invoke({
    method: "POST",
    path: `api/pipe/start/dataset/${encodeURIComponent(String(req.params.dataset))}`,
    json: req.payload
  });
  const result = { status: resp.status, ok: resp.ok };
  if (resp.ok) {
    result.payload = await resp.json();
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
export async function dszDomainSelect(services, req) {
  const resp = await services.invoker().invoke({
    method: "POST",
    path: `api/ds/solution-domain-select/dataset/${encodeURIComponent(String(req.params.dataset))}`,
    json: req.payload
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
export async function samplefraction(services, req) {
  const resp = await services.invoker().invoke({
    method: "POST",
    path: `api/gox/routez/sample/fraction/${encodeURIComponent(String(req.params.numerator))}/${encodeURIComponent(String(req.params.denominator))}`,
    query: req.query,
    headers: req.headers,
    json: req.payload
  });
  const result = { status: resp.status, ok: resp.ok };
  if (resp.ok) {
    result.payload = await resp.json();
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
