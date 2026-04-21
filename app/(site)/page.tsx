import { client } from '@/sanity/lib/client'
import {
  homepageQuery,
  latestArticlesQuery,
  rankingByCategoryQuery,
  allInterviewsQuery,
} from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/urlFor'
import Image from 'next/image'
import Link from 'next/link'
import type { SanityImageSource } from '@sanity/image-url'

export const revalidate = 60

export default async function HomePage() {
  const [homepage, latestArticles, menRanking, interviews] = await Promise.all([
    client.fetch(homepageQuery),
    client.fetch(latestArticlesQuery, { limit: 3 }),
    client.fetch(rankingByCategoryQuery, { category: 'men' }),
    client.fetch(allInterviewsQuery),
  ])

  const featuredArticle = homepage?.featuredArticle ?? null
  const topRankings: Array<{
    rank: number
    points: number
    player: { name: string; slug: { current: string }; nationality?: string }
  }> = (menRanking?.entries ?? []).slice(0, 5)
  const featuredInterview = interviews?.[0] ?? null

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[88vh] flex items-end overflow-hidden bg-inverse-surface">
        {featuredArticle?.coverImage && (
          <Image
            src={urlFor(featuredArticle.coverImage as SanityImageSource)
              .width(1800)
              .height(1000)
              .url()}
            alt={featuredArticle.title}
            fill
            priority
            className="object-cover brightness-[0.6] saturate-[1.15]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#120e03]/90 via-[#120e03]/30 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-8 pb-20 pt-36">
          {/* Live badge */}
          <div className="inline-flex items-center gap-3 bg-tertiary-container text-on-tertiary-container px-4 py-1.5 rounded-full mb-8 font-body font-bold text-sm uppercase tracking-wider">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-tertiary" />
            </span>
            Latest News
          </div>

          {featuredArticle ? (
            <>
              <h1 className="font-display text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8 max-w-4xl">
                {featuredArticle.title}
              </h1>
              {featuredArticle.excerpt && (
                <p className="font-body text-white/75 max-w-sm text-lg font-medium leading-snug mb-10">
                  {featuredArticle.excerpt}
                </p>
              )}
              <Link
                href={`/news/${featuredArticle.slug.current}`}
                className="inline-flex items-center gap-3 bg-primary text-on-primary px-8 py-4 rounded-[1rem] font-display font-bold text-base uppercase tracking-widest hover:bg-primary-dim transition-all shadow-2xl"
              >
                Read Article
              </Link>
            </>
          ) : (
            <h1 className="font-display text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8 max-w-4xl">
              Bali Padel<br />Insider.
            </h1>
          )}
        </div>
      </section>

      <main className="max-w-[1440px] mx-auto px-6 lg:px-8 py-20 space-y-24">

        {/* ── RANKINGS + NEWS BENTO ── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Rankings widget */}
          {topRankings.length > 0 && (
            <div className="lg:col-span-4 bg-surface-container-high rounded-[2rem] p-10 shadow-[0_8px_40px_rgba(58,50,22,0.06)]">
              <div className="flex justify-between items-center mb-10">
                <h2 className="font-display text-2xl font-black tracking-tighter uppercase text-primary">
                  Top Rankings
                </h2>
              </div>
              <div className="space-y-3">
                {topRankings.map((entry, i) => (
                  <Link
                    key={entry.rank}
                    href="/rankings"
                    className={`flex items-center justify-between p-4 rounded-[1rem] transition-transform hover:scale-[1.02] ${
                      i === 0 ? 'bg-surface-container-lowest shadow-[0_2px_12px_rgba(58,50,22,0.08)]' : 'bg-surface-container-lowest/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`font-display font-black text-2xl ${i === 0 ? 'text-tertiary' : 'text-on-surface-muted'}`}>
                        {String(entry.rank).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="font-display font-bold text-on-surface">{entry.player.name}</p>
                        {entry.player.nationality && (
                          <p className="font-body text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                            {entry.player.nationality}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="font-display font-black text-primary">{entry.points}</span>
                  </Link>
                ))}
              </div>
              <Link
                href="/rankings"
                className="w-full mt-8 py-4 font-display font-bold uppercase tracking-widest text-primary flex items-center justify-center rounded-[1rem] bg-surface-container-lowest/50 hover:bg-surface-container-lowest transition-colors text-sm"
              >
                View Full Leaderboard
              </Link>
            </div>
          )}

          {/* News cards */}
          <div className={`${topRankings.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col gap-8`}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-3xl font-black tracking-tighter uppercase text-on-surface">
                Recent News
              </h2>
              <Link href="/news" className="font-body text-secondary font-bold flex items-center gap-2 hover:underline text-sm">
                All News →
              </Link>
            </div>

            {latestArticles?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                {latestArticles.slice(0, 4).map((article: {
                  slug: { current: string }
                  title: string
                  category?: string
                  publishedAt?: string
                  coverImage?: SanityImageSource
                }) => (
                  <Link
                    key={article.slug.current}
                    href={`/news/${article.slug.current}`}
                    className="group bg-surface-container rounded-[2rem] overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-[0_8px_40px_rgba(58,50,22,0.06)] hover:shadow-[0_16px_60px_rgba(58,50,22,0.10)]"
                  >
                    {article.coverImage && (
                      <div className="h-48 overflow-hidden">
                        <Image
                          src={urlFor(article.coverImage).width(720).height(384).url()}
                          alt={article.title}
                          width={720}
                          height={384}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        {article.category && (
                          <span className="font-body text-xs font-black uppercase tracking-widest text-secondary">
                            {article.category}
                          </span>
                        )}
                        {article.publishedAt && (
                          <span className="font-body text-xs font-bold text-on-surface-muted">
                            {new Date(article.publishedAt).toLocaleDateString('en-AU', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-xl font-bold leading-snug tracking-[-0.02em] text-on-surface line-clamp-2">
                        {article.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-surface-container rounded-[2rem] py-20">
                <p className="font-body text-on-surface-muted">No articles published yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── FEATURED INTERVIEW ── */}
        {featuredInterview && (
          <section className="bg-inverse-surface rounded-[2rem] overflow-hidden flex flex-col lg:flex-row min-h-[560px] shadow-2xl relative">
            {/* Photo side */}
            <div className="lg:w-1/2 relative h-[360px] lg:h-auto">
              {featuredInterview.coverImage ? (
                <Image
                  src={urlFor(featuredInterview.coverImage as SanityImageSource)
                    .width(800)
                    .height(800)
                    .url()}
                  alt={featuredInterview.title}
                  fill
                  className="object-cover brightness-90"
                />
              ) : (
                <div className="absolute inset-0 bg-primary/20" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-inverse-surface hidden lg:block" />
              <div className="absolute bottom-8 left-8">
                <span className="bg-tertiary text-on-tertiary px-4 py-1 rounded-full font-display font-black text-sm uppercase tracking-widest shadow-xl">
                  Exclusive Feature
                </span>
              </div>
            </div>

            {/* Content side */}
            <div className="lg:w-1/2 p-12 lg:p-16 flex flex-col justify-center">
              {featuredInterview.subject && (
                <p className="font-display text-sm uppercase tracking-[0.2em] text-tertiary font-bold mb-6">
                  With {featuredInterview.subject.name}
                </p>
              )}
              <h2 className="font-display text-4xl md:text-5xl font-black tracking-tighter mb-8 leading-[0.95] text-white">
                {featuredInterview.title}
              </h2>
              <div className="flex items-center gap-8 mt-4">
                <Link
                  href={`/interviews/${featuredInterview.slug.current}`}
                  className="bg-primary text-on-primary px-8 py-4 rounded-[1rem] font-display font-bold uppercase tracking-widest hover:scale-105 transition-transform inline-block"
                >
                  Read Interview
                </Link>
                {featuredInterview.subject && (
                  <div>
                    <p className="font-display font-bold text-xl text-white">
                      {featuredInterview.subject.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

      </main>
    </>
  )
}
