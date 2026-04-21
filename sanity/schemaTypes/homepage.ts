import { defineField, defineType } from 'sanity'

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'featuredArticle',
      type: 'reference',
      to: [{ type: 'article' }],
    }),
    defineField({
      name: 'featuredEvents',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'event' }] }],
    }),
    defineField({
      name: 'featuredPlayers',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'player' }] }],
    }),
  ],
})
