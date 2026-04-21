import { fetchInterviewBySlug } from '@/sanity/lib/fetch'
import { PortableText } from '@/components/ui/PortableText'
import { MuxVideoPlayer } from '@/components/ui/MuxVideoPlayer'
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
  const interview = await fetchInterviewBySlug(slug)
  return { title: interview?.title ?? 'Interview' }
}

export default async function InterviewPage({ params }: Props) {
  const { slug } = await params
  const interview = await fetchInterviewBySlug(slug)
  if (!interview) notFound()

  const { subject, related = [] } = interview

  return (
    <main>

      {/* ── HEADER ── */}
      <header className="px-4 sm:px-6 md:px-16 pt-12 pb-16 max-w-[1440px] mx-auto">
        <div className="mb-6 flex items-center gap-3 flex-wrap">
          {interview.category && (
            <span className="bg-tertiary-container text-on-tertiary-container px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase font-body">
              {interview.category}
            </span>
          )}
          {interview.readTime && (
            <span className="text-outline text-xs font-bold tracking-widest uppercase font-body">
              · {interview.readTime} Min Read
            </span>
          )}
        </div>
        <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.05] text-primary tracking-tighter max-w-4xl mb-6">
          {interview.title}
        </h1>
        {interview.excerpt && (
          <p className="text-lg md:text-2xl text-on-surface-variant font-medium max-w-2xl leading-relaxed font-body">
            {interview.excerpt}
          </p>
        )}
      </header>

      {/* ── VIDEO / COVER IMAGE ── */}
      <section className="px-4 sm:px-6 md:px-16 mb-16 max-w-[1440px] mx-auto">
        <div className="relative group aspect-video rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/10 bg-surface-container-highest">
          {interview.videoPlaybackId ? (
            <MuxVideoPlayer playbackId={interview.videoPlaybackId} title={interview.title} />
          ) : interview.coverImage ? (
            <>
              <Image
                src={urlFor(interview.coverImage as SanityImageSource).width(1600).height(900).url()}
                alt={interview.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-inverse-surface/20 flex items-center justify-center group-hover:bg-inverse-surface/30 transition-colors duration-500">
                <div className="bg-surface/90 backdrop-blur-md w-20 md:w-24 h-20 md:h-24 rounded-full flex items-center justify-center text-primary shadow-2xl scale-100 hover:scale-110 transition-transform">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 md:w-12 h-10 md:h-12 ml-1 text-primary"><polygon points="5,3 19,12 5,21" /></svg>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex items-center gap-3 bg-surface/80 backdrop-blur px-4 md:px-6 py-2 md:py-3 rounded-full">
                <span className="w-2.5 h-2.5 bg-tertiary rounded-full animate-pulse" />
                <span className="font-headline font-bold text-xs md:text-sm tracking-tight">WATCH THE INTERVIEW</span>
              </div>
            </>
          ) : null}
        </div>
      </section>

      {/* ── MAIN CONTENT + SIDEBAR ── */}
      <div className="px-4 sm:px-6 md:px-16 max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 mb-24">

        {/* Article */}
        <article className="lg:col-span-8 space-y-10">
          {interview.pullQuote && (
            <p className="text-xl md:text-2xl font-light leading-relaxed text-on-surface/90 italic border-l-4 border-tertiary pl-6 md:pl-8 py-2 font-body">
              &ldquo;{interview.pullQuote}&rdquo;
            </p>
          )}
          {interview.body && (
            <PortableText value={interview.body} />
          )}
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">

          {/* Gear Check */}
          {(subject?.racket || subject?.shoes) && (
            <div className="bg-surface-container-high rounded-[2rem] p-8 shadow-sm">
              <h4 className="text-sm font-bold font-body text-secondary tracking-widest uppercase mb-8">Gear Check</h4>
              <div className="space-y-8">
                {subject.racket && (
                  <div className="flex flex-col gap-4">
                    {subject.racketImage && (
                      <div className="aspect-square bg-surface-container-lowest rounded-[1.5rem] overflow-hidden flex items-center justify-center p-6">
                        <Image
                          src={urlFor(subject.racketImage as SanityImageSource).width(400).height(400).url()}
                          alt={subject.racket}
                          width={200}
                          height={200}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <h5 className="font-headline font-bold text-primary">{subject.racket}</h5>
                      {subject.racketDescription && (
                        <p className="text-sm text-on-surface-variant mb-3 font-body">{subject.racketDescription}</p>
                      )}
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-body">
                        Top Choice
                      </span>
                    </div>
                  </div>
                )}
                {subject.shoes && (
                  <div className="flex flex-col gap-4">
                    {subject.shoesImage && (
                      <div className="aspect-square bg-surface-container-lowest rounded-[1.5rem] overflow-hidden flex items-center justify-center p-6">
                        <Image
                          src={urlFor(subject.shoesImage as SanityImageSource).width(400).height(400).url()}
                          alt={subject.shoes}
                          width={200}
                          height={200}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <h5 className="font-headline font-bold text-primary">{subject.shoes}</h5>
                      {subject.shoesDescription && (
                        <p className="text-sm text-on-surface-variant font-body">{subject.shoesDescription}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {subject?.slug && (
                <Link
                  href={`/players/${subject.slug.current}`}
                  className="w-full mt-8 bg-on-surface text-surface py-4 rounded-full font-bold font-headline hover:bg-inverse-surface/80 transition-all block text-center text-sm"
                >
                  Shop the Pro Look
                </Link>
              )}
            </div>
          )}

          {/* CTA */}
          {interview.ctaTitle && (
            <div className="bg-primary text-on-primary rounded-[2rem] p-8 relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-headline font-bold text-2xl mb-4">{interview.ctaTitle}</h4>
                {interview.ctaBody && (
                  <p className="text-on-primary/80 mb-6 leading-relaxed font-body">{interview.ctaBody}</p>
                )}
                {interview.ctaUrl && (
                  <a
                    href={interview.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-bold text-tertiary-fixed hover:gap-4 transition-all font-body"
                  >
                    Check Availability →
                  </a>
                )}
              </div>
            </div>
          )}

          <Link
            href="/interviews"
            className="font-body text-on-surface-variant font-bold text-sm hover:underline block px-2"
          >
            ← All Interviews
          </Link>
        </aside>
      </div>

      {/* ── RELATED INTERVIEWS ── */}
      {related.length > 0 && (
        <section className="px-4 sm:px-6 md:px-16 py-16 md:py-24 bg-surface-container-low">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6">
              <div>
                <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mb-3">
                  The Directory: More Stories
                </h2>
                <p className="text-on-surface-variant max-w-lg font-body">
                  Go deeper into the world of professional padel with our curated interview series.
                </p>
              </div>
              <Link
                href="/interviews"
                className="text-primary font-bold font-body flex items-center gap-2 hover:gap-3 transition-all shrink-0"
              >
                View All Interviews →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {related.map((item: { title: string; slug: { current: string }; coverImage?: SanityImageSource; category?: string; subject?: { name: string } }) => (
                <Link key={item.slug.current} href={`/interviews/${item.slug.current}`} className="group">
                  <div className="aspect-[16/10] rounded-[2rem] overflow-hidden mb-5 bg-surface-container-highest">
                    {item.coverImage && (
                      <Image
                        src={urlFor(item.coverImage).width(720).height(450).url()}
                        alt={item.title}
                        width={720}
                        height={450}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                  </div>
                  {item.category && (
                    <span className="text-xs font-bold font-body text-secondary tracking-widest uppercase">
                      {item.category}
                    </span>
                  )}
                  <h3 className="font-headline text-xl md:text-2xl font-bold text-on-surface mt-2 group-hover:text-primary transition-colors tracking-tight">
                    {item.title}
                  </h3>
                  {item.subject && (
                    <p className="text-sm text-on-surface-variant font-body mt-1">With {item.subject.name}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  )
}
