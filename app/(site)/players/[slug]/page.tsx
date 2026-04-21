import { fetchPlayerBySlug } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/urlFor'
import { nationalityCode } from '@/lib/flags'
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
  const player = await fetchPlayerBySlug(slug)
  return { title: player?.name ?? 'Player' }
}

export default async function PlayerPage({ params }: Props) {
  const { slug } = await params
  const player = await fetchPlayerBySlug(slug)

  if (!player) notFound()

  const flagCode = player.nationality ? nationalityCode(player.nationality) : ''

  const offTheCourt = [
    { label: 'Pre-Match Ritual', value: player.preMatchRitual },
    { label: 'Secret Talent', value: player.secretTalent },
    { label: 'Favourite Playlist', value: player.favouritePlaylist },
    { label: 'Recovery Routine', value: player.recoveryRoutine },
  ].filter((item) => item.value)

  const inMyBag = [
    { label: 'Racket', value: player.racket },
    { label: 'Shoes', value: player.shoes },
    { label: 'Grip', value: player.grip },
    { label: 'Bag', value: player.bag },
  ].filter((item) => item.value)

  return (
    <main className="pt-12 pb-32">

      {/* ── HERO: two-column layout matching mockup ── */}
      <section className="px-8 max-w-[1440px] mx-auto mt-12 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">

          {/* Photo column */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl bg-surface-container-high">
              {player.photo ? (
                <Image
                  src={urlFor(player.photo as SanityImageSource).width(800).height(1000).url()}
                  alt={player.name}
                  fill
                  priority
                  className="object-cover object-top"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-headline font-black text-8xl text-on-surface-variant opacity-20">
                    {player.name[0]}
                  </span>
                </div>
              )}
            </div>
            {player.currentRanking && (
              <div className="absolute -bottom-6 -right-6 bg-tertiary-container text-on-tertiary-container p-6 rounded-[1.5rem] shadow-xl hidden md:block">
                <p className="font-headline font-black text-4xl">
                  #{String(player.currentRanking).padStart(2, '0')}
                </p>
                <p className="font-body text-xs uppercase tracking-widest font-bold mt-1">Ranked Player</p>
              </div>
            )}
          </div>

          {/* Info column */}
          <div className="lg:col-span-7 lg:pl-12">
            <div className="inline-block bg-primary-container text-on-primary-container px-4 py-1 rounded-full mb-6 font-body text-sm font-bold uppercase tracking-widest">
              {player.nationality ?? 'Player'}
            </div>
            <h1 className="font-headline text-7xl md:text-8xl font-black text-on-surface tracking-tighter leading-none mb-4">
              {player.name}
            </h1>
            {player.bio && (
              <p className="font-body text-xl text-on-surface-variant max-w-xl leading-relaxed mb-8">
                {player.bio}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              {flagCode && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`https://flagcdn.com/24x18/${flagCode}.png`}
                  width={24}
                  height={18}
                  alt={player.nationality ?? ''}
                  className="rounded-[2px]"
                />
              )}
              {player.nationality && (
                <span className="font-body text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                  {player.nationality}
                </span>
              )}
              {player.homeClub && (
                <>
                  <span className="text-outline-variant">·</span>
                  <Link
                    href={`/clubs/${player.homeClub.slug.current}`}
                    className="font-body text-sm font-bold text-primary hover:underline uppercase tracking-widest"
                  >
                    {player.homeClub.name}
                  </Link>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/players"
                className="bg-surface-container text-on-surface px-8 py-4 rounded-full font-headline font-bold text-base hover:bg-surface-container-high transition-all"
              >
                ← All Players
              </Link>
              <Link
                href="/rankings"
                className="bg-primary-container text-on-primary-container px-8 py-4 rounded-full font-headline font-bold text-base hover:opacity-80 transition-all"
              >
                View Rankings
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── OFF THE COURT ── */}
      {offTheCourt.length > 0 && (
        <section className="px-8 max-w-[1440px] mx-auto mb-16">
          <h2 className="font-headline text-4xl font-black tracking-tighter text-on-surface mb-8">
            Off The Court
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offTheCourt.map(({ label, value }) => (
              <div key={label} className="bg-surface-container-low p-8 rounded-[2rem]">
                <p className="font-body text-xs font-black uppercase tracking-widest text-secondary mb-3">
                  {label}
                </p>
                <p className="font-headline text-xl font-bold text-on-surface leading-snug">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── IN MY BAG ── */}
      {inMyBag.length > 0 && (
        <section className="px-8 max-w-[1440px] mx-auto mb-16">
          <h2 className="font-headline text-4xl font-black tracking-tighter text-on-surface mb-8">
            In My Bag
          </h2>
          <div className="bg-surface-container rounded-[2rem] p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {inMyBag.map(({ label, value }) => (
                <div key={label}>
                  <p className="font-body text-xs font-black uppercase tracking-widest text-secondary mb-2">
                    {label}
                  </p>
                  <p className="font-headline font-bold text-on-surface text-lg leading-snug">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
