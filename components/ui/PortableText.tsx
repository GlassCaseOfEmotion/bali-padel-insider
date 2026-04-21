import { PortableText as SanityPortableText } from '@portabletext/react'
import type { PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from 'sanity'
import type { ReactNode } from 'react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/urlFor'

interface Props {
  value: PortableTextBlock[]
}

const components: PortableTextComponents = {
  block: {
    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote className="my-12 md:my-16 px-8 md:px-12 py-10 md:py-14 bg-surface-container-low rounded-[2rem] relative overflow-hidden not-prose">
        <span className="absolute -top-2 -left-1 text-[7rem] md:text-[9rem] font-headline font-black text-tertiary/20 select-none leading-none">&ldquo;</span>
        <div className="text-2xl md:text-3xl lg:text-4xl font-headline font-extrabold text-primary leading-tight relative z-10">
          {children}
        </div>
      </blockquote>
    ),
  },
  types: {
    image: ({ value }: { value: Record<string, unknown> }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-10 not-prose">
          <div className="rounded-[1.5rem] overflow-hidden relative">
            <Image
              src={urlFor(value).width(960).url()}
              alt={(value.alt as string) ?? ''}
              width={960}
              height={640}
              className="w-full object-cover"
            />
            {!!value.caption && (
              <div className="absolute bottom-4 right-4 bg-surface/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold font-body uppercase tracking-wide text-on-surface">
                {value.caption as string}
              </div>
            )}
          </div>
        </figure>
      )
    },
  },
}

export function PortableText({ value }: Props) {
  return (
    <div className="prose prose-lg max-w-none font-body
      prose-headings:font-headline prose-headings:text-primary
      prose-h1:text-primary prose-h2:text-primary prose-h3:text-primary
      prose-p:text-on-surface prose-p:leading-relaxed
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      prose-strong:text-on-surface prose-li:text-on-surface
      prose-h1:tracking-[-0.02em] prose-h2:tracking-[-0.02em] prose-h3:tracking-[-0.02em]">
      <SanityPortableText value={value} components={components} />
    </div>
  )
}
