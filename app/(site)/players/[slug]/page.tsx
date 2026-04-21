import { fetchPlayerBySlug } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/urlFor'
import { nationalityCode } from '@/lib/flags'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { SanityImageSource } from '@sanity/image-url'

interface RecentResult {
  tournamentName: string
  opponent?: string
  score?: string
  isWin: boolean
}

interface Interview {
  title: string
  slug: { current: string }
  coverImage?: SanityImageSource
  excerpt?: string
}

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const player = await fetchPlayerBySlug(slug)
  return { title: player?.name ?? 'Player' }
}

const OFF_COURT_ICONS: Record<string, string> = {
  preMatchRitual: '☕',
  secretTalent: '🏄',
  favouritePlaylist: '🎵',
}

const OFF_COURT_LABELS: Record<string, string> = {
  preMatchRitual: 'Pre-Match Ritual',
  secretTalent: 'Secret Talent',
  favouritePlaylist: 'The Playlist',
}

const BAG_ITEMS = [
  { key: 'racket', urlKey: 'racketUrl', label: 'Racket' },
  { key: 'shoes', urlKey: 'shoesUrl', label: 'Footwear' },
  { key: 'grip', urlKey: 'gripUrl', label: 'Grip' },
  { key: 'bag', urlKey: 'bagUrl', label: 'The Bag' },
] as const

