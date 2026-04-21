import { fetchFeatureBySlug } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/urlFor'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { SanityImageSource } from '@sanity/image-url'

export const revalidate = 60

interface Params { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const feature = await fetchFeatureBySlug(slug)
  return { title: feature?.title ?? 'Feature' }
}

export default async function FeaturePage({ params }: Params) {
  const { slug } = await params
  const feature = await fetchFeatureBySlug(slug)
  if (!feature) notFound()

  return (
    <article className="pt-12 pb-32">

      {/* ── HERO: two-col, text left / rotated portrait right ── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          {feature.badge && (
            <span className="inline-block bg-tertiary-container text-on-tertiary-container px-4 py-1 rounded-full font-body text-xs font-bold uppercase tracking-widest mb-6">
              {feature.badge}
            </span>
          )}
          <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-primary leading-[0.9] tracking-tighter mb-8">
            {feature.title}
          </h1>
          {feature.excerpt && (
            <p className="font-body text-on-surface-variant text-xl leading-relaxed max-w-lg">
              {feature.excerpt}
            </p>
          )}
        </div>

        {feature.coverImage && (
          <div className="relative">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
              <Image
                src={urlFor(feature.coverImage as SanityImageSource).width(800).height(1000).url()}
                alt={feature.title}
                fill
                className="object-cover"
              />
            </div>
            {feature.pullQuote && (
              <div className="absolute -bottom-6 -left-6 bg-surface-container-highest p-8 rounded-[1.5rem] shadow-xl max-w-xs hidden md:block">
                <p className="font-headline font-bold text-primary italic text-lg line-clamp-3">"{feature.pullQuote}"</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── STATS BAR ── */}
      {feature.stats && feature.stats.length > 0 && (
        <section className="bg-primary py-16">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {feature.stats.map((s: { value: string; label: string }, i: number) => (
              <div key={i} className="text-center">
                <div className="font-headline text-5xl md:text-6xl font-black text-tertiary-fixed mb-2 tracking-tighter">
                  {s.value}
                </div>
                <div className="font-body text-on-primary text-xs uppercase tracking-widest font-bold">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── BODY ── */}
      {feature.body && (
        <section className="py-20">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="
                [&>p]:font-body [&>p]:text-lg [&>p]:leading-relaxed [&>p]:text-on-surface-variant
                [&>p:first-child]:text-2xl [&>p:first-child]:font-light
                [&>p:first-child::first-letter]:text-7xl [&>p:first-child::first-letter]:font-black
                [&>p:first-child::first-letter]:text-primary [&>p:first-child::first-letter]:mr-3
                [&>p:first-child::first-letter]:float-left [&>p:first-child::first-letter]:leading-none
                [&>h3]:font-headline [&>h3]:text-3xl [&>h3]:font-black [&>h3]:text-on-surface [&>h3]:tracking-tight
                space-y-8">
                <PortableText value={feature.body} />
              </div>

              {/* Pull quote */}
              {feature.pullQuote && (
                <div className="relative py-12 px-8 md:px-16 my-16 bg-surface-container-high rounded-[2rem] overflow-hidden">
                  <span className="absolute top-4 left-6 text-[9rem] text-primary/10 font-black leading-none font-headline">"</span>
                  <blockquote className="font-headline text-3xl md:text-4xl font-extrabold text-primary relative z-10 leading-tight">
                    {feature.pullQuote}
                  </blockquote>
                  {feature.pullQuoteAttribution && (
                    <div className="mt-8 flex items-center gap-4">
                      <div className="w-12 h-2 bg-secondary rounded-full" />
                      <span className="font-body font-bold uppercase tracking-widest text-xs text-on-surface-variant">
                        {feature.pullQuoteAttribution}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      {feature.ctaHeadline && (
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16">
          <div className="bg-primary rounded-[2rem] overflow-hidden flex flex-col md:flex-row items-center">
            <div className="p-8 md:p-16 lg:p-20 md:w-3/5">
              <h2 className="font-headline text-4xl md:text-6xl font-black text-on-primary tracking-tighter mb-8 leading-none">
                {feature.ctaHeadline}
              </h2>
              {feature.ctaBody && (
                <p className="font-body text-on-primary/80 text-xl mb-10 max-w-lg">{feature.ctaBody}</p>
              )}
              <div className="flex flex-wrap gap-4">
                {feature.ctaPrimaryLabel && feature.ctaPrimaryUrl && (
                  <Link
                    href={feature.ctaPrimaryUrl}
                    className="bg-tertiary-fixed text-on-tertiary-fixed px-10 py-5 rounded-full font-headline font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform inline-block"
                  >
                    {feature.ctaPrimaryLabel}
                  </Link>
                )}
                {feature.ctaSecondaryLabel && feature.ctaSecondaryUrl && (
                  <Link
                    href={feature.ctaSecondaryUrl}
                    className="bg-transparent border-2 border-on-primary text-on-primary px-10 py-5 rounded-full font-headline font-black uppercase tracking-widest text-sm hover:bg-on-primary hover:text-primary transition-all inline-block"
                  >
                    {feature.ctaSecondaryLabel}
                  </Link>
                )}
              </div>
            </div>
            {feature.ctaImage && (
              <div className="md:w-2/5 h-64 md:h-[500px] w-full relative">
                <Image
                  src={urlFor(feature.ctaImage as SanityImageSource).width(800).height(1000).url()}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </section>
      )}
    </article>
  )
}
