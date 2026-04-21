import { client } from '@/sanity/lib/client'
import { allEventsQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/urlFor'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { SanityImageSource } from '@sanity/image-url'

export const metadata: Metadata = { title: 'Events' }
export const revalidate = 60

interface Event {
  title: string
  slug: { current: string }
  date?: string
  eventType?: string
  coverImage?: SanityImageSource
  venue?: { name: string; slug: { current: string } }
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  tournament: 'bg-secondary text-on-secondary',
  clinic: 'bg-primary-container text-on-primary-container',
  social: 'bg-tertiary text-on-tertiary',
  mixer: 'bg-tertiary text-on-tertiary',
}

export default async function EventsPage() {
  const events: Event[] = await client.fetch(allEventsQuery) ?? []

  const now = new Date()
  const upcoming = events.filter((e) => !e.date || new Date(e.date) >= now)
  const past = events.filter((e) => e.date && new Date(e.date) < now)

  const featuredEvent = upcoming[0] ?? events[0] ?? null
  const gridEvents = upcoming.slice(1)

  return (
    <main className="pt-12 pb-32 px-4 sm:px-6 md:px-16 max-w-[1440px] mx-auto">

      {/* ── HERO FEATURED EVENT ── */}
      {featuredEvent && (
        <section className="mb-24 relative rounded-[2rem] overflow-hidden min-h-[500px] flex items-end">
          <div className="absolute inset-0 z-0">
            {featuredEvent.coverImage ? (
              <Image
                src={urlFor(featuredEvent.coverImage).width(1600).height(800).url()}
                alt={featuredEvent.title}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-inverse-surface" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
          <div className="relative z-10 p-6 md:p-12 w-full flex flex-col lg:flex-row gap-8 items-end">
            <div className="flex-1">
              {featuredEvent.eventType && (
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-body text-xs font-bold uppercase tracking-widest mb-6 ${EVENT_TYPE_COLORS[featuredEvent.eventType.toLowerCase()] ?? 'bg-tertiary text-on-tertiary'}`}>
                  {featuredEvent.eventType}
                </span>
              )}
              <h1 className="font-headline text-4xl sm:text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-6">
                {featuredEvent.title}
              </h1>
              {featuredEvent.date && (
                <p className="font-body text-white/80 text-lg max-w-md mb-8">
                  {new Date(featuredEvent.date).toLocaleDateString('en-AU', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                  })}
                  {featuredEvent.venue && ` · ${featuredEvent.venue.name}`}
                </p>
              )}
            </div>
            <Link
              href={`/events/${featuredEvent.slug.current}`}
              className="shrink-0 bg-tertiary-fixed text-on-tertiary-fixed px-10 py-5 rounded-full font-headline font-black text-lg uppercase tracking-tighter hover:scale-105 transition-all shadow-2xl"
            >
              View Details
            </Link>
          </div>
        </section>
      )}

      {/* ── FILTER PILLS (static) ── */}
      <section className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
        <div className="flex flex-wrap gap-4">
          <span className="px-4 sm:px-8 py-2 sm:py-3 bg-primary text-on-primary rounded-full font-headline font-bold text-sm uppercase tracking-widest">All Events</span>
          <span className="px-4 sm:px-8 py-2 sm:py-3 bg-surface-container-high text-on-surface/60 rounded-full font-headline font-bold text-sm uppercase tracking-widest">Tournaments</span>
          <span className="px-4 sm:px-8 py-2 sm:py-3 bg-surface-container-high text-on-surface/60 rounded-full font-headline font-bold text-sm uppercase tracking-widest">Social Mixers</span>
          <span className="px-4 sm:px-8 py-2 sm:py-3 bg-surface-container-high text-on-surface/60 rounded-full font-headline font-bold text-sm uppercase tracking-widest">Clinics</span>
        </div>
      </section>

      {/* ── UPCOMING EVENTS GRID ── */}
      {gridEvents.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {gridEvents.map((event) => {
            const typeKey = event.eventType?.toLowerCase() ?? ''
            const tagClass = EVENT_TYPE_COLORS[typeKey] ?? 'bg-surface-container text-on-surface-variant'
            return (
              <Link
                key={event.slug.current}
                href={`/events/${event.slug.current}`}
                className="group relative bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-12px_rgba(58,50,22,0.08)] hover:-translate-y-2 transition-all duration-500"
              >
                {event.coverImage && (
                  <div className="h-64 overflow-hidden relative">
                    <Image
                      src={urlFor(event.coverImage).width(720).height(400).url()}
                      alt={event.title}
                      width={720}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {event.eventType && (
                      <div className={`absolute top-4 right-4 backdrop-blur-md px-3 py-1 rounded-full font-body text-[10px] font-black uppercase tracking-tighter ${tagClass}`}>
                        {event.eventType}
                      </div>
                    )}
                  </div>
                )}
                <div className="p-8">
                  {event.date && (
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-body text-xs font-bold uppercase tracking-widest text-on-surface/60">
                        {new Date(event.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                  <h3 className="font-headline text-2xl font-black text-on-surface mb-3 tracking-tight">
                    {event.title}
                  </h3>
                  {event.venue && (
                    <p className="font-body text-on-surface-variant text-sm mb-6">{event.venue.name}</p>
                  )}
                  <div className="flex items-center justify-between pt-6 border-t border-surface-container">
                    <span className="font-headline font-bold text-primary text-sm uppercase tracking-tighter">View Details</span>
                    <span className="font-headline font-bold text-primary text-sm">→</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </section>
      )}

      {/* ── PAST EVENTS ── */}
      {past.length > 0 && (
        <section className="mt-12">
          <h2 className="font-headline text-3xl font-black text-on-surface tracking-tighter mb-8">Past Events</h2>
          <div className="space-y-4">
            {past.map((event) => (
              <Link
                key={event.slug.current}
                href={`/events/${event.slug.current}`}
                className="flex items-center gap-6 p-6 bg-surface-container rounded-[1.5rem] hover:bg-surface-container-high transition-colors group"
              >
                {event.coverImage && (
                  <div className="w-20 h-20 rounded-[1rem] overflow-hidden shrink-0">
                    <Image
                      src={urlFor(event.coverImage).width(160).height(160).url()}
                      alt={event.title}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-headline font-bold text-on-surface group-hover:text-primary transition-colors">{event.title}</h3>
                  <p className="font-body text-xs text-on-surface-variant mt-1">
                    {event.date && new Date(event.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {event.venue && ` · ${event.venue.name}`}
                  </p>
                </div>
                {event.eventType && (
                  <span className="font-body text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">{event.eventType}</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {events.length === 0 && (
        <p className="font-body text-on-surface-variant text-center py-20">No events published yet.</p>
      )}
    </main>
  )
}
