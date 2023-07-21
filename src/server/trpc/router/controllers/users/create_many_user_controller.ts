import { db } from '~/server/db/admin_firebase'
import { randomUUID } from 'crypto'
import { sendMultipleEmails } from '../../member/helper'
import { adminAuth } from '~/server/db/admin_firebase'
import { userCollection } from '~/server/db/collections/admin/UserCollection'
import {
  CreateMultipleUserFailureEmail,
  type Payload,
} from '../email/templates/create_multiple_users_failure'

type CreateMultipleUserPayload = {
  name: string
  personal_email: string
  department: string
  role: string
  nus_email: string
  student_id: string
  resume?: string | undefined
}

export class CreateManyUserController {
  // This variable refers to the people whom we fail to create a user account for.
  private failure: Payload[] = []
  private filteredUsers: CreateMultipleUserPayload[] = []
  private payload: CreateMultipleUserPayload[] = []
  private success: { id: string; email: string; password: string }[] = []
  private transaction?: FirebaseFirestore.Transaction

  /**
   * Used to filter all the invalid users based on the following conditions.
   *
   * (1). Personal email already exists.
   * (2). Student matriculation number already exist.
   */
  private async filterUser() {
    const users = await userCollection.getAll()
    const userIds = new Set(users.map((user) => user.id))
    const userEmails = new Set(users.map((user) => user.personal_email))

    this.filteredUsers = this.payload.filter((user) => {
      const isValidUser =
        user.student_id &&
        !userIds.has(user.student_id) &&
        !userEmails.has(user.personal_email)

      if (!isValidUser) {
        this.failure.push({
          name: user.name,
          userId: user.student_id,
          reason: `The personal email ${user.personal_email} or matriculation number ${user.student_id} is already in the database.`,
        })
      }

      return isValidUser
    })
  }

  private async sendEmails(recipient: string) {
    await new CreateMultipleUserFailureEmail().execute(recipient, this.failure)
    await sendMultipleEmails(this.success)
  }

  private async createUser(user: CreateMultipleUserPayload) {
    try {
      const password = randomUUID().substring(0, 10)

      await adminAuth.createUser({
        email: user.personal_email,
        displayName: user.name,
        uid: user.student_id,
        password,
      })

      userCollection
        .withTransaction(this.transaction as FirebaseFirestore.Transaction)
        .set(
          {
            department: user.department,
            email: user.nus_email,
            name: user.name,
            isAdmin: false,
            id: user.student_id,
            role: user.role,
            resume: user.resume || '',
            personal_email: user.personal_email,
          },
          user.student_id
        )

      this.success.push({
        id: user.student_id,
        email: user.personal_email,
        password,
      })
    } catch (e) {
      this.failure.push({
        userId: user.student_id,
        name: user.name,
        reason: (e as Error).message,
      })
    }
  }

  private async addUsers(
    input: {
      name: string
      personal_email: string
      department: string
      role: string
      nus_email: string
      student_id: string
      resume?: string | undefined
    }[],
    recipient: string
  ) {
    await this.filterUser()

    /// Step 2: Save the data for all the valid users.
    await Promise.all(this.filteredUsers.map(this.createUser))

    await this.sendEmails(recipient)

    return this.success.map((data) => data.id)
  }

  public async execute(
    input: CreateMultipleUserPayload[],
    recipient: string,
    transaction?: FirebaseFirestore.Transaction
  ) {
    this.payload = input

    if (transaction) {
      this.transaction = transaction
      return await this.addUsers(input, recipient)
    }

    return await db.runTransaction(async (transaction) => {
      this.transaction = transaction
      return await this.addUsers(input, recipient)
    })
  }
}
