import { router } from '~/server/trpc/trpc'
import { getMemberProfile, getMemberImage } from './read'
import { updateMemberImage } from './update'
import { deleteMemberImage } from './delete'
import { addMultipleUsers, createSingleUser } from './create'

export const memberRouter = router({
  addMultipleUsers,
  createSingleUser,
  deleteMemberImage,
  getMemberImage,
  getMemberProfile,
  updateMemberImage,
})
