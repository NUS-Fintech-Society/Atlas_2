import { Button } from '~/components/utilities'
import { type BaseProps } from '~/utils/withAuth'
import { trpc } from '~/utils/trpc'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { type MouseEventHandler } from 'react'
import Container from '~/components/auth/Container'
import Head from 'next/head'
import withAuth from '~/utils/withAuth'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import LoadingScreen from '~/components/common/LoadingScreen'
import TopNavbar from '~/components/common/TopNavbar'

interface UserActionRequiredProp {
  hasUserMarkedAttendance: boolean
  isAttendanceRequired: boolean
  loading: boolean
  markAttendance: MouseEventHandler<HTMLButtonElement> | undefined
}

const UserActionRequired: React.FC<UserActionRequiredProp> = ({
  isAttendanceRequired,
  hasUserMarkedAttendance,
  loading,
  markAttendance,
}) => {
  if (!isAttendanceRequired) {
    return (
      <h1 className="mb-2 self-center text-center text-xl font-medium">
        Your attendance has been recorded
      </h1>
    )
  } else if (hasUserMarkedAttendance) {
    return (
      <h1 className="mb-2 self-center text-center text-xl font-medium">
        Your attendance has been recorded. No further action is required.
      </h1>
    )
  }
  return (
    <Button
      isLoading={loading}
      onClick={markAttendance}
      className="mt-2 self-center bg-orange-500 text-center"
      type="button"
    >
      Confirm Attendance
    </Button>
  )
}

const ConfirmAttendance: React.FC<BaseProps> = ({ session }) => {
  const route = useRouter()
  const eventId = route.query.id as string
  const { data, isLoading, refetch } =
    trpc.attendance.getEventForUser.useQuery(eventId)
  const { mutateAsync, isLoading: loading } =
    trpc.attendance.markAttendance.useMutation()
  dayjs.extend(LocalizedFormat)

  const markAttendance = useCallback(async () => {
    await mutateAsync(eventId)
    await refetch()
  }, [mutateAsync, eventId, refetch])

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
              <UserActionRequired
                isAttendanceRequired={data.isAttendanceRequired}
                hasUserMarkedAttendance={data.hasUserMarkedAttendance}
                loading={loading}
                markAttendance={markAttendance}
              />
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
