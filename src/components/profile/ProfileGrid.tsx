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
    trpc.user.getUserProfile.useQuery(studentId)

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!data || isError) {
    return <p className="text-3xl">Something is wrong</p>
  }

  return (
    <div className="m-10 grid grid-cols-1 grid-rows-3 place-items-center gap-y-6 md:grid-cols-3">
      <div className="row-span-3 h-full w-3/4 max-w-md bg-[#01003D] md:place-self-end">
        <ProfileCard
          name={data.name}
          dept={data.department}
          role={data.role}
          studentId={studentId}
        />
      </div>
      <div className="col-span-2 w-3/4">
        <ProfileContactInfo studentId={studentId} {...data} refetch={refetch} />
      </div>
      <div className="col-span-2 row-span-2 mb-10 w-3/4">
        <ProfileInfo batch={data.batch as string} />
      </div>
    </div>
  )
}

export default ProfileGrid
