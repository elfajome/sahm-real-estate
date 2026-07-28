import { useState } from 'react'
import { IconStar, IconUser } from '@/components/icons/index.jsx'
import { cn } from '@/utils/cn.js'

/**
 * Fixed-height testimonial card: avatar > name > role > rating > review.
 * Review clamps to four lines so long text never changes the card height (spec §155-158).
 */
export function TestimonialCard({ quote, author, role, avatar, rating = 5 }) {
  const [avatarFailed, setAvatarFailed] = useState(false)
  const showAvatar = avatar && !avatarFailed

  return (
    <article className="flex h-full min-h-56 flex-col rounded-xl border border-border bg-white p-6 shadow-sm transition duration-200 hover:shadow-md">
      <div className="mb-4 flex items-center gap-3">
        {showAvatar ? (
          <img
            src={avatar}
            alt=""
            loading="lazy"
            onError={() => setAvatarFailed(true)}
            className="h-12 w-12 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
            <IconUser className="h-6 w-6" />
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold text-text">{author}</p>
          {role && <p className="truncate text-xs text-text-muted">{role}</p>}
        </div>
      </div>
      {rating > 0 && (
        <div className="mb-3 flex gap-0.5 text-amber-400" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <IconStar key={i} className={cn('h-4 w-4', i >= rating && 'text-border')} />
          ))}
        </div>
      )}
      <p className="line-clamp-4 flex-1 text-sm leading-relaxed text-text-muted">&ldquo;{quote}&rdquo;</p>
    </article>
  )
}
