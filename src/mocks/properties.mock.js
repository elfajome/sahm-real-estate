import { ApiError } from '@/services/ApiError.js'
import { areas, propertyTypes, propertyStatuses } from './lookups.mock.js'
import { getCurrentMockUser } from './auth.mock.js'
import { readStore, writeStore } from './storage.mock.js'

/**
 * TEMPORARY mock properties — exactly the same schema as the backend `aqars`
 * endpoint (see docs/api/endpoint-map.md and resources/sahm.postman_collection.json),
 * so replacing this mock with the real API later requires NO UI changes.
 *
 * Every property belongs to one of the ONLY two allowed areas for the current
 * development phase — “Saudi Arabia” and “Demo” — taken from the shared
 * lookups collection (src/mocks/lookups.mock.js), so the filter options and
 * the property data always stay synchronized. The same applies to the
 * `aqar_type` of every property: only the approved Real Estate types
 * (Villa, Tower, Palace, Agricultural Land, Company, Apartment) are used.
 *
 * User actions (favorites, compares, purchases, created listings, comments)
 * are persisted in the shared mock store (storage.mock.js).
 *
 * TODO(backend): replaced by `listingsService` when the façade in
 * src/services/index.js is flipped to the real backend.
 */

const img = (seed) => `https://picsum.photos/seed/sahm-${seed}/800/600`
const area = (id) => areas.find((a) => a.id === id)
const type = (id) => propertyTypes.find((t) => t.id === id)
const status = (id) => propertyStatuses.find((s) => s.id === id)

/**
 * Property owners — the `user` object the backend returns inside each aqar
 * (see the `owner/:id` endpoint). Properties that carry an owner show the
 * "تواصل مع المالك" button; the chat mock reuses these users as
 * conversation participants.
 */
export const mockPropertyOwners = {
  ahmed: { id: 901, name: 'أحمد محمد', image: null },
  modernBuild: { id: 902, name: 'شركة البناء الحديث', image: null },
  sara: { id: 903, name: 'سارة علي', image: null },
}

