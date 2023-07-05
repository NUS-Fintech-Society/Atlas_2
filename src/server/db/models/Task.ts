import type { Timestamp } from 'firebase/firestore'
import type User from './Event'

export type Task = {
  status: string
  id?: string
  due: Timestamp
  taskName: string
  description: string
  department: string[]
  assignedUsers?: User[]
  taskCreatorId: string
  taskCreatorName: string
}

export default Task
