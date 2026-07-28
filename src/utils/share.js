import { listingDetailPath } from '@/constants/routes.js'

export function getListingShareUrl(id) {
  return `${window.location.origin}${listingDetailPath(id)}`
}

export async function shareListing(id, title) {
  const url = getListingShareUrl(id)
  if (navigator.share) {
    await navigator.share({ title, url })
    return
  }
  await navigator.clipboard.writeText(url)
}
