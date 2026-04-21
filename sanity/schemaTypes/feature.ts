import { defineField, defineType } from 'sanity'

export const feature = defineType({
  name: 'feature',
  title: 'Feature Article',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'badge', type: 'string', description: 'Label shown in the hero pill, e.g. "Executive Spotlight"' }),
    defineField({ name: 'excerpt', type: 'text', rows: 3 }),
    defineField({ name: 'coverImage', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({
      name: 'stats',
      type: 'array',
      of: [
        defineField({
          name: 'stat',
          type: 'object',
          fields: [
            defineField({ name: 'value', type: 'string' }),
            defineField({ name: 'label', type: 'string' }),
          ],
        }),
      ],
      validation: (r) => r.max(4),
    }),
    defineField({ name: 'pullQuote', type: 'text', rows: 2, description: 'Large blockquote displayed mid-article' }),
    defineField({ name: 'pullQuoteAttribution', type: 'string', description: 'e.g. "On the early days"' }),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
      ],
    }),
    defineField({ name: 'ctaHeadline', type: 'string' }),
    defineField({ name: 'ctaBody', type: 'text', rows: 2 }),
    defineField({ name: 'ctaPrimaryLabel', type: 'string' }),
    defineField({ name: 'ctaPrimaryUrl', type: 'url' }),
    defineField({ name: 'ctaSecondaryLabel', type: 'string' }),
    defineField({ name: 'ctaSecondaryUrl', type: 'url' }),
    defineField({ name: 'ctaImage', type: 'image', options: { hotspot: true } }),
  ],
  preview: { select: { title: 'title', media: 'coverImage' } },
})
