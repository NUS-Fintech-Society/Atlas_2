import { adminAuth } from '~/server/db/admin_firebase'
import { userCollection } from '~/server/db/collections/admin/UserCollection'
import { CreateManyUserController } from '~/server/trpc/router/controllers/users/create_many_user_controller'
import { sendMultipleEmails } from '~/server/trpc/router/member/helper'
import { dropCollection } from '../../../../util/dropCollection'

describe('create_many_user_controller.ts', () => {
  const controller = new CreateManyUserController()

  afterEach(async () => {
    await dropCollection('users')
    jest.clearAllMocks()
  })

  test.todo("If the person calling the method does not have the permission, throw an error.")

  test('it should save the user.', async () => {
    const NAME = 'Michael'
    const STUDENT_ID = 'A1234567N'
    const EMAIL = 'abc@gmail.com'

    const applicant = {
      name: NAME,
      personal_email: EMAIL,
      department: 'Software Development',
      role: 'Software Engineer',
    }

    await controller.execute([
      {
        ...applicant,
        student_id: STUDENT_ID,
        nus_email: 'michaelyeo@u.nus.edu',
      },
    ], "woowenjun99@gmail.com")

    expect(adminAuth.createUser).toBeCalledTimes(1)

    expect(adminAuth.createUser).toBeCalledWith({
      displayName: NAME,
      email: EMAIL,
      uid: STUDENT_ID,
      password: expect.any(String),
    })

    expect(sendMultipleEmails).toBeCalledTimes(1)

    await expect(userCollection.getById(STUDENT_ID)).resolves.toStrictEqual({
      ...applicant,
      email: 'michaelyeo@u.nus.edu',
      id: STUDENT_ID,
      isAdmin: false,
      resume: '',
    })
  })

  test('If the user is already in the database, we will silently drop him.', async () => {
    await userCollection.set({
      name: 'Michael',
      personal_email: 'abc@gmail.com',
      department: 'Software Development',
      role: 'Software Engineer',
      email: 'michaelyeo@u.nus.edu',
      isAdmin: false,
    })

    expect(adminAuth.createUser).toBeCalledTimes(0)

    expect(sendMultipleEmails).toBeCalledTimes(0)
  })
})
