import { Component } from 'react'
import { useLocale } from '@/hooks/useLocale.js'

class ErrorBoundaryInner extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-8">
          <p className="text-lg text-text">{this.props.message}</p>
          <button
            type="button"
            className="rounded-lg bg-primary px-6 py-2 text-white"
            onClick={() => window.location.reload()}
          >
            {this.props.retryLabel}
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export function ErrorBoundary({ children }) {
  const { t } = useLocale()
  return (
    <ErrorBoundaryInner message={t('common.error')} retryLabel={t('common.retry')}>
      {children}
    </ErrorBoundaryInner>
  )
}
