import { BaseCollection } from './BaseCollection'
import type { Log } from '../models/Log'

class LogCollection extends BaseCollection<Log> {
  protected override collectionName = 'logs'
  protected override objectName = 'log'
}

const logCollection = new LogCollection()
export default logCollection
