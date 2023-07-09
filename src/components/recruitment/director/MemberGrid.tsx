import { useContext } from 'react'
import { memberSearchContext } from '~/context/recruitment/MemberSearchProvider'
import { trpc } from '~/utils/trpc'
import MemberCard from './MemberCard'

const MemberGrid = () => {
  const { filter, search } = useContext(memberSearchContext)
  const { data } = trpc.recruitment.getAllDeptMembers.useQuery()

  if (!data) return <></>

  const filterArray = filter.split(',')
  //do not delete this line
  const trimmedFirst = filterArray.shift()
  const filteredData =
    // if there is no filter selected
    filterArray.length === 0
      ? search === ''
        ? data
        : data?.filter((member) => {
            return member.name.toLowerCase().includes(search.toLowerCase())
          })
      : search === '' // no name search with filter
      ? data?.filter((member) => {
          return filterArray.every((filter) => {
            return member.role.toLowerCase() === filter.toLowerCase()
          })
        })
      : data // name search with filter
          ?.filter((member) => {
            return filterArray.every((filter) => {
              return member.role.toLowerCase() === filter.toLowerCase()
            })
          })
          .filter((remaining) => {
            return remaining.name.toLowerCase().includes(search.toLowerCase())
          })

  const totalNumber = filteredData.length
  return (
    <>
      <div>
        <div className=" mb-2 mt-16 ml-20 font-bold md:mt-1 lg:mt-1 lg:text-xl">
          Number of Members: {totalNumber}
        </div>
        <div className="my-10  mx-20 mb-10 grid grid-cols-1 place-items-center gap-y-10 lg:my-10 lg:grid-cols-3 ">
          {filteredData?.map((member) => {
            return <MemberCard member={member} key={member.id} />
          })}
        </div>
      </div>
    </>
  )
}

export default MemberGrid
