import { useState } from 'react'
import { useLocale } from '@/hooks/useLocale.js'
import { Button } from '@/components/ui/Button.jsx'
import { contentService } from '@/services/index.js'
import { useToast } from '@/components/ui/Toast.jsx'

export function NewsletterInput() {
  const { t } = useLocale()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await contentService.storeNewsletter(email)
      setEmail('')
      showToast(t('footer.subscribeSuccess'))
    } catch {
      showToast(t('common.error'), 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('footer.emailPlaceholder')}
        required
        className="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus-visible:border-primary focus-visible:outline-none"
      />
      <Button type="submit" variant="accent" size="sm" disabled={loading}>
        {t('footer.subscribe')}
      </Button>
    </form>
  )
}
