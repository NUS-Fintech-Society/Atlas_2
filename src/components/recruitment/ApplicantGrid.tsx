import { useContext } from 'react'
import {searchContext } from '~/context/recruitment/SearchProvider'
import { trpc } from '~/utils/trpc'
import ApplicantCard from './ApplicantCard'
import InfoPopup from '~/components/recruitment/InfoPopup'

const ApplicantGrid = () => {
  const { search } = useContext(searchContext)
  // const { filter } = useContext(filterContext)
  const { data } = trpc.recruitment.getAllApplicantsTopRoleByDept.useQuery()
  if (!data) return <></>

  const filteredData =
    search === ''
      ? data
      : data?.filter((applicant) => {
          return applicant.name.toLowerCase().includes(search.toLowerCase())
        })

  return (
    <>
      <div className="my-20 mx-20 grid grid-cols-1 place-items-center gap-y-10 lg:my-10 lg:grid-cols-3 ">
        {filteredData?.map((applicant) => {
          return <ApplicantCard applicant={applicant} key={applicant.id} />
        })}
      </div>
      {filteredData.length > 0 && <InfoPopup />}
    </>
  )
}

export default ApplicantGrid
