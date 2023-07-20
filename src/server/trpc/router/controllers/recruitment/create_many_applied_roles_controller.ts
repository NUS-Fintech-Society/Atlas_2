import { CreateManyUserController } from '../users/create_many_user_controller'
import { appliedRoleCollection } from '~/server/db/collections/admin/AppliedRoleCollection'
import { ApplicationStatus } from '~/server/db/models/AppliedRole'
import { db } from '~/server/db/admin_firebase'

export class CreateManyAppliedRoleController {
  async execute(
    applicants: {
      applicantId: string
      firstRole: string
      firstDepartment: string
      secondRole: string
      secondDepartment: string
    }[],
    users: {
      name: string
      department: string
      nus_email: string
      role: string
      student_id: string
      personal_email: string
      resume?: string | undefined
    }[]
  ) {
    return await db.runTransaction(async (transaction) => {
      // Filter away the empty rows
      users = users.filter((user) => user.student_id)
      
      const controller = new CreateManyUserController()

      const usersCreated = await controller.execute(users, transaction)

      applicants = applicants.filter((applicant) =>
        usersCreated.includes(applicant.applicantId)
      )

      applicants.forEach((appliedRole) => {
        /// Upload first choice
        appliedRoleCollection.withTransaction(transaction).set({
          applicantId: appliedRole.applicantId,
          rank: 1,
          role: appliedRole.firstRole,
          department: appliedRole.firstDepartment,
          status: ApplicationStatus.PENDING,
          flag: false,
        })

        /// Upload second choice
        appliedRoleCollection.withTransaction(transaction).set({
          applicantId: appliedRole.applicantId,
          rank: 2,
          role: appliedRole.secondRole,
          department: appliedRole.secondDepartment,
          status: ApplicationStatus.PENDING,
          flag: false,
        })
      })
    })
  }
}