export const mockProperties = [
  {
    id: 1,
    title: 'Cozy Furnished Studio for Rent',
    description: 'Compact fully furnished studio near the business district — an ideal first rental.',
    price: 4500,
    image: img(1),
    images: [{ url: img(1) }, { url: img('1b') }],
    area: area(1),
    aqar_type: type(1),
    aqar_status: status(2),
    ownership: 'residential',
    room_no: 0,
    hall_no: 0,
    bathroom_no: 1,
    garage_no: 0,
    floor: 2,
    space: 38,
    features: ['Furnished', 'Air Conditioning', 'Elevator'],
    pin: 0,
    featured: false,
    offer: 0,
    user_type: 'individual',
    user: mockPropertyOwners.ahmed,
    created_at: '2026-07-16',
  },
  {
    id: 2,
    title: 'Luxury Villa with Private Swimming Pool',
    description: 'Prestigious 5-bedroom villa with landscaped garden, pool and double garage.',
    price: 525000,
    image: img(2),
    images: [{ url: img(2) }, { url: img('2b') }],
    area: area(2),
    aqar_type: type(2),
    aqar_status: status(1),
    ownership: 'ownership',
    room_no: 5,
    hall_no: 3,
    bathroom_no: 6,
    garage_no: 2,
    floor: 0,
    space: 620,
    features: ['Swimming Pool', 'Garden', 'Garage', 'Air Conditioning', 'Balcony'],
    // Featured flag — drives the fixed "التثبيت" ribbon on the Home page
    // Featured Properties section only (same field comes from the backend).
    isFeatured: true,
    pin: 1,
    featured: true,
    offer: 0,
    user_type: 'individual',
    user: mockPropertyOwners.sara,
    created_at: '2026-06-02',
  },
  {
    id: 3,
    title: 'Residential Land in Quiet District',
    description: 'Flat 900 m² residential plot ready to build, close to schools and services.',
    price: 95000,
    image: img(3),
    images: [{ url: img(3) }],
    area: area(1),
    aqar_type: type(5),
    aqar_status: status(1),
    ownership: 'residential',
    room_no: 0,
    hall_no: 0,
    bathroom_no: 0,
    garage_no: 0,
    floor: 0,
    space: 900,
    features: [],
    pin: 0,
    featured: false,
    offer: 0,
    user_type: 'individual',
    created_at: '2026-05-20',
  },
  {
    id: 4,
    title: 'Modern Open-Plan Office',
    description: 'Bright open-plan office with meeting rooms in a serviced tower.',
    price: 28000,
    image: img(4),
    images: [{ url: img(4) }],
    area: area(1),
    aqar_type: type(6),
    aqar_status: status(2),
    ownership: 'company',
    room_no: 4,
    hall_no: 1,
    bathroom_no: 2,
    garage_no: 0,
    floor: 7,
    space: 210,
    features: ['Elevator', 'Air Conditioning'],
    pin: 0,
    featured: false,
    offer: 0,
    user_type: 'company',
    user: mockPropertyOwners.modernBuild,
    created_at: '2026-06-18',
  },
  {
    id: 5,
    title: 'Retail Shop on Main Street',
    description: 'High-footfall retail shop with wide storefront — discounted for a limited time.',
    price: 18500,
    old_price: 22000,
    image: img(5),
    images: [{ url: img(5) }],
    area: area(2),
    aqar_type: type(6),
    aqar_status: status(2),
    ownership: 'company',
    room_no: 1,
    hall_no: 0,
    bathroom_no: 1,
    garage_no: 0,
    floor: 0,
    space: 85,
    features: ['Air Conditioning'],
    pin: 0,
    featured: false,
    offer: 1,
    user_type: 'company',
    created_at: '2026-06-25',
  },
  {
    id: 6,
    title: 'Off-Plan Residential Tower Project',
    description: 'Company construction project: 20-unit residential tower, delivery in 18 months.',
    price: 480000,
    image: img(6),
    images: [{ url: img(6) }, { url: img('6b') }],
    area: area(1),
    aqar_type: type(3),
    aqar_status: status(3),
    ownership: 'company',
    room_no: 20,
    hall_no: 10,
    bathroom_no: 16,
    garage_no: 12,
    floor: 0,
    space: 1500,
    features: ['Elevator', 'Garage'],
    pin: 0,
    featured: true,
    offer: 0,
    user_type: 'company',
    created_at: '2026-04-30',
  },
  {
    id: 7,
    title: 'Furnished 2-Bedroom Apartment near Corniche',
    description: 'Recently added, fully furnished 2-bedroom apartment with sea breeze balcony.',
    price: 9800,
    image: img(7),
    images: [{ url: img(7) }],
    area: area(2),
    aqar_type: type(1),
    aqar_status: status(2),
    ownership: 'residential',
    room_no: 2,
    hall_no: 1,
    bathroom_no: 2,
    garage_no: 0,
    floor: 4,
    space: 110,
    features: ['Furnished', 'Balcony', 'Air Conditioning', 'Elevator'],
    pin: 0,
    featured: false,
    offer: 0,
    user_type: 'individual',
    user: mockPropertyOwners.ahmed,
    created_at: '2026-07-14',
  },
  {
    id: 8,
    title: 'Family Villa with Large Garden',
    description: 'Pinned listing: 4-bedroom family villa with mature garden and covered garage.',
    price: 310000,
    image: img(8),
    images: [{ url: img(8) }],
    area: area(1),
    aqar_type: type(2),
    aqar_status: status(1),
    ownership: 'ownership',
    room_no: 4,
    hall_no: 2,
    bathroom_no: 4,
    garage_no: 1,
    floor: 0,
    space: 380,
    features: ['Garden', 'Garage', 'Balcony'],
    isFeatured: true,
    pin: 1,
    featured: false,
    offer: 0,
    user_type: 'individual',
    user: mockPropertyOwners.sara,
    created_at: '2026-05-05',
  },
  {
    id: 9,
    title: 'Affordable 1-Bedroom Apartment',
    description: 'Budget-friendly 1-bedroom apartment — a smart entry purchase.',
    price: 42000,
    image: img(9),
    images: [{ url: img(9) }],
    area: area(1),
    aqar_type: type(1),
    aqar_status: status(1),
    ownership: 'ownership',
    room_no: 1,
    hall_no: 1,
    bathroom_no: 1,
    garage_no: 0,
    floor: 1,
    space: 65,
    features: ['Balcony'],
    pin: 0,
    featured: false,
    offer: 0,
    user_type: 'individual',
    created_at: '2026-03-22',
  },
  {
    id: 10,
    title: 'Premium Penthouse with Panoramic City View',
    description: 'Top-floor luxury penthouse with private pool access and full furnishing.',
    price: 545000,
    image: img(10),
    images: [{ url: img(10) }, { url: img('10b') }],
    area: area(2),
    aqar_type: type(1),
    aqar_status: status(1),
    ownership: 'ownership',
    room_no: 4,
    hall_no: 2,
    bathroom_no: 5,
    garage_no: 2,
    floor: 24,
    space: 320,
    features: ['Swimming Pool', 'Elevator', 'Balcony', 'Air Conditioning', 'Furnished'],
    pin: 0,
    featured: true,
    offer: 0,
    user_type: 'individual',
    user: mockPropertyOwners.modernBuild,
    created_at: '2026-06-10',
  },
  {
    id: 11,
    title: 'Commercial Land on Airport Road',
    description: 'Strategic 2,500 m² commercial plot with main-road frontage.',
    price: 220000,
    image: img(11),
    images: [{ url: img(11) }],
    area: area(1),
    aqar_type: type(5),
    aqar_status: status(1),
    ownership: 'company',
    room_no: 0,
    hall_no: 0,
    bathroom_no: 0,
    garage_no: 0,
    floor: 0,
    space: 2500,
    features: [],
    pin: 0,
    featured: false,
    offer: 0,
    user_type: 'company',
    created_at: '2026-02-14',
  },
  {
    id: 12,
    title: 'Full Residential Building with 8 Units',
    description: 'Income-generating residential building, fully leased, with elevator and parking.',
    price: 498000,
    image: img(12),
    images: [{ url: img(12) }],
    area: area(2),
    aqar_type: type(3),
    aqar_status: status(1),
    ownership: 'company',
    room_no: 16,
    hall_no: 8,
    bathroom_no: 12,
    garage_no: 8,
    floor: 0,
    space: 1200,
    features: ['Elevator', 'Garage'],
    pin: 0,
    featured: false,
    offer: 0,
    user_type: 'company',
    created_at: '2026-04-08',
  },
  {
    id: 13,
    title: '3-Bedroom Apartment Under Construction',
    description: 'Discounted off-plan 3-bedroom apartment, handover next year.',
    price: 130000,
    old_price: 150000,
    image: img(13),
    images: [{ url: img(13) }],
    area: area(1),
    aqar_type: type(1),
    aqar_status: status(3),
    ownership: 'residential',
    room_no: 3,
    hall_no: 1,
    bathroom_no: 2,
    garage_no: 1,
    floor: 5,
    space: 145,
    features: ['Balcony', 'Elevator'],
    pin: 0,
    featured: false,
    offer: 1,
    user_type: 'company',
    created_at: '2026-05-28',
  },
  {
    id: 14,
    title: 'Compact Shop inside Shopping Mall',
    description: 'Small ready-to-operate shop unit inside a busy mall.',
    price: 75000,
    image: img(14),
    images: [{ url: img(14) }],
    area: area(2),
    aqar_type: type(6),
    aqar_status: status(1),
    ownership: 'ownership',
    room_no: 1,
    hall_no: 0,
    bathroom_no: 0,
    garage_no: 0,
    floor: 2,
    space: 40,
    features: ['Air Conditioning', 'Elevator'],
    pin: 0,
    featured: false,
    offer: 0,
    user_type: 'individual',
    created_at: '2026-03-09',
  },
  {
    id: 15,
    title: 'Spacious Mountain-View Villa Under Construction',
    description: '5-bedroom villa under construction with garden and garage, mountain views.',
    price: 265000,
    image: img(15),
    images: [{ url: img(15) }],
    area: area(2),
    aqar_type: type(2),
    aqar_status: status(3),
    ownership: 'ownership',
    room_no: 5,
    hall_no: 2,
    bathroom_no: 5,
    garage_no: 2,
    floor: 0,
    space: 450,
    features: ['Garage', 'Garden'],
    pin: 0,
    featured: false,
    offer: 0,
    user_type: 'individual',
    created_at: '2026-06-29',
  },
  {
    id: 16,
    title: 'Executive Office Floor for Sale',
    description: 'Whole executive floor with 5 offices, parking and central AC.',
    price: 160000,
    image: img(16),
    images: [{ url: img(16) }],
    area: area(2),
    aqar_type: type(6),
    aqar_status: status(1),
    ownership: 'company',
    room_no: 5,
    hall_no: 1,
    bathroom_no: 2,
    garage_no: 3,
    floor: 9,
    space: 260,
    features: ['Elevator', 'Air Conditioning', 'Garage'],
    pin: 0,
    featured: false,
    offer: 0,
    user_type: 'company',
    created_at: '2026-01-30',
  },
  {
    id: 17,
    title: 'Budget 2-Bedroom Apartment for Rent',
    description: 'Very affordable 2-bedroom apartment close to the city center.',
    price: 6200,
    image: img(17),
    images: [{ url: img(17) }],
    area: area(1),
    aqar_type: type(1),
    aqar_status: status(2),
    ownership: 'residential',
    room_no: 2,
    hall_no: 1,
    bathroom_no: 1,
    garage_no: 0,
    floor: 3,
    space: 90,
    features: ['Air Conditioning'],
    pin: 0,
    featured: false,
    offer: 0,
    user_type: 'individual',
    created_at: '2026-07-10',
  },
  {
    id: 18,
    title: 'Agricultural Land for Long-Term Rent',
    description: 'Large 5,000 m² agricultural plot with water access, long-term lease.',
    price: 15000,
    image: img(18),
    images: [{ url: img(18) }],
    area: area(1),
    aqar_type: type(5),
    aqar_status: status(2),
    ownership: 'ownership',
    room_no: 0,
    hall_no: 0,
    bathroom_no: 0,
    garage_no: 0,
    floor: 0,
    space: 5000,
    features: [],
    pin: 0,
    featured: false,
    offer: 0,
    user_type: 'individual',
    created_at: '2026-02-02',
  },
]

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/** Static dataset + user-created listings (persisted in the mock store). */
export const getAllMockProperties = () => [...mockProperties, ...readStore('user_aqars')]

