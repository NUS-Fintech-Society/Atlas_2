import { router } from '../../trpc'
import { resetPassword } from './post'

export const authRouter = router({
  resetPassword,
})
