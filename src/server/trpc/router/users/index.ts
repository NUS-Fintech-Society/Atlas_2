import { router } from '~/server/trpc/trpc'
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
import { getAllUsers } from './getAllUsers'
import { updateUserInfo } from './updateUserInfo'

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
  updateUserInfo
})
