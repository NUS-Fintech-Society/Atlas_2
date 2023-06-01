import { protectedProcedure } from '../../trpc'
import userCollection from '~/server/db/collections/UserCollection'

export const getAllUsers = protectedProcedure.query(async () => {
  const users = await userCollection.queries([])
  return users.map((user) => {
    return {
      department: user.department,
      email: user.email,
      id: user.id,
      name: user.name,
      role: user.role,
    }
  })
})
