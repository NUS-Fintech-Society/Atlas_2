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
    <div className="flex flex-col items-center md:flex-row md:items-start md:justify-evenly">
      <div className="mb-5 w-3/4 max-w-lg rounded-3xl bg-[#01003D]">
        <ProfileCard
          name={data.name}
          dept={data.department}
          role={data.role}
          studentId={studentId}
        />
      </div>
      <div className="h-full w-3/4 max-w-lg justify-center md:max-w-xl">
        <ProfileContactInfo user={data} refetch={refetch} />
      </div>
    </div>
  )
}

export default ProfileGrid
