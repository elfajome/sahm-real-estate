export function ProfilePageHeader({ title, count, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-text">{title}</h1>
        {count != null && (
          <span className="rounded-full bg-bg-light px-2.5 py-0.5 text-sm font-medium text-text-muted">
            {count}
          </span>
        )}
      </div>
      {action}
    </div>
  )
}
