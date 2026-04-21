import { client } from '@/sanity/lib/client'
import { articleBySlugQuery } from '@/sanity/lib/queries'
import { PortableText } from '@/components/ui/PortableText'
import { urlFor } from '@/sanity/lib/urlFor'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { SanityImageSource } from '@sanity/image-url'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await client.fetch(articleBySlugQuery, { slug })
  return { title: article?.title ?? 'Article' }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await client.fetch(articleBySlugQuery, { slug })

  if (!article) notFound()

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {article.category && (
        <span className="font-body text-xs font-semibold uppercase tracking-widest text-secondary">
          {article.category}
        </span>
      )}
      <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-[-0.02em] text-on-surface">
        {article.title}
      </h1>
      <div className="mt-4 flex items-center gap-4 font-body text-sm text-on-surface-muted">
        {article.author?.name && <span>{article.author.name}</span>}
        {publishedDate && <span>{publishedDate}</span>}
      </div>
      {article.coverImage && (
        <div className="relative mt-8 h-80 rounded-[2rem] overflow-hidden bg-surface-container-high">
          <Image
            src={urlFor(article.coverImage as SanityImageSource).width(1200).height(600).url()}
            alt={article.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}
      {article.body && (
        <div className="mt-10">
          <PortableText value={article.body} />
        </div>
      )}
    </article>
  )
}
