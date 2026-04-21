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
      of: [{ type: 'block' }],
    }),
  ],
})
