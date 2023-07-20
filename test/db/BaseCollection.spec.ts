import { db } from '../firebase'
import { userCollection } from '../../src/server/db/collections/admin/UserCollection'

describe('Base Collection', () => {
  afterEach(async () => {
    const docs = await db
      .collection('users')
      .get()
      .then((snapshots) => snapshots.docs)
    await Promise.all(docs.map((doc) => doc.ref.delete()))
  })

  test('The set should work as expected.', async () => {
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

  test('The getById should work as expected.', async () => {
    await expect(userCollection.getById('userId')).rejects.toThrowError(
      'The user does not exist'
    )
    await db.collection('users').doc('userId').set({ name: 'John' })
    await expect(userCollection.getById('userId')).resolves.toStrictEqual({
      name: 'John',
      id: 'userId',
    })
  })

  test('The update should work as expected.', async () => {
    await db.collection('users').doc('userId').set({ name: 'John' })
    await userCollection.update('userId', { department: 'Blockchain' })
    await expect(
      db
        .collection('users')
        .doc('userId')
        .get()
        .then((snapshot) => snapshot.data())
    ).resolves.toStrictEqual({
      department: 'Blockchain',
      name: 'John',
    })
  })

  test('The delete should work as expected.', async () => {
    await db.collection('users').doc('userId').set({ name: 'John' })
    await expect(
      db
        .collection('users')
        .doc('userId')
        .get()
        .then((snapshot) => snapshot.data())
    ).resolves.toStrictEqual({ name: 'John' })
    await userCollection.delete('userId')
    await expect(
      db
        .collection('users')
        .doc('userId')
        .get()
        .then((snapshot) => snapshot.exists)
    ).resolves.toBeFalsy()
  })
})
