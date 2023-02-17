import { trpc } from '~/utils/trpc'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import LoadingScreen from '~/components/common/LoadingScreen'
import Link from 'next/link'
import Head from 'next/head'
import dayjs from 'dayjs'
import { type MouseEvent } from 'react'

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

const AttendancePage = ({
  name,
  date,
  departments,
}: {
  date: Date
  name: string
  departments: string[]
}) => {
  const start = dayjs(date).format('D MMMM YYYY')

  function submitAttendance(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
  }

  return (
    <>
      <Head>
        <title>Atlas | {name}</title>
      </Head>
      <body className="min-h-screen bg-[#F5F5F5]">
        <div className="relative z-50">
          <h1 className="text-center font-[Inter] text-5xl font-bold">
            {name}
          </h1>
          <h2 className="my-14 text-center font-[Inter] text-3xl font-medium">
            {start}
          </h2>
          <button onClick={submitAttendance}>Confirm Attendance</button>
        </div>
      </body>
    </>
  )
}

const EventPage = () => {
  const router = useRouter()
  useSession({ required: true })
  const slug = router.query.id
  const { data, isLoading } = trpc.event.getEvent.useQuery(
    typeof slug === 'string' ? slug : slug?.join()
  )
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
    return (
      <AttendancePage date={data.start as Date} name={data.name as string} />
    )
  }

  return <>{render()}</>
}

export default EventPage
