import { defineField, defineType } from 'sanity'

export const interview = defineType({
  name: 'interview',
  title: 'Interview',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subject',
      type: 'reference',
      to: [{ type: 'player' }],
    }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'e.g. "The Pro Series", "Deep Dives", "Coach\'s Corner"',
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time (minutes)',
      type: 'number',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt / Subtitle',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'pullQuote',
      title: 'Opening Pull Quote',
      type: 'text',
      rows: 3,
      description: 'Displayed as a large italic block quote at the top of the article',
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'mux.video',
    }),
    defineField({
      name: 'body',
      title: 'Transcript / Summary',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
            defineField({ name: 'caption', type: 'string', title: 'Caption' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'ctaTitle',
      title: 'Sidebar CTA Title',
      type: 'string',
      description: 'e.g. "Train with Nia"',
    }),
    defineField({
      name: 'ctaBody',
      title: 'Sidebar CTA Body',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'ctaUrl',
      title: 'Sidebar CTA Link',
      type: 'url',
    }),
  ],
})
