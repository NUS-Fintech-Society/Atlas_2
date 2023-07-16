import { useContext, useEffect } from 'react'
import { applicantSearchContext } from '~/context/recruitment/ApplicantSearchProvider'
import { trpc } from '~/utils/trpc'
import ApplicantCard from './ApplicantCard'
import InfoPopup from '~/components/recruitment/InfoPopup'

const ApplicantGrid = () => {
  const { filter, search } = useContext(applicantSearchContext)
  const { data, refetch: refetchAllApplicantsTopRoleByDept } =
    trpc.recruitment.getAllApplicantsTopRoleByDept.useQuery()

  useEffect(() => {
    refetchAllApplicantsTopRoleByDept()
  }, [filter, refetchAllApplicantsTopRoleByDept])

  if (!data) return <></>

  const filterArray = filter.split(',')
  //do not delete this line
  const trimmedFirst = filterArray.shift()
  const filteredData =
    filterArray.length === 0
      ? search === ''
        ? data
        : data?.filter((applicant) => {
            return applicant.name.toLowerCase().includes(search.toLowerCase())
          })
      : search === ''
      ? data?.filter((applicant) => {
          return filterArray.every((filter) => {
            return (
              applicant.appliedRoles.some(
                (role) => role?.role.toLowerCase() === filter.toLowerCase()
              ) ||
              applicant.appliedRoles.some(
                (role) => role?.status.toLowerCase() === filter.toLowerCase()
              ) ||
              applicant.appliedRoles.some(
                (role) => role?.flag.toString() === filter
              )
            )
          })
        })
      : data
          ?.filter((applicant) => {
            return filterArray.every((filter) => {
              return (
                applicant.appliedRoles.some(
                  (role) => role?.role.toLowerCase() === filter.toLowerCase()
                ) ||
                applicant.appliedRoles.some(
                  (role) => role?.status.toLowerCase() === filter.toLowerCase()
                ) ||
                applicant.appliedRoles.some(
                  (role) => role?.flag.toString() === filter
                )
              )
            })
          })
          .filter((remaining) => {
            return remaining.name.toLowerCase().includes(search.toLowerCase())
          })

  const totalNumber = filteredData.length

  return (
    <>
      <div>
        <div className="mt-20 text-center text-xl font-bold lg:mt-1 lg:ml-20 lg:text-left ">
          {totalNumber == 1
            ? `${totalNumber} Applicant`
            : `${totalNumber} Applicants`}
        </div>
        <div className="mx-20 mt-5 mb-10 grid grid-cols-1 place-items-center gap-y-10 lg:my-10 lg:grid-cols-3 ">
          {filteredData?.map((applicant) => {
            return <ApplicantCard applicant={applicant} key={applicant.id} />
          })}
        </div>
      </div>

      {filteredData.length > 0 && (
        <InfoPopup
          iconBgColor="#02005A"
          iconColor="white"
          className="bottom-50 absolute right-10"
          popoverPlacement="left"
        />
      )}
    </>
  )
}

export default ApplicantGrid
