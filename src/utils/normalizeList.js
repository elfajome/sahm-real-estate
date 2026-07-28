function normalizeList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.aqars)) return data.aqars
  return []
}

export { normalizeList }
