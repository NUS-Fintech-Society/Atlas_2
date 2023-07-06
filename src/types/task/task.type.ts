export type TaskInfos = {
  status: string
  id: string
  due: string
  taskName: string
  description: string
  department: string[]
  taskCreatorId: string
  taskCreatorName: string
  taskCompletion?: number
}
