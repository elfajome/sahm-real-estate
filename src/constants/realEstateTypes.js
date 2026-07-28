/**
 * Centralized Real Estate type configuration — SINGLE SOURCE OF TRUTH for
 * the approved Real Estate types and their conditional "More" section
 * behavior (implement.md).
 *
 * Two responsibilities, two sources of truth:
 * - API contract (field names, ids, payload shape):
 *   the backend API collection (`store/aqar`) — field names here
 *   (`room_no`, `hall_no`, `bathroom_no`, `street_no`, `garage_no`, `floor`,
 *   `space`, `nature_id`) are the EXACT Postman/backend names.
 * - UI conditional-field matrix: implement.md §12 — which fields are
 *   visible/required per selected Real Estate type.
 *
 * Approved types (the ONLY types the app may offer anywhere):
 *   Villa — فيلا, Tower — برج, Palace — قصر,
 *   Agricultural Land — أرض زراعية, Company — شركة, Apartment — شقة
 *
 * IDs: the `id` values below seed the MOCK `aqar_types` lookup only
 * (src/mocks/lookups.mock.js). At runtime, components always use the id
 * coming from the lookup service (mock today, backend later) and resolve the
 * conditional behavior by canonical `name` via `resolveRealEstateTypeKey` —
 * so backend ids are preserved automatically when the façade is flipped.
 *
 * Localization: `name` doubles as the `lookups.<name>` translation key
 * (see src/utils/lookupLabel.js). Business logic NEVER depends on the
 * translated label — only on the stable `key` resolved from the lookup item.
 */

export const REAL_ESTATE_TYPES = [
  { id: 1, key: 'apartment', name: 'Apartment' },
  { id: 2, key: 'villa', name: 'Villa' },
  { id: 3, key: 'tower', name: 'Tower' },
  { id: 4, key: 'palace', name: 'Palace' },
  { id: 5, key: 'agricultural_land', name: 'Agricultural Land' },
  { id: 6, key: 'company', name: 'Company' },
]

/**
 * Conditional "More" section fields, in display order (implement.md §8).
 * Keys are the exact Postman `store/aqar` field names.
 */
export const CONDITIONAL_FIELD_ORDER = [
  'space', // المساحة — Area
  'floor', // الدور — Floor
  'room_no', // عدد الغرف — Number of Rooms
  'hall_no', // عدد الصالات — Number of Halls
  'bathroom_no', // عدد دورات المياه — Number of Bathrooms
  'garage_no', // عدد الجراجات — Number of Garages
  'street_no', // عدد الواجهات — Number of Facades (Postman: street_no)
  'nature_id', // طبيعة العقار — Real Estate Nature (aqar_natures lookup)
]

/** Presentation metadata per conditional field (label key + control type). */
export const CONDITIONAL_FIELD_META = {
  space: { labelKey: 'propertyForm.area', input: 'number', step: 'any' },
  floor: { labelKey: 'propertyForm.floor', input: 'number', step: '1' },
  room_no: { labelKey: 'propertyForm.rooms', input: 'number', step: '1' },
  hall_no: { labelKey: 'propertyForm.halls', input: 'number', step: '1' },
  bathroom_no: { labelKey: 'propertyForm.bathrooms', input: 'number', step: '1' },
  garage_no: { labelKey: 'propertyForm.garages', input: 'number', step: '1' },
  street_no: { labelKey: 'propertyForm.facades', input: 'number', step: '1' },
  nature_id: { labelKey: 'propertyForm.nature', input: 'select' },
}

/**
 * Backend-safe defaults for conditional fields hidden for the selected type
 * — the Postman `store/aqar` contract includes every field, so hidden ones
 * are submitted with these defaults, never with stale user input
 * (implement.md §14).
 */
export const CONDITIONAL_FIELD_DEFAULTS = {
  space: '0',
  floor: '0',
  room_no: '0',
  hall_no: '0',
  bathroom_no: '0',
  garage_no: '0',
  street_no: '0',
  nature_id: '0',
}

/**
 * UI conditional-field matrix (implement.md §12).
 * Per type key: field → 'required' | 'optional'; omitted → HIDDEN (the field
 * is NOT rendered). Content (`description`) and Price (`price`) are always
 * visible and required for every type, so they are not part of this matrix.
 */
const TYPE_FIELD_RULES = {
  villa: { room_no: 'required' },
  tower: { floor: 'optional', room_no: 'required' },
  palace: {
    space: 'required',
    floor: 'optional',
    room_no: 'required',
    hall_no: 'required',
    bathroom_no: 'required',
    garage_no: 'required',
    street_no: 'required',
    nature_id: 'required',
  },
  agricultural_land: { space: 'optional', street_no: 'required' },
  company: {},
  apartment: {},
}

/**
 * Resolves the stable type key for a selected lookup id.
 * Matching is done on the canonical lookup `name` (backend value), NEVER on
 * a translated label or a hardcoded id — so ids stay backend-driven and
 * changing the app language never changes behavior (implement.md §27).
 */
export function resolveRealEstateTypeKey(types, selectedId) {
  if (selectedId == null || selectedId === '') return null
  const item = (types ?? []).find((ty) => String(ty.id) === String(selectedId))
  if (!item) return null
  const name = String(item.name ?? item.title ?? '').toLowerCase()
  return REAL_ESTATE_TYPES.find((ty) => ty.name.toLowerCase() === name)?.key ?? null
}

/**
 * Visibility/required rules for a type key.
 * Returns { visible: string[], required: string[] } in display order.
 * Unknown/unselected type → no conditional fields (Content + Price only).
 */
export function getConditionalFieldRules(typeKey) {
  const spec = TYPE_FIELD_RULES[typeKey] ?? {}
  const visible = CONDITIONAL_FIELD_ORDER.filter((name) => spec[name])
  const required = visible.filter((name) => spec[name] === 'required')
  return { visible, required }
}
