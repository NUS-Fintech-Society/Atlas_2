import React, { useContext, useState } from 'react'
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { searchContext } from '~/context/recruitment/SearchProvider'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useSession } from 'next-auth/react'
import { roles } from '~/constant/roles'

const SearchBar = () => {
  const ctx = useSession()
  const department = ctx.data?.user?.department
  const filteredRoles = roles.filter(
    (combination) => combination.department === department
  )
  const {filter, setFilter, setSearch } = useContext(searchContext)
  const filterArray = filter.split(',')
  //do not remove this line
  const firstElement = filterArray.shift()
  const [showDropdown, setShowDropdown] = useState(false)
  console.log(filteredRoles)
  const [selectedFilter, setSelectedFilter] = useState('')
  const [showOptions, setShowOptions] = useState(false)
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
              setShowOptions(false),
                setShowDropdown(true),
                setFilter(filter.concat(',offered'))
            }}
            className="cursor-pointer px-3 py-2"
          >
            Offered
          </button>
          <button
            onClick={() => {
              setShowOptions(false),
                setShowDropdown(true),
                setFilter(filter.concat(',pending'))
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
              setShowOptions(false),
                setShowDropdown(true),
                setFilter(filter.concat(',true'))
            }}
            className="cursor-pointer px-3 py-2"
          >
            Seen
          </button>
          <button
            onClick={() => {
              setShowOptions(false),
                setShowDropdown(true),
                setFilter(filter.concat(',false'))
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
      <div className="absolute top-6 left-0 mt-10 flex max-w-[250px] flex-wrap md:top-0">
        {filterArray.map((value) => {
          return (
            <div
              key={value}
              className="mx-1 my-1 flex flex-col rounded-full  border border-gray-200 bg-white px-2 text-center shadow-md"
            >
              {value === 'true' ? 'seen' : value === 'false' ? 'unseen' : value}
            </div>
          )
        })}
      </div>
    </InputGroup>
  )
}

export default SearchBar
