import { trpc } from '~/utils/trpc'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import LoadingScreen from '~/components/common/LoadingScreen'

const NoImagePage = () => {
  return <body>No event found</body>
}

const EventPage = () => {
  const router = useRouter()
  useSession({ required: true })
  const slug = router.query.id as string
  const { data, isLoading } = trpc.event.getEvent.useQuery(slug)
  const render = () => {
    if (isLoading) {
      return <LoadingScreen />
    }
    if (!data) {
      return <NoImagePage />
    }
    return <Image alt="QR-Code" src={data || ''} height={100} width={100} />
  }

  return <h1>{render()}</h1>
}

export default EventPage
