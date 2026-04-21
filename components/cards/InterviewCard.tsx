import Link from 'next/link'
import Image from 'next/image'
import type { SanityImageSource } from '@sanity/image-url'
import { urlFor } from '@/sanity/lib/urlFor'

interface Interview {
  title: string
  slug: { current: string }
  publishedAt?: string
  coverImage?: SanityImageSource | null
  subject?: { name: string; slug: { current: string } }
}

export function InterviewCard({ interview }: { interview: Interview }) {
  return (
    <Link
      href={`/interviews/${interview.slug.current}`}
      className="group block rounded-[2rem] overflow-hidden bg-surface-container shadow-[0_8px_40px_rgba(58,50,22,0.06)] hover:scale-[1.02] hover:shadow-[0_16px_60px_rgba(58,50,22,0.10)] transition-all duration-300"
    >
      {interview.coverImage && (
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={urlFor(interview.coverImage).width(720).height(416).url()}
            alt={interview.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6">
        <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary">
          Interview
        </span>
        <h3 className="mt-2 font-display text-lg font-bold leading-snug tracking-[-0.02em] text-on-surface line-clamp-2">
          {interview.title}
        </h3>
        {interview.subject && (
          <p className="mt-2 font-body text-sm text-on-surface-muted">{interview.subject.name}</p>
        )}
      </div>
    </Link>
  )
}
