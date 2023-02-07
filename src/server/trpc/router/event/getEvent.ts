import { protectedProcedure } from '../../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { randomBytes } from 'crypto'
import { hash } from 'bcryptjs'
import dayjs from 'dayjs'
import nodemailer from 'nodemailer'
import { env } from '~/env/server.mjs'
import type { User } from '@prisma/client'

/**
 * @params Event ID from the event page
 */
const getEvent = protectedProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    if (ctx.session.level !== 'admin') {
    }
  })
