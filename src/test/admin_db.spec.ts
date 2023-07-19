import { db } from './database/firebase'
import { userCollection } from '../server/db/collections/UserAdminBaseCollection'

jest.mock('../server/db/admin_firebase', () => {
  return { db }
})

describe('dummy', () => {
  test('The collection should set the data correctly.', async () => {
    await userCollection.set({
      department: 'Blockchain',
      email: 'woowenjun99@gmail.com',
      isAdmin: false,
      id: 'userId',
      name: 'Wen Jun',
      role: 'Applicant',
      personal_email: 'woowenjun99@gmail.com',
    })

    const user = await db
      .collection('users')
      .doc('userId')
      .get()
      .then((snapshot) => snapshot.data())

    expect(user).toStrictEqual({
      department: 'Blockchain',
      email: 'woowenjun99@gmail.com',
      isAdmin: false,
      name: 'Wen Jun',
      role: 'Applicant',
      personal_email: 'woowenjun99@gmail.com',
    })
  })
})
