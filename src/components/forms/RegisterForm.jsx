import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input.jsx'
import { Select } from '@/components/ui/Select.jsx'
import { Button } from '@/components/ui/Button.jsx'
import { ConstructionTypeField } from './ConstructionTypeField.jsx'
import { buildRegisterSchema } from '@/validation/registerSchema.js'
import { useLocale } from '@/hooks/useLocale.js'
import { ROUTES } from '@/constants/routes.js'
// Services come through the façade (src/services/index.js) — currently the
// temporary mock backend. TODO(backend): flip the façade to go live.
import { authService, lookupsService } from '@/services/index.js'
import { login } from '@/store/slices/authSlice.js'
import { normalizeList } from '@/utils/normalizeList.js'
import { lookupLabel } from '@/utils/lookupLabel.js'

export function RegisterForm() {
  const { t } = useLocale()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [userTypes, setUserTypes] = useState([])
  const [areas, setAreas] = useState([])
  const [constructionTypes, setConstructionTypes] = useState([])
  const [selectedType, setSelectedType] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const requiresConstruction = Number(selectedType?.construction_type_required ?? 0) === 1

  const schema = useMemo(() => buildRegisterSchema(requiresConstruction), [requiresConstruction])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const watchType = watch('type')

  useEffect(() => {
    ;(async () => {
      const [types, areaList, cTypes] = await Promise.all([
        lookupsService.getUserTypes(),
        lookupsService.getAreas(),
        lookupsService.getConstructionTypes(),
      ])
      setUserTypes(normalizeList(types))
      setAreas(normalizeList(areaList))
      setConstructionTypes(normalizeList(cTypes))
    })()
  }, [])

  useEffect(() => {
    const found = userTypes.find((ut) => String(ut.id) === String(watchType))
    setSelectedType(found ?? null)
  }, [watchType, userTypes])

  const onSubmit = async (data) => {
    setSubmitting(true)
    setError(null)
    try {
      const payload = {
        name: data.name,
        email: data.email,
        // The phone entered here is what the profile page displays — it must
        // reach the (mock or real) backend with the rest of the account data.
        phone: data.phone,
        type: data.type,
        area_id: data.area_id,
        password: data.password,
        password_confirmation: data.password_confirmation,
      }
      if (requiresConstruction && data.construction_type) {
        payload['construction_type[0]'] = data.construction_type
      }
      await authService.register(payload)
      // Auto-login: authenticate the new account through the SAME login thunk
      // the Login page uses, so the session (token + user) is stored
      // identically, then land on Home already signed in — never on Login.
      const result = await dispatch(login({ email: data.email, password: data.password }))
      if (login.fulfilled.match(result)) {
        navigate(ROUTES.HOME, { replace: true })
      } else {
        // Unlikely fallback — the account exists but auto-login failed.
        navigate(ROUTES.LOGIN)
      }
    } catch (err) {
      setError(err.message ?? t('common.error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl space-y-6" noValidate>
      <h1 className="text-center text-2xl font-bold text-text">{t('auth.registerTitle')}</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label={t('auth.userType')} error={errors.type?.message} {...register('type')}>
          <option value="">{t('auth.userType')}</option>
          {userTypes.map((ut) => (
            <option key={ut.id} value={ut.id}>
              {lookupLabel(t, ut)}
            </option>
          ))}
        </Select>
        <Input label={t('auth.name')} error={errors.name?.message} {...register('name')} />
        <Input label={t('auth.email')} type="email" error={errors.email?.message} {...register('email')} />
        <Input label={t('auth.phone')} error={errors.phone?.message} {...register('phone')} />
        <Input
          label={t('auth.password')}
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label={t('auth.passwordConfirm')}
          type="password"
          error={errors.password_confirmation?.message}
          {...register('password_confirmation')}
        />
        <Select label={t('auth.country')} error={errors.area_id?.message} {...register('area_id')}>
          <option value="">{t('auth.country')}</option>
          {areas.map((a) => (
            <option key={a.id} value={a.id}>
              {lookupLabel(t, a)}
            </option>
          ))}
        </Select>
        {requiresConstruction && (
          <ConstructionTypeField
            types={constructionTypes}
            error={errors.construction_type?.message}
            {...register('construction_type')}
          />
        )}
      </div>
      {error && <p className="text-center text-sm text-red-600">{error}</p>}
      <div className="flex justify-center">
        <Button type="submit" disabled={submitting}>
          {t('auth.submitRegister')}
        </Button>
      </div>
      <p className="text-center text-sm text-text-muted">
        {t('auth.hasAccount')}{' '}
        <Link to={ROUTES.LOGIN} className="text-primary hover:underline">
          {t('auth.loginTitle')}
        </Link>
      </p>
    </form>
  )
}
