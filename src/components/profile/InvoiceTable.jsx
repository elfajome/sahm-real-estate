import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge.jsx'
import { Button } from '@/components/ui/Button.jsx'
import { useLocale } from '@/hooks/useLocale.js'
import { formatPrice } from '@/utils/formatPrice.js'
import { listingDetailPath } from '@/constants/routes.js'
import { IconCalendar, IconLocation, IconSale, IconUser } from '@/components/icons/index.jsx'

function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString()
}

export function InvoiceTable({ items }) {
  const { t, locale } = useLocale()
  // Accordion behavior — a single expanded id, so opening one invoice
  // automatically closes the previously opened one. Only one invoice can be
  // expanded at any given time.
  const [expandedId, setExpandedId] = useState(null)

  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id))

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-bg-light text-text-muted">
          <tr>
            <th className="px-4 py-3 text-start">{t('profile.invoice.property')}</th>
            <th className="px-4 py-3 text-start">{t('profile.invoice.price')}</th>
            <th className="px-4 py-3 text-start">{t('profile.invoice.date')}</th>
            <th className="px-4 py-3 text-start">{t('profile.invoice.action')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const id = item.id ?? item.post_id
            const image = item.image ?? item.images?.[0]?.url ?? item.images?.[0]
            const title = item.title ?? item.name ?? '—'
            const status = item.status?.name ?? item.aqar_status?.name
            const owner = item.user?.name ?? item.owner?.name
            const expanded = expandedId === id
            const paidViaSite = String(item.pay_type ?? item.user_pay_type ?? '0') === '0'
            const date = item.created_at ?? item.date ?? item.purchased_at

            return (
              <Fragment key={id}>
                <tr className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-bg-light">
                        {image ? (
                          <img src={image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="flex h-full items-center justify-center text-border">
                            <IconSale className="h-5 w-5" />
                          </span>
                        )}
                      </div>
                      <Link
                        to={listingDetailPath(id)}
                        className="font-medium text-primary hover:underline"
                      >
                        {title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-accent">
                    {formatPrice(item.price, locale)}
                  </td>
                  <td className="px-4 py-3 text-text-muted">{formatDate(date)}</td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" onClick={() => toggle(id)}>
                      {expanded ? t('profile.hideInvoice') : t('profile.viewInvoice')}
                    </Button>
                  </td>
                </tr>
                {expanded && (
                  <tr className="border-t border-border bg-bg-light">
                    <td colSpan={4} className="p-4">
                      <div className="overflow-hidden rounded-xl bg-white">
                        {image && (
                          <img src={image} alt="" className="aspect-[21/9] w-full object-cover" />
                        )}
                        <div className="p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="text-lg font-bold">{title}</h3>
                            {status && <Badge variant="accent">{status}</Badge>}
                          </div>
                          {owner && (
                            <p className="mt-2 flex items-center gap-2 text-sm text-text-muted">
                              <IconUser className="h-4 w-4 text-accent" />
                              {owner}
                            </p>
                          )}
                          <p className="mt-2 flex items-center gap-2 text-sm text-text-muted">
                            <IconCalendar className="h-4 w-4 text-accent" />
                            {formatDate(date)}
                          </p>
                          <p className="mt-1 flex items-center gap-2 text-sm text-text-muted">
                            <IconLocation className="h-4 w-4 text-accent" />
                            {item.area?.name ?? item.location ?? '—'}
                          </p>
                          <p className="mt-4 text-xl font-bold text-accent">
                            {formatPrice(item.price, locale)}
                          </p>
                          <p className="mt-1 text-sm text-text-muted">
                            {paidViaSite ? t('profile.paidViaSite') : t('profile.paidViaUser')}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
