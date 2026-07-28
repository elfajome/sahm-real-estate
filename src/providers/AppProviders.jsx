import { Suspense, useEffect } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { store } from '@/store/index.js'
import { router } from '@/router/router.jsx'
import { ErrorBoundary } from './ErrorBoundary.jsx'
import { PageLoader } from '@/components/ui/PageLoader.jsx'
import { hydrateAuth } from '@/store/slices/authSlice.js'
import { AuthProvider } from './AuthProvider.jsx'
import { setApiLanguage, setUnauthorizedHandler } from '@/services/apiClient.js'
import '@/locales/index.js'
import { useDocumentTitle } from '@/hooks/useDocumentTitle.js'

function Bootstrap({ children }) {
  const dispatch = useDispatch()

  useEffect(() => {
    const lang = localStorage.getItem('sahm_lang') ?? 'ar'
    setApiLanguage(lang)
    dispatch(hydrateAuth())
    setUnauthorizedHandler(() => {
      if (window.location.pathname.startsWith('/auth')) return
      const returnUrl = window.location.pathname + window.location.search
      window.location.href = `/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`
    })
  }, [dispatch])

  return children
}

export function AppProviders() {
  useDocumentTitle()
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Bootstrap>
          <AuthProvider>
            <Suspense fallback={<PageLoader fullScreen />}>
              <RouterProvider router={router} />
            </Suspense>
          </AuthProvider>
        </Bootstrap>
      </ErrorBoundary>
    </Provider>
  )
}
