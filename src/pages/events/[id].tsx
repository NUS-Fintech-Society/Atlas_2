import { trpc } from '~/utils/trpc'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import LoadingScreen from '~/components/common/LoadingScreen'
import Link from 'next/link'
import Head from 'next/head'

const NoImagePage = () => {
  return (
    <>
      <Head>
        <title>Atlas | No Event Found</title>
      </Head>
      <body>
        <div className="w-full">
          {/* Warning Symbol */}
          <Image
            alt="Warning Triangle"
            className="mx-auto"
            src="/events/warning-triangle.svg"
            width={400}
            height={400}
          />

          <h1 className="text-center text-4xl font-bold">No Event Found!</h1>
          <Link href="/">
            <div className="bg-green-50">Return To Home Page</div>
          </Link>
        </div>
      </body>
    </>
  )
}

const AttendancePage = ({ qrcode, name }: { qrcode: string; name: string }) => {
  return (
    <>
      <Head>
        <title>Atlas | {name}</title>
      </Head>
      <body>
        <div className="my-auto w-full">
          <h1 className="text-center text-4xl font-bold">{name}</h1>
          <Image
            alt="QR-Code"
            className="mx-auto"
            src={qrcode || ''}
            height={400}
            width={400}
          />
        </div>
      </body>
    </>
  )
}

const EventPage = () => {
  const router = useRouter()
  useSession({ required: true })
  const slug = router.query.id as string
  const { data, isLoading } = trpc.event.getEvent.useQuery(slug)
  const render = () => {
    if (isLoading) {
      return (
        <>
          <Head>
            <title>Atlas | Loading...</title>
          </Head>
          <LoadingScreen />
        </>
      )
    }
    if (!data?.qrcode) {
      return <NoImagePage />
    }
    return <AttendancePage name={data.name as string} qrcode={data.qrcode} />
  }

  return <>{render()}</>
}

export default EventPage
