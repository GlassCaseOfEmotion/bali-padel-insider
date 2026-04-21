import Link from 'next/link'
import Image from 'next/image'
import type { SanityImageSource } from '@sanity/image-url'
import { urlFor } from '@/sanity/lib/urlFor'

interface Article {
  title: string
  slug: { current: string }
  excerpt?: string
  coverImage?: SanityImageSource | null
  publishedAt?: string
  category?: string
  authorName?: string
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/news/${article.slug.current}`}
      className="group block rounded-[2rem] overflow-hidden bg-surface-container-low shadow-[0_8px_40px_rgba(58,50,22,0.06)] hover:scale-[1.02] hover:shadow-[0_16px_60px_rgba(58,50,22,0.10)] transition-all duration-300"
    >
      {article.coverImage && (
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={urlFor(article.coverImage).width(720).height(416).url()}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6">
        {article.category && (
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-secondary">
            {article.category}
          </span>
        )}
        <h3 className="mt-2 font-headline text-lg font-bold leading-snug tracking-[-0.02em] text-on-surface line-clamp-2">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-2 font-body text-sm leading-relaxed text-on-surface-muted line-clamp-2">
            {article.excerpt}
          </p>
        )}
        {article.authorName && (
          <p className="mt-4 font-body text-xs text-on-surface-muted">{article.authorName}</p>
        )}
      </div>
    </Link>
  )
}