export default async function PlayerPage({ params }: Props) {
  const { slug } = await params
  const player = await fetchPlayerBySlug(slug)

  if (!player) notFound()

  const flagCode = player.nationality ? nationalityCode(player.nationality) : ''

  const offTheCourt = (['preMatchRitual', 'secretTalent', 'favouritePlaylist'] as const)
    .map((key) => ({ key, label: OFF_COURT_LABELS[key], icon: OFF_COURT_ICONS[key], value: player[key] }))
    .filter((item) => item.value)

  const inMyBag = BAG_ITEMS
    .map((item) => ({ ...item, value: player[item.key], url: player[item.urlKey] ?? null }))
    .filter((item) => item.value)

  const partners: { name: string; url?: string }[] = player.partners ?? []

  const recentResults: RecentResult[] = player.recentResults ?? []
  const interviews: Interview[] = player.interviews ?? []
  const featuredInterview = interviews[0] ?? null
  const clipInterviews = interviews.slice(1)

  const hasStats = player.winRate || player.matchesPlayed || player.smashPower || player.titles || player.isClubMvp || recentResults.length > 0
  const hasIslandMindset = player.islandMindsetQ1 && player.islandMindsetA1

  return (
    <main className="pt-12 pb-32">

      {/* ── HERO ── */}
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
                <p className="font-body text-xs uppercase tracking-widest font-bold mt-1">Club Rank</p>
              </div>
            )}
          </div>

          {/* Info column */}
          <div className="lg:col-span-7 lg:pl-12">
            <div className="inline-block bg-primary-container text-on-primary-container px-4 py-1 rounded-full mb-6 font-body text-sm font-bold uppercase tracking-widest">
              {player.tier ?? player.nationality ?? 'Player'}
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
                className="bg-secondary-container text-on-secondary-container px-8 py-4 rounded-full font-headline font-bold text-base hover:opacity-80 transition-all"
              >
                View Rankings
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BENTO GRID ── */}
      {hasStats && (
        <section className="px-8 max-w-[1440px] mx-auto mb-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {/* Career Win Rate */}
            {player.winRate && (
              <div className="md:col-span-2 bg-surface-container-low p-10 rounded-[2rem] flex flex-col justify-between aspect-video md:aspect-auto">
                <h3 className="font-body text-sm font-bold uppercase tracking-widest opacity-60">Career Win Rate</h3>
                <div className="mt-auto">
                  <span className="text-8xl font-black text-primary leading-none font-headline">{player.winRate}</span>
                </div>
              </div>
            )}

            {/* Recent Results */}
            {recentResults.length > 0 && (
              <div className={`${player.winRate ? 'md:col-span-2' : 'md:col-span-4'} bg-surface-container-high p-10 rounded-[2rem]`}>
                <h3 className="font-body text-sm font-bold uppercase tracking-widest mb-8 opacity-60">Recent Results</h3>
                <div className="space-y-6">
                  {recentResults.slice(0, 3).map((result, i) => (
                    <div key={i} className={`flex justify-between items-center pb-4 ${i < Math.min(recentResults.length, 3) - 1 ? 'border-b border-outline-variant/30' : ''}`}>
                      <div>
                        <p className="font-headline font-bold text-lg">{result.tournamentName}</p>
                        {result.opponent && <p className="text-sm opacity-60">{result.opponent}</p>}
                      </div>
                      {result.score && (
                        <span className={`${result.isWin ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-error-container text-on-error-container'} px-3 py-1 rounded-full font-bold text-xs`}>
                          {result.isWin ? 'WIN' : 'LOSS'} ({result.score})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Secondary stats */}
            {player.matchesPlayed != null && (
              <div className="bg-surface-container p-8 rounded-[2rem] text-center">
                <p className="font-body text-xs uppercase tracking-widest font-bold opacity-60 mb-2">Matches Played</p>
                <p className="font-headline text-5xl font-black">{player.matchesPlayed}</p>
              </div>
            )}
            {player.smashPower != null && (
              <div className="bg-surface-container p-8 rounded-[2rem] text-center">
                <p className="font-body text-xs uppercase tracking-widest font-bold opacity-60 mb-2">Smash Power</p>
                <p className="font-headline text-5xl font-black text-secondary">
                  {player.smashPower}<span className="text-xl">km/h</span>
                </p>
              </div>
            )}
            {player.titles != null && (
              <div className="bg-surface-container p-8 rounded-[2rem] text-center border-2 border-tertiary">
                <p className="font-body text-xs uppercase tracking-widest font-bold opacity-60 mb-2">Titles</p>
                <p className="font-headline text-5xl font-black">{player.titles}</p>
              </div>
            )}
            {player.isClubMvp && (
              <div className="bg-surface-container p-8 rounded-[2rem] text-center">
                <p className="font-body text-xs uppercase tracking-widest font-bold opacity-60 mb-2">Club MVP</p>
                <p className="text-5xl">⭐</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── FEATURED INTERVIEW & CLIPS ── */}
      {featuredInterview && (
        <section className="mb-24">
          <div className="max-w-[1440px] mx-auto px-8">
            <div className="bg-primary/5 rounded-[2rem] p-8 md:p-12">
              <div className="flex flex-col lg:flex-row gap-12 items-center">

                {/* Featured video / thumbnail */}
                <div className="w-full lg:w-2/3 relative group cursor-pointer">
                  <Link href={`/interviews/${featuredInterview.slug.current}`}>
                    <div className="aspect-video rounded-[2rem] overflow-hidden relative shadow-2xl bg-surface-container-high">
                      {featuredInterview.coverImage ? (
                        <Image
                          src={urlFor(featuredInterview.coverImage).width(1200).height(675).url()}
                          alt={featuredInterview.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-surface-container-highest" />
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white text-5xl font-black ml-1">▶</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Interview description */}
                <div className="w-full lg:w-1/3">
                  <span className="font-body text-xs font-black uppercase tracking-[0.3em] text-primary mb-4 block">Featured Interview</span>
                  <h2 className="font-headline text-4xl font-black tracking-tighter mb-6 leading-tight">
                    {featuredInterview.title}
                  </h2>
                  {featuredInterview.excerpt && (
                    <p className="font-body text-lg text-on-surface-variant leading-relaxed mb-8">
                      {featuredInterview.excerpt}
                    </p>
                  )}
                  <Link
                    href={`/interviews/${featuredInterview.slug.current}`}
                    className="inline-block bg-primary text-on-primary px-8 py-4 rounded-full font-headline font-bold hover:opacity-90 transition-opacity"
                  >
                    Watch Interview
                  </Link>
                </div>
              </div>

              {/* Clips carousel */}
              {clipInterviews.length > 0 && (
                <div className="mt-16 pt-16 border-t border-outline-variant/20">
                  <div className="flex justify-between items-end mb-8">
                    <h3 className="font-body text-sm font-bold uppercase tracking-widest opacity-60">More Interviews</h3>
                    <Link href="/interviews" className="text-primary font-headline font-bold text-sm hover:underline">
                      View all →
                    </Link>
                  </div>
                  <div className="flex gap-6 overflow-x-auto pb-6 snap-x" style={{ scrollbarWidth: 'none' }}>
                    {clipInterviews.map((clip) => (
                      <Link
                        key={clip.slug.current}
                        href={`/interviews/${clip.slug.current}`}
                        className="min-w-[280px] md:min-w-[320px] snap-start group cursor-pointer flex-shrink-0"
                      >
                        <div className="aspect-video rounded-[1.5rem] overflow-hidden relative mb-4 bg-surface-container-high">
                          {clip.coverImage ? (
                            <Image
                              src={urlFor(clip.coverImage).width(640).height(360).url()}
                              alt={clip.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-surface-container-highest" />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                            <span className="text-white text-4xl font-black">▶</span>
                          </div>
                        </div>
                        <h4 className="font-headline font-bold text-lg mb-1 group-hover:text-primary transition-colors">{clip.title}</h4>
                        {clip.excerpt && <p className="font-body text-sm opacity-60 line-clamp-2">{clip.excerpt}</p>}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── THE ISLAND MINDSET Q&A ── */}
      {hasIslandMindset && (
        <section className="bg-surface-container-lowest py-24 mb-24 overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 text-[12rem] font-black text-surface-container-high select-none leading-none z-0 font-headline">
                &ldquo;
              </div>
              <div className="relative z-10">
                <h2 className="font-headline text-5xl md:text-6xl font-black tracking-tighter mb-10">
                  THE ISLAND<br />MINDSET
                </h2>
                <div className="space-y-8">
                  <div>
                    <p className="font-headline font-bold text-xl text-primary mb-2">{player.islandMindsetQ1}</p>
                    <p className="font-body text-lg leading-relaxed text-on-surface-variant">&ldquo;{player.islandMindsetA1}&rdquo;</p>
                  </div>
                  {player.islandMindsetQ2 && player.islandMindsetA2 && (
                    <div>
                      <p className="font-headline font-bold text-xl text-primary mb-2">{player.islandMindsetQ2}</p>
                      <p className="font-body text-lg leading-relaxed text-on-surface-variant">&ldquo;{player.islandMindsetA2}&rdquo;</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Grayscale photo */}
            {player.photo && (
              <div className="relative h-[600px] rounded-[2rem] overflow-hidden group">
                <Image
                  src={urlFor(player.photo as SanityImageSource).width(800).height(1000).url()}
                  alt={player.name}
                  fill
                  className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                <div className="absolute bottom-10 left-10 text-white">
                  <p className="font-body text-xs uppercase tracking-[0.3em] mb-2">Exclusive Feature</p>
                  <p className="font-headline font-bold text-3xl">The Kinetic Issue</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── OFF THE COURT ── */}
      {offTheCourt.length > 0 && (
        <section className="px-8 max-w-[1440px] mx-auto mb-24">
          <h3 className="font-body text-sm font-bold uppercase tracking-widest mb-12 opacity-60">Off the Court</h3>
          <div className="flex flex-col md:flex-row gap-8">
            {offTheCourt.map(({ key, label, icon, value }, index) => (
              <div
                key={key}
                className={`flex-1 bg-surface-container-low p-10 rounded-[2rem] ${index === 1 ? 'mt-0 md:mt-12' : ''}`}
              >
                <span className="text-4xl mb-4 block">{icon}</span>
                <h4 className="font-headline font-bold text-2xl mb-4">{label}</h4>
                <p className="font-body text-on-surface-variant">{value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── IN MY BAG ── */}
      {inMyBag.length > 0 && (
        <section className="px-8 max-w-[1440px] mx-auto">
          <div className="bg-surface-container-highest rounded-[2rem] p-12 md:p-20 overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="font-headline text-5xl font-black tracking-tighter mb-16">IN MY BAG</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {inMyBag.map(({ key, label, value, url }, index) => {
                  const inner = (
                    <>
                      <div className="aspect-square bg-surface-container rounded-[1.5rem] flex items-center justify-center p-8 transition-colors group-hover:bg-primary-container">
                        <span className="font-headline font-black text-4xl text-primary/30">{label[0]}</span>
                      </div>
                      <div>
                        <p className="font-body text-xs uppercase tracking-widest font-bold text-primary mb-1 flex items-center gap-2">
                          {label}
                          {url && <span className="text-primary/40 text-[10px] font-normal normal-case tracking-normal">→ buy</span>}
                        </p>
                        <h4 className="font-headline font-bold text-xl">{value}</h4>
                      </div>
                    </>
                  )
                  return url ? (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`space-y-6 group ${index % 2 === 1 ? 'lg:mt-12' : ''}`}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div key={key} className={`space-y-6 ${index % 2 === 1 ? 'lg:mt-12' : ''}`}>
                      {inner}
                    </div>
                  )
                })}
              </div>

              {/* Official Partners strip */}
              {partners.length > 0 && (
                <div className="mt-20 pt-10 border-t border-outline-variant/30 flex flex-wrap items-center gap-12">
                  <p className="font-body text-xs font-black uppercase tracking-[0.4em] text-on-surface-variant/40">Official Partners</p>
                  {partners.map(({ name, url }) =>
                    url ? (
                      <a
                        key={name}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-headline text-2xl font-bold text-on-surface/30 hover:text-on-surface/60 transition-colors"
                      >
                        {name}
                      </a>
                    ) : (
                      <span key={name} className="font-headline text-2xl font-bold text-on-surface/30">
                        {name}
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
