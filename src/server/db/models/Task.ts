import type { Timestamp } from 'firebase/firestore'
import type User from './Event'

export type Task = {
  status: string | null
  id?: string
  due: Timestamp
  taskName: string
  description: string
  department: string[]
  assignedUsers?: User[]
  taskCreatorId: string
  taskCreatorName: string
  taskCompletion?: number
}

export default Task
