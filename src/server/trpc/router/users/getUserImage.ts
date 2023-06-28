import { protectedProcedure } from '../../trpc'
import userCollection from '~/server/db/collections/UserCollection'

export const getUserImage = protectedProcedure.query(async ({ ctx }) => {
  return (await userCollection.getById(ctx.session.user.id)).image || ''
})
