import React, { useContext, useState } from 'react'
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { searchContext } from '~/context/recruitment/SearchProvider'
import { ChevronDownIcon } from '@chakra-ui/icons';

const SearchBar = () => {
  const { search, setSearch } = useContext(searchContext)
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  console.log('searchbar: ', search)

  const handleFilterChange = (filter: React.SetStateAction<string>) => {
    setSelectedFilter(filter);
    setShowDropdown(false);
    // Perform filtering logic or update your data based on the selected filter
  };

  const renderOptions = () => {
    if (selectedFilter === 'Roles') {
      return (
        <ul className="ml-2">
          <li className="px-3 py-2 cursor-pointer">Role 1</li>
          <li className="px-3 py-2 cursor-pointer">Role 2</li>
        </ul>
      );
    }
    if (selectedFilter === 'Status') {
      return (
        <ul className="ml-2">
          <li className="px-3 py-2 cursor-pointer">Status 1</li>
          <li className="px-3 py-2 cursor-pointer">Status 2</li>
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
      right={{ lg: '12', base: '0' }}
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
          <div className="absolute top-0 right-0 mt-10 bg-white border border-gray-200 rounded-md shadow-md">
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
