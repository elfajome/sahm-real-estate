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

  // Postman `delete_aqar`: DELETE method, `post_id` in the query string (NOT
  // a POST form body — confirmed against resources/sahm.postman_collection.json).
  deleteAqar: (postId) => apiClient.delete(withQuery('delete/aqar', { post_id: postId })),

  storeComment: (fields) => apiClient.postForm('store_comment', buildFormData(fields)),

  getOwner: (id) => apiClient.get(`owner/${id}`),

  // Postman `delete_image`: DELETE method, `post_id` + `image_id` in the query string.
  deleteImage: (postId, imageId) =>
    apiClient.delete(withQuery('delete_image', { post_id: postId, image_id: imageId })),
}
