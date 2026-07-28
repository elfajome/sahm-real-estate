/**
 * TEMPORARY localStorage-backed store shared by the mock backend services.
 * Every key is namespaced with `sahm_mock_` so clearing the mock state never
 * touches the real session token (`sahm_token`).
 *
 * TODO(backend): delete this file together with the mock services once the
 * real API is integrated (switch happens in src/services/index.js).
 */
const PREFIX = 'sahm_mock_'

// One-time cleanup: purchases (and the invoices derived from them) were
// reset so testing can restart from a clean slate. Bump the version below to
// wipe them again in every browser on the next load.
const PURCHASES_RESET_VERSION = '2'
try {
  if (localStorage.getItem(PREFIX + 'purchases_reset') !== PURCHASES_RESET_VERSION) {
    localStorage.removeItem(PREFIX + 'purchases')
    localStorage.setItem(PREFIX + 'purchases_reset', PURCHASES_RESET_VERSION)
  }
} catch {
  /* storage unavailable — nothing to clean */
}

export function readStore(key, fallback = []) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? (JSON.parse(raw) ?? fallback) : fallback
  } catch {
    return fallback
  }
}

export function writeStore(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value))
  return value
}
