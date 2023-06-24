import type { Timestamp } from 'firebase/firestore'

export type Log = {
  createdAt: Timestamp
  id?: string
  level: 'INFO' | 'WARNING' | 'ERROR'
  description: string
  title: string
}
