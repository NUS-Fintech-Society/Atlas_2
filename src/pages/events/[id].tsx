import { trpc } from '~/utils/trpc'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import LoadingScreen from '~/components/common/LoadingScreen'

const EventPage = () => {
  const { data: session, status } = useSession({ required: true })
  const router = useRouter()
  const getId = () => {
    const { pid } = router.query
    if (pid === undefined) {
      return ''
    }

    if (typeof pid === 'string') {
      return pid
    }

    return pid.join('')
  }
  const { data, error, isLoading } = trpc.event.getEvent.useQuery(getId())

  if (status === 'loading') {
    return <LoadingScreen />
  }

  return <h1>Hiß</h1>
}

export default EventPage
