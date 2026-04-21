import { PortableText as SanityPortableText } from '@portabletext/react'
import type { PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from 'sanity'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/urlFor'

interface Props {
  value: PortableTextBlock[]
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: Record<string, unknown> }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-10 not-prose">
          <div className="rounded-[1.5rem] overflow-hidden">
            <Image
              src={urlFor(value).width(960).url()}
              alt={(value.alt as string) ?? ''}
              width={960}
              height={640}
              className="w-full object-cover"
            />
          </div>
          {!!value.caption && (
            <figcaption className="text-xs text-on-surface-variant font-body mt-3 text-center opacity-60">
              {value.caption as string}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

export function PortableText({ value }: Props) {
  return (
    <div className="prose prose-lg max-w-none font-body
      prose-headings:font-headline prose-headings:text-on-surface
      prose-p:text-on-surface prose-p:leading-relaxed
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      prose-strong:text-on-surface prose-li:text-on-surface
      prose-h1:tracking-[-0.02em] prose-h2:tracking-[-0.02em] prose-h3:tracking-[-0.02em]
      prose-blockquote:border-l-tertiary prose-blockquote:not-italic
      prose-blockquote:font-headline prose-blockquote:font-bold prose-blockquote:text-primary
      prose-blockquote:text-2xl">
      <SanityPortableText value={value} components={components} />
    </div>
  )
}
