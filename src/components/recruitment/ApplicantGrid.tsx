import { useContext } from 'react'
import {searchContext } from '~/context/recruitment/SearchProvider'
import { trpc } from '~/utils/trpc'
import ApplicantCard from './ApplicantCard'
import InfoPopup from '~/components/recruitment/InfoPopup'
import applicants from '~/pages/recruitment/applicants'
import { Button, VStack } from '@chakra-ui/react'

const ApplicantGrid = () => {
  const { filter, search } = useContext(searchContext)

  const { data } = trpc.recruitment.getAllApplicantsTopRoleByDept.useQuery()
  if (!data) return <></>

  // const filteredData =
  //   search === ''
  //     ? data
  //     : data?.filter((applicant) => {
  //         return applicant.name.toLowerCase().includes(search.toLowerCase())
  //       })

  const filteredData =
        filter === ''
          ? (search ==='' ? data : 
          data?.filter((applicant) => {
            return applicant.name.toLowerCase().includes(search.toLowerCase())
          })) 
          :  
          (search === '' ?        
          data?.filter((applicant) => {
              return (applicant.appliedRoles.some((role) => (role.role.toLowerCase() === filter.toLowerCase())) || 
              applicant.appliedRoles.some((role) =>role.status.toLowerCase() === filter.toLowerCase()) ||
              applicant.appliedRoles.some((role) => role.flag.toString() === filter))
            }) :
            data?.filter((applicant) => {
              return (applicant.appliedRoles.some((role) => (role.role.toLowerCase() === filter.toLowerCase())) || 
              applicant.appliedRoles.some((role) =>role.status.toLowerCase() === filter.toLowerCase()) ||
              applicant.appliedRoles.some((role) => role.flag.toString() === filter))
            }).filter((remaining) => {
              return remaining.name.toLowerCase().includes(search.toLowerCase())
            })
            
          )

  const totalNumber = filteredData.length


  return (
    <>
   <div>
      <div className='mb-2 mt-20 lg:mt-1 md:mt-1 font-bold ml-20 lg:text-xl'>
      Number of Applicants: {totalNumber}
      </div>
      <div className="mb-10  my-10 mx-20 grid grid-cols-1 place-items-center gap-y-10 lg:my-10 lg:grid-cols-3 ">
      
        {filteredData?.map((applicant, index) => {
          
          return <ApplicantCard applicant={applicant} key={applicant.id} />
           
        })}
      </div>
      </div>
      
      
      {filteredData.length > 0 && <InfoPopup />}
   
     
    </>
  )
}

export default ApplicantGrid
