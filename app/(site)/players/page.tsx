import { fetchAllPlayers, fetchRankingByCategory } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/urlFor'
import { nationalityCode } from '@/lib/flags'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { SanityImageSource } from '@sanity/image-url'

export const metadata: Metadata = { title: 'Players' }
export const revalidate = 60

interface Player {
  name: string
  slug: { current: string }
  photo?: SanityImageSource
  currentRanking?: number
  nationality?: string
  homeClubName?: string
}

const RANK_CATEGORIES = [
  { key: 'men', label: 'Men' },
  { key: 'women', label: 'Women' },
  { key: 'mixed', label: 'Mixed' },
]

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; category?: string }>
}) {
  const { tab, category: categoryParam } = await searchParams
  const activeTab = tab === 'rankings' ? 'rankings' : 'players'
  const activeCategory = RANK_CATEGORIES.find((c) => c.key === categoryParam)?.key ?? 'men'

  const [players, ranking] = await Promise.all([
    fetchAllPlayers(),
    fetchRankingByCategory(activeCategory),
  ])

  const playerList: Player[] = players ?? []
  const top5 = playerList.filter((p) => p.currentRanking && p.currentRanking <= 5).sort((a, b) => (a.currentRanking ?? 99) - (b.currentRanking ?? 99))
  const rest = playerList.filter((p) => !p.currentRanking || p.currentRanking > 5)

  const rankEntries: Array<{
    rank: number
    points: number
    player: { name: string; slug: { current: string }; photo?: SanityImageSource; nationality?: string }
  }> = ranking?.entries ?? []
  const topEntry = rankEntries[0] ?? null

  return (
    <>
      {/* ── HERO ── */}
      <header className="relative w-full min-h-[480px] flex items-center overflow-hidden pt-12">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-surface-container-low via-surface to-surface-container" />
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 w-full py-20">
          <div className="max-w-2xl">
            <span className="bg-tertiary text-on-tertiary px-4 py-1.5 rounded-full font-body text-xs font-bold uppercase tracking-widest mb-6 inline-block">
              Member Directory
            </span>
            <h1 className="font-headline text-4xl sm:text-6xl md:text-8xl font-black text-on-surface tracking-tighter leading-[0.9] mb-6">
              Meet the<br /><span className="text-primary italic">Island Legends</span>
            </h1>
            <p className="font-body text-lg md:text-xl text-on-surface/80 font-medium max-w-lg leading-relaxed">
              Connect with the elite talent of Bali's premier padel community. From pro tour champions to rising tropical stars.
            </p>
          </div>
        </div>
      </header>

      {/* ── TAB STRIP ── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 py-8 flex gap-3">
        <Link
          href="/players"
          className={`px-6 py-2.5 rounded-full font-headline font-bold text-sm uppercase tracking-widest transition-colors ${
            activeTab === 'players'
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
          }`}
        >
          Players
        </Link>
        <Link
          href="/players?tab=rankings"
          className={`px-6 py-2.5 rounded-full font-headline font-bold text-sm uppercase tracking-widest transition-colors ${
            activeTab === 'rankings'
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
          }`}
        >
          Rankings
        </Link>
      </div>

      {/* ── PLAYERS TAB ── */}
      {activeTab === 'players' && (
        <>
          {/* Top 5 horizontal scroll */}
          {top5.length > 0 && (
            <section className="py-16 bg-surface-container-low overflow-hidden">
              <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 mb-10">
                <h2 className="font-headline text-4xl font-black tracking-tight text-on-surface">The Elite Top 5</h2>
                <p className="font-body text-on-surface/60 font-medium uppercase tracking-widest text-sm mt-2">Bali Season Rankings</p>
              </div>
              <div className="max-w-[1440px] mx-auto overflow-x-auto">
                <div className="flex gap-6 px-4 sm:px-6 md:px-16 pb-8" style={{ scrollbarWidth: 'none' }}>
                  {top5.map((player) => {
                    const flagCode = player.nationality ? nationalityCode(player.nationality) : ''
                    return (
                      <Link
                        key={player.slug.current}
                        href={`/players/${player.slug.current}`}
                        className="flex-none w-[240px] sm:w-[280px] bg-surface rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all group hover:scale-[1.02] duration-300"
                      >
                        <div className="relative mb-6 rounded-[1.5rem] overflow-hidden h-[320px]">
                          {player.photo ? (
                            <Image
                              src={urlFor(player.photo as SanityImageSource).width(560).height(640).url()}
                              alt={player.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-surface-container-high flex items-center justify-center">
                              <span className="font-headline font-black text-5xl text-on-surface-variant opacity-20">{player.name[0]}</span>
                            </div>
                          )}
                          {player.currentRanking && (
                            <div className="absolute top-4 left-4 bg-tertiary text-on-tertiary px-3 py-1 rounded-full font-headline font-black text-sm">
                              #{String(player.currentRanking).padStart(2, '0')}
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-headline text-xl font-bold group-hover:text-primary transition-colors">{player.name}</h3>
                            {player.nationality && (
                              <div className="flex items-center gap-2 text-on-surface/60 text-sm font-semibold uppercase tracking-wider mt-1">
                                {flagCode && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={`https://flagcdn.com/16x12/${flagCode}.png`}
                                    width={16}
                                    height={12}
                                    alt={player.nationality}
                                    className="rounded-[2px]"
                                  />
                                )}
                                {player.nationality}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </section>
          )}

          {/* All players grid */}
          <main className="py-16 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-headline text-3xl font-black tracking-tight">
                All Players <span className="text-primary">({playerList.length})</span>
              </h2>
            </div>

            {playerList.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {rest.map((player) => {
                  const flagCode = player.nationality ? nationalityCode(player.nationality) : ''
                  return (
                    <Link
                      key={player.slug.current}
                      href={`/players/${player.slug.current}`}
                      className="bg-surface-container-low rounded-[2rem] p-6 flex flex-col items-center text-center group hover:bg-surface-container transition-all"
                    >
                      <div className="relative w-28 h-28 mb-5">
                        {player.photo ? (
                          <Image
                            src={urlFor(player.photo as SanityImageSource).width(224).height(224).url()}
                            alt={player.name}
                            fill
                            className="object-cover rounded-full"
                          />
                        ) : (
                          <div className="absolute inset-0 rounded-full bg-surface-container-high flex items-center justify-center">
                            <span className="font-headline font-black text-2xl text-on-surface-variant opacity-30">{player.name[0]}</span>
                          </div>
                        )}
                        {player.currentRanking && (
                          <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center font-headline font-bold text-xs">
                            #{player.currentRanking}
                          </div>
                        )}
                      </div>
                      <h4 className="font-headline text-base font-bold group-hover:text-primary transition-colors">{player.name}</h4>
                      {player.nationality && (
                        <p className="font-body text-on-surface/60 font-semibold uppercase tracking-widest text-[10px] mt-1 flex items-center justify-center gap-1.5">
                          {flagCode && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={`https://flagcdn.com/16x12/${flagCode}.png`}
                              width={14}
                              height={10}
                              alt={player.nationality}
                              className="rounded-[2px]"
                            />
                          )}
                          {player.nationality}
                        </p>
                      )}
                      {player.homeClubName && (
                        <p className="font-body text-[10px] text-primary font-bold tracking-widest uppercase mt-1">{player.homeClubName}</p>
                      )}
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="font-body text-on-surface-variant text-center py-20">No players added yet.</p>
            )}
          </main>
        </>
      )}

      {/* ── RANKINGS TAB ── */}
      {activeTab === 'rankings' && (
        <main className="py-8 pb-32 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16">

          {/* Category selector */}
          <section className="bg-surface-container-low rounded-[1.5rem] p-4 mb-12 flex gap-2 flex-wrap shadow-sm">
            {RANK_CATEGORIES.map(({ key, label }) => (
              <Link
                key={key}
                href={`/players?tab=rankings&category=${key}`}
                className={`px-8 py-3 rounded-full font-headline font-bold text-sm uppercase tracking-widest transition-all ${
                  activeCategory === key
                    ? 'bg-primary text-on-primary shadow-lg'
                    : 'bg-surface-container-high text-on-surface/60 hover:bg-surface-container-highest'
                }`}
              >
                {label}
              </Link>
            ))}
          </section>

          {/* Top entry featured */}
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

          {/* Rankings list */}
          {rankEntries.length > 0 ? (
            <>
              <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 font-body text-xs font-black tracking-widest uppercase text-on-surface-variant/60">
                <div className="col-span-1">Rank</div>
                <div className="col-span-5">Player</div>
                <div className="col-span-2 text-center">Nationality</div>
                <div className="col-span-2 text-right">Points</div>
                <div className="col-span-2 text-right">Profile</div>
              </div>

              <div className="space-y-3 mt-2">
                {rankEntries.slice(1).map((entry) => {
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
                        <h3 className="font-headline text-lg font-bold tracking-tight">{entry.player.name}</h3>
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
        </main>
      )}
    </>
  )
}
