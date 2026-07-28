import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input.jsx'
import { Button } from '@/components/ui/Button.jsx'
import { PageLoader } from '@/components/ui/PageLoader.jsx'
import { UserAvatar } from '@/components/ui/UserAvatar.jsx'
import { ProfilePageHeader } from '@/components/profile/ProfilePageHeader.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { useToast } from '@/components/ui/Toast.jsx'
// Data comes through the service façade (src/services/index.js) — currently
// the temporary mock backend. TODO(backend): flip the façade to go live.
import { authService } from '@/services/index.js'

export default function ProfileInfoPage() {
  const { t } = useLocale()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [userName, setUserName] = useState('')

  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    ;(async () => {
      try {
        const user = await authService.getProfile()
        reset({
          name: user.name ?? '',
          email: user.email ?? '',
          // Phone always mirrors the authenticated user (the number used at
          // Login/Register) — the same field the future profile endpoint
          // will populate, so no UI change is needed later.
          phone: user.phone ?? '',
        })
        setUserName(user.name ?? '')
        setAvatarPreview(user.image ?? user.avatar ?? null)
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    })()
  }, [reset])

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const fields = { name: data.name, email: data.email }
      if (data.password) {
        fields.password = data.password
        fields.password_confirmation = data.password_confirmation
      }
      if (avatarFile) fields.image = avatarFile
      await authService.updateProfile(fields)
      showToast(t('profile.saved'))
    } catch {
      showToast(t('common.error'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <ProfilePageHeader title={t('profile.nav.info')} />
      {/* The form is the main content area: it fills ALL remaining width
          beside the fixed-width sidebar (no artificial max-width), keeping
          the existing responsive behavior on tablet and mobile. */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-xl border border-border bg-white p-6">
        <div className="flex justify-center">
          <UserAvatar
            src={avatarPreview}
            name={userName}
            size="lg"
            editable
            onChange={(file) => {
              setAvatarFile(file)
              setAvatarPreview(URL.createObjectURL(file))
            }}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label={t('auth.name')} {...register('name')} />
          <Input label={t('auth.email')} type="email" {...register('email')} />
          <Input label={t('auth.phone')} disabled {...register('phone')} />
          <Input label={t('auth.password')} type="password" {...register('password')} />
          <Input
            label={t('auth.passwordConfirm')}
            type="password"
            {...register('password_confirmation')}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={submitting}>
            {t('profile.save')}
          </Button>
        </div>
      </form>
    </div>
  )
}
