import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input.jsx'
import { Button } from '@/components/ui/Button.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { useToast } from '@/components/ui/Toast.jsx'
import { contentService } from '@/services/index.js'

const schema = z.object({
  name: z.string().min(3),
  last_name: z.string().min(3),
  mobile: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
})

export function ContactForm() {
  const { t } = useLocale()
  const { showToast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    try {
      await contentService.storeContact(data)
      showToast(t('contact.success'))
      reset()
    } catch {
      showToast(t('common.error'), 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <h2 className="text-lg font-bold text-text">{t('contact.formTitle')}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label={t('contact.firstName')} error={errors.name?.message} {...register('name')} />
        <Input
          label={t('contact.lastName')}
          error={errors.last_name?.message}
          {...register('last_name')}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label={t('auth.phone')} error={errors.mobile?.message} {...register('mobile')} />
        <Input
          label={t('auth.email')}
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-text">
          {t('contact.message')}
        </label>
        <textarea
          id="message"
          rows={5}
          className="w-full rounded-lg border border-border px-3 py-2 text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          {...register('message')}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {t('contact.submit')}
      </Button>
    </form>
  )
}
