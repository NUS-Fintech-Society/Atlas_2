import { trpc } from '~/utils/trpc'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import LoadingScreen from '~/components/common/LoadingScreen'
import Button from '~/components/utilities/Button'
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

const AdminAttendancePage = ({
  name,
  date,
  departments,
  hasStarted,
  id,
  qrcode,
}: {
  date: Date
  name: string
  departments: string[]
  hasStarted: boolean
  id: string
  qrcode: string
}) => {
  const start = dayjs(date).format('D MMMM YYYY')
  const involvedDepartments = departments.map((department, index) => {
    return <p key={index}>{department}</p>
  })
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
      <body className="min-h-screen bg-[#F5F5F5]">
        <div className="relative z-50">
          <h1 className="text-center font-[Inter] text-5xl font-bold">
            {name}
          </h1>
          <h2 className="my-14 text-center font-[Inter] text-3xl font-medium">
            {start}
          </h2>
          <div className="flexjustify-center">
            <Image alt="qrcode" height={300} src={qrcode} width={300} />
          </div>
          {hasStarted ? (
            involvedDepartments
          ) : (
            <Button onClick={startEvent} isLoading={isLoading} type="button">
              Start Event
            </Button>
          )}
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
      <AdminAttendancePage
        date={data.start as Date}
        departments={data.departments as string[]}
        id={slug}
        hasStarted={data.hasStarted as boolean}
        name={data.name as string}
        qrcode={data.qrcode}
      />
    )
  }

  return <>{render()}</>
}

export default EventPage
