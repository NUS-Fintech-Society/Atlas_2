import { db } from './firebase'

jest.mock('../src/server/db/admin_firebase', () => {
  return { db, adminAuth: { createUser: jest.fn() } }
})

jest.mock("../src/server/trpc/router/member/helper", () => ({
  sendMultipleEmails: jest.fn()
}))