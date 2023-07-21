import { db } from '~/server/db/admin_firebase'
import { randomUUID } from 'crypto'
import { sendMultipleEmails } from '../../member/helper'
import { adminAuth } from '~/server/db/admin_firebase'
import { userCollection } from '~/server/db/collections/admin/UserCollection'
import { createMultipleUserFailureEmail } from '../email/templates/create_multiple_users_failure'

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
  private filteredUsers: CreateMultipleUserPayload[] = []
  private payload: CreateMultipleUserPayload[] = []

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
    const failure: { name: string; reason: string; userId: string }[] = []

    this.filteredUsers = this.payload.filter((user) => {
      const isValidUser =
        user.student_id &&
        !userIds.has(user.student_id) &&
        !userEmails.has(user.personal_email)

      if (!isValidUser) {
        failure.push({
          name: user.name,
          userId: user.student_id,
          reason: `The personal email ${user.personal_email} or matriculation number ${user.student_id} is already in the database.`,
        })
      }

      return isValidUser
    })

    return failure
  }

  private async createUser(
    user: CreateMultipleUserPayload,
    transaction: FirebaseFirestore.Transaction
  ) {
    try {
      const password = randomUUID().substring(0, 10)

      await adminAuth.createUser({
        email: user.personal_email,
        displayName: user.name,
        uid: user.student_id,
        password,
      })

      userCollection.withTransaction(transaction).set(
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

      return {
        success: true,
        id: user.student_id,
        email: user.personal_email,
        password,
        user: user.name,
      }
    } catch (e) {
      return {
        success: false,
        id: user.student_id,
        email: user.personal_email,
        password: '',
        error: (e as Error).message,
        name: user.name,
      }
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
    recipient: string,
    transaction: FirebaseFirestore.Transaction
  ) {
    const usersFilteredAway = await this.filterUser()

    const emailData = await Promise.all(
      this.filteredUsers.map((user) => this.createUser(user, transaction))
    )

    await createMultipleUserFailureEmail(
      recipient,
      emailData
        .filter((user) => !user.success)
        .map((user) => {
          return {
            userId: user.id,
            name: user.name as string,
            reason: user.error as string,
          }
        })
        .concat(usersFilteredAway)
    )

    await sendMultipleEmails(
      emailData
        .filter((user) => user.success)
        .map((user) => {
          return {
            email: user.email,
            password: user.password,
          }
        })
    )

    return emailData.filter((user) => user.success).map((data) => data.id)
  }

  public async execute(
    input: CreateMultipleUserPayload[],
    recipient: string,
    transaction?: FirebaseFirestore.Transaction
  ) {
    this.payload = input

    if (transaction) {
      return await this.addUsers(input, recipient, transaction)
    }

    return await db.runTransaction(async (transaction) => {
      return await this.addUsers(input, recipient, transaction)
    })
  }
}
