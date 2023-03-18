import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const updateMemberImage = protectedProcedure
  .input(
    z.object({
      image: z.string(),
      studentId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.update({
      where: {
        id: input.studentId,
      },
      data: {
        image: input.image,
      },
    })
    return user
  })

export const updateProfile = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      name: z.string(),
      roles: z.string(),
      department: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.user.update({
      where: { id: input.id },
      data: {
        department: input.department,
        name: input.name,
        roles: input.roles,
      },
    })
  })

export const updateMemberContacts = protectedProcedure
  .input(
    z.object({
      studentId: z.string(),
      telegram: z.string(),
      discord: z.string(),
      personal_email: z.string(),
      email: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const user = await ctx.prisma.user.update({
        where: {
          id: input.studentId,
        },
        data: {
          telegram: input.telegram,
          discord: input.discord,
          personal_email: input.personal_email,
          email: input.email,
        },
      })
      return user
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (e as Error).message,
      })
    }
  })
