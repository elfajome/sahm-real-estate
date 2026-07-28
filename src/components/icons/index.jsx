import {
  FaBath,
  FaBed,
  FaChevronRight,
  FaExchangeAlt,
  FaHardHat,
  FaHeart,
  FaHome,
  FaInstagram,
  FaKey,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaRegHeart,
  FaRegUser,
  FaRulerCombined,
  FaSearch,
  FaShareAlt,
  FaStar,
  FaTimes,
  FaUser,
} from 'react-icons/fa'
import { BsFillBuildingsFill } from 'react-icons/bs'
import { GiHouseKeys } from 'react-icons/gi'
import { FaSnapchat, FaWhatsapp, FaXTwitter } from 'react-icons/fa6'
import {
  MdOutlineApartment,
  MdOutlineCalendarToday,
  MdOutlineChair,
  MdOutlineDirectionsCar,
  MdOutlineFileUpload,
  MdOutlineInbox,
  MdOutlineLocationOn,
  MdOutlineMail,
  MdOutlinePhone,
} from 'react-icons/md'

/**
 * Central icons module — the single source of truth for every icon in the app.
 *
 * Two ways to consume it:
 * 1. Raw react-icons re-exports — import the icon name directly.
 * 2. `IconX` wrappers — stable names with default sizing shared across pages.
 *
 * Components must import icons ONLY from this file, never from `react-icons/*`
 * directly, so the icon set stays consistent and easy to audit.
 */

// ── Raw react-icons re-exports ──────────────────────────────────────────────
export {
  FaCamera,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaRegHeart,
  FaSignInAlt,
  FaStar,
  FaUserPlus,
} from 'react-icons/fa'
export { FaRegMessage, FaSnapchat, FaWhatsapp, FaXTwitter } from 'react-icons/fa6'
export { FiFilter, FiGrid, FiList, FiMenu, FiMinus, FiPlus, FiSearch, FiX } from 'react-icons/fi'
export {
  MdArrowForward,
  MdLogout,
  MdOutlineCampaign,
  MdOutlineChat,
  MdOutlineCompareArrows,
  MdOutlineDescription,
  MdOutlineFavoriteBorder,
  MdOutlineFormatListBulleted,
  MdOutlineHomeWork,
  MdOutlineLocalOffer,
  MdOutlinePerson,
  MdOutlineReceipt,
  MdOutlineShoppingBag,
  MdSend,
} from 'react-icons/md'
export { IoIosLogOut } from 'react-icons/io'
export { IoNotificationsCircleOutline } from 'react-icons/io5'
export { CgProfile } from 'react-icons/cg'

// ── Named wrappers (stable API, default sizing) ─────────────────────────────

export function IconMail({ className = 'h-5 w-5' }) {
  return <MdOutlineMail className={className} aria-hidden />
}

export function IconPhone({ className = 'h-5 w-5' }) {
  return <MdOutlinePhone className={className} aria-hidden />
}

export function IconLocations({ className = 'h-4 w-4' }) {
  return <MdOutlineLocationOn className={className} aria-hidden />
}

export function IconWhatsapp({ className = 'h-5 w-5 text-accent' }) {
  return <FaWhatsapp className={className} aria-hidden />
}

export function IconInstagram({ className = 'h-5 w-5 text-accent' }) {
  return <FaInstagram className={className} aria-hidden />
}

export function IconTwitter({ className = 'h-5 w-5 text-accent' }) {
  return <FaXTwitter className={className} aria-hidden />
}

export function IconSnapchat({ className = 'h-5 w-5 text-accent' }) {
  return <FaSnapchat className={className} aria-hidden />
}

export function IconSale({ className = 'h-7 w-7' }) {
  return <FaHome className={className} aria-hidden />
}

export function IconSales({ className = 'h-7 w-7' }) {
  return <BsFillBuildingsFill className={className} aria-hidden />
}

export function IconRents({ className = 'h-7 w-7' }) {
  return <GiHouseKeys className={className} aria-hidden />
}

export function IconCustomers({ className = 'h-7 w-7' }) {
  return <FaRegUser className={className} aria-hidden />
}

export function IconSell({ className = 'h-7 w-7' }) {
  return <GiHouseKeys className={className} aria-hidden />
}

export function IconRent({ className = 'h-7 w-7' }) {
  return <FaKey className={className} aria-hidden />
}

export function IconLand({ className = 'h-7 w-7' }) {
  return <FaMapMarkedAlt className={className} aria-hidden />
}

export function IconConstruction({ className = 'h-7 w-7' }) {
  return <FaHardHat className={className} aria-hidden />
}

export function IconBed({ className = 'h-4 w-4' }) {
  return <FaBed className={className} aria-hidden />
}

export function IconBath({ className = 'h-4 w-4' }) {
  return <FaBath className={className} aria-hidden />
}

export function IconArea({ className = 'h-4 w-4' }) {
  return <FaRulerCombined className={className} aria-hidden />
}

export function IconStar({ className = 'h-4 w-4' }) {
  return <FaStar className={className} aria-hidden />
}

export function IconHeart({ className = 'h-5 w-5' }) {
  return <FaHeart className={className} aria-hidden />
}

export function IconHeartOutline({ className = 'h-5 w-5' }) {
  return <FaRegHeart className={className} aria-hidden />
}

export function IconCompare({ className = 'h-5 w-5' }) {
  return <FaExchangeAlt className={className} aria-hidden />
}

export function IconShare({ className = 'h-5 w-5' }) {
  return <FaShareAlt className={className} aria-hidden />
}

export function IconSearch({ className = 'h-5 w-5' }) {
  return <FaSearch className={className} aria-hidden />
}

export function IconUser({ className = 'h-5 w-5' }) {
  return <FaUser className={className} aria-hidden />
}

export function IconLocation({ className = 'h-4 w-4' }) {
  return <FaMapMarkerAlt className={className} aria-hidden />
}

export function IconClose({ className = 'h-5 w-5' }) {
  return <FaTimes className={className} aria-hidden />
}

export function IconUpload({ className = 'h-6 w-6' }) {
  return <MdOutlineFileUpload className={className} aria-hidden />
}

export function IconChevron({ className = 'h-5 w-5' }) {
  return <FaChevronRight className={className} aria-hidden />
}

export function IconInbox({ className = 'h-12 w-12' }) {
  return <MdOutlineInbox className={className} aria-hidden />
}

export function IconCalendar({ className = 'h-4 w-4' }) {
  return <MdOutlineCalendarToday className={className} aria-hidden />
}

export function IconHall({ className = 'h-4 w-4' }) {
  return <MdOutlineChair className={className} aria-hidden />
}

export function IconGarage({ className = 'h-4 w-4' }) {
  return <MdOutlineDirectionsCar className={className} aria-hidden />
}

export function IconFloor({ className = 'h-4 w-4' }) {
  return <MdOutlineApartment className={className} aria-hidden />
}

const TAB_ICONS = {
  sale: IconSale,
  rent: IconRent,
  land: IconLand,
  construction: IconConstruction,
}

export function TabIcon({ tabKey, className }) {
  const Icon = TAB_ICONS[tabKey] ?? IconSale
  return <Icon className={className} />
}
