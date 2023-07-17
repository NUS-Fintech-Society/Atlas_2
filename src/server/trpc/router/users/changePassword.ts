import { protectedProcedure } from '../../trpc'
import { TRPCError } from '@trpc/server'
import { adminAuth } from '~/server/db/admin_firebase'

export const changePassword = protectedProcedure.mutation(async ({ ctx }) => {
  try {
    const email = ctx.session.user.email
    return await adminAuth.generatePasswordResetLink(email as string)
  } catch (e) {
    // Throw an error if there is an issue with updating of password
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: (e as Error).message,
    })
  }
})
