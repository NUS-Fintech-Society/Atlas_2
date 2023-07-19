import { db } from './firebase'

jest.mock('../src/server/db/admin_firebase', () => {
  return { db }
})
