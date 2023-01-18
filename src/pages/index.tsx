import { useSession, signIn } from 'next-auth/react'

export default function HomePage() {
  useSession({ required: true })

  return <>Dummy Login Page</>
}
