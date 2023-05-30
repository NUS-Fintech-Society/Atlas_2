import { router } from '~/server/trpc/trpc'
import { getMemberProfile, getMemberImage, getRoles, getAllUsers } from './read'
import { updateProfile, updateMemberContacts } from '../users/updateUserImage'
import { deleteUserImage } from '../users/deleteUserImage'
import { createSingleUser } from '../users/createSingleUser'
import { createManyUsers } from '../users/createManyUsers'

export const memberRouter = router({
  createManyUsers,
  createSingleUser,
  deleteUserImage,
  getAllUsers,
  getMemberImage,
  getMemberProfile,
  getRoles,
  updateProfile,
  updateMemberContacts,
})
