export function withQuery(endpoint, params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.set(k, String(v))
  })
  const qs = query.toString()
  return qs ? `${endpoint}?${qs}` : endpoint
}
