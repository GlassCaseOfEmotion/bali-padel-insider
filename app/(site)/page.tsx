import { client } from '@/sanity/lib/client'
import {
  homepageQuery,
  latestArticlesQuery,
  upcomingEventsQuery,
} from '@/sanity/lib/queries'
import { ArticleCard } from '@/components/cards/ArticleCard'
import { EventCard } from '@/components/cards/EventCard'
import { urlFor } from '@/sanity/lib/urlFor'
import Image from 'next/image'
import Link from 'next/link'
import type { SanityImageSource } from '@sanity/image-url'

export const revalidate = 60

export default async function HomePage() {
  const [homepage, latestArticles, upcomingEvents] = await Promise.all([
    client.fetch(homepageQuery),
    client.fetch(latestArticlesQuery, { limit: 5 }),
    client.fetch(upcomingEventsQuery, { limit: 2 }),
  ])

  return (
    <>
      {/* Hero */}
      {homepage?.featuredArticle && (
        <section className="px-4 sm:px-6 lg:px-8 pt-8 pb-16 max-w-7xl mx-auto">
          <Link href={`/news/${homepage.featuredArticle.slug.current}`} className="group block">
            <div className="relative h-[520px] rounded-[2rem] overflow-hidden bg-surface-container-high">
              {homepage.featuredArticle.coverImage && (
                <Image
                  src={urlFor(homepage.featuredArticle.coverImage as SanityImageSource).width(1400).height(700).url()}
                  alt={homepage.featuredArticle.title}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#3a3216]/80 via-[#3a3216]/20 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10 text-white">
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-white/70 mb-3">
                  Featured
                </p>
                <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight tracking-[-0.02em]">
                  {homepage.featuredArticle.title}
                </h1>
                {homepage.featuredArticle.excerpt && (
                  <p className="mt-3 font-body text-white/80 text-lg line-clamp-2">
                    {homepage.featuredArticle.excerpt}
                  </p>
                )}
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Latest News */}
      <section className="bg-surface px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-on-surface">Latest News</h2>
            <Link
              href="/news"
              className="font-body text-sm font-medium text-primary hover:text-primary transition-colors"
            >
              View all →
            </Link>
          </div>
          {latestArticles?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestArticles.map((article: { slug: { current: string }; title: string }) => (
                <ArticleCard key={article.slug.current} article={article} />
              ))}
            </div>
          ) : (
            <p className="font-body text-on-surface-muted text-center py-12">No articles published yet.</p>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents?.length > 0 && (
        <section className="bg-surface-container px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-on-surface">Upcoming Events</h2>
              <Link
                href="/events"
                className="font-body text-sm font-medium text-primary hover:text-primary transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {upcomingEvents.map((event: { slug: { current: string }; title: string }) => (
                <EventCard key={event.slug.current} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Players */}
      {homepage?.featuredPlayers?.length > 0 && (
        <section className="bg-surface px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-on-surface">Featured Players</h2>
              <Link
                href="/players"
                className="font-body text-sm font-medium text-primary hover:text-primary transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {homepage.featuredPlayers.map((player: { slug: { current: string }; photo?: SanityImageSource; name: string; currentRanking?: number }) => (
                <Link
                  key={player.slug.current}
                  href={`/players/${player.slug.current}`}
                  className="group text-center"
                >
                  <div className="relative h-28 w-28 mx-auto rounded-full overflow-hidden bg-surface-container-high mb-3 shadow-[0_4px_20px_rgba(58,50,22,0.08)]">
                    {player.photo && (
                      <Image
                        src={urlFor(player.photo).width(224).height(224).url()}
                        alt={player.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <p className="font-body font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">
                    {player.name}
                  </p>
                  {player.currentRanking && (
                    <span className="inline-block font-body text-xs font-semibold text-primary mt-0.5">#{player.currentRanking}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
