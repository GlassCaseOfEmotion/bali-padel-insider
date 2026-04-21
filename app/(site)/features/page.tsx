import { fetchAllFeatures } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/urlFor'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { SanityImageSource } from '@sanity/image-url'

export const metadata: Metadata = { title: 'Features' }
export const revalidate = 60

interface Feature {
  title: string
  slug: { current: string }
  badge?: string
  excerpt?: string
  coverImage?: SanityImageSource
  publishedAt?: string
  stats?: { value: string; label: string }[]
}

export default async function FeaturesPage() {
  const features: Feature[] = await fetchAllFeatures() ?? []
  const featured = features[0] ?? null
  const grid = features.slice(1)

  return (
    <main className="pt-12 pb-32">

      {/* Hero */}
      {featured && (
        <section className="mb-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16">
          <Link
            href={`/features/${featured.slug.current}`}
            className="group block relative rounded-[2rem] overflow-hidden min-h-[500px] flex items-end bg-inverse-surface"
          >
            {featured.coverImage && (
              <Image
                src={urlFor(featured.coverImage).width(1600).height(800).url()}
                alt={featured.title}
                fill
                priority
                className="object-cover brightness-75 group-hover:scale-105 transition-transform duration-700"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10 p-8 md:p-16 w-full">
              {featured.badge && (
                <span className="inline-block bg-tertiary-container text-on-tertiary-container px-4 py-1 rounded-full font-body text-xs font-bold uppercase tracking-widest mb-6">
                  {featured.badge}
                </span>
              )}
              <h1 className="font-headline text-4xl sm:text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-6 max-w-3xl">
                {featured.title}
              </h1>
              {featured.excerpt && (
                <p className="font-body text-white/80 text-lg max-w-xl">{featured.excerpt}</p>
              )}
            </div>
          </Link>
        </section>
      )}

      {/* Grid */}
      {grid.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16">
          <h2 className="font-headline text-3xl font-black tracking-tighter mb-10">
            All Features <span className="text-primary">({features.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {grid.map((f) => (
              <Link
                key={f.slug.current}
                href={`/features/${f.slug.current}`}
                className="group bg-surface-container-low rounded-[2rem] overflow-hidden hover:-translate-y-1 transition-all duration-300"
              >
                {f.coverImage && (
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={urlFor(f.coverImage).width(720).height(400).url()}
                      alt={f.title}
                      width={720}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-8">
                  {f.badge && (
                    <span className="font-body text-xs font-black uppercase tracking-widest text-secondary mb-3 block">
                      {f.badge}
                    </span>
                  )}
                  <h3 className="font-headline text-2xl font-bold text-on-surface group-hover:text-primary transition-colors tracking-tight">
                    {f.title}
                  </h3>
                  {f.excerpt && (
                    <p className="font-body text-on-surface-variant text-sm mt-3 line-clamp-2">{f.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {features.length === 0 && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 py-32 text-center">
          <p className="font-body text-on-surface-variant text-lg">No features published yet.</p>
        </div>
      )}
    </main>
  )
}