const findProperty = (id) =>
  getAllMockProperties().find((p) => String(p.id) === String(id)) ?? null

// Accepts a single id, an array of ids, or a comma-separated list ("1,3").
// Multi-select uses OR inside a group; different groups combine with AND
// (the sequential filters below).
const toIdList = (value) => {
  if (value == null || value === '') return []
  const list = Array.isArray(value) ? value : String(value).split(',')
  return list.map((v) => String(v).trim()).filter(Boolean)
}

// Toggles an id inside a persisted id list (favorites / compares).
const toggleStoredId = (key, postId) => {
  const ids = readStore(key)
  const idStr = String(postId)
  const next = ids.includes(idStr) ? ids.filter((v) => v !== idStr) : [...ids, idStr]
  writeStore(key, next)
  return next.includes(idStr)
}

const today = () => new Date().toISOString().slice(0, 10)

/**
 * Same method names / return shapes as `listingsService` (src/services/listings.service.js).
 * `getListings` accepts the exact backend query params:
 * search, area_id, aqar_type, aqar_status, from_price, to_price, pin.
 * area_id / aqar_type / aqar_status also accept comma-separated id lists
 * for the multi-select checkbox filters.
 */
export const mockListingsService = {
  getListings: (params = {}) => {
    const { search, area_id, aqar_type, aqar_status, from_price, to_price, pin } = params
    let result = getAllMockProperties()

    if (search) {
      const q = String(search).toLowerCase()
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      )
    }
    const areaIds = toIdList(area_id)
    if (areaIds.length) result = result.filter((p) => areaIds.includes(String(p.area.id)))
    const typeIds = toIdList(aqar_type)
    if (typeIds.length) result = result.filter((p) => typeIds.includes(String(p.aqar_type.id)))
    const statusIds = toIdList(aqar_status)
    if (statusIds.length)
      result = result.filter((p) => statusIds.includes(String(p.aqar_status.id)))
    if (from_price) result = result.filter((p) => p.price >= Number(from_price))
    if (to_price) result = result.filter((p) => p.price <= Number(to_price))
    if (pin != null && pin !== '') result = result.filter((p) => p.pin === Number(pin))

    // Pinned first, then newest — same ordering the backend applies.
    result.sort((a, b) => b.pin - a.pin || new Date(b.created_at) - new Date(a.created_at))
    return Promise.resolve(result)
  },

  getListing: (id) => {
    const property = findProperty(id)
    if (!property) return Promise.resolve(null)
    const comments = readStore('comments', {})[String(id)] ?? []
    return Promise.resolve({ ...property, comments })
  },

  toggleFavorite: (postId) => Promise.resolve({ added: toggleStoredId('favorites', postId) }),

  toggleCompare: (postId) => Promise.resolve({ added: toggleStoredId('compares', postId) }),

  buyNow: (postId) => {
    const property = findProperty(postId)
    if (!property) return Promise.reject(new ApiError(404, 'Property not found'))
    const purchases = readStore('purchases')
    // Never store the same property twice in "My Purchases". The duplicate
    // check lives HERE (service layer, single implementation) and the result
    // exposes an `already_purchased` flag — the real backend can return the
    // same flag, so flipping the façade requires zero UI changes.
    const idStr = String(postId)
    if (purchases.some((p) => String(p.id ?? p.post_id) === idStr)) {
      return Promise.resolve({ success: true, already_purchased: true })
    }
    purchases.push({ ...property, created_at: today() })
    writeStore('purchases', purchases)
    return Promise.resolve({ success: true, already_purchased: false })
  },

  storeAqar: (fields = {}) => {
    const owner = getCurrentMockUser()
    if (!owner) return Promise.reject(new ApiError(401, 'Unauthenticated'))
    const list = readStore('user_aqars')
    const id = 100000 + list.length + 1 // never clashes with the static dataset
    const property = {
      id,
      title: fields.title ?? '',
      description: fields.description ?? '',
      price: Number(fields.price) || 0,
      // Uploaded File objects cannot be persisted — a placeholder image keeps
      // the cards rendering correctly.
      image: img(`user-${id}`),
      images: [{ url: img(`user-${id}`) }],
      area: area(Number(fields.area_id)) ?? areas[0],
      aqar_type: type(Number(fields.aqar_type)) ?? propertyTypes[0],
      aqar_status: status(Number(fields.type_id)) ?? propertyStatuses[0],
      ownership: 'ownership',
      room_no: Number(fields.room_no) || 0,
      hall_no: Number(fields.hall_no) || 0,
      bathroom_no: Number(fields.bathroom_no) || 0,
      garage_no: Number(fields.garage_no) || 0,
      street_no: Number(fields.street_no) || 0,
      nature_id: Number(fields.nature_id) || 0,
      floor: Number(fields.floor) || 0,
      space: Number(fields.space) || 0,
      features: [],
      pin: Number(fields.pin) || 0,
      featured: false,
      offer: 0,
      user_type: 'individual',
      user: { id: owner.id, name: owner.name },
      created_at: today(),
    }
    list.push(property)
    writeStore('user_aqars', list)
    return Promise.resolve(property)
  },

  updateAqar: (fields = {}) => {
    const list = readStore('user_aqars')
    const index = list.findIndex((p) => String(p.id) === String(fields.post_id))
    if (index === -1) return Promise.reject(new ApiError(404, 'Property not found'))
    const current = list[index]
    list[index] = {
      ...current,
      title: fields.title ?? current.title,
      description: fields.description ?? current.description,
      price: fields.price != null ? Number(fields.price) : current.price,
      area: area(Number(fields.area_id)) ?? current.area,
      aqar_type: type(Number(fields.aqar_type)) ?? current.aqar_type,
      aqar_status: status(Number(fields.type_id)) ?? current.aqar_status,
      room_no: fields.room_no != null ? Number(fields.room_no) : current.room_no,
      hall_no: fields.hall_no != null ? Number(fields.hall_no) : current.hall_no,
      bathroom_no:
        fields.bathroom_no != null ? Number(fields.bathroom_no) : current.bathroom_no,
      garage_no: fields.garage_no != null ? Number(fields.garage_no) : current.garage_no,
      street_no: fields.street_no != null ? Number(fields.street_no) : (current.street_no ?? 0),
      nature_id: fields.nature_id != null ? Number(fields.nature_id) : (current.nature_id ?? 0),
      floor: fields.floor != null ? Number(fields.floor) : current.floor,
      space: fields.space != null ? Number(fields.space) : current.space,
      pin: fields.pin != null ? Number(fields.pin) : current.pin,
    }
    writeStore('user_aqars', list)
    return Promise.resolve(list[index])
  },

  deleteAqar: (postId) => {
    const list = readStore('user_aqars')
    const next = list.filter((p) => String(p.id) !== String(postId))
    if (next.length === list.length)
      return Promise.reject(new ApiError(404, 'Property not found'))
    writeStore('user_aqars', next)
    return Promise.resolve({ success: true })
  },

  storeComment: ({ model_id, body, stars } = {}) => {
    const author = getCurrentMockUser()
    if (!author) return Promise.reject(new ApiError(401, 'Unauthenticated'))
    const all = readStore('comments', {})
    const key = String(model_id)
    const list = all[key] ?? []
    list.push({
      id: Date.now(),
      body,
      stars,
      user: { id: author.id, name: author.name },
      created_at: today(),
    })
    all[key] = list
    writeStore('comments', all)
    return Promise.resolve({ success: true })
  },
}
