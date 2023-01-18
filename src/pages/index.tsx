import { useSession } from 'next-auth/react'
import LoadingScreen from '~/components/common/LoadingScreen'

export default function HomePage() {
  const { status } = useSession({ required: true })

  if (status === 'loading') {
    return <LoadingScreen />
  }

  return <>Dummy Login Page</>
}
