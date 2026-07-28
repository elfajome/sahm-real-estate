import { apiClient } from './apiClient.js'
import { buildFormData } from '@/utils/buildFormData.js'

export const contentService = {
  getAbout: () => apiClient.get('about'),

  storeContact: (fields) => apiClient.postForm('store-contact', buildFormData(fields)),

  storeNewsletter: (email) =>
    apiClient.postForm('store-newsletter', buildFormData({ email })),
}
