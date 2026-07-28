import { apiClient } from './apiClient.js'
import { buildFormData } from '@/utils/buildFormData.js'

export const constructionsService = {
  storeConstruction: (fields) =>
    apiClient.postForm('store/construction', buildFormData(fields)),
}
