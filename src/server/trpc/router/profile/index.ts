import { router } from '~/server/trpc/trpc'
import changePassword from './password'

export const profileRouter = router({
  changePassword,
})
