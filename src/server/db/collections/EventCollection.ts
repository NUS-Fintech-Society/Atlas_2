import { BaseCollection } from './BaseCollection'
import type { Event } from '../models/Event'

class EventCollection extends BaseCollection<Event> {
  protected override collectionName = 'events'
  protected override objectName = 'event'
}

const eventCollection = new EventCollection()
export default eventCollection
