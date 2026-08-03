import { buildFormData } from '@/utils/buildFormData.js'
import { apiClient } from './apiClient.js'
import { withQuery } from './utils/withQuery.js'

function extractToken(payload) {
  if (!payload || typeof payload !== 'object') return null
  return payload.token ?? payload.access_token ?? payload.data?.token ?? null
}

// Exact `register` formdata contract (resources/sahm.postman_collection.json).
// `phone` is intentionally NOT forwarded — ADR decisions.md L-15: the field is
// shown in the UI but not sent to the API until the backend adds support.
const REGISTER_FIELDS = ['name', 'email', 'type', 'area_id', 'password', 'password_confirmation']

// Exact `update/profile` formdata contract — password fields go through the
// dedicated `change/password` endpoint (see changePassword below), never here.
const UPDATE_PROFILE_FIELDS = ['name', 'email', 'area_id', 'photo_profile']

function pickFields(fields, allowedKeys) {
  const payload = {}
  for (const key of allowedKeys) {
    if (fields[key] !== undefined) payload[key] = fields[key]
  }
  return payload
}

export const authService = {
  login: async ({ email, password }) => {
    const form = buildFormData({ email, password })
    const data = await apiClient.postForm('login', form)
    return {
      user: data?.user ?? data,
      token: extractToken(data) ?? extractToken({ token: data?.token }),
    }
  },

  register: (fields) => {
    const payload = pickFields(fields, REGISTER_FIELDS)
    // `construction_type[0]` is sent verbatim under its literal Postman key.
    if (fields['construction_type[0]'] !== undefined) {
      payload['construction_type[0]'] = fields['construction_type[0]']
    }
    return apiClient.postForm('register', buildFormData(payload))
  },

  logout: () => apiClient.postForm('logout', new FormData()),

  getProfile: () => apiClient.get('profile'),

  // Laravel method-spoofing: the real route is PUT, sent as POST + `_method`
  // (matches the Postman `update_profile` request exactly).
  updateProfile: (fields) => {
    const payload = { ...pickFields(fields, UPDATE_PROFILE_FIELDS), _method: 'put' }
    return apiClient.postForm('update/profile', buildFormData(payload))
  },

  // Postman `change_password`: PUT, params in the query string, empty body.
  changePassword: ({ current_password, password, password_confirmation }) =>
    apiClient.put(withQuery('change/password', { current_password, password, password_confirmation })),

  // Postman `is_notify`: POST, `is_notify` (0/1) form field.
  setNotify: (isNotify) =>
    apiClient.postForm('is_notify', buildFormData({ is_notify: isNotify ? 1 : 0 })),
}
