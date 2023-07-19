import { adminAuth } from '~/server/db/admin_firebase'
import { userCollection } from '~/server/db/collections/admin/UserCollection'
import { CreateManyAppliedRoleController } from '~/server/trpc/router/controllers/recruitment/create_many_applied_roles_controller'
import { dropCollection } from '../../../../util/dropCollection'
import { sendMultipleEmails } from '~/server/trpc/router/member/helper'

describe('create_many_applied_roles_controller', () => {
  const controller = new CreateManyAppliedRoleController()

  afterEach(async () => {
    await dropCollection('users')
    await dropCollection('applied_roles')
  })

  test.todo(
    'Without the correct permissions, an error should be thrown if the user attempts to save.'
  )

  test('The user should be able to upload the applicant into the database with the correct parameters.', async () => {
    const NAME = 'Wen Jun'
    const STUDENT_ID = 'wenjun'
    const PERSONAL_EMAIL = 'woowenjun99@gmail.com'

    const applicant_one = {
      name: NAME,
      department: '',
      personal_email: PERSONAL_EMAIL,
      role: '',
    }

    await controller.execute(
      [
        {
          applicantId: STUDENT_ID,
          firstRole: 'Software Engineer',
          secondRole: 'Technical Lead',
          firstDepartment: 'Software Development',
          secondDepartment: 'Blockchain',
        },
      ],
      [
        {
          ...applicant_one,
          nus_email: 'wenjun@u.nus.edu',
          student_id: STUDENT_ID,
        },
      ]
    )

    await expect(userCollection.getById(STUDENT_ID)).resolves.toStrictEqual({
      ...applicant_one,
      department: 'Unassigned',
      email: 'wenjun@u.nus.edu',
      id: STUDENT_ID,
      isAdmin: false,
      resume: '',
      role: 'Applicant',
    })

    expect(adminAuth.createUser).toBeCalledTimes(1)

    expect(adminAuth.createUser).toBeCalledWith({
      displayName: NAME,
      email: PERSONAL_EMAIL,
      password: expect.any(String),
      uid: STUDENT_ID,
    })

    expect(sendMultipleEmails).toBeCalledWith([
      { email: PERSONAL_EMAIL, id: STUDENT_ID, password: expect.any(String) },
    ])
  })

  test.todo('The user should not have applied for 2 of the same roles.')

  test.todo(
    'If the user already exist, we should not upload him nor his roles into the database again.'
  )
})
