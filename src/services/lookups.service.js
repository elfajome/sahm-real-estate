import { apiClient } from './apiClient.js'

/** Shared reference data — single source for areas, types, statuses. */
export const lookupsService = {
  getAreas: () => apiClient.get('areas'),
  // Postman `area_child`: sub-areas for a parent area id.
  getAreaChildren: (areaId) => apiClient.get(`area/${areaId}`),
  getAqarTypes: () => apiClient.get('aqar_types'),
  getAqarStatuses: () => apiClient.get('aqar_status'),
  getAqarNatures: () => apiClient.get('aqar_natures'),
  getConstructionTypes: () => apiClient.get('construction_types'),
  getUserTypes: () => apiClient.get('user_types'),
}
