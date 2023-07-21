import { adminAuth } from '~/server/db/admin_firebase'
import { userCollection } from '~/server/db/collections/admin/UserCollection'
import { CreateManyAppliedRoleController } from '~/server/trpc/router/controllers/recruitment/create_many_applied_roles_controller'
import { dropCollection } from '../../../../util/dropCollection'
import { appliedRoleCollection } from '~/server/db/collections/admin/AppliedRoleCollection'
import { sendEmail } from '~/server/trpc/router/controllers/email/email'
import { sendNewMemberEmail } from '~/server/trpc/router/controllers/email/templates/new_user_creation'
import { sendNewApplicantEmail } from '~/server/trpc/router/controllers/email/templates/new_applicant_creation'

describe('create_many_applied_roles_controller', () => {
  /// Mock Applicant One
  const NAME = 'Wen Jun'
  const STUDENT_ID = 'wenjun'
  const PERSONAL_EMAIL = 'woowenjun99@gmail.com'

  const applicant_one = {
    name: NAME,
    department: 'Unassigned',
    personal_email: PERSONAL_EMAIL,
    role: 'Applicant',
  }

  afterEach(async () => {
    await dropCollection('users')
    await dropCollection('applied_roles')
    jest.clearAllMocks()
  })

  test.todo(
    'Without the correct permissions, an error should be thrown if the user attempts to save.'
  )

  test('The user should be able to upload the applicant into the database with the correct parameters.', async () => {
    const controller = new CreateManyAppliedRoleController()

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
      ],
      'woowenjun99@gmail.com'
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

    expect(sendNewApplicantEmail).toBeCalledTimes(1)

    const userAppliedRoles = await appliedRoleCollection.getAll()

    expect(userAppliedRoles).toHaveLength(2)

    userAppliedRoles.forEach((role) => {
      expect(role).toMatchObject({
        applicantId: STUDENT_ID,
        flag: false,
        status: 'pending',
      })
    })
  })

  test.todo('The user should not have applied for 2 of the same roles.')

  test('If the user already exist, we should not upload him nor his roles into the database again.', async () => {
    const controller = new CreateManyAppliedRoleController()

    await userCollection.set({
      department: 'Blockchain',
      email: 'wenjun@u.nus.edu',
      isAdmin: true,
      name: NAME,
      role: 'Co-Director',
      personal_email: PERSONAL_EMAIL,
    })

    expect(
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
        ],
        'woowenjun99@gmail.com'
      )
    ).resolves

    expect(adminAuth.createUser).toBeCalledTimes(0)

    expect(sendNewMemberEmail).toBeCalledTimes(0)

    const userAppliedRoles = await appliedRoleCollection.getAll()

    expect(userAppliedRoles).toHaveLength(0)

    expect(sendEmail).toBeCalledTimes(1)

    expect(sendEmail).toBeCalledWith("woowenjun99@gmail.com", "Immediate Action Required!", expect.any(String))
  })
})
