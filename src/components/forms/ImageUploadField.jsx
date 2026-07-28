import { useEffect, useMemo, useRef } from 'react'
import { useLocale } from '@/hooks/useLocale.js'
import { IconClose, IconUpload } from '@/components/icons/index.jsx'
import { cn } from '@/utils/cn.js'

/**
 * Multiple-image uploader for the Add/Edit Real Estate form.
 *
 * - Selecting files APPENDS to the current selection (add more later).
 * - Every selected image gets a preview with an individual remove action;
 *   removing one image preserves all the others.
 * - Only image files are accepted (`accept` + type filter).
 * - The parent owns the `File[]` state, so the payload stays compatible with
 *   the Postman `store/aqar` `images[]` formdata contract (buildFormData).
 */
export function ImageUploadField({ images, onChange, error }) {
  const { t } = useLocale()
  const inputRef = useRef(null)

  const previews = useMemo(
    () => images.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [images],
  )

  // Revoke object URLs when the previews change / component unmounts.
  useEffect(
    () => () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url))
    },
    [previews],
  )

  const handleSelect = (event) => {
    const picked = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith('image/'),
    )
    if (picked.length) onChange([...images, ...picked])
    // Reset so choosing the same file again still fires `change`.
    event.target.value = ''
  }

  const handleRemove = (index) => {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex min-h-44 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-bg-light p-6 text-text-muted transition hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          error && 'border-red-500',
        )}
        aria-describedby={error ? 'images-error' : undefined}
      >
        <IconUpload className="h-9 w-9" />
        <span className="text-sm font-medium">{t('propertyForm.uploadPrompt')}</span>
        <span className="text-xs">{t('propertyForm.uploadHint')}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleSelect}
      />

      {error && (
        <p id="images-error" className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}

      {previews.length > 0 && (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {previews.map((preview, index) => (
            <li
              key={`${preview.file.name}-${preview.file.size}-${index}`}
              className="relative overflow-hidden rounded-lg border border-border"
            >
              <img
                src={preview.url}
                alt={preview.file.name}
                className="aspect-square w-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                aria-label={t('propertyForm.removeImage')}
                className="absolute end-2 top-2 rounded-full bg-white/90 p-1.5 text-text shadow transition hover:bg-red-600 hover:text-white"
              >
                <IconClose className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
