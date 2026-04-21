import { fetchAllPlayers } from '@/sanity/lib/fetch'
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

export default async function PlayersPage() {
  const players: Player[] = await fetchAllPlayers() ?? []

  const top5 = players.filter((p) => p.currentRanking && p.currentRanking <= 5).sort((a, b) => (a.currentRanking ?? 99) - (b.currentRanking ?? 99))
  const rest = players.filter((p) => !p.currentRanking || p.currentRanking > 5)

  return (
    <>
      {/* ── HERO ── */}
      <header className="relative w-full min-h-[480px] flex items-center overflow-hidden">
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

      {/* ── TOP 5 HORIZONTAL SCROLL ── */}
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

      {/* ── PLAYER GRID ── */}
      <main className="py-16 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-headline text-3xl font-black tracking-tight">
            All Players <span className="text-primary">({players.length})</span>
          </h2>
        </div>

        {players.length > 0 ? (
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
  )
}
