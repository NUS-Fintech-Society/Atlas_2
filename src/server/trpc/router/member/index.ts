import { router } from '~/server/trpc/trpc'
import { getMemberProfile, getMemberImage, getRoles, getAllUsers } from './read'
import { updateMemberImage, updateProfile } from './update'
import { deleteMemberImage } from './delete'
import { addMultipleUsers, createSingleUser } from './create'

export const memberRouter = router({
  addMultipleUsers,
  createSingleUser,
  deleteMemberImage,
  getAllUsers,
  getMemberImage,
  getMemberProfile,
  getRoles,
  updateMemberImage,
  updateProfile,
})
