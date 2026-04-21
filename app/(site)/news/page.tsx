import { client } from '@/sanity/lib/client'
import { latestArticlesQuery, allInterviewsQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/urlFor'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { SanityImageSource } from '@sanity/image-url'

export const metadata: Metadata = { title: 'News' }
export const revalidate = 60

interface Article {
  title: string
  slug: { current: string }
  excerpt?: string
  coverImage?: SanityImageSource
  publishedAt?: string
  category?: string
  authorName?: string
}

interface Interview {
  title: string
  slug: { current: string }
  publishedAt?: string
  coverImage?: SanityImageSource
  excerpt?: string
  subject?: { name: string; slug: { current: string }; currentRanking?: number }
}

export default async function NewsPage() {
  const [articles, interviews] = await Promise.all([
    client.fetch(latestArticlesQuery, { limit: 49 }),
    client.fetch(allInterviewsQuery),
  ])

  const featuredArticle: Article | null = articles?.[0] ?? null
  const recentArticles: Article[] = articles?.slice(1, 5) ?? []
  const featuredInterview: Interview | null = interviews?.[0] ?? null

  return (
    <main className="pt-12 pb-32 px-4 sm:px-6 md:px-16 max-w-[1440px] mx-auto">

      {/* ── FEATURED HERO ── */}
      {featuredArticle && (
        <section className="relative mb-20 group overflow-hidden rounded-[2rem]">
          <div className="flex flex-col lg:flex-row bg-surface-container-low rounded-[2rem] overflow-hidden min-h-[500px]">
            <div className="lg:w-2/3 relative h-[400px] lg:h-auto overflow-hidden">
              {featuredArticle.coverImage ? (
                <Image
                  src={urlFor(featuredArticle.coverImage).width(1200).height(800).url()}
                  alt={featuredArticle.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-surface-container-high" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <span className="bg-tertiary text-on-tertiary px-6 py-2 rounded-full font-body text-xs font-bold uppercase tracking-widest">
                  Featured Story
                </span>
              </div>
            </div>
            <div className="lg:w-1/3 p-6 md:p-10 flex flex-col justify-center">
              {featuredArticle.category && (
                <span className="font-body text-xs font-black uppercase tracking-widest text-secondary mb-4 block">
                  {featuredArticle.category}
                </span>
              )}
              <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tighter leading-tight mb-6">
                {featuredArticle.title}
              </h1>
              {featuredArticle.excerpt && (
                <p className="font-body text-lg text-on-surface-variant mb-8 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
              )}
              <Link
                href={`/news/${featuredArticle.slug.current}`}
                className="bg-primary text-on-primary font-headline font-bold py-4 px-10 rounded-full self-start hover:bg-primary-dim transition-all shadow-lg"
              >
                Read Full Story
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* ── MAIN CONTENT ── */}
        <div className="lg:col-span-8 space-y-12">

          {/* Latest News */}
          <section>
            <header className="flex justify-between items-end mb-8">
              <div>
                <span className="font-body text-secondary font-black uppercase tracking-widest text-xs">Stay Updated</span>
                <h2 className="font-headline text-4xl font-bold text-on-surface mt-2 tracking-tighter">Latest News</h2>
              </div>
              <Link href="/news" className="font-body text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all text-sm">
                View All →
              </Link>
            </header>

            {recentArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {recentArticles.map((article) => (
                  <Link
                    key={article.slug.current}
                    href={`/news/${article.slug.current}`}
                    className="bg-surface-container-lowest rounded-[2rem] overflow-hidden group shadow-sm hover:shadow-xl transition-all"
                  >
                    {article.coverImage && (
                      <div className="aspect-video overflow-hidden">
                        <Image
                          src={urlFor(article.coverImage).width(720).height(400).url()}
                          alt={article.title}
                          width={720}
                          height={400}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-8">
                      <div className="flex items-center gap-4 mb-4">
                        {article.category && (
                          <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full font-body text-[10px] font-bold uppercase tracking-widest">
                            {article.category}
                          </span>
                        )}
                        {article.publishedAt && (
                          <span className="font-body text-xs text-outline">
                            {new Date(article.publishedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                      <h3 className="font-headline text-2xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors tracking-tight">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="font-body text-on-surface-variant text-sm line-clamp-2">{article.excerpt}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="font-body text-on-surface-variant text-center py-20">No articles published yet.</p>
            )}
          </section>

          {/* Deep Dives / Interviews */}
          {featuredInterview && (
            <section className="pt-12 border-t border-outline-variant/20">
              <header className="mb-8">
                <h2 className="font-headline text-4xl font-bold text-on-surface tracking-tighter">Deep Dives</h2>
                <p className="font-body text-on-surface-variant mt-2">Exclusive interviews with the personalities of Bali Padel.</p>
              </header>
              <Link
                href={`/interviews/${featuredInterview.slug.current}`}
                className="bg-surface-container-high rounded-[2rem] overflow-hidden p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 hover:bg-surface-container-highest transition-colors block"
              >
                {featuredInterview.coverImage && (
                  <div className="w-48 h-48 rounded-full overflow-hidden border-8 border-surface-container-lowest flex-shrink-0 shadow-lg">
                    <Image
                      src={urlFor(featuredInterview.coverImage as SanityImageSource).width(400).height(400).url()}
                      alt={featuredInterview.title}
                      width={192}
                      height={192}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <span className="font-body text-secondary text-4xl font-black leading-none block mb-4">"</span>
                  <p className="font-headline text-2xl md:text-3xl font-bold text-primary leading-tight italic mb-6">
                    {featuredInterview.excerpt ?? featuredInterview.title}
                  </p>
                  {featuredInterview.subject && (
                    <>
                      <h4 className="font-headline text-xl font-bold text-on-surface">{featuredInterview.subject.name}</h4>
                      <p className="font-body text-sm text-outline tracking-widest uppercase mt-1">
                        {featuredInterview.subject.currentRanking ? `#${featuredInterview.subject.currentRanking} Ranked Player` : 'Featured Player'}
                      </p>
                    </>
                  )}
                </div>
              </Link>

              {interviews?.length > 1 && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {interviews.slice(1, 3).map((interview: Interview) => (
                    <Link
                      key={interview.slug.current}
                      href={`/interviews/${interview.slug.current}`}
                      className="group flex gap-4 bg-surface-container-lowest rounded-[1.5rem] p-5 hover:bg-surface-container transition-colors"
                    >
                      {interview.coverImage && (
                        <div className="w-24 h-24 rounded-[1rem] overflow-hidden shrink-0">
                          <Image
                            src={urlFor(interview.coverImage as SanityImageSource).width(200).height(200).url()}
                            alt={interview.title}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="font-body text-[10px] font-black uppercase tracking-widest text-secondary">Interview</span>
                        <h4 className="font-headline font-bold text-on-surface text-base leading-snug mt-1 group-hover:text-primary transition-colors line-clamp-2">
                          {interview.title}
                        </h4>
                        {interview.subject && (
                          <p className="font-body text-xs text-on-surface-variant mt-1">{interview.subject.name}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-6 text-center">
                <Link
                  href="/interviews"
                  className="font-body text-primary font-bold text-sm hover:underline"
                >
                  View All Interviews →
                </Link>
              </div>
            </section>
          )}
        </div>

        {/* ── SIDEBAR ── */}
        <aside className="lg:col-span-4 space-y-8">

          {/* More Articles */}
          {articles?.length > 5 && (
            <div className="bg-surface-container rounded-[2rem] p-8 shadow-sm">
              <h3 className="font-headline text-xl font-bold text-on-surface mb-6">More Stories</h3>
              <div className="space-y-5">
                {articles.slice(5, 9).map((article: Article) => (
                  <Link
                    key={article.slug.current}
                    href={`/news/${article.slug.current}`}
                    className="flex gap-3 group"
                  >
                    {article.coverImage && (
                      <div className="w-16 h-16 rounded-[0.75rem] overflow-hidden shrink-0">
                        <Image
                          src={urlFor(article.coverImage).width(128).height(128).url()}
                          alt={article.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {article.category && (
                        <span className="font-body text-[10px] font-black uppercase tracking-widest text-secondary">{article.category}</span>
                      )}
                      <p className="font-headline font-bold text-sm text-on-surface line-clamp-2 group-hover:text-primary transition-colors mt-0.5">
                        {article.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Interviews list */}
          {interviews?.length > 0 && (
            <div className="bg-surface-container-high rounded-[2rem] p-8">
              <h3 className="font-headline text-xl font-bold text-on-surface mb-6">Recent Interviews</h3>
              <div className="space-y-4">
                {interviews.slice(0, 4).map((interview: Interview) => (
                  <Link
                    key={interview.slug.current}
                    href={`/interviews/${interview.slug.current}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <span className="font-headline font-black text-on-primary text-xs">▶</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-headline font-bold text-sm text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                        {interview.title}
                      </p>
                      {interview.subject && (
                        <p className="font-body text-xs text-on-surface-variant">{interview.subject.name}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href="/interviews"
                className="font-body text-primary font-bold text-sm hover:underline block mt-6"
              >
                All Interviews →
              </Link>
            </div>
          )}

          {/* Events promo */}
          <div className="bg-primary rounded-[2rem] p-8 text-on-primary">
            <h3 className="font-headline text-xl font-bold mb-3">Upcoming Events</h3>
            <p className="font-body text-on-primary/80 text-sm mb-6">Don't miss the next tournament. Check the full schedule.</p>
            <Link
              href="/events"
              className="font-body text-on-primary font-bold flex items-center gap-2 border-b-2 border-tertiary-fixed inline-block text-sm"
            >
              View Schedule →
            </Link>
          </div>
        </aside>
      </div>
    </main>
  )
}
