import { router } from '~/server/trpc/trpc'
import { getMemberProfile, getMemberImage, getRoles, getAllUsers } from './read'
import {
  updateProfile,
  updateMemberContacts,
} from '../users/updateUserImage'
import { deleteMemberImage } from './delete'
import { createSingleUser } from './createSingleUser'
import { createManyUsers } from '../users/createManyUsers'

export const memberRouter = router({
  createManyUsers,
  createSingleUser,
  deleteMemberImage,
  getAllUsers,
  getMemberImage,
  getMemberProfile,
  getRoles,
  updateProfile,
  updateMemberContacts,
})
