import { fetchAllClubs } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/urlFor'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { SanityImageSource } from '@sanity/image-url'

export const metadata: Metadata = { title: 'Clubs' }
export const revalidate = 60

interface Club {
  name: string
  slug: { current: string }
  coverPhoto?: SanityImageSource
  logo?: SanityImageSource
  courts?: { count?: number; surfaceType?: string }
  address?: string
}

export default async function ClubsPage() {
  const clubs: Club[] = await fetchAllClubs() ?? []

  return (
    <main className="min-h-screen">

      {/* ── HERO ── */}
      <section className="px-6 py-12 max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <span className="font-body text-tertiary font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Tropical Play</span>
            <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter leading-[0.9] mb-6">
              Find Your <span className="text-primary italic">Island</span> Court.
            </h1>
            <p className="font-body text-on-surface-variant text-lg leading-relaxed">
              Discover premier padel destinations across Bali. From the cliffs of Uluwatu to the vibrant heart of Canggu.
            </p>
          </div>
        </div>

        {/* ── CLUB LIST ── */}
        {clubs.length > 0 ? (
          <div className="space-y-6">
            {clubs.map((club) => (
              <Link
                key={club.slug.current}
                href={`/clubs/${club.slug.current}`}
                className="group bg-surface-container-lowest rounded-[2rem] overflow-hidden flex flex-col md:flex-row hover:scale-[1.01] transition-transform duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.04)]"
              >
                {/* Image */}
                <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                  {club.coverPhoto ? (
                    <Image
                      src={urlFor(club.coverPhoto as SanityImageSource).width(800).height(500).url()}
                      alt={club.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-surface-container-high flex items-center justify-center">
                      <span className="font-headline font-black text-on-surface-variant text-4xl opacity-20">{club.name[0]}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="md:w-3/5 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-headline text-3xl font-extrabold tracking-tighter text-on-surface">{club.name}</h3>
                    </div>
                    {club.address && (
                      <div className="font-body text-on-surface-variant text-sm font-medium mb-6 flex items-center gap-1">
                        <span className="text-primary">◎</span> {club.address}
                      </div>
                    )}
                    {club.courts?.count && (
                      <div className="flex flex-wrap gap-2 mb-8">
                        <div className="bg-surface-container px-3 py-1.5 rounded-full flex items-center gap-2">
                          <span className="text-primary text-sm">🎾</span>
                          <span className="font-body text-[10px] font-bold uppercase tracking-tighter">
                            {club.courts.count} Court{club.courts.count !== 1 ? 's' : ''}
                            {club.courts.surfaceType ? ` · ${club.courts.surfaceType}` : ''}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-end mt-auto">
                    <span className="bg-primary text-on-primary px-8 py-3 rounded-full font-headline font-bold text-sm tracking-wider hover:bg-primary-dim transition-colors shadow-xl">
                      View Club
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="font-body text-on-surface-variant text-center py-20">No clubs listed yet.</p>
        )}
      </section>
    </main>
  )
}
