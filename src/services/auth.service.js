import { buildFormData } from '@/utils/buildFormData.js'
import { apiClient } from './apiClient.js'

function extractToken(payload) {
  if (!payload || typeof payload !== 'object') return null
  return payload.token ?? payload.access_token ?? payload.data?.token ?? null
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

  register: (fields) => apiClient.postForm('register', buildFormData(fields)),

  logout: () => apiClient.postForm('logout', new FormData()),

  getProfile: () => apiClient.get('profile'),

  updateProfile: (fields) => apiClient.postForm('update/profile', buildFormData(fields)),
}
