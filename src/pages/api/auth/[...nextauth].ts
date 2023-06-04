import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'

import { env } from '../../../env/server.mjs'
import type { User } from '~/server/db/models/User'

import userCollection from '~/server/db/collections/UserCollection'
import { where } from 'firebase/firestore'

export const authOptions: NextAuthOptions = {
  callbacks: {
    // We need this to ensure that the client knows when to log in
    async session({ session, token }) {
      if (session && session.user && token) {
        session.user.id = token.sub || ''
        session.user.image = token.picture
      }

      if (token) {
        session.isAdmin = token.isAdmin as boolean
      }
      return session
    },

    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = (user as User).isAdmin as boolean
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
          const users = await userCollection.queries([
            where('email', '==', email),
          ])

          if (users.length === 0) {
            throw Error('Invalid email or password')
          }

          const user = users[0] as User
          const isSuccess = await compare(password, user.hashedPassword)
          if (!isSuccess) {
            throw Error('Incorrect password')
          }

          // The user object is passed to the session callback in session.data.user
          return {
            id: user.id as string,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
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
    signOut: '/auth/signout',
  },
}

export default NextAuth(authOptions)
