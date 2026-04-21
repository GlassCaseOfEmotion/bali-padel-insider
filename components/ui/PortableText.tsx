import { PortableText as SanityPortableText } from '@portabletext/react'
import type { PortableTextBlock } from 'sanity'

interface Props {
  value: PortableTextBlock[]
}

export function PortableText({ value }: Props) {
  return (
    <div className="prose prose-lg max-w-none font-body
      prose-headings:font-display prose-headings:text-on-surface
      prose-p:text-on-surface prose-p:leading-relaxed
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      prose-strong:text-on-surface prose-li:text-on-surface
      prose-h1:tracking-[-0.02em] prose-h2:tracking-[-0.02em] prose-h3:tracking-[-0.02em]">
      <SanityPortableText value={value} />
    </div>
  )
}
