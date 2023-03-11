import { protectedProcedure } from '../../trpc'
import { z } from 'zod'

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
      email: z.string(),
      roles: z.string(),
      department: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    console.log("Wen Jun", input);
    const user = await ctx.prisma.user.update({
      where: {
        id: input.id.trim(),
      },
      data: {
        department: input.department,
        id: input.id,
        name: input.name,
        roles: input.roles,
      },
    })
    return user
  })