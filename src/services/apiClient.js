import { ApiError } from './ApiError.js'

const TOKEN_KEY = 'sahm_token'
const DEFAULT_TIMEOUT = 30_000

let memoryToken = null
let memoryLang = 'ar'
let onUnauthorized = null

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

export function getToken() {
  return memoryToken ?? localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  memoryToken = token
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export function clearToken() {
  memoryToken = null
  localStorage.removeItem(TOKEN_KEY)
}

export function setApiLanguage(lang) {
  memoryLang = lang === 'en' ? 'en' : 'ar'
}

function getBaseUrl() {
  const base = import.meta.env.VITE_API_BASE_URL ?? ''
  return base.endsWith('/') ? base : `${base}/`
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') ?? ''
  let payload = null

  if (contentType.includes('application/json')) {
    payload = await response.json()
  } else {
    const text = await response.text()
    payload = text ? { message: text } : null
  }

  if (!response.ok) {
    const message =
      payload?.message ?? payload?.error ?? `Request failed (${response.status})`
    throw new ApiError(response.status, message, payload?.errors ?? payload?.details ?? {})
  }

  return payload?.data !== undefined ? payload.data : payload
}

async function request(method, endpoint, { body, headers = {}, timeout = DEFAULT_TIMEOUT } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  const token = getToken()
  const isFormData = body instanceof FormData

  const finalHeaders = {
    Accept: 'application/json',
    Lang: memoryLang,
    ...headers,
  }

  if (token) finalHeaders.Authorization = `Bearer ${token}`
  if (!isFormData && body !== undefined) finalHeaders['Content-Type'] = 'application/json'

  const url = endpoint.startsWith('http') ? endpoint : `${getBaseUrl()}${endpoint.replace(/^\//, '')}`

  try {
    const response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })

    if (response.status === 401 && token) {
      // Expired/invalid session only — login failures pass through as ApiError
      clearToken()
      onUnauthorized?.()
    }

    return await parseResponse(response)
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ApiError(408, 'Request timeout')
    }
    if (error instanceof ApiError) throw error
    throw new ApiError(0, error.message ?? 'Network error')
  } finally {
    clearTimeout(timer)
  }
}

export const apiClient = {
  get: (endpoint, options) => request('GET', endpoint, options),
  post: (endpoint, body, options) => request('POST', endpoint, { ...options, body }),
  postForm: (endpoint, formData, options) =>
    request('POST', endpoint, { ...options, body: formData }),
  put: (endpoint, body, options) => request('PUT', endpoint, { ...options, body }),
  delete: (endpoint, options) => request('DELETE', endpoint, options),
}
