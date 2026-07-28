export const ROUTES = {
  HOME: '/',
  LISTINGS: '/real-estates',
  LISTING_DETAIL: '/real-estates/:id',
  LISTING_CREATE: '/real-estates/create',
  LISTING_EDIT: '/real-estates/:id/edit',
  CONSTRUCTION_CREATE: '/constructions/create',
  SERVICES: '/services',
  HELP: '/help',
  FAQ: '/faq',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  BLACKLIST: '/blacklist-reasons',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE_INFO: '/profile/info',
  PROFILE_FAVORITES: '/profile/favorites',
  PROFILE_COMPARE: '/profile/compare',
  PROFILE_LISTINGS: '/profile/listings',
  PROFILE_REQUESTS: '/profile/requests',
  PROFILE_PURCHASES: '/profile/purchases',
  PROFILE_INVOICES: '/profile/invoices',
  PROFILE_NOTIFICATIONS: '/profile/notifications',
  PROFILE_MESSAGES: '/profile/messages',
}

export const listingDetailPath = (id) => `/real-estates/${id}`
export const listingEditPath = (id) => `/real-estates/${id}/edit`

export const loginPath = (returnUrl) => {
  if (!returnUrl) return ROUTES.LOGIN
  return `${ROUTES.LOGIN}?returnUrl=${encodeURIComponent(returnUrl)}`
}

export const listingsPathWithParams = (params) => {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value))
    }
  })
  const qs = search.toString()
  return qs ? `${ROUTES.LISTINGS}?${qs}` : ROUTES.LISTINGS
}
