import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// Data comes through the service façade (src/services/index.js) — currently
// the temporary mock backend, resolved by property id from the same dataset
// as the Listings page. TODO(backend): flip the façade to go live.
import { listingsService } from '@/services/index.js'
import { PageLoader } from '@/components/ui/PageLoader.jsx'
import { Badge } from '@/components/ui/Badge.jsx'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { StarRating } from '@/components/ui/StarRating.jsx'
import { ImageGallery } from '@/components/property/ImageGallery.jsx'
import { MapEmbed } from '@/components/property/MapEmbed.jsx'
import { formatPrice } from '@/utils/formatPrice.js'
import { useLocale } from '@/hooks/useLocale.js'
import { BuyNowButton } from '@/components/property/BuyNowButton.jsx'
import { ContactOwnerButton } from '@/components/property/ContactOwnerButton.jsx'
import { PropertyDetailActions } from '@/components/property/PropertyDetailActions.jsx'
import { PropertyFeaturesGrid } from '@/components/property/PropertyFeaturesGrid.jsx'
import { ReviewForm } from '@/components/forms/ReviewForm.jsx'
import { IconLocation, IconSale, IconUser } from '@/components/icons/index.jsx'

function normalizeComments(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.comments)) return data.comments
  if (Array.isArray(data?.data?.comments)) return data.data.comments
  return []
}

export default function PropertyDetailPage() {
  const { id } = useParams()
  const { t, locale } = useLocale()
  const [item, setItem] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await listingsService.getListing(id)
      setItem(data)
      setComments(normalizeComments(data))
    } catch {
      setItem(null)
      setComments([])
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  if (loading) return <PageLoader />
  if (!item) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <span className="flex justify-center text-border" aria-hidden>
          <IconSale className="h-12 w-12" />
        </span>
        <p className="mt-4 text-text-muted">{t('listings.notFound')}</p>
      </div>
    )
  }

  const status = item.status?.name ?? item.aqar_status?.name
  const location = item.area?.name ?? item.location ?? '—'
  const owner = item.user?.name ?? item.owner?.name ?? item.user_name

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 lg:px-6">
      <div className="grid gap-8 lg:grid-cols-2">
        <ImageGallery item={item} />
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-text">{item.title ?? item.name}</h1>
            {status && <Badge variant="accent">{status}</Badge>}
          </div>
          <p className="mt-2 text-2xl font-bold text-accent">{formatPrice(item.price, locale)}</p>
          <p className="mt-2 flex items-center gap-2 text-sm text-text-muted">
            <IconLocation className="h-4 w-4 text-accent" />
            {location}
          </p>
          {owner && (
            <p className="mt-1 flex items-center gap-2 text-sm text-text-muted">
              <IconUser className="h-4 w-4 text-accent" />
              {owner}
            </p>
          )}
          <p className="mt-4 text-text-muted">{item.description}</p>
          <div className="mt-6">
            <PropertyFeaturesGrid item={item} />
          </div>
          <PropertyDetailActions postId={id} title={item.title ?? item.name} />
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <BuyNowButton postId={id} />
            {/* Entry point to the messaging system — renders only when the
                property data carries an owner (`user`). */}
            <ContactOwnerButton owner={item.user} />
          </div>
        </div>
      </div>

      <section>
        <SectionTitle title={t('listings.location')} />
        <MapEmbed lat={item.lat} lng={item.lng} className="mt-4" />
      </section>

      <section>
        <SectionTitle title={t('listings.reviews')} />
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <ReviewForm postId={id} onSubmitted={load} />
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-sm text-text-muted">{t('listings.noReviews')}</p>
            ) : (
              comments.map((c) => (
                <article
                  key={c.id ?? c.body}
                  className="rounded-xl border border-border bg-white p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-text">{c.user?.name ?? c.name ?? '—'}</p>
                    <StarRating value={Number(c.stars ?? c.rating ?? 0)} readOnly size="sm" />
                  </div>
                  <p className="mt-2 text-sm text-text-muted">{c.body ?? c.comment}</p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
