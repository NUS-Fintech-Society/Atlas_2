import { type DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    level?: string
    user?: {
      level?: string
      id: string
    } & DefaultSession['user']
  }
}
