export function buildFormData(fields) {
  const fd = new FormData()
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v instanceof File) fd.append(`${key}[]`, v)
        else fd.append(key.endsWith('[]') ? key : `${key}[]`, v)
      })
    } else if (value instanceof File) {
      fd.append(key, value)
    } else {
      fd.append(key, String(value))
    }
  })
  return fd
}
