import { router } from '../trpc'
import { resetPassword } from './auth/post'
import {changePassword} from './auth/update'

export const authRouter = router({
  resetPassword,
  changePassword
})
