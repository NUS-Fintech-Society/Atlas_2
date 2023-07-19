import { addUsers } from '../../users/createManyUsers'
import { db } from '~/server/db/admin_firebase'

export class CreateManyUserController {
  async execute(
    input: {
      name: string
      personal_email: string
      department: string
      role: string
      nus_email: string
      student_id: string
      resume?: string | undefined
    }[],
    transaction?: FirebaseFirestore.Transaction
  ) {
    if (transaction) {
      return await addUsers(input, transaction)
    }
    return await db.runTransaction((transaction) => addUsers(input, transaction))
  }
}
