import { createContext, useCallback, useContext, useState } from 'react'
import { cn } from '@/utils/cn.js'

const ToastContext = createContext(null)

const VARIANT_CLASSES = {
  success: 'bg-accent',
  error: 'bg-red-600',
  warning: 'bg-amber-500',
  info: 'bg-primary',
}

const TOAST_DURATION = 3000

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, variant = 'success') => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, TOAST_DURATION)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Top-right stack above all page content (spec §89) */}
      <div
        className="pointer-events-none fixed right-4 top-4 z-[60] flex w-72 max-w-[calc(100vw-2rem)] flex-col gap-2 sm:right-6 sm:top-6"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'animate-toast-in rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg',
              VARIANT_CLASSES[toast.variant] ?? VARIANT_CLASSES.info,
            )}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
