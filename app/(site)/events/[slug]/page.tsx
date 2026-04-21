import { fetchEventBySlug } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/urlFor'
import { CountdownTimer } from '@/components/ui/CountdownTimer'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { SanityImageSource } from '@sanity/image-url'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

const EVENT_TYPE_COLORS: Record<string, string> = {
  tournament: 'bg-tertiary-container text-on-tertiary-container',
  clinic: 'bg-primary-container text-on-primary-container',
  social: 'bg-surface-container-high text-on-surface',
  mixer: 'bg-surface-container-high text-on-surface',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = await fetchEventBySlug(slug)
  return { title: event?.title ?? 'Event' }
}

function formatDateRange(startIso: string | null, endIso: string | null): string | null {
  if (!startIso) return null
  const start = new Date(startIso)
  if (!endIso) {
    return start.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  const end = new Date(endIso)
  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return `${start.toLocaleDateString('en-AU', { month: 'short' })} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`
  }
  return `${start.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}`
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params
  const event = await fetchEventBySlug(slug)
  if (!event) notFound()

  const dateRange = formatDateRange(event.date ?? null, event.endDate ?? null)
  const typeKey = event.eventType?.toLowerCase() ?? ''
  const typeBadgeClass = EVENT_TYPE_COLORS[typeKey] ?? 'bg-surface-container text-on-surface'
  const hasPrizePool = event.prizePool?.total
  const hasSchedule = event.schedule?.length > 0
  const hasSponsors = event.sponsors?.length > 0
  const hasLocation = event.venue?.address || event.shuttleInfo || event.conciergeEmail

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  const mapUrl = (mapboxToken && event.venue?.lat && event.venue?.lng)
    ? `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-l+066d40(${event.venue.lng},${event.venue.lat})/${event.venue.lng},${event.venue.lat},13,0/800x500@2x?access_token=${mapboxToken}`
    : null

  return (
    <main className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-[600px] md:min-h-[870px] flex items-center px-4 sm:px-8 md:px-16 lg:px-24 py-20">
        <div className="absolute inset-0 z-0">
          {event.coverImage ? (
            <Image
              src={urlFor(event.coverImage as SanityImageSource).width(1800).height(900).url()}
              alt={event.title}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-surface-container" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl">
          {event.eventType && (
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 md:mb-8 font-body text-xs font-bold uppercase tracking-widest ${typeBadgeClass}`}>
              ★ {event.eventType}
            </div>
          )}
          <h1 className="font-headline text-5xl sm:text-6xl md:text-8xl font-black text-on-surface tracking-tighter leading-[0.9] mb-6">
            {event.title}
          </h1>
          {event.excerpt && (
            <p className="text-lg md:text-2xl text-on-surface-variant font-medium max-w-2xl mb-8 md:mb-10 leading-relaxed font-body">
              {event.excerpt}
            </p>
          )}

          {/* Metadata row */}
          <div className="flex flex-wrap gap-6 md:gap-12 mb-8 md:mb-12">
            {dateRange && (
              <div className="flex flex-col">
                <span className="text-on-surface-variant text-xs font-body uppercase tracking-widest mb-1">Date</span>
                <span className="text-lg md:text-xl font-bold font-headline">{dateRange}</span>
              </div>
            )}
            {event.venue?.address && (
              <div className="flex flex-col">
                <span className="text-on-surface-variant text-xs font-body uppercase tracking-widest mb-1">Location</span>
                <span className="text-lg md:text-xl font-bold font-headline">{event.venue.name ?? event.venue.address}</span>
              </div>
            )}
            {event.level && (
              <div className="flex flex-col">
                <span className="text-on-surface-variant text-xs font-body uppercase tracking-widest mb-1">Level</span>
                <span className="text-lg md:text-xl font-bold font-headline">{event.level}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {event.registrationUrl ? (
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-on-primary px-8 md:px-10 py-4 md:py-5 rounded-full font-headline font-bold text-base md:text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:bg-primary-dim transition-all"
              >
                Register Now →
              </a>
            ) : (
              <Link
                href="/events"
                className="bg-primary text-on-primary px-8 md:px-10 py-4 md:py-5 rounded-full font-headline font-bold text-base md:text-lg flex items-center justify-center shadow-xl shadow-primary/20 hover:bg-primary-dim transition-all"
              >
                ← All Events
              </Link>
            )}
            {event.bracketUrl && (
              <a
                href={event.bracketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface-container-highest text-on-surface-variant px-8 md:px-10 py-4 md:py-5 rounded-full font-headline font-bold text-base md:text-lg flex items-center justify-center hover:bg-surface-variant transition-all"
              >
                View Bracket
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── BENTO GRID: PRIZE POOL + COUNTDOWN + SCHEDULE ── */}
      {(hasPrizePool || hasSchedule || event.registrationDeadline) && (
        <section className="py-16 md:py-24 px-4 sm:px-8 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 max-w-[1440px] mx-auto">

            {/* Prize Pool */}
            {hasPrizePool && (
              <div className="md:col-span-8 bg-surface-container-low rounded-[2rem] p-8 md:p-10 relative overflow-hidden flex flex-col justify-between">
                <div className="relative z-10">
                  <h2 className="font-headline text-3xl md:text-4xl font-extrabold mb-4">Total Prize Pool</h2>
                  <p className="text-on-surface-variant max-w-md mb-6 md:mb-8 font-body">
                    Competing for more than just glory. {event.title} features our largest reward structure to date.
                  </p>
                  <div className="font-headline text-5xl md:text-7xl font-black text-primary tracking-tighter">
                    ${event.prizePool.total.toLocaleString()}
                  </div>
                </div>
                {(event.prizePool.first || event.prizePool.second || event.prizePool.third) && (
                  <div className="grid grid-cols-3 gap-4 mt-8 md:mt-12 relative z-10">
                    {event.prizePool.first && (
                      <div className="bg-surface-container-lowest p-4 md:p-6 rounded-[1.5rem] text-center">
                        <div className="text-secondary font-black text-xl md:text-2xl mb-1 font-headline">1st</div>
                        <div className="text-on-surface-variant text-xs uppercase font-body tracking-tighter">{event.prizePool.first}</div>
                      </div>
                    )}
                    {event.prizePool.second && (
                      <div className="bg-surface-container-lowest p-4 md:p-6 rounded-[1.5rem] text-center">
                        <div className="text-on-surface font-black text-xl md:text-2xl mb-1 font-headline">2nd</div>
                        <div className="text-on-surface-variant text-xs uppercase font-body tracking-tighter">{event.prizePool.second}</div>
                      </div>
                    )}
                    {event.prizePool.third && (
                      <div className="bg-surface-container-lowest p-4 md:p-6 rounded-[1.5rem] text-center">
                        <div className="text-on-tertiary-container font-black text-xl md:text-2xl mb-1 font-headline">3rd</div>
                        <div className="text-on-surface-variant text-xs uppercase font-body tracking-tighter">{event.prizePool.third}</div>
                      </div>
                    )}
                  </div>
                )}
                <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-tertiary/10 rounded-full blur-3xl" />
              </div>
            )}

            {/* Countdown */}
            {event.registrationDeadline && (
              <div className={`${hasPrizePool ? 'md:col-span-4' : 'md:col-span-12'} bg-primary text-on-primary rounded-[2rem] p-8 md:p-10 flex flex-col justify-center items-center text-center`}>
                <span className="text-5xl mb-6">⏱</span>
                <h3 className="font-headline text-2xl md:text-3xl font-bold mb-4">Closing Soon</h3>
                <p className="text-on-primary/80 mb-8 font-body leading-relaxed">
                  Early bird registration ends soon. Secure your spot in the bracket today.
                </p>
                <CountdownTimer deadline={event.registrationDeadline} />
                {event.registrationUrl && (
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 bg-on-primary text-primary px-8 py-3 rounded-full font-bold font-headline hover:bg-primary-fixed transition-colors"
                  >
                    Join Bracket
                  </a>
                )}
              </div>
            )}

            {/* Image feature */}
            {event.coverImage && (
              <div className="md:col-span-4 rounded-[2rem] overflow-hidden h-64 md:h-auto">
                <Image
                  src={urlFor(event.coverImage as SanityImageSource).width(600).height(700).url()}
                  alt={event.title}
                  width={600}
                  height={700}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Schedule */}
            {hasSchedule && (
              <div className={`${event.coverImage ? 'md:col-span-8' : 'md:col-span-12'} bg-surface-container-highest rounded-[2rem] p-8 md:p-10`}>
                <div className="flex items-center justify-between mb-8 md:mb-10">
                  <h2 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight">The Schedule</h2>
                </div>
                <div className="space-y-4 md:space-y-6">
                  {event.schedule.map((item: { phase: string; datetime?: string; isFeatured?: boolean }, i: number) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-5 md:p-6 rounded-[1.5rem] transition-all ${
                        item.isFeatured
                          ? 'bg-tertiary-container text-on-tertiary-container'
                          : 'bg-surface-container-low hover:bg-surface-container-high'
                      }`}
                    >
                      <div className="flex items-center gap-5 md:gap-8">
                        <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full font-bold font-body text-sm shrink-0 ${
                          item.isFeatured ? 'bg-on-tertiary-container text-tertiary-container' : 'bg-primary text-on-primary'
                        }`}>
                          {String(i + 1).padStart(2, '0')}
                        </div>
                        <div>
                          <h4 className="font-headline font-bold text-lg md:text-xl">{item.phase}</h4>
                          {item.datetime && (
                            <p className={`text-sm font-body mt-0.5 ${item.isFeatured ? 'text-on-tertiary-container/70' : 'text-on-surface-variant'}`}>
                              {item.datetime}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-lg">{item.isFeatured ? '★' : '→'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── SPONSORS ── */}
      {hasSponsors && (
        <section className="py-16 md:py-20 bg-surface-container-lowest">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-16">
            <p className="text-center text-xs font-body uppercase tracking-[0.3em] text-on-surface-variant mb-10 md:mb-12">
              Proudly Supported By
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 lg:gap-24 opacity-50 grayscale hover:opacity-80 hover:grayscale-0 transition-all">
              {event.sponsors.map((sponsor: string) => (
                <span key={sponsor} className="font-headline font-black text-lg md:text-2xl tracking-tighter">
                  {sponsor}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── LOCATION ── */}
      {hasLocation && (
        <section className="py-16 md:py-24 px-4 sm:px-8 md:px-16 lg:px-24">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
              <div>
                <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
                  How to Find Us
                </h2>
                <div className="space-y-6 md:space-y-8">
                  {event.venue?.address && (
                    <div className="flex gap-5 md:gap-6">
                      <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container text-xl">
                        ◎
                      </div>
                      <div>
                        <h5 className="font-headline font-bold text-xl mb-1">Club Address</h5>
                        {event.venue.slug ? (
                          <Link href={`/clubs/${event.venue.slug.current}`} className="text-on-surface-variant font-body hover:text-primary transition-colors">
                            {event.venue.name && <span className="font-bold text-on-surface block">{event.venue.name}</span>}
                            {event.venue.address}
                          </Link>
                        ) : (
                          <p className="text-on-surface-variant font-body">{event.venue.address}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {event.shuttleInfo && (
                    <div className="flex gap-5 md:gap-6">
                      <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-xl">
                        🚐
                      </div>
                      <div>
                        <h5 className="font-headline font-bold text-xl mb-1">Shuttle Service</h5>
                        <p className="text-on-surface-variant font-body">{event.shuttleInfo}</p>
                      </div>
                    </div>
                  )}
                  {event.conciergeEmail && (
                    <div className="flex gap-5 md:gap-6">
                      <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container text-xl">
                        💬
                      </div>
                      <div>
                        <h5 className="font-headline font-bold text-xl mb-1">Concierge</h5>
                        <p className="text-on-surface-variant font-body">
                          Need help with logistics?{' '}
                          <a href={`mailto:${event.conciergeEmail}`} className="text-primary hover:underline font-bold">
                            {event.conciergeEmail}
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Map */}
              <div className="h-[300px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl relative bg-surface-container">
                {mapUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mapUrl}
                      alt={`Map showing location of ${event.venue?.name ?? event.title}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="font-body text-on-surface-variant text-sm">Map unavailable</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── BACK LINK ── */}
      <div className="px-4 sm:px-8 md:px-16 pb-16 max-w-[1440px] mx-auto">
        <Link href="/events" className="font-body text-on-surface-variant font-bold text-sm hover:underline">
          ← All Events
        </Link>
      </div>

    </main>
  )
}
