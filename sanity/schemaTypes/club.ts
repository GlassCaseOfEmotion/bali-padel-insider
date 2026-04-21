import { defineField, defineType } from 'sanity'

export const club = defineType({
  name: 'club',
  title: 'Club',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'logo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'coverPhoto', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'location',
      type: 'object',
      fields: [
        defineField({ name: 'address', type: 'string' }),
        defineField({ name: 'googleMapsUrl', type: 'url' }),
      ],
    }),
    defineField({
      name: 'courts',
      type: 'object',
      fields: [
        defineField({ name: 'count', type: 'number' }),
        defineField({ name: 'surfaceType', type: 'string' }),
      ],
    }),
    defineField({
      name: 'facilities',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: ['Lights', 'Pro Shop', 'Cafe', 'Changing Rooms', 'Parking', 'Showers'],
      },
    }),
    defineField({ name: 'website', type: 'url' }),
    defineField({ name: 'instagram', type: 'url' }),
    defineField({ name: 'whatsapp', type: 'string' }),
  ],
})
