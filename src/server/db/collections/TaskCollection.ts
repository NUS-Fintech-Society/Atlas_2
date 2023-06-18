import { BaseCollection } from './BaseCollection'
import type { Task } from '../models/Task'

class TaskCollection extends BaseCollection<Task> {
  protected override collectionName = 'tasks'
  protected override objectName = 'task'
}

const taskCollection = new TaskCollection()
export default taskCollection
