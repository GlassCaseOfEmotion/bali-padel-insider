import { fetchArticleBySlug } from '@/sanity/lib/fetch'
import { PortableText } from '@/components/ui/PortableText'
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
  const article = await fetchArticleBySlug(slug)
  return { title: article?.title ?? 'Article' }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await fetchArticleBySlug(slug)

  if (!article) notFound()

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <main>
      {/* ── HERO: two-column layout — text left, image right ── */}
      <section className="relative min-h-[600px] flex flex-col items-center justify-center px-4 sm:px-6 md:px-16 overflow-hidden bg-surface py-10 md:py-16 lg:py-20">
        <div className="max-w-[1440px] w-full grid md:grid-cols-2 gap-12 items-center mx-auto">

          {/* Left: text */}
          <div className="order-2 md:order-1">
            {article.category && (
              <span className="inline-block bg-tertiary-container text-on-tertiary-container px-4 py-1 rounded-full font-body text-xs font-bold tracking-widest uppercase mb-6">
                {article.category}
              </span>
            )}
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-primary leading-[0.9] tracking-tighter mb-8">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="font-body text-xl md:text-2xl text-on-surface-variant max-w-lg mb-8 leading-relaxed">
                {article.excerpt}
              </p>
            )}
            <div className="flex items-center gap-4 font-body text-sm text-on-surface-variant">
              {article.authorName && <span className="font-bold">{article.authorName}</span>}
              {article.authorName && publishedDate && <span className="text-outline">·</span>}
              {publishedDate && <span>{publishedDate}</span>}
            </div>
          </div>

          {/* Right: rotated photo */}
          <div className="order-1 md:order-2 relative">
            {article.coverImage && (
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 bg-surface-container-high">
                <Image
                  src={urlFor(article.coverImage as SanityImageSource).width(800).height(1000).url()}
                  alt={article.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── ARTICLE BODY ── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 py-10 md:py-16">

          {/* Main editorial content */}
          <div className="lg:col-span-8">
            {article.body ? (
              <PortableText value={article.body} />
            ) : (
              <p className="font-body text-on-surface-variant">No content available.</p>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-surface-container-high p-8 rounded-[2rem] sticky top-28">
              <h3 className="font-headline text-lg font-black tracking-tight text-on-surface mb-6">More Stories</h3>
              <Link href="/news" className="font-body text-primary font-bold text-sm hover:underline block mb-8">
                ← Back to all news
              </Link>
              <Link
                href="/events"
                className="block bg-primary text-on-primary rounded-[1.5rem] p-6 hover:bg-primary-dim transition-colors"
              >
                <p className="font-headline font-black text-lg mb-1">Upcoming Events</p>
                <p className="font-body text-on-primary/80 text-sm">View the full tournament schedule →</p>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
