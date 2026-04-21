import { fetchAllClubs } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/urlFor'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { SanityImageSource } from '@sanity/image-url'
import ClubMapWrapper from '@/components/ui/ClubMapWrapper'

export const metadata: Metadata = { title: 'Clubs' }
export const revalidate = 60

interface Club {
  name: string
  slug: { current: string }
  coverPhoto?: SanityImageSource
  courts?: { count?: number; surfaceType?: string }
  facilities?: string[]
  address?: string
  lat?: number
  lng?: number
  isPremium?: boolean
  rating?: number
  pricePerHour?: number
}

const FACILITY_ICONS: Record<string, string> = {
  'lights': '💡',
  'pro shop': '🛍️',
  'cafe': '☕',
  'bar': '🍹',
  'restaurant': '🍽️',
  'changing rooms': '🚿',
  'showers': '🚿',
  'parking': '🅿️',
  'pool': '🏊',
  'spa': '🧖',
  'gym': '💪',
  'wifi': '📶',
  'ice bath': '🧊',
  'smoothie bar': '🥤',
}

export default async function ClubsPage() {
  const clubs: Club[] = await fetchAllClubs() ?? []

  const mapClubs = clubs
    .filter((c) => c.lat && c.lng)
    .map((c) => ({
      slug: c.slug.current,
      name: c.name,
      address: c.address,
      lat: c.lat!,
      lng: c.lng!,
      isPremium: c.isPremium,
      rating: c.rating,
      courts: c.courts,
    }))

  return (
    <main className="min-h-screen">
      <section className="px-4 sm:px-6 md:px-16 py-12 max-w-[1440px] mx-auto">

        {/* ── HERO + FILTERS ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <span className="font-body text-tertiary font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
              Tropical Play
            </span>
            <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter leading-[0.9] mb-6">
              Find Your <span className="text-primary italic">Island</span> Court.
            </h1>
            <p className="font-body text-on-surface-variant text-lg leading-relaxed">
              Discover premier padel destinations across Bali. From the cliffs of Uluwatu to the vibrant heart of Canggu.
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-3 bg-surface-container-low p-3 rounded-[2rem]">
            <div className="bg-surface-container-high px-5 py-3 rounded-full flex items-center gap-2">
              <span className="text-primary text-sm">📍</span>
              <span className="font-body text-sm font-bold text-on-surface-variant uppercase tracking-wider">All Locations</span>
            </div>
            <div className="bg-surface-container-high px-5 py-3 rounded-full flex items-center gap-2">
              <span className="text-primary text-sm">🏊</span>
              <span className="font-body text-sm font-bold text-on-surface-variant uppercase tracking-wider">With Pool</span>
            </div>
            <div className="bg-surface-container-high px-5 py-3 rounded-full flex items-center gap-2">
              <span className="text-primary text-sm">☕</span>
              <span className="font-body text-sm font-bold text-on-surface-variant uppercase tracking-wider">Cafe</span>
            </div>
            <div className="bg-primary text-on-primary px-5 py-3 rounded-full flex items-center gap-2">
              <span className="text-sm">⚙️</span>
              <span className="font-body text-sm font-bold uppercase tracking-wider">All Filters</span>
            </div>
          </div>
        </div>

        {/* ── CONTENT GRID: LIST + MAP ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left: club list */}
          <div className="lg:col-span-7 space-y-6">
            {clubs.length > 0 ? clubs.map((club) => {
              const facilities = club.facilities ?? []
              const displayFacilities = facilities.slice(0, 3)

              return (
                <div
                  key={club.slug.current}
                  className="group bg-surface-container-lowest rounded-[2rem] overflow-hidden flex flex-col md:flex-row hover:scale-[1.01] transition-transform duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.04)]"
                >
                  {/* Image */}
                  <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                    {club.coverPhoto ? (
                      <Image
                        src={urlFor(club.coverPhoto as SanityImageSource).width(600).height(500).url()}
                        alt={club.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-surface-container-high flex items-center justify-center">
                        <span className="font-headline font-black text-on-surface-variant text-4xl opacity-20">{club.name[0]}</span>
                      </div>
                    )}
                    {club.isPremium && (
                      <div className="absolute top-4 left-4 bg-tertiary text-on-tertiary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                        Premium
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="md:w-3/5 p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-headline text-3xl font-extrabold tracking-tighter text-on-surface">
                          {club.name}
                        </h3>
                        {club.rating && (
                          <span className="font-body font-bold text-sm text-secondary whitespace-nowrap ml-4">
                            {club.rating} ★
                          </span>
                        )}
                      </div>

                      {club.address && (
                        <div className="font-body text-on-surface-variant text-sm font-medium mb-6 flex items-center gap-1">
                          <span className="text-primary">◎</span> {club.address}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mb-8">
                        {club.courts?.count && (
                          <div className="bg-surface-container px-3 py-1.5 rounded-full flex items-center gap-2">
                            <span className="text-primary text-sm">🎾</span>
                            <span className="font-body text-[10px] font-bold uppercase tracking-tighter">
                              {club.courts.count} {club.courts.count === 1 ? 'Court' : 'Courts'}
                            </span>
                          </div>
                        )}
                        {displayFacilities.map((f) => {
                          const icon = FACILITY_ICONS[f.toLowerCase()] ?? '✓'
                          return (
                            <div key={f} className="bg-surface-container px-3 py-1.5 rounded-full flex items-center gap-2">
                              <span className="text-sm">{icon}</span>
                              <span className="font-body text-[10px] font-bold uppercase tracking-tighter">{f}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      {club.pricePerHour ? (
                        <span className="font-body text-on-surface-variant font-bold text-sm tracking-wide">
                          ${club.pricePerHour}<span className="text-xs font-normal">/hour</span>
                        </span>
                      ) : (
                        <span />
                      )}
                      <Link
                        href={`/clubs/${club.slug.current}`}
                        className="bg-primary text-on-primary px-8 py-3 rounded-full font-headline font-bold text-sm tracking-wider hover:bg-primary-dim transition-colors shadow-xl shadow-primary/10"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              )
            }) : (
              <p className="font-body text-on-surface-variant text-center py-20">No clubs listed yet.</p>
            )}
          </div>

          {/* Right: map */}
          <div className="hidden lg:block lg:col-span-5 sticky top-28 h-[calc(100vh-10rem)]">
            <ClubMapWrapper clubs={mapClubs} />
          </div>
        </div>
      </section>
    </main>
  )
}
