import { client } from '@/sanity/lib/client'
import { allEventsQuery, upcomingEventsQuery } from '@/sanity/lib/queries'
import { EventCard } from '@/components/cards/EventCard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Events' }
export const revalidate = 60

export default async function EventsPage() {
  const [upcoming, all] = await Promise.all([
    client.fetch(upcomingEventsQuery, { limit: 19 }),
    client.fetch(allEventsQuery),
  ])
  const past = all?.filter(
    (e: { slug: { current: string } }) =>
      !upcoming?.some((u: { slug: { current: string } }) => u.slug.current === e.slug.current)
  ) ?? []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-on-surface mb-10">Events</h1>

      {upcoming?.length > 0 && (
        <section className="mb-12">
          <h2 className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-6">
            Upcoming
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((event: { title: string; slug: { current: string } }) => (
              <EventCard key={event.slug.current} event={event} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="mt-12">
          <h2 className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-6">
            Past Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {past.map((event: { title: string; slug: { current: string } }) => (
              <EventCard key={event.slug.current} event={event} />
            ))}
          </div>
        </section>
      )}

      {!upcoming?.length && !past.length && (
        <p className="font-body text-on-surface-muted text-center py-20">No events published yet.</p>
      )}
    </div>
  )
}
