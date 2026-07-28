import { apiClient } from './apiClient.js'
import { buildFormData } from '@/utils/buildFormData.js'
import { withQuery } from './utils/withQuery.js'

export const listingsService = {
  getListings: (params = {}) => apiClient.get(withQuery('aqars', params)),

  getListing: (id) => apiClient.get(`aqar/${id}`),

  toggleFavorite: (postId) =>
    apiClient.postForm('toggle_fav', buildFormData({ post_id: postId })),

  toggleCompare: (postId) =>
    apiClient.postForm('toggle_compare', buildFormData({ post_id: postId })),

  buyNow: (postId) => apiClient.postForm('buy_now', buildFormData({ post_id: postId })),

  storeAqar: (fields) => apiClient.postForm('store/aqar', buildFormData(fields)),

  updateAqar: (fields) => apiClient.postForm('update/aqar', buildFormData(fields)),

  deleteAqar: (postId) => apiClient.postForm('delete/aqar', buildFormData({ post_id: postId })),

  storeComment: (fields) => apiClient.postForm('store_comment', buildFormData(fields)),
}
