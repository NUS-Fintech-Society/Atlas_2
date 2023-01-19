import { useSession } from 'next-auth/react'
import LoadingScreen from '~/components/common/LoadingScreen'

const HomePage = () => {
  const { status } = useSession({ required: true })

  return status === 'loading' ? <LoadingScreen /> : <div>Home Page</div>
}

export default HomePage
