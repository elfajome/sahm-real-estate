import { IconRents, IconSell, IconCustomers, IconSales } from '@/components/icons/index.jsx'

function StatIcon({ statKey }) {
  const icons = {
    Sales: (
      <IconSales className="h-8 w-8" />
    ),
    Sell: <IconSell className="h-8 w-8" />,
    Rent: (
      <IconRents className="h-8 w-8" />
    ),
    Customers: <IconCustomers className="h-8 w-8" />,
  }
  return icons[statKey] ?? icons.properties
}

export function StatsCounter({ items = [] }) {
  if (!items.length) return null

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.key ?? item.label} className="flex flex-col items-center text-center">
          <span className="mb-3 text-accent">
            <StatIcon statKey={item.key} />
          </span>
          <p className="text-3xl font-bold text-gray-600">{item.value}</p>
          <p className="mt-1 text-sm text-text-muted">{item.label}</p>
        </div>
      ))}
    </div>
  )
}
