import { defineField, defineType } from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Event',
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
    defineField({ name: 'date', title: 'Start Date', type: 'datetime' }),
    defineField({ name: 'endDate', title: 'End Date', type: 'datetime' }),
    defineField({
      name: 'eventType',
      type: 'string',
      options: { list: ['tournament', 'social', 'clinic', 'mixer'] },
    }),
    defineField({
      name: 'level',
      title: 'Skill Level',
      type: 'string',
      description: 'e.g. "Pro & Intermediate", "All Levels", "Beginner"',
    }),
    defineField({
      name: 'venue',
      type: 'reference',
      to: [{ type: 'club' }],
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'excerpt',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 3,
      description: 'Short paragraph shown below the title in the hero',
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'registrationUrl',
      title: 'Registration URL',
      type: 'url',
    }),
    defineField({
      name: 'bracketUrl',
      title: 'Bracket / Schedule URL',
      type: 'url',
    }),
    defineField({
      name: 'registrationDeadline',
      title: 'Registration Deadline',
      type: 'datetime',
      description: 'Used for the "Closing Soon" countdown timer',
    }),
    defineField({
      name: 'prizePool',
      title: 'Prize Pool',
      type: 'object',
      fields: [
        defineField({ name: 'total', title: 'Total Prize ($)', type: 'number' }),
        defineField({ name: 'first', title: '1st Place Prize', type: 'string', description: 'e.g. "$12k"' }),
        defineField({ name: 'second', title: '2nd Place Prize', type: 'string' }),
        defineField({ name: 'third', title: '3rd Place Prize', type: 'string' }),
      ],
    }),
    defineField({
      name: 'schedule',
      title: 'Event Schedule',
      type: 'array',
      of: [{
        type: 'object',
        name: 'scheduleItem',
        fields: [
          defineField({ name: 'phase', title: 'Phase Name', type: 'string' }),
          defineField({ name: 'datetime', title: 'Date / Time Label', type: 'string', description: 'e.g. "Friday, 8:00 AM – 10:00 PM"' }),
          defineField({ name: 'isFeatured', title: 'Highlight this phase', type: 'boolean' }),
        ],
        preview: {
          select: { title: 'phase', subtitle: 'datetime' },
        },
      }],
    }),
    defineField({
      name: 'sponsors',
      title: 'Sponsors',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'shuttleInfo',
      title: 'Shuttle Service Info',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'conciergeEmail',
      title: 'Concierge Email',
      type: 'string',
    }),
  ],
})
