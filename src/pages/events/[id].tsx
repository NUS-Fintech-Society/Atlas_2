import { trpc } from '~/utils/trpc'
import { useRouter } from 'next/router'

const EventPage = () => {
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
  return <h1>Hiß</h1>
}

export default EventPage
