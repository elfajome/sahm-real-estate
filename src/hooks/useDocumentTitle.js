import { useEffect } from 'react'
import { useLocale } from '@/hooks/useLocale'

export function useDocumentTitle() {
    const { t } = useLocale()

    useEffect(() => {
        document.title = t('common.title')
    }, [t])
}

