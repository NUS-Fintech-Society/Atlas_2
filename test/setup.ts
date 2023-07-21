import { db } from './firebase'

jest.mock('../src/server/db/admin_firebase', () => {
  return { db, adminAuth: { createUser: jest.fn() } }
})

/// NOTE: We cannot create and mock a class for the sendEmail. The best
/// we can do is to use functional programming and create a mock function
jest.mock('~/server/trpc/router/controllers/email/email', () => {
  return {
    sendEmail: jest.fn(),
  }
})

jest.mock("~/server/trpc/router/controllers/email/templates/new_user_creation", () => {
  return {
    sendNewMemberEmail: jest.fn()
  }
})

jest.mock('~/server/trpc/router/controllers/email/templates/new_applicant_creation', () => {
  return {
    sendNewApplicantEmail: jest.fn()
  }
})

jest.setTimeout(10000)
