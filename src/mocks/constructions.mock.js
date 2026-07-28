/**
 * TEMPORARY mock constructions — mirrors `constructionsService`
 * (src/services/constructions.service.js). Requests are persisted in the
 * shared mock store and listed on /profile/requests via the user mock.
 *
 * TODO(backend): replaced by `constructionsService` when the façade in
 * src/services/index.js is flipped to the real backend.
 */
import { ApiError } from '@/services/ApiError.js'
import { getCurrentMockUser } from './auth.mock.js'
import { areas, constructionTypes } from './lookups.mock.js'
import { readStore, writeStore } from './storage.mock.js'

export const mockConstructionsService = {
  storeConstruction: (fields = {}) => {
    const user = getCurrentMockUser()
    if (!user) return Promise.reject(new ApiError(401, 'Unauthenticated'))
    const list = readStore('constructions')
    const request = {
      id: list.length + 1,
      title: fields.title ?? '',
      description: fields.description ?? '',
      space: Number(fields.space) || 0,
      construction_type:
        constructionTypes.find((ct) => String(ct.id) === String(fields.construction_type)) ?? null,
      area: areas.find((a) => String(a.id) === String(fields.area_id)) ?? null,
      // Uploaded File objects cannot be persisted in localStorage.
      image: null,
      user: { id: user.id, name: user.name },
      created_at: new Date().toISOString().slice(0, 10),
    }
    list.push(request)
    writeStore('constructions', list)
    return Promise.resolve(request)
  },
}
