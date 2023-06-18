import React, { useContext, useState } from 'react'
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { searchContext } from '~/context/recruitment/SearchProvider'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useSession } from 'next-auth/react'

const SearchBar = () => {
  const roles = [
    {
      department: 'Software Development',
      role: 'Software Engineer',
    },
    {
      department: 'Software Development',
      role: 'Technical Lead',
    },
    {
      department: 'Software Development',
      role: 'UI/UX Designer',
    },
    {
      department: 'Software Development',
      role: 'Head of Design',
    },
    {
      department: 'Software Development',
      role: 'Co-Director',
    },
    {
      department: 'Blockchain',
      role: 'Co-Director',
    },
    {
      department: 'Blockchain',
      role: 'Core Developer',
    },
    {
      department: 'Blockchain',
      role: 'Community Manager',
    },
    {
      department: 'Blockchain',
      role: 'Developer',
    },
    {
      department: 'Blockchain',
      role: 'Lead Developer',
    },
    {
      department: 'Blockchain',
      role: 'Research Analyst',
    },
    {
      department: 'Blockchain',
      role: 'Research Community Developer',
    },
    {
      department: 'Machine Learning',
      role: 'Quant Tech Analyst',
    },
    ,
    {
      department: 'Machine Learning',
      role: 'Quant Tech Lead',
    },
    {
      department: 'Machine Learning',
      role: 'Quant wing head',
    },
    {
      department: 'Machine Learning',
      role: 'Project Tech Analyst',
    },
    {
      department: 'Machine Learning',
      role: 'Project Tech Lead',
    },
    {
      department: 'Machine Learning',
      role: 'Tech Analyst/Trainee',
    },
    {
      department: 'Machine Learning',
      role: 'Training Head',
    },
    {
      department: 'Internal Affairs',
      role: 'Co-Director',
    },
    {
      department: 'Internal Affairs',
      role: 'Community Development Executive',
    },
    {
      department: 'Internal Affairs',
      role: 'Community Development Lead',
    },
    {
      department: 'Internal Affairs',
      role: 'Finance Executive',
    },
    {
      department: 'Internal Affairs',
      role: 'Finance Lead',
    },
    {
      department: 'Internal Affairs',
      role: 'Project Manager Executive',
    },
    {
      department: 'Internal Affairs',
      role: 'Product Manager',
    },
    {
      department: 'Internal Affairs',
      role: 'Talent Management Executive',
    },
    {
      department: 'Internal Affairs',
      role: 'Talent Management Lead',
    },
    {
      department: 'External Relations',
      role: 'Partnerships Executive',
    },
    {
      department: 'External Relations',
      role: 'Director',
    },
    {
      department: 'External Relations',
      role: 'Marketing Executive',
    },
    {
      department: 'External Relations',
      role: 'Marketing Lead',
    },
    {
      department: 'External Relations',
      role: 'Partnerships Lead',
    },
    {
      department: 'External Relations',
      role: 'Finance Executive',
    },
    {
      department: 'External Relations',
      role: 'Finance Lead',
    },
  ] as { department: string; role: string }[]
  const ctx = useSession()
  const department = ctx.data?.user?.department
  const filteredRoles = roles.filter(
    (combination) => combination.department === department
  )
  const { search, filter, setFilter, setSearch } = useContext(searchContext)
  const filterArray = filter.split(',')
  const firstElement = filterArray.shift()
  console.log(filterArray)
  const [showDropdown, setShowDropdown] = useState(false)
  console.log(filteredRoles)

  const [selectedFilter, setSelectedFilter] = useState('')
  const [showOptions, setShowOptions] = useState(false)
  console.log('searchbar: ', search)

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter)
    setShowDropdown(false)
    // Perform filtering logic or update your data based on the selected filter
  }

  const renderOptions = () => {
    if (selectedFilter === 'Roles') {
      return (
        <ul className="ml-2">
          {filteredRoles.map((role) => (
            <button
              key={role.role}
              onClick={() => {
                setShowOptions(false),
                  setShowDropdown(true),
                  setFilter(filter.concat(',' + role.role))
              }}
              className="cursor-pointer px-3 py-2"
            >
              {role.role}
            </button>
          ))}

          {/* <button 
          onClick={() => {setShowOptions(false), setShowDropdown(true), setFilter('designer')}}
          className="px-3 py-2 cursor-pointer">Designer</button>
          <button 
           onClick={() => {setShowOptions(false), setShowDropdown(true), setFilter('designer manager')}}
          className="px-3 py-2 cursor-pointer">Designer Manager</button>
          <button 
           onClick={() => {setShowOptions(false), setShowDropdown(true), setFilter('technical lead')}}
          className="px-3 py-2 cursor-pointer">Technical Lead</button>
          <button 
           onClick={() => {setShowOptions(false), setShowDropdown(true), setFilter('software engineer')}}
          className="px-3 py-2 cursor-pointer">Software Engineer</button> */}
        </ul>
      )
    }
    if (selectedFilter === 'Status') {
      return (
        <ul className="ml-2">
          <button
            onClick={() => {
              setShowOptions(false),
                setShowDropdown(true),
                setFilter(filter.concat(',accepted'))
            }}
            className="cursor-pointer px-3 py-2"
          >
            Accepted
          </button>
          <button
            onClick={() => {
              setShowOptions(false), setShowDropdown(true), setFilter(filter.concat(',offered'))
            }}
            className="cursor-pointer px-3 py-2"
          >
            Offered
          </button>
          <button
            onClick={() => {
              setShowOptions(false), setShowDropdown(true), setFilter(filter.concat(',pending'))
            }}
            className="cursor-pointer px-3 py-2"
          >
            Pending Review
          </button>
          <button
            onClick={() => {
              setShowOptions(false),
                setShowDropdown(true),
                setFilter(filter.concat(',interviewed'))
            }}
            className="cursor-pointer px-3 py-2"
          >
            Interviewed
          </button>
          <button
            onClick={() => {
              setShowOptions(false),
                setShowDropdown(true),
                setFilter(filter.concat(',rejected'))
            }}
            className="cursor-pointer px-3 py-2"
          >
            Rejected
          </button>
        </ul>
      )
    }
    if (selectedFilter === 'Flags') {
      return (
        <ul className="ml-2">
          <button
            onClick={() => {
              setShowOptions(false), setShowDropdown(true), setFilter(filter.concat(',true'))
            }}
            className="cursor-pointer px-3 py-2"
          >
            Seen
          </button>
          <button
            onClick={() => {
              setShowOptions(false), setShowDropdown(true), setFilter(filter.concat(',false'))
            }}
            className="cursor-pointer px-3 py-2"
          >
            Unseen
          </button>
        </ul>
      )
    }
    return null
  }
  return (
    <InputGroup
      minWidth={'150px'}
      maxWidth={'300px'}
      position="absolute"
      top={{ lg: '0' }}
      right={{ lg: '20', base: '0' }}
      left={{ lg: 'unset', base: '0' }}
      marginTop={{ lg: 'unset', base: '5' }}
      marginLeft={{ base: 'auto' }}
      marginRight={{ base: 'auto' }}
    >
      <InputLeftElement>
        <SearchIcon />
      </InputLeftElement>
      <Input
        placeholder="Search"
        borderWidth="3px"
        border="3px solid #004586"
        borderColor="#004586"
        borderRadius="20px"
        onChange={(e) => {
          setSearch(e.currentTarget.value)
        }}
      />
      <button
        type="button"
        className="relative ml-2 rounded-md bg-gray-200 px-3 py-2 text-gray-600"
        onMouseEnter={() => setShowOptions(true)}
        onMouseLeave={() => {
          setShowOptions(false), setShowDropdown(true)
        }}
      >
        <ChevronDownIcon />
        {showOptions && (
          <div className="absolute top-0 left-0 mt-10 rounded-md border border-gray-200 bg-white shadow-md">
            {showDropdown ? (
              <>
                <button
                  type="button"
                  className="cursor-pointer px-4 py-2"
                  onClick={() => handleFilterChange('Roles')}
                >
                  Roles
                </button>
                <button
                  type="button"
                  className="cursor-pointer px-4 py-2"
                  onClick={() => handleFilterChange('Status')}
                >
                  Status
                </button>
                <button
                  type="button"
                  className="cursor-pointer px-4 py-2"
                  onClick={() => handleFilterChange('Flags')}
                >
                  Flags
                </button>
                <button
                  type="button"
                  className="mb-2 cursor-pointer rounded bg-gray-200 px-4 py-2 font-bold"
                  onClick={() => {
                    setShowOptions(false), setShowDropdown(true), setFilter('')
                  }}
                >
                  Clear
                </button>
              </>
            ) : (
              renderOptions()
            )}
        
          </div>
        )}
      </button>
      {/* <div className='grid grid-cols-2 flex flex-col absolute top-0 gap-x-1 gap-y-1 left-0 mt-10'>
      {filterArray.map((value) => {
        return (
         <div className='w-30  rounded-full flex flex-col text-center border border-gray-200 bg-white shadow-md '>
          {value === 'true' ? 'seen' : value === 'false' ? 'unseen' : value}
         </div>
        )
      }
        )}
        </div> */}

        <div className='flex flex-wrap absolute  mx-6 top-0 left-0 mt-10' >
  {filterArray.map((value) => {
    return (
      <div className='w-30 rounded-full flex flex-col text-center border border-gray-200 bg-white shadow-md'>
        {value === 'true' ? 'seen' : value === 'false' ? 'unseen' : value}
      </div>
    )
  })}
</div>
      
     
    
    </InputGroup>
  )
}

export default SearchBar
