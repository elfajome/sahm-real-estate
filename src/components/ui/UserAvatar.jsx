import { useRef, useState } from 'react'
import { cn } from '@/utils/cn.js'
import { FaCamera, IconUser } from '@/components/icons/index.jsx'

export function UserAvatar({ src, name, size = 'md', editable = false, onChange }) {
  const inputRef = useRef(null)
  const [hover, setHover] = useState(false)

  const sizes = {
    sm: 'h-10 w-10 text-sm',
    md: 'h-20 w-20 text-xl',
    lg: 'h-28 w-28 text-3xl',
  }

  const initials = name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleClick = () => {
    if (editable) inputRef.current?.click()
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (file) onChange?.(file)
    e.target.value = ''
  }

  return (
    <div
      className={cn('relative shrink-0', editable && 'cursor-pointer')}
      onMouseEnter={() => editable && setHover(true)}
      onMouseLeave={() => editable && setHover(false)}
      onClick={handleClick}
      role={editable ? 'button' : undefined}
      tabIndex={editable ? 0 : undefined}
      onKeyDown={(e) => editable && e.key === 'Enter' && handleClick()}
    >
      <div
        className={cn(
          'overflow-hidden rounded-full bg-primary/10 font-semibold text-primary',
          sizes[size],
          'flex items-center justify-center',
        )}
      >
        {src ? (
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : (
          <span>{initials ?? <IconUser className="h-[1em] w-[1em]" />}</span>
        )}
      </div>
      {editable && hover && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white">
          <FaCamera className="h-5 w-5" aria-hidden />
        </div>
      )}
      {editable && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFile}
        />
      )}
    </div>
  )
}
