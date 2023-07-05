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
  taskCreator: string
}

export default Task
