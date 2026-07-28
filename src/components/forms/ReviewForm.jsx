import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button.jsx'
import { StarRating } from '@/components/ui/StarRating.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { useAuth } from '@/hooks/useAuth.js'
import { useToast } from '@/components/ui/Toast.jsx'
import { listingsService } from '@/services/index.js'

export function ReviewForm({ postId, onSubmitted }) {
  const { t } = useLocale()
  const { isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const [stars, setStars] = useState(5)
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  if (!isAuthenticated) {
    return <p className="text-sm text-text-muted">{t('listings.loginToReview')}</p>
  }

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      await listingsService.storeComment({
        model: 'Post',
        model_id: postId,
        body: data.body,
        stars,
      })
      showToast(t('listings.reviewSuccess'))
      reset()
      setStars(5)
      onSubmitted?.()
    } catch {
      showToast(t('common.error'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border border-border p-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-text">{t('listings.rating')}</label>
        <StarRating value={stars} onChange={setStars} />
      </div>
      <div>
        <label htmlFor="review-body" className="mb-1 block text-sm font-medium text-text">
          {t('listings.reviewPlaceholder')}
        </label>
        <textarea
          id="review-body"
          rows={3}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          {...register('body', { required: true })}
        />
      </div>
      <Button type="submit" size="sm" disabled={submitting}>
        {t('listings.submitReview')}
      </Button>
    </form>
  )
}
