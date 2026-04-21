import Link from 'next/link'
import Image from 'next/image'
import type { SanityImageSource } from '@sanity/image-url'
import { urlFor } from '@/sanity/lib/urlFor'

interface Club {
  name: string
  slug: { current: string }
  coverPhoto?: SanityImageSource | null
  courts?: { count?: number; surfaceType?: string }
  address?: string
}

export function ClubCard({ club }: { club: Club }) {
  return (
    <Link
      href={`/clubs/${club.slug.current}`}
      className="group block rounded-[2rem] overflow-hidden bg-surface-container-low shadow-[0_8px_40px_rgba(58,50,22,0.06)] hover:scale-[1.02] hover:shadow-[0_16px_60px_rgba(58,50,22,0.10)] transition-all duration-300"
    >
      {club.coverPhoto && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={urlFor(club.coverPhoto).width(720).height(384).url()}
            alt={club.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="font-headline text-lg font-bold leading-snug tracking-[-0.02em] text-on-surface line-clamp-2">
          {club.name}
        </h3>
        {club.courts?.count && (
          <p className="mt-2 font-body text-sm text-on-surface-muted">
            <span>{club.courts.count} courts</span>
            {club.courts.surfaceType && (
              <span> · {club.courts.surfaceType}</span>
            )}
          </p>
        )}
        {club.address && (
          <p className="mt-1 font-body text-xs text-on-surface-muted">{club.address}</p>
        )}
      </div>
    </Link>
  )
}
