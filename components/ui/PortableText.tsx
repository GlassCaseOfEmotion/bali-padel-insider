import { PortableText as SanityPortableText } from '@portabletext/react'
import type { PortableTextBlock } from 'sanity'

interface Props {
  value: PortableTextBlock[]
}

export function PortableText({ value }: Props) {
  return (
    <div className="prose max-w-none font-body text-on-surface [&_h1]:font-display [&_h2]:font-display [&_h3]:font-display [&_a]:text-primary [&_a]:no-underline [&_a:hover]:underline">
      <SanityPortableText value={value} />
    </div>
  )
}
