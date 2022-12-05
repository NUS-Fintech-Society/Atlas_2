import { router } from '~/server/trpc/trpc'
import { getMemberProfile, getMemberImage } from './read'
import { updateMemberImage } from './update'
import { deleteMemberImage } from './delete'
import { addMultipleUsers } from './create'

export const memberRouter = router({
  addMultipleUsers,
  deleteMemberImage,
  getMemberImage,
  getMemberProfile,
  updateMemberImage,
})
