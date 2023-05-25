import type { ApplicantWithAppliedRole } from '~/types/model'
import ApplicantCard from './ApplicantCard'

const ApplicantGrid = ({
  data,
}: {
  data: ApplicantWithAppliedRole[] | undefined
}) => {
  return (
    <div className="my-20 mx-20 grid grid-cols-1 place-items-center gap-y-10 lg:my-10 lg:grid-cols-3 ">
      {data?.map((applicant) => {
        return <ApplicantCard applicant={applicant} key={applicant.id} />
      })}
    </div>
  )
}

export default ApplicantGrid
