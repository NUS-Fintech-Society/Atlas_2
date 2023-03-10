import { trpc } from '~/utils/trpc'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import LoadingScreen from '~/components/common/LoadingScreen'
import Image from 'next/image'
import { useState } from 'react'

const EventPage = () => {
  const { data: session, status } = useSession({ required: true })
  const [shouldRefetch, setShouldRefetch] = useState(true)
  const router = useRouter()

  const { data, error, isLoading } = trpc.event.getEvent.useQuery(
    router.query.id as string,
    {
      enabled: shouldRefetch,
      onError: () => {
        setShouldRefetch(false)
      },
    }
  )

  if (isLoading || status === 'loading') {
    return <LoadingScreen />
  }

  console.log('The data is ', data)
  if (error) {
    return <h1>No QR code</h1>
  }

  return <h1>Hiß</h1>
}

export default EventPage
