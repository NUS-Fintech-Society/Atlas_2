import { protectedProcedure } from '~/server/trpc/trpc'
import { TRPCError } from '@trpc/server'

export const getAllAttendance = protectedProcedure.query(async ({ ctx }) => {
  try {
    const attendance = await ctx.prisma
      .$queryRaw`SELECT e."name", COUNT(*) AS total_users, e."startDate", e."endDate", COALESCE((SELECT COUNT(*) FROM "_attendanceToUser" au JOIN "Attendance" a ON au."A"=a."id" AND a."eventId" = e."id" GROUP BY a."eventId"), 0) AS total_attendees
      FROM "_EventToUser" eu
      JOIN "Event" e ON eu."A" = e."id"
      GROUP BY e."id";`
    return attendance
  } catch (e) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: (e as Error).message,
    })
  }
})
