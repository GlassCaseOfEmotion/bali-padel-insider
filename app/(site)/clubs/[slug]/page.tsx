import { fetchClubBySlug } from '@/sanity/lib/fetch'
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
  const club = await fetchClubBySlug(slug)
  return { title: club?.name ?? 'Club' }
}

// Map facility names to emojis for visual interest without Material Symbols dependency
const FACILITY_ICONS: Record<string, string> = {
  'lights': '💡',
  'pro shop': '🛍️',
  'cafe': '☕',
  'changing rooms': '🚿',
  'parking': '🅿️',
  'pool': '🏊',
  'wifi': '📶',
  'bar': '🍹',
  'restaurant': '🍽️',
  'gym': '💪',
  'spa': '🧖',
  'locker': '🔑',
}

export default async function ClubPage({ params }: Props) {
  const { slug } = await params
  const club = await fetchClubBySlug(slug)

  if (!club) notFound()

  const facilities: string[] = club.facilities ?? []

  return (
    <main className="pb-32">

      {/* ── HERO: full-bleed fixed height matching mockup ── */}
      <section className="mt-8 relative h-[480px] md:h-[614px] w-full overflow-hidden group mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="relative h-full rounded-[2rem] overflow-hidden">
          {club.coverPhoto ? (
            <Image
              src={urlFor(club.coverPhoto as SanityImageSource).width(1800).height(900).url()}
              alt={club.name}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-surface-container-highest" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent" />

          {/* Bottom overlay: name + actions */}
          <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-tertiary text-on-tertiary px-4 py-1 rounded-full font-body text-xs font-bold uppercase tracking-widest">
                  Bali Padel Club
                </span>
              </div>
              <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white leading-none tracking-tighter">
                {club.name}
              </h1>
              {club.location?.address && (
                <p className="font-body text-white/80 mt-4 text-lg max-w-xl">
                  {club.location.address}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── BENTO GRID CONTENT ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-16 max-w-[1440px] mx-auto px-4 md:px-8">

        {/* Left: About + Amenities */}
        <div className="lg:col-span-8 space-y-8">

          {/* About */}
          {club.description && (
            <div className="bg-surface-container-low p-8 md:p-12 rounded-[2rem]">
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
                The Tropical Kinetic Experience
              </h2>
              <div className="font-body text-on-surface-variant text-lg leading-relaxed">
                <PortableText value={club.description} />
              </div>
            </div>
          )}

          {/* Amenities Grid */}
          {facilities.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {facilities.map((f: string) => {
                const icon = FACILITY_ICONS[f.toLowerCase()] ?? '✓'
                return (
                  <div
                    key={f}
                    className="bg-surface-container p-6 rounded-[1.5rem] flex flex-col items-center text-center gap-3 hover:bg-primary-container transition-colors duration-300"
                  >
                    <span className="text-3xl">{icon}</span>
                    <span className="font-headline font-bold text-sm uppercase tracking-wider">{f}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right: Details sidebar */}
        <div className="lg:col-span-4 space-y-6">

          {/* Court info */}
          {club.courts?.count && (
            <div className="bg-surface-container-high p-8 rounded-[2rem]">
              <h3 className="font-headline text-xl font-bold text-on-surface mb-6">Court Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-body text-xs font-black uppercase tracking-widest text-on-surface-variant/60 mb-1">Courts</p>
                  <p className="font-headline text-5xl font-black text-primary">{club.courts.count}</p>
                </div>
                {club.courts.surfaceType && (
                  <div>
                    <p className="font-body text-xs font-black uppercase tracking-widest text-on-surface-variant/60 mb-1">Surface</p>
                    <p className="font-headline font-bold text-on-surface uppercase tracking-wide">
                      {club.courts.surfaceType}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Location */}
          {club.location?.address && (
            <div className="bg-surface-container p-6 rounded-[2rem]">
              <h4 className="font-headline font-bold mb-3 flex items-center gap-2 text-on-surface">
                <span className="text-primary">◎</span> Location
              </h4>
              <p className="font-body text-sm text-on-surface-variant">{club.location.address}</p>
            </div>
          )}

          {/* Contact */}
          {(club.website || club.instagram || club.whatsapp) && (
            <div className="bg-surface-container p-6 rounded-[2rem] space-y-3">
              <h4 className="font-headline font-bold text-on-surface mb-2">Get in Touch</h4>
              {club.website && (
                <a
                  href={club.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm font-bold text-primary hover:underline block"
                >
                  🌐 Website
                </a>
              )}
              {club.instagram && (
                <a
                  href={club.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm font-bold text-primary hover:underline block"
                >
                  📸 Instagram
                </a>
              )}
              {club.whatsapp && (
                <a
                  href={`https://wa.me/${club.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm font-bold text-primary hover:underline block"
                >
                  💬 WhatsApp
                </a>
              )}
            </div>
          )}

          <Link
            href="/clubs"
            className="font-body text-on-surface-variant font-bold text-sm hover:underline block px-2"
          >
            ← All Clubs
          </Link>
        </div>
      </section>
    </main>
  )
}
