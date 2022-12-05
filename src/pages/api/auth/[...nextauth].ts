import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'

import { prisma } from '../../../server/db/client'
import { env } from '../../../env/server.mjs'
import type { User } from '@prisma/client'

export const authOptions: NextAuthOptions = {
  callbacks: {
    // We need this to ensure that the client knows when to log in
    async session({ session, token }) {
      if (session && session.user && token) {
        session.user.id = token.sub || ''
        session.user.image = token.picture
      }

      if (token) {
        session.level = token.level as string
      }
      return session
    },

    async jwt({ token, user }) {
      if (user) {
        token.level = (user as User).level
        token.picture = user.image
      }
      return token
    },
  },

  providers: [
    CredentialsProvider({
      name: 'NUS Email',
      credentials: {},
      authorize: async (credential) => {
        try {
          // Step 1: Destructure and get the email and password
          const { email, password } = credential as {
            email: string
            password: string
          }

          // Step 2: If no credentials are provided, throw an error
          if (!credential || !email || !password) {
            throw new Error('No email or password provided')
          }

          // Step 3: Get the user by the email
          const adapterUser = await prisma.user.findUnique({
            where: { email: email.concat('@u.nus.edu') },
          })
          if (!adapterUser) throw new Error('Invalid NUS email or password')

          // Step 4: Type cast it to the type of User
          const account = adapterUser as User

          // If the account is found, challenge the hashPassword with the password
          const success = await compare(password, account.hashedPassword)
          if (!success) throw new Error('Wrong password')

          // The user object is passed to the session callback in session.data.user
          return {
            id: account.id,
            name: account.name,
            email: account.email,
            level: account.level,
            image: account.image || '',
          }
        } catch (e) {
          throw new Error((e as Error).message)
        }
      },
    }),
  ],

  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: '/auth/login',
  },
}

export default NextAuth(authOptions)
