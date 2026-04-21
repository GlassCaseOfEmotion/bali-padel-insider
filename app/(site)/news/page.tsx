import { client } from '@/sanity/lib/client'
import { latestArticlesQuery } from '@/sanity/lib/queries'
import { ArticleCard } from '@/components/cards/ArticleCard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'News' }
export const revalidate = 60

export default async function NewsPage() {
  const articles = await client.fetch(latestArticlesQuery, { limit: 49 })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-on-surface mb-10">News</h1>
      {articles?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: { title: string; slug: { current: string } }) => (
            <ArticleCard key={article.slug.current} article={article} />
          ))}
        </div>
      ) : (
        <p className="font-body text-on-surface-muted text-center py-20">No articles published yet.</p>
      )}
    </div>
  )
}
