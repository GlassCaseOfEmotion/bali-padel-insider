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

  const publishedDate = interview.publishedAt
    ? new Date(interview.publishedAt).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary">
        Interview
      </span>
      <h1 className="mt-3 font-headline text-4xl font-bold leading-tight tracking-[-0.02em] text-on-surface">
        {interview.title}
      </h1>
      <div className="mt-4 flex items-center gap-4 font-body text-sm text-on-surface-muted">
        {interview.subject && (
          <Link href={`/players/${interview.subject.slug.current}`} className="hover:underline text-primary">
            {interview.subject.name}
          </Link>
        )}
        {publishedDate && <span>{publishedDate}</span>}
      </div>

      {interview.videoPlaybackId ? (
        <div className="mt-8">
          <MuxVideoPlayer
            playbackId={interview.videoPlaybackId}
            title={interview.title}
          />
        </div>
      ) : interview.coverImage ? (
        <div className="relative mt-8 h-72 rounded-[2rem] overflow-hidden bg-surface-container-high">
          <Image
            src={urlFor(interview.coverImage as SanityImageSource).width(1200).height(600).url()}
            alt={interview.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      ) : null}

      {interview.body && (
        <div className="mt-10">
          <PortableText value={interview.body} />
        </div>
      )}
    </article>
  )
}
