import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { auth } from '~/server/db/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

import { env } from '../../../env/server.mjs'
import type { User } from '~/server/db/models/User'

import userCollection from '~/server/db/collections/UserCollection'

export const authOptions: NextAuthOptions = {
  callbacks: {
    // We need this to ensure that the client knows when to log in
    async session({ session, token }) {
      if (session && session.user && token) {
        session.user.id = token.sub || ''
        session.user.image = token.picture
        session.user.department = token.department as string
      }

      if (token) {
        session.isAdmin = token.isAdmin as boolean
        session.isApplicant = token.isApplicant as boolean
      }
      return session
    },

    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = (user as User).isAdmin as boolean
        token.department = (user as User).department as string
        token.isApplicant = (user as any).isApplicant
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

          const authenticatedUser = await signInWithEmailAndPassword(auth, email, password)

          const uid = authenticatedUser.user.uid

          const user = await userCollection.getById(uid)

          return {
            id: uid,
            department: user.department as string,
            name: authenticatedUser.user.displayName,
            email: authenticatedUser.user.email,
            isApplicant: user.role === 'Applicant',
            isAdmin: user.isAdmin,
            image: user.image || '',
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
