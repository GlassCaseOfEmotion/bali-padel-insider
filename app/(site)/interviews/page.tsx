import { client } from '@/sanity/lib/client'
import { allInterviewsQuery } from '@/sanity/lib/queries'
import { InterviewCard } from '@/components/cards/InterviewCard'
import type { Metadata } from 'next'
import type { SanityImageSource } from '@sanity/image-url'

export const metadata: Metadata = { title: 'Interviews' }
export const revalidate = 60

export default async function InterviewsPage() {
  const interviews = await client.fetch(allInterviewsQuery)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-on-surface mb-10">Interviews</h1>
      {interviews?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview: { title: string; slug: { current: string }; publishedAt?: string; coverImage?: SanityImageSource | null; subject?: { name: string; slug: { current: string } } }) => (
            <InterviewCard key={interview.slug.current} interview={interview} />
          ))}
        </div>
      ) : (
        <p className="font-body text-on-surface-muted text-center py-20">No interviews published yet.</p>
      )}
    </div>
  )
}
