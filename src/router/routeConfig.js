import { ROUTES } from '@/constants/routes.js'

/** Route metadata for layout, auth guards, and breadcrumb labels. */
export const routeConfig = {
  [ROUTES.HOME]: { layout: 'main', auth: false, breadcrumb: 'breadcrumb.home' },
  [ROUTES.LISTINGS]: { layout: 'main', auth: false, breadcrumb: 'nav.listings' },
  [ROUTES.SERVICES]: { layout: 'main', auth: false, breadcrumb: 'nav.services' },
  [ROUTES.HELP]: { layout: 'main', auth: false, breadcrumb: 'nav.help' },
  [ROUTES.FAQ]: { layout: 'main', auth: false, breadcrumb: 'nav.faq' },
  [ROUTES.ABOUT]: { layout: 'main', auth: false, breadcrumb: 'nav.about' },
  [ROUTES.CONTACT]: { layout: 'main', auth: false, breadcrumb: 'nav.contact' },
  [ROUTES.PRIVACY]: { layout: 'main', auth: false, breadcrumb: 'nav.privacy' },
  [ROUTES.TERMS]: { layout: 'main', auth: false, breadcrumb: 'nav.terms' },
  [ROUTES.BLACKLIST]: { layout: 'main', auth: false, breadcrumb: 'nav.blacklist' },
  [ROUTES.LOGIN]: { layout: 'main', auth: false, breadcrumb: 'nav.login' },
  [ROUTES.REGISTER]: { layout: 'main', auth: false, breadcrumb: 'nav.register' },
  [ROUTES.LISTING_CREATE]: { layout: 'main', auth: true, breadcrumb: 'nav.addProperty' },
  [ROUTES.CONSTRUCTION_CREATE]: { layout: 'main', auth: true, breadcrumb: 'constructions.title' },
  [ROUTES.PROFILE_INFO]: { layout: 'dashboard', auth: true, breadcrumb: 'profile.nav.info' },
  [ROUTES.PROFILE_FAVORITES]: { layout: 'dashboard', auth: true, breadcrumb: 'profile.nav.favorites' },
  [ROUTES.PROFILE_COMPARE]: { layout: 'dashboard', auth: true, breadcrumb: 'profile.nav.compare' },
  [ROUTES.PROFILE_LISTINGS]: { layout: 'dashboard', auth: true, breadcrumb: 'profile.nav.listings' },
  [ROUTES.PROFILE_REQUESTS]: { layout: 'dashboard', auth: true, breadcrumb: 'profile.nav.requests' },
  [ROUTES.PROFILE_PURCHASES]: { layout: 'dashboard', auth: true, breadcrumb: 'profile.nav.purchases' },
  [ROUTES.PROFILE_INVOICES]: { layout: 'dashboard', auth: true, breadcrumb: 'profile.nav.invoices' },
  [ROUTES.PROFILE_NOTIFICATIONS]: { layout: 'dashboard', auth: true, breadcrumb: 'profile.nav.notifications' },
  [ROUTES.PROFILE_MESSAGES]: { layout: 'dashboard', auth: true, breadcrumb: 'profile.nav.messages' },
}

export function getRouteMeta(pathname) {
  if (routeConfig[pathname]) return routeConfig[pathname]
  if (/^\/real-estates\/\d+$/.test(pathname)) {
    return { layout: 'main', auth: false, breadcrumb: 'nav.listings' }
  }
  if (/^\/real-estates\/\d+\/edit$/.test(pathname)) {
    return { layout: 'main', auth: true, breadcrumb: 'nav.addProperty' }
  }
  return { layout: 'main', auth: false }
}
