import { trpc } from '../../utils/trpc'
import type { Session } from 'next-auth'
import LoadingScreen from '../common/LoadingScreen'
import ProfileCard from './ProfileCard'
import ProfileInfo from './ProfileInfo'
import ProfileContactInfo from './ProfileContactInfo'

const ProfileGrid = ({
  studentId,
  session,
}: {
  studentId: string
  session: Session
}) => {
  const { data, isError, isLoading, refetch } =
    trpc.member.getMemberProfile.useQuery(studentId)

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!data || !data.user || isError) {
    return <p className="text-3xl">Something is wrong</p>
  }

  return (
    <div className="m-10 grid grid-cols-1 grid-rows-3 place-items-center gap-y-6 md:grid-cols-3">
      <div className="row-span-3 h-full w-3/4 max-w-md bg-[#01003D] md:place-self-end">
        <ProfileCard
          refetch={refetch}
          name={data.user.name}
          dept={data.user.department}
          role={data.user.roles}
          studentId={studentId}
          session={session}
        />
      </div>
      <div className="col-span-2 w-3/4">
        <ProfileContactInfo
          studentId={studentId}
          {...data.user}
          refetch={refetch}
        />
      </div>
      <div className="col-span-2 row-span-2 mb-10 w-3/4">
        <ProfileInfo {...data.user} />
      </div>
    </div>
  )
}

export default ProfileGrid
