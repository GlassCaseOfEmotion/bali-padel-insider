import { fetchRankingByCategory } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/urlFor'
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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-on-surface mb-8">Rankings</h1>

      {/* Category tabs — use background color shift, no border-b */}
      <div className="flex gap-1 mb-10 bg-surface-container rounded-[1rem] p-1">
        {CATEGORIES.map(({ key, label }) => (
          <Link
            key={key}
            href={`/rankings?category=${key}`}
            className={`flex-1 text-center px-4 py-2 rounded-[0.75rem] font-body text-sm font-medium transition-all ${
              activeCategory === key
                ? 'bg-surface text-on-surface shadow-[0_2px_8px_rgba(58,50,22,0.08)]'
                : 'text-on-surface-muted hover:text-on-surface'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {ranking?.entries?.length > 0 ? (
        <div className="space-y-2">
          {ranking.entries.map((entry: { rank: number; points: number; player: { name: string; slug: { current: string }; photo?: SanityImageSource; nationality?: string } }) => (
            <Link
              key={entry.rank}
              href={`/players/${entry.player.slug.current}`}
              className="flex items-center gap-4 px-5 py-4 rounded-[1rem] bg-surface-container hover:bg-surface-container-high transition-colors"
            >
              <span className="w-8 font-body text-sm font-bold text-on-surface-muted shrink-0">
                {entry.rank}
              </span>
              {entry.player.photo && (
                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-surface-container-high shrink-0">
                  <Image
                    src={urlFor(entry.player.photo).width(80).height(80).url()}
                    alt={entry.player.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-body font-semibold text-on-surface truncate">{entry.player.name}</p>
                {entry.player.nationality && (
                  <p className="font-body text-xs text-on-surface-muted">{entry.player.nationality}</p>
                )}
              </div>
              <span className="font-body text-sm font-semibold text-primary shrink-0">{entry.points} pts</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="font-body text-on-surface-muted text-center py-20">No rankings published yet.</p>
      )}
    </div>
  )
}
