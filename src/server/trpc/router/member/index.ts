import { router } from '~/server/trpc/trpc'
import { getMemberProfile, getMemberImage, getRoles, getAllUsers, getUsersfromDepartment } from './read'
import { updateMemberImage } from './update'
import { deleteMemberImage } from './delete'
import { addMultipleUsers, createSingleUser } from './create'

export const memberRouter = router({
  addMultipleUsers,
  createSingleUser,
  deleteMemberImage,
  getAllUsers,
  getUsersfromDepartment,
  getMemberImage,
  getMemberProfile,
  getRoles,
  updateMemberImage,
})
