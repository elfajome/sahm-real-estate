import { Button } from '@/components/ui/Button.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { usePropertyActions } from '@/hooks/usePropertyActions.js'
import {
  IconCompare,
  IconHeart,
  IconHeartOutline,
  IconShare,
} from '@/components/icons/index.jsx'

/**
 * Detail page actions — delegates to the shared usePropertyActions hook,
 * the same toggle logic used by the Home and Listings cards (no duplication).
 */
export function PropertyDetailActions({ postId, title }) {
  const { t } = useLocale()
  const { isFavorite, isCompared, toggleFavorite, toggleCompare, share } = usePropertyActions()

  const favorite = isFavorite(postId)
  const compared = isCompared(postId)

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <Button
        type="button"
        variant={favorite ? 'accent' : 'outline'}
        size="sm"
        aria-pressed={favorite}
        onClick={() => toggleFavorite(postId)}
      >
        {favorite ? <IconHeart className="h-4 w-4" /> : <IconHeartOutline className="h-4 w-4" />}{' '}
        {favorite ? t('profile.removeFavorite') : t('listings.addToFavorites')}
      </Button>
      <Button
        type="button"
        variant={compared ? 'accent' : 'outline'}
        size="sm"
        aria-pressed={compared}
        onClick={() => toggleCompare(postId)}
      >
        <IconCompare className="h-4 w-4" />{' '}
        {compared ? t('listings.removeFromCompare') : t('listings.addToCompare')}
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => share(postId, title)}>
        <IconShare className="h-4 w-4" /> {t('listings.share')}
      </Button>
    </div>
  )
}
