import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
// import { TRPCError } from '@trpc/server'

export const resetPasswordRouter = protectedProcedure.input(z.string()).mutation(()=>{
    return "Hi"
})