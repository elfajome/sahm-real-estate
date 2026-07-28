/**
 * TEMPORARY mock user collections — mirrors `userService`
 * (src/services/user.service.js) method-for-method: favorites, compares,
 * purchases, owned listings and construction requests, all persisted in the
 * shared mock store so they survive reloads.
 *
 * TODO(backend): replaced by `userService` when the façade in
 * src/services/index.js is flipped to the real backend.
 */
import { ApiError } from '@/services/ApiError.js'
import { getCurrentMockUser } from './auth.mock.js'
import { getAllMockProperties } from './properties.mock.js'
import { readStore } from './storage.mock.js'

const unauthenticated = () => Promise.reject(new ApiError(401, 'Unauthenticated'))

const propertiesByStoredIds = (key) => {
  const ids = readStore(key)
  return getAllMockProperties().filter((p) => ids.includes(String(p.id)))
}

export const mockUserService = {
  getFavorites: () => {
    if (!getCurrentMockUser()) return unauthenticated()
    return Promise.resolve(propertiesByStoredIds('favorites'))
  },

  getCompares: () => {
    if (!getCurrentMockUser()) return unauthenticated()
    return Promise.resolve(propertiesByStoredIds('compares'))
  },

  getPurchases: () => {
    if (!getCurrentMockUser()) return unauthenticated()
    return Promise.resolve(readStore('purchases'))
  },

  getUserAqars: () => {
    const user = getCurrentMockUser()
    if (!user) return unauthenticated()
    return Promise.resolve(readStore('user_aqars').filter((p) => p.user?.id === user.id))
  },

  getUserConstructions: () => {
    const user = getCurrentMockUser()
    if (!user) return unauthenticated()
    return Promise.resolve(readStore('constructions').filter((c) => c.user?.id === user.id))
  },
}
