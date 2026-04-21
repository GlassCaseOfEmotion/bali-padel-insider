import { fetchRankingByCategory } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/urlFor'
import { nationalityCode } from '@/lib/flags'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { SanityImageSource } from '@sanity/image-url'

export const metadata: Metadata = { title: 'Rankings' }
export const revalidate = 60

const CATEGORIES = [
  { key: 'men', label: 'Men' },
  { key: 'women', label: 'Women' },
  { key: 'mixed', label: 'Mixed' },
]

interface Props {
  searchParams: Promise<{ category?: string }>
}

export default async function RankingsPage({ searchParams }: Props) {
  const { category: categoryParam } = await searchParams
  const activeCategory = CATEGORIES.find((c) => c.key === categoryParam)?.key ?? 'men'

  const ranking = await fetchRankingByCategory(activeCategory)
  const entries: Array<{
    rank: number
    points: number
    player: { name: string; slug: { current: string }; photo?: SanityImageSource; nationality?: string }
  }> = ranking?.entries ?? []

  const topEntry = entries[0] ?? null

  return (
    <main className="pt-12 pb-32 px-4 sm:px-6 md:px-16 max-w-[1440px] mx-auto">

      {/* ── HERO ── */}
      <header className="mb-12 md:ml-0">
        <div className="inline-block px-4 py-1 bg-tertiary-container text-on-tertiary-container rounded-full font-body text-xs font-bold tracking-widest uppercase mb-4">
          Global Standing
        </div>
        <h1 className="font-headline text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter text-on-surface leading-none mb-6">
          {"Bali's Padel"} <br /><span className="text-primary italic">Elite Tier.</span>
        </h1>
        <p className="font-body text-on-surface-variant max-w-xl text-lg font-medium leading-relaxed">
          Celebrating the kinetic energy of our top performers. Updated weekly based on club tournaments and sanctioned rankings.
        </p>
      </header>

      {/* ── CATEGORY TABS ── */}
      <section className="bg-surface-container-low rounded-[1.5rem] p-4 mb-12 flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(({ key, label }) => (
            <Link
              key={key}
              href={`/rankings?category=${key}`}
              className={`px-8 py-3 rounded-full font-headline font-bold text-sm uppercase tracking-widest transition-all ${
                activeCategory === key
                  ? 'bg-primary text-on-primary shadow-lg'
                  : 'bg-surface-container-high text-on-surface/60 hover:bg-surface-container-highest'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── TOP 1 FEATURED ── */}
      {topEntry && (
        <div className="bg-primary-container text-on-primary-container rounded-[2rem] p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-lg hover:scale-[1.005] transition-transform duration-300 mb-4">
          <div className="col-span-1 font-headline text-4xl font-black italic">01</div>
          <div className="col-span-5 flex items-center gap-6">
            <div className="relative">
              {topEntry.player.photo ? (
                <Image
                  src={urlFor(topEntry.player.photo).width(160).height(160).url()}
                  alt={topEntry.player.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover border-4 border-on-primary"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary-fixed flex items-center justify-center border-4 border-on-primary">
                  <span className="font-headline font-black text-primary text-xl">1</span>
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-tertiary-fixed text-on-tertiary-fixed p-1 rounded-full shadow-lg">
                <span className="text-xs font-black">★</span>
              </div>
            </div>
            <div>
              <h3 className="font-headline text-2xl font-black tracking-tight leading-tight">{topEntry.player.name}</h3>
              {topEntry.player.nationality && (
                <p className="font-body text-sm font-bold opacity-70 tracking-wide uppercase flex items-center gap-2 mt-1">
                  {topEntry.player.nationality}
                  {nationalityCode(topEntry.player.nationality) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://flagcdn.com/16x12/${nationalityCode(topEntry.player.nationality)}.png`}
                      width={16}
                      height={12}
                      alt={topEntry.player.nationality}
                      className="inline-block rounded-[2px]"
                    />
                  )}
                </p>
              )}
            </div>
          </div>
          <div className="col-span-2 flex justify-center items-center">
            <div className="text-center">
              <div className="font-headline text-2xl font-black">{topEntry.points.toLocaleString()}</div>
              <div className="font-body text-[10px] font-bold uppercase tracking-widest opacity-60">Season Pts</div>
            </div>
          </div>
          <div className="col-span-2" />
          <div className="col-span-2 text-right">
            <Link
              href={`/players/${topEntry.player.slug.current}`}
              className="inline-flex items-center gap-2 bg-on-primary-container text-primary-container px-6 py-3 rounded-full font-body text-sm font-black transition-all hover:opacity-90"
            >
              VIEW PROFILE →
            </Link>
          </div>
        </div>
      )}

      {/* ── RANKINGS LIST ── */}
      {entries.length > 0 ? (
        <>
          {/* Table header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 font-body text-xs font-black tracking-widest uppercase text-on-surface-variant/60">
            <div className="col-span-1">Rank</div>
            <div className="col-span-5">Player</div>
            <div className="col-span-2 text-center">Nationality</div>
            <div className="col-span-2 text-right">Points</div>
            <div className="col-span-2 text-right">Profile</div>
          </div>

          <div className="space-y-3 mt-2">
            {entries.slice(1).map((entry) => {
              const flagCode = entry.player.nationality ? nationalityCode(entry.player.nationality) : ''
              return (
                <div
                  key={entry.rank}
                  className="bg-surface-container rounded-[1.5rem] p-6 md:px-8 md:py-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-surface-container-high transition-colors"
                >
                  <div className="col-span-1 font-headline text-2xl font-bold italic text-on-surface-variant/40">
                    {String(entry.rank).padStart(2, '0')}
                  </div>
                  <div className="col-span-5 flex items-center gap-4">
                    {entry.player.photo ? (
                      <Image
                        src={urlFor(entry.player.photo).width(96).height(96).url()}
                        alt={entry.player.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                        <span className="font-headline font-black text-on-surface-variant text-sm">{entry.rank}</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-headline text-lg font-bold tracking-tight">{entry.player.name}</h3>
                    </div>
                  </div>
                  <div className="col-span-2 flex justify-start md:justify-center items-center gap-2">
                    {entry.player.nationality && (
                      <>
                        {flagCode && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`https://flagcdn.com/16x12/${flagCode}.png`}
                            width={16}
                            height={12}
                            alt={entry.player.nationality}
                            className="inline-block rounded-[2px]"
                          />
                        )}
                        <span className="font-body text-xs font-bold text-on-surface-variant uppercase tracking-tighter">
                          {entry.player.nationality}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="col-span-2 text-right">
                    <div className="font-headline text-xl font-bold">{entry.points.toLocaleString()}</div>
                  </div>
                  <div className="col-span-2 text-right">
                    <Link
                      href={`/players/${entry.player.slug.current}`}
                      className="font-body text-primary text-xs font-black tracking-widest uppercase hover:underline"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <p className="font-body text-on-surface-variant text-center py-20">No rankings published yet for {activeCategory}.</p>
      )}

      {/* ── CTA ── */}
      <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1 md:col-span-2 relative overflow-hidden rounded-[2rem] min-h-[320px] flex items-end p-8 md:p-12 bg-inverse-surface">
          <div className="relative z-20 text-white">
            <h4 className="font-headline text-3xl font-black mb-4">Want to Join the Rankings?</h4>
            <p className="font-body mb-8 opacity-80 max-w-md">Register for our upcoming Open Season. Test your mettle against Bali's finest and climb the leaderboard.</p>
            <Link href="/events" className="bg-primary px-8 py-4 rounded-full font-headline font-bold text-on-primary hover:bg-primary-dim transition-all inline-block">
              VIEW EVENTS
            </Link>
          </div>
        </div>
        <div className="col-span-1 bg-secondary-container p-8 md:p-12 rounded-[2rem] flex flex-col justify-between">
          <div>
            <h4 className="font-headline text-3xl font-black text-on-secondary-container leading-tight">Player Directory</h4>
          </div>
          <div>
            <p className="font-body text-on-secondary-container opacity-80 mb-6">Connect with players of your skill level for friendlies and sparring.</p>
            <Link href="/players" className="font-headline font-black text-secondary tracking-widest text-sm uppercase flex items-center gap-2">
              BROWSE ALL PLAYERS →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
