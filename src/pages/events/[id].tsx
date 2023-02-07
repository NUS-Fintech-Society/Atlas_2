import { trpc } from '~/utils/trpc'
import { useRouter } from 'next/router'
import Image from 'next/image'

const EventPage = () => {
  const router = useRouter()
  const slug = router.query.id as string
  const { data } = trpc.event.getEvent.useQuery(slug)

  return (
    <h1>
      <Image alt="QR-Code" src={data || ''} height={100} width={100} />
    </h1>
  )
}

export default EventPage
