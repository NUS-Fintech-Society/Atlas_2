import { router } from '../trpc'
import { resetPassword } from './auth/post'

export const authRouter = router({
  resetPassword
})
