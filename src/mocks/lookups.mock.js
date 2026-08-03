/**
 * TEMPORARY mock lookup data — mirrors the backend lookup endpoints
 * (`areas`, `aqar_types`, `aqar_status`, `aqar_natures`, `user_types`,
 * `construction_types`) documented in docs/api/endpoint-map.md.
 *
 * SINGLE SOURCE OF TRUTH: every Area / type / status selector in the app
 * (search filters, registration, property form, construction form, mock
 * properties) consumes these collections through the service façade
 * (src/services/index.js) — never duplicate them elsewhere.
 *
 * Current development phase intentionally exposes ONLY two areas:
 * “Saudi Arabia” and “Demo”. Do NOT add more locations here.
 *
 * TODO(backend): replaced by `lookupsService` (src/services/lookups.service.js)
 * when the façade in src/services/index.js is flipped to the real backend.
 * The shapes are identical, so the UI and logic require zero changes.
 */
import { REAL_ESTATE_TYPES } from '@/constants/realEstateTypes.js'

export const areas = [
  { id: 1, name: 'Saudi Arabia' },
  { id: 2, name: 'Demo' },
]

/**
 * Approved Real Estate types — derived from the centralized configuration
 * (src/constants/realEstateTypes.js): Villa, Tower, Palace, Agricultural
 * Land, Company, Apartment. Same `{ id, name }` shape as the backend
 * `aqar_types` lookup. Do NOT add other types and do NOT duplicate this list
 * in components — conditional behavior is resolved by canonical name, so the
 * real backend ids are preserved automatically when the façade is flipped.
 */
export const propertyTypes = REAL_ESTATE_TYPES.map(({ id, name }) => ({ id, name }))

export const propertyStatuses = [
  { id: 1, name: 'Sale' },
  { id: 2, name: 'Rent' },
  { id: 3, name: 'Construction' },
]

/**
 * Real Estate natures — the Postman collection exposes GET `aqar_natures`
 * (used by `store/aqar`.`nature_id`) but ships no sample values, so these
 * placeholders only mirror the lookup SHAPE. They will be replaced by the
 * backend data — never hardcode nature ids in components.
 */
export const aqarNatures = [
  { id: 1, name: 'Residential' },
  { id: 2, name: 'Commercial' },
]

// Same schema as the backend `user_types` lookup — RegisterForm reads
// `construction_type_required` to decide whether to show the construction
// types field for the selected type.
// The ONLY two account types, always displayed with these exact Arabic
// labels: "مستخدم" and "مستخدم تجاري". Do NOT add more types and do NOT use
// English labels — the backend returns the same Arabic names.
export const userTypes = [
  { id: 1, name: 'مستخدم', construction_type_required: 0 },
  { id: 2, name: 'مستخدم تجاري', construction_type_required: 1 },
]

export const constructionTypes = [
  { id: 1, name: 'Residential Construction' },
  { id: 2, name: 'Commercial Construction' },
  { id: 3, name: 'Renovation' },
]

/** Same method names / return shapes as `lookupsService` (src/services/lookups.service.js). */
export const mockLookupsService = {
  getAreas: () => Promise.resolve(areas),
  // No area hierarchy modeled in the 2-area demo dataset (`areas` has no
  // parent/child relation) — resolves empty, matching "no children" for both.
  getAreaChildren: () => Promise.resolve([]),
  getAqarTypes: () => Promise.resolve(propertyTypes),
  getAqarStatuses: () => Promise.resolve(propertyStatuses),
  getAqarNatures: () => Promise.resolve(aqarNatures),
  getUserTypes: () => Promise.resolve(userTypes),
  getConstructionTypes: () => Promise.resolve(constructionTypes),
}
