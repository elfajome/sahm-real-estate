import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { z } from 'zod'
import { Input } from '@/components/ui/Input.jsx'
import { Button } from '@/components/ui/Button.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { ROUTES } from '@/constants/routes.js'
import { login, selectAuth, clearAuthError } from '@/store/slices/authSlice.js'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export function LoginForm() {
  const { t } = useLocale()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { status, error } = useSelector(selectAuth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) })

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  useEffect(() => {
    if (status === 'succeeded') {
      const returnUrl = searchParams.get('returnUrl')
      navigate(returnUrl || ROUTES.HOME, { replace: true })
    }
  }, [status, navigate, searchParams])

  const onSubmit = (data) => dispatch(login(data))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl space-y-6" noValidate>
      <h1 className="text-center text-2xl font-bold text-text">{t('auth.loginTitle')}</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={t('auth.email')}
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label={t('auth.password')}
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>
      {error && <p className="text-center text-sm text-red-600">{error}</p>}
      <p className="text-center text-sm">
        <span className="text-text-muted">{t('auth.forgotPassword')}</span>
      </p>
      <div className="flex justify-center">
        <Button type="submit" disabled={status === 'loading'}>
          {t('auth.submitLogin')}
        </Button>
      </div>
      <p className="text-center text-sm text-text-muted">
        {t('auth.noAccount')}{' '}
        <Link to={ROUTES.REGISTER} className="text-primary hover:underline">
          {t('auth.registerTitle')}
        </Link>
      </p>
    </form>
  )
}
