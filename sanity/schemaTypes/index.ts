import { type SchemaTypeDefinition } from 'sanity'
import { article } from './article'
import { author } from './author'
import { club } from './club'
import { event } from './event'
import { feature } from './feature'
import { homepage } from './homepage'
import { interview } from './interview'
import { player } from './player'
import { ranking } from './ranking'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [article, author, club, event, feature, homepage, interview, player, ranking],
}
