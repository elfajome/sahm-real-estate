/** Empty/error placeholder that keeps section spacing intact (spec §21-22). */
export function SectionMessage({ message }) {
  return (
    <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-border bg-bg-light/50 px-4 text-center">
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  )
}
