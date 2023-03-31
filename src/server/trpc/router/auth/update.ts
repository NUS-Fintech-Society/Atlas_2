import { publicProcedure } from '../../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { env } from '~/env/server.mjs'

export const changePassword = publicProcedure
    .input(z.object({userId: z.string(), password: z.string()}))
    .mutation(async ({ ctx, input}) => {
        try {
          const {userId,password} = input
          console.log(userId)
          console.log(password)
          const update = await ctx.prisma.user.update({
            where: { id: userId },
            data: { hashedPassword: password },
          })

        } catch (e) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: (e as Error).message,
            })
          }
    })  