import { ROUTES } from './routes.js'
import {
  MdOutlinePerson,
  MdOutlineFavoriteBorder,
  MdOutlineCompareArrows,
  MdOutlineFormatListBulleted,
  MdOutlineDescription,
  MdOutlineShoppingBag,
  MdOutlineReceipt,
} from '@/components/icons/index.jsx'

// Notifications & Messages are intentionally NOT part of the sidebar — their
// pages stay registered in the router and are reached from the Navbar icons
// only (see src/components/layout/AuthenticatedTopBar.jsx).
export const profileNav = [
  { key: 'info', route: ROUTES.PROFILE_INFO, labelKey: 'profile.nav.info', icon: MdOutlinePerson },
  { key: 'favorites', route: ROUTES.PROFILE_FAVORITES, labelKey: 'profile.nav.favorites', icon: MdOutlineFavoriteBorder },
  { key: 'compare', route: ROUTES.PROFILE_COMPARE, labelKey: 'profile.nav.compare', icon: MdOutlineCompareArrows },
  { key: 'listings', route: ROUTES.PROFILE_LISTINGS, labelKey: 'profile.nav.listings', icon: MdOutlineFormatListBulleted },
  { key: 'requests', route: ROUTES.PROFILE_REQUESTS, labelKey: 'profile.nav.requests', icon: MdOutlineDescription },
  { key: 'purchases', route: ROUTES.PROFILE_PURCHASES, labelKey: 'profile.nav.purchases', icon: MdOutlineShoppingBag },
  { key: 'invoices', route: ROUTES.PROFILE_INVOICES, labelKey: 'profile.nav.invoices', icon: MdOutlineReceipt },
]
