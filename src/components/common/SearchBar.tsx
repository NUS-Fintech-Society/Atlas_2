import React, { useContext, useState } from 'react'
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { searchContext } from '~/context/recruitment/SearchProvider'
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useSession } from 'next-auth/react';


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
  console.log(department)
  const filteredRoles = roles.filter((combination) => combination.department === department)
  const { search, filter, setFilter, setSearch } = useContext(searchContext)
  const [showDropdown, setShowDropdown] = useState(false);
  console.log(filteredRoles)


  const [selectedFilter, setSelectedFilter] = useState('')
  const [showOptions, setShowOptions] = useState(false);
  console.log('searchbar: ', search)

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setShowDropdown(false);
    // Perform filtering logic or update your data based on the selected filter
  };

 

  const renderOptions = () => {
    if (selectedFilter === 'Roles') {
      return (
        <ul className="ml-2">
           {filteredRoles.map((role) =>   
          <button 
          key={role.role}
          onClick={() => {setShowOptions(false), setShowDropdown(true), setFilter(role.role)}}
          className="px-3 py-2 cursor-pointer">{role.role}
          </button>)
          }

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
      );
    }
    if (selectedFilter === 'Status') {
      return (
        <ul className="ml-2">
          <button 
          onClick={() => {setShowOptions(false), setShowDropdown(true), setFilter('accepted')}}
          className="px-3 py-2 cursor-pointer">Accepted</button>
          <button 
          onClick={() => {setShowOptions(false), setShowDropdown(true), setFilter('offered')}}
          className="px-3 py-2 cursor-pointer">Offered</button>
           <button 
          onClick={() => {setShowOptions(false), setShowDropdown(true), setFilter('pending')}}
          className="px-3 py-2 cursor-pointer">Pending Review</button>
           <button 
          onClick={() => {setShowOptions(false), setShowDropdown(true), setFilter('interviewed')}}
          className="px-3 py-2 cursor-pointer">Interviewed</button>
           <button 
          onClick={() => {setShowOptions(false), setShowDropdown(true), setFilter('rejected')}}
          className="px-3 py-2 cursor-pointer">Rejected</button>
        </ul>
      );
    }
    if (selectedFilter === 'Flags') {
      return (
        <ul className="ml-2">
          <button 
          onClick={() => {setShowOptions(false), setShowDropdown(true), setFilter('true')}}
          className="px-3 py-2 cursor-pointer">Flagged</button>
          <button 
          onClick={() => {setShowOptions(false), setShowDropdown(true), setFilter('false')}}
          className="px-3 py-2 cursor-pointer">Unflagged</button>
        </ul>
      );
    }
    return null;
  };
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
          setSearch(e.currentTarget.value);
        }}
      />
       <button
        type="button"
        className="ml-2 px-3 py-2 rounded-md bg-gray-200 text-gray-600 relative"
        onMouseEnter={() => setShowOptions(true)}
        onMouseLeave={() => {setShowOptions(false), setShowDropdown(true)}}
       
        
      >
        <ChevronDownIcon />
        {showOptions && (
          <div className="absolute top-0 left-0 mt-10 bg-white border border-gray-200 rounded-md shadow-md">
            {showDropdown ? (
              <>
               
                <button
                  type="button"
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleFilterChange('Roles')}
                >
                  Roles
                </button>
                <button
                  type="button"
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleFilterChange('Status')}
                >
                  Status
                </button>
                <button
                  type="button"
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleFilterChange('Flags')}
                >
                  Flags
                </button>
                <button
                  type="button"
                  className="px-4 py-2 mb-2 cursor-pointer rounded font-bold bg-gray-200"
                  onClick={() => {setShowOptions(false), setShowDropdown(true), setFilter('')}}
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
     
     
    </InputGroup>
  )
}

export default SearchBar
