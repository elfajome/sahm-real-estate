import { apiClient } from './apiClient.js'

/** Authenticated user collections — favorites, compares, purchases, owned listings. */
export const userService = {
  getFavorites: () => apiClient.get('favourites'),

  getCompares: () => apiClient.get('compares'),

  getPurchases: () => apiClient.get('purchases'),

  getUserAqars: () => apiClient.get('user/aqars'),

  getUserConstructions: () => apiClient.get('user/constructions'),
}
