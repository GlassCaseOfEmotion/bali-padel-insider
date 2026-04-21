import { defineField, defineType } from 'sanity'

export const ranking = defineType({
  name: 'ranking',
  title: 'Ranking',
  type: 'document',
  fields: [
    defineField({
      name: 'category',
      type: 'string',
      options: { list: ['men', 'women', 'mixed'] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({
      name: 'entries',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'player',
              type: 'reference',
              to: [{ type: 'player' }],
            }),
            defineField({ name: 'rank', type: 'number' }),
            defineField({ name: 'points', type: 'number' }),
          ],
          preview: {
            select: { title: 'player.name', subtitle: 'rank' },
            prepare({ title, subtitle }: { title?: string; subtitle?: number }) {
              return { title, subtitle: `Rank #${subtitle}` }
            },
          },
        },
      ],
    }),
  ],
})
