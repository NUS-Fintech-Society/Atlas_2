import { protectedProcedure } from '~/server/trpc/trpc'
import { TRPCError } from '@trpc/server'

export default protectedProcedure.query(async ({ ctx }) => {
  try {
    const announcements = await ctx.prisma.announcement.findMany({
      include: {
        created_by: {
          select: { name: true },
        },
      },
    })

    return announcements
  } catch (e) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: (e as Error).message,
    })
  }
})
