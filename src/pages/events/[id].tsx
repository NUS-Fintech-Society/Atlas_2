import { trpc } from '~/utils/trpc'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import LoadingScreen from '~/components/common/LoadingScreen'
import Button from '~/components/utilities/Button'
import Link from 'next/link'
import Head from 'next/head'
import { useEffect, useState, type MouseEvent } from 'react'

const NoImagePage = () => {
  return (
    <>
      <Head>
        <title>Atlas | No Event Found</title>
      </Head>
      <div>
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
          <div className="mt-5 flex justify-center">
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

const AdminAttendancePage = ({
  name,
  date,
  hasStarted,
  id,
  qrcode,
}: {
  date: string
  name: string
  hasStarted: boolean
  id: string
  qrcode: string
}) => {
  const { mutateAsync, isLoading } = trpc.event.startEvent.useMutation()
  async function startEvent(
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) {
    e.preventDefault()
    await mutateAsync(id)
  }

  return (
    <>
      <Head>
        <title>Atlas | {name}</title>
      </Head>
      <div className="min-h-screen bg-[#F5F5F5]">
        <div className="relative z-50">
          <h1 className="text-center font-[Inter] text-5xl font-bold">
            {name}
          </h1>
          <h2 className="my-14 text-center font-[Inter] text-3xl font-medium">
            {date}
          </h2>
          <div className="flex justify-center">
            <Image alt="qrcode" height={300} src={qrcode} width={300} />
          </div>
          {hasStarted && (
            <Button onClick={startEvent} isLoading={isLoading} type="button">
              Start Event
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

const EventPage = () => {
  const router = useRouter()
  useSession({ required: true })
  const slug = router.query.id
  const [hasError, setHasError] = useState(false)
  const { data, isLoading, isError } = trpc.event.getEvent.useQuery(
    typeof slug === 'string' ? slug : slug?.join(),
    { enabled: !hasError }
  )

  // Disables the refetch upon an error
  useEffect(() => {
    setHasError(true)
  }, [isError])

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
    if (hasError || !data) {
      return <NoImagePage />
    }
    return (
      <AdminAttendancePage
        date={data.start}
        id={data.id as string}
        hasStarted={data.hasStarted as boolean}
        name={data.name as string}
        qrcode={data.qrcode as string}
      />
    )
  }

  return <>{render()}</>
}

export default EventPage
