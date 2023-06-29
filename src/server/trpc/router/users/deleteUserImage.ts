import { protectedProcedure } from '../../trpc'
import { Timestamp } from 'firebase/firestore'
import logCollection from '~/server/db/collections/LogCollection'
import userCollection from '~/server/db/collections/UserCollection'

export const deleteUserImage = protectedProcedure.mutation(async ({ ctx }) => {
  try {
    return await userCollection.update(ctx.session.user.id, {
      image: '',
    })
  } catch (e) {
    await logCollection.add({
      title: `Error deleting image for ${ctx.session.user.name}`,
      description: (e as Error).message,
      level: 'WARNING',
      createdAt: Timestamp.fromDate(new Date()),
    })
  }
})
