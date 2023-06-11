import { trpc } from '../../utils/trpc'
import LoadingScreen from '../common/LoadingScreen'
import ProfileCard from './ProfileCard'
import ProfileContactInfo from './ProfileContactInfo'

const ProfileGrid = ({ studentId }: { studentId: string }) => {
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
          session={session}
        />
      </div>
      <div className="col-span-2 w-3/4">
        <ProfileContactInfo studentId={studentId} user={data} refetch={refetch} />
      </div>
    </div>
  )
}

export default ProfileGrid
