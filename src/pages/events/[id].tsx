import Container from '~/components/auth/Container'
import { Button } from '~/components/utilities'
import Head from 'next/head'
import withAuth from '~/utils/withAuth'
import { trpc } from '~/utils/trpc'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import LoadingScreen from '~/components/common/LoadingScreen'
import { useEffect, useState } from 'react'

const ConfirmAttendance = () => {
  const route = useRouter()

  const [eventId, setEventId] = useState('')
  useEffect(() => {
    setEventId(route.query.id as string)
  }, [route.query.id])

  const { data, isLoading } = trpc.event.getEvent.useQuery(eventId)
  dayjs.extend(LocalizedFormat)

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <>
      <Head>
        <title>Atlas | {isLoading ? 'Loading...' : 'Attendance'}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="The confirm attendance page for Atlas"
        />
      </Head>
      <Container>
        <div className="flex w-full flex-col items-start">
          {data ? (
            <>
              <h1 className="mb-2 self-center text-center text-5xl font-medium">
                {data.name}
              </h1>
              <h1 className="mb-2 self-center text-center text-3xl font-medium">
                {dayjs(data.startDate).format('lll')}
              </h1>
              {data.isAttendanceRequired ? (
                <Button
                  className="mt-2 self-center bg-orange-500 text-center"
                  type="button"
                >
                  Confirm Attendance
                </Button>
              ) : (
                'Your attendance is not required.'
              )}
            </>
          ) : (
            <h1 className="mb-2 self-center text-center text-3xl font-medium">
              No event found
            </h1>
          )}
        </div>
      </Container>
    </>
  )
}

export default withAuth(ConfirmAttendance)
