import { client } from '@/sanity/lib/client'
import { eventBySlugQuery } from '@/sanity/lib/queries'
import { PortableText } from '@/components/ui/PortableText'
import { urlFor } from '@/sanity/lib/urlFor'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { SanityImageSource } from '@sanity/image-url'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = await client.fetch(eventBySlugQuery, { slug })
  return { title: event?.title ?? 'Event' }
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params
  const event = await client.fetch(eventBySlugQuery, { slug })

  if (!event) notFound()

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString('en-AU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {event.eventType && (
        <span className="font-body text-xs font-semibold uppercase tracking-widest text-tertiary">
          {event.eventType}
        </span>
      )}
      <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-[-0.02em] text-on-surface">
        {event.title}
      </h1>
      {formattedDate && (
        <p className="mt-3 font-body text-lg text-on-surface-muted">{formattedDate}</p>
      )}
      {event.venue && (
        <Link
          href={`/clubs/${event.venue.slug.current}`}
          className="mt-1 inline-block font-body text-sm text-primary hover:underline"
        >
          {event.venue.name}
          {event.venue.location?.address && ` — ${event.venue.location.address}`}
        </Link>
      )}
      {event.coverImage && (
        <div className="relative mt-8 h-72 rounded-[2rem] overflow-hidden bg-surface-container-high">
          <Image
            src={urlFor(event.coverImage as SanityImageSource).width(1200).height(600).url()}
            alt={event.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}
      {event.description && (
        <div className="mt-10">
          <PortableText value={event.description} />
        </div>
      )}
    </div>
  )
}
