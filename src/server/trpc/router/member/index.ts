import { router } from '~/server/trpc/trpc'
import { getMemberProfile, getMemberImage, getRoles, getAllUsers } from './read'
import {
  updateMemberImage,
  updateProfile,
  updateMemberContacts,
} from './update'
import { deleteMemberImage } from './delete'
import {  createSingleUser } from './createSingleUser'
import { createMultipleUsers } from './createMultipleUsers'

export const memberRouter = router({
  createMultipleUsers,
  createSingleUser,
  deleteMemberImage,
  getAllUsers,
  getMemberImage,
  getMemberProfile,
  getRoles,
  updateMemberImage,
  updateProfile,
  updateMemberContacts,
})
