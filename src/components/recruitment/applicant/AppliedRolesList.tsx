import { AppliedRole } from '~/server/db/models/AppliedRole'
import { trpc } from '~/utils/trpc'
import AppliedRoleListItem from './AppliedRoleListItem'

const AppliedRolesList = ({ applicantId }: { applicantId: string }) => {
  const { data: roles, refetch } =
    trpc.recruitment.getAppliedRolesByApplicant.useQuery(applicantId)
  return (
    <div className="mx-20 grid grid-cols-1 gap-y-5 ">
      {roles?.map((role) => {
        return <AppliedRoleListItem appliedRole={role} key={role.id} />
      })}
    </div>
  )
}

export default AppliedRolesList
