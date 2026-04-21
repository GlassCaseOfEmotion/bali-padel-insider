import Link from 'next/link'
import Image from 'next/image'
import type { SanityImageSource } from '@sanity/image-url'
import { urlFor } from '@/sanity/lib/urlFor'

interface Event {
  title: string
  slug: { current: string }
  date?: string
  eventType?: string
  coverImage?: SanityImageSource | null
  venue?: { name: string; slug: { current: string } }
}

export function EventCard({ event }: { event: Event }) {
  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <Link
      href={`/events/${event.slug.current}`}
      className="group block rounded-[2rem] overflow-hidden bg-surface-container shadow-[0_8px_40px_rgba(58,50,22,0.06)] hover:scale-[1.02] hover:shadow-[0_16px_60px_rgba(58,50,22,0.10)] transition-all duration-300"
    >
      {event.coverImage && (
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={urlFor(event.coverImage).width(720).height(416).url()}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6">
        {event.eventType && (
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-tertiary">
            {event.eventType}
          </span>
        )}
        <h3 className="mt-2 font-display text-lg font-bold leading-snug tracking-[-0.02em] text-on-surface line-clamp-2">
          {event.title}
        </h3>
        {formattedDate && (
          <p className="mt-2 font-body text-sm text-on-surface-muted">{formattedDate}</p>
        )}
        {event.venue && (
          <p className="mt-1 font-body text-xs text-on-surface-muted">{event.venue.name}</p>
        )}
      </div>
    </Link>
  )
}
