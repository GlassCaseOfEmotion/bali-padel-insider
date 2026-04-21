import { fetchPlayerBySlug } from '@/sanity/lib/fetch'
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
  const player = await fetchPlayerBySlug(slug)
  return { title: player?.name ?? 'Player' }
}

export default async function PlayerPage({ params }: Props) {
  const { slug } = await params
  const player = await fetchPlayerBySlug(slug)

  if (!player) notFound()

  const offTheCourt = [
    { label: 'Pre-match ritual', value: player.preMatchRitual },
    { label: 'Secret talent', value: player.secretTalent },
    { label: 'Favourite playlist', value: player.favouritePlaylist },
    { label: 'Recovery routine', value: player.recoveryRoutine },
  ].filter((item) => item.value)

  const inMyBag = [
    { label: 'Racket', value: player.racket },
    { label: 'Shoes', value: player.shoes },
    { label: 'Grip', value: player.grip },
    { label: 'Bag', value: player.bag },
  ].filter((item) => item.value)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row gap-8 items-start">
        {player.photo && (
          <div className="relative h-48 w-48 rounded-[2rem] overflow-hidden bg-surface-container-high flex-shrink-0">
            <Image
              src={urlFor(player.photo as SanityImageSource).width(400).height(400).url()}
              alt={player.name}
              fill
              priority
              className="object-cover object-top"
            />
          </div>
        )}
        <div>
          <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-on-surface">{player.name}</h1>
          <div className="mt-3 flex flex-wrap gap-3 font-body text-sm text-on-surface-muted">
            {player.currentRanking && (
              <span className="font-semibold text-primary">Ranking #{player.currentRanking}</span>
            )}
            {player.nationality && <span>{player.nationality}</span>}
            {player.homeClub && (
              <Link
                href={`/clubs/${player.homeClub.slug.current}`}
                className="text-primary hover:underline"
              >
                {player.homeClub.name}
              </Link>
            )}
          </div>
          {player.bio && (
            <p className="mt-4 font-body text-on-surface-muted leading-relaxed">{player.bio}</p>
          )}
        </div>
      </div>

      {offTheCourt.length > 0 && (
        <section className="mt-12 bg-surface-container rounded-[2rem] p-8">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-on-surface mb-6">Off The Court</h2>
          <dl className="space-y-5">
            {offTheCourt.map(({ label, value }) => (
              <div key={label}>
                <dt className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted">
                  {label}
                </dt>
                <dd className="mt-1 font-body text-on-surface">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {inMyBag.length > 0 && (
        <section className="mt-6 bg-surface-container rounded-[2rem] p-8">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-on-surface mb-6">In My Bag</h2>
          <dl className="grid grid-cols-2 gap-5">
            {inMyBag.map(({ label, value }) => (
              <div key={label}>
                <dt className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted">
                  {label}
                </dt>
                <dd className="mt-1 font-body font-medium text-on-surface">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  )
}
