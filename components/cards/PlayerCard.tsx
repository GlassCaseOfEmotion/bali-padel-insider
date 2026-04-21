import Link from 'next/link'
import Image from 'next/image'
import type { SanityImageSource } from '@sanity/image-url'
import { urlFor } from '@/sanity/lib/urlFor'

interface Player {
  name: string
  slug: { current: string }
  photo?: SanityImageSource | null
  currentRanking?: number
  nationality?: string
  homeClubName?: string
}

export function PlayerCard({ player }: { player: Player }) {
  return (
    <Link
      href={`/players/${player.slug.current}`}
      className="group block rounded-[2rem] overflow-hidden bg-surface-container-low shadow-[0_8px_40px_rgba(58,50,22,0.06)] hover:scale-[1.02] hover:shadow-[0_16px_60px_rgba(58,50,22,0.10)] transition-all duration-300"
    >
      {player.photo && (
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={urlFor(player.photo).width(480).height(560).url()}
            alt={player.name}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-bold leading-snug tracking-[-0.02em] text-on-surface">
            {player.name}
          </h3>
          {player.currentRanking && (
            <span className="shrink-0 font-body text-sm font-semibold text-primary">
              #{player.currentRanking}
            </span>
          )}
        </div>
        {player.nationality && (
          <p className="mt-1 font-body text-xs uppercase tracking-widest text-on-surface-muted">
            {player.nationality}
          </p>
        )}
        {player.homeClubName && (
          <p className="mt-2 font-body text-xs text-on-surface-muted">{player.homeClubName}</p>
        )}
      </div>
    </Link>
  )
}
