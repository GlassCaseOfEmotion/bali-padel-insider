import { client } from '@/sanity/lib/client'
import { allInterviewsQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/urlFor'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { SanityImageSource } from '@sanity/image-url'

export const metadata: Metadata = { title: 'Interviews' }
export const revalidate = 60

interface Interview {
  title: string
  slug: { current: string }
  publishedAt?: string
  coverImage?: SanityImageSource
  excerpt?: string
  subject?: { name: string; slug: { current: string }; currentRanking?: number }
}

export default async function InterviewsPage() {
  const interviews: Interview[] = await client.fetch(allInterviewsQuery) ?? []

  const featuredInterview = interviews[0] ?? null
  const gridInterviews = interviews.slice(1)

  return (
    <main className="flex-grow pt-8">

      {/* ── HERO: FEATURED VIDEO ── */}
      {featuredInterview && (
        <section className="px-4 sm:px-6 md:px-16 pb-12">
          <div className="max-w-[1440px] mx-auto relative group overflow-hidden rounded-[2rem] bg-surface-container-highest aspect-[21/9]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            {featuredInterview.coverImage ? (
              <Image
                src={urlFor(featuredInterview.coverImage).width(1800).height(800).url()}
                alt={featuredInterview.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-inverse-surface" />
            )}
            <Link
              href={`/interviews/${featuredInterview.slug.current}`}
              className="absolute inset-0 flex items-center justify-center z-20"
            >
              <div className="w-24 h-24 flex items-center justify-center bg-tertiary-fixed text-on-tertiary-fixed rounded-full shadow-2xl transition-transform hover:scale-110">
                <span className="text-4xl font-black ml-1">▶</span>
              </div>
            </Link>
            <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 z-20 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-tertiary-fixed text-on-tertiary-fixed px-4 py-1.5 rounded-full font-headline font-bold text-xs uppercase tracking-widest mb-4">
                <span className="w-2 h-2 rounded-full bg-on-tertiary-fixed animate-pulse" />
                Featured Interview
              </div>
              <h1 className="font-headline text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tighter mb-4">
                {featuredInterview.title}
              </h1>
              {featuredInterview.subject && (
                <p className="font-body text-white/80 text-xl font-medium">
                  With {featuredInterview.subject.name}
                  {featuredInterview.subject.currentRanking && ` · #${featuredInterview.subject.currentRanking} Ranked`}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── CATEGORY FILTERS (static) ── */}
      <section className="px-4 sm:px-6 md:px-16 pb-12 overflow-x-auto">
        <div className="max-w-[1440px] mx-auto flex gap-4">
          <span className="bg-primary text-on-primary px-8 py-3 rounded-full font-headline font-bold whitespace-nowrap shadow-lg cursor-default">All</span>
          <span className="bg-surface-container-high text-on-surface px-8 py-3 rounded-full font-headline font-bold whitespace-nowrap cursor-default">Player Profiles</span>
          <span className="bg-surface-container-high text-on-surface px-8 py-3 rounded-full font-headline font-bold whitespace-nowrap cursor-default">Deep Dives</span>
          <span className="bg-surface-container-high text-on-surface px-8 py-3 rounded-full font-headline font-bold whitespace-nowrap cursor-default">Coach&apos;s Corner</span>
        </div>
      </section>

      {/* ── INTERVIEW GRID ── */}
      {gridInterviews.length > 0 && (
        <section className="px-4 sm:px-6 md:px-16 py-16 bg-surface-container-low">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="font-body text-secondary font-bold uppercase tracking-[0.2em] text-xs">Behind the Racket</span>
                <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mt-2">Player Perspectives</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {gridInterviews.map((interview) => (
                <Link
                  key={interview.slug.current}
                  href={`/interviews/${interview.slug.current}`}
                  className="group cursor-pointer"
                >
                  <div className="relative rounded-[2rem] overflow-hidden aspect-video bg-surface-container-highest mb-6 shadow-xl">
                    {interview.coverImage ? (
                      <Image
                        src={urlFor(interview.coverImage).width(720).height(400).url()}
                        alt={interview.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-surface-container-high" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-primary/20 backdrop-blur-[2px]">
                      <span className="text-white text-5xl font-black">▶</span>
                    </div>
                  </div>
                  <h3 className="font-headline text-2xl font-extrabold tracking-tight group-hover:text-primary transition-colors">
                    {interview.title}
                  </h3>
                  {interview.subject && (
                    <p className="font-body text-on-surface/60 mt-1 text-sm font-medium">
                      With {interview.subject.name}
                      {interview.subject.currentRanking && ` · #${interview.subject.currentRanking}`}
                    </p>
                  )}
                  {interview.excerpt && (
                    <p className="font-body text-on-surface/60 mt-2 font-medium line-clamp-2">{interview.excerpt}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {interviews.length === 0 && (
        <div className="px-4 sm:px-6 md:px-16 py-32 text-center">
          <p className="font-body text-on-surface-variant text-lg">No interviews published yet.</p>
        </div>
      )}

      {/* ── CTA ── */}
      <section className="px-4 sm:px-6 md:px-16 py-24">
        <div className="max-w-[1440px] mx-auto bg-primary rounded-[2rem] p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="z-10 flex-1">
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight mb-6">
              Never Miss a <br />Match Point.
            </h2>
            <p className="font-body text-on-primary/80 text-xl font-medium mb-8 max-w-md">
              Get exclusive court-side footage, pro interviews, and early access delivered straight to your inbox.
            </p>
            <Link
              href="/news"
              className="bg-tertiary-fixed text-on-tertiary-fixed px-10 py-4 rounded-full font-headline font-black text-lg hover:scale-105 transition-transform inline-block"
            >
              Read All Stories
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
