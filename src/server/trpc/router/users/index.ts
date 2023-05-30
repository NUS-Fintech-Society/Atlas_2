import { router } from '~/server/trpc/trpc'
import { protectedProcedure } from '~/server/trpc/trpc'
import { TRPCError } from '@trpc/server'
import { resetPassword } from './resetPassword'
import { changePassword } from './changePassword'
import { getAllUsersForTable } from './getAllUsersForTable'
import { getUserProfile } from './getUserProfile'
import { createManyUsers } from './createManyUsers'
import { updateUserImage } from './updateUserImage'
import { getUserImage } from './getUserImage'
import { createSingleUser } from './createSingleUser'
import { deleteUserImage } from './deleteUserImage'
import { updateUserProfile } from './updateUserProfile'
import { updateUserContacts } from './updateUserContacts'

const getAllUsers = protectedProcedure.query(async ({ ctx }) => {
  try {
    const users = await ctx.prisma.user.findMany({
      select: {
        department: true,
        email: true,
        id: true,
        name: true,
        role: true,
      },
    })

    return users
  } catch (e) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: (e as Error).message,
    })
  }
})

export const userRouter = router({
  changePassword,
  createManyUsers,
  createSingleUser,
  deleteUserImage,
  getAllUsers,
  getAllUsersForTable,
  getUserImage,
  getUserProfile,
  resetPassword,
  updateUserContacts,
  updateUserImage,
  updateUserProfile,
})
