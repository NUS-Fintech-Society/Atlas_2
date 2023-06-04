import { useRouter, } from 'next/router'
import { useSession} from 'next-auth/react'
import { useState, useCallback, useRef, Fragment } from 'react'
import Head from 'next/head'
import {  Box, Button, Grid, GridItem, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Portal, useDisclosure, useToast, Text, InputGroup, InputLeftElement, TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot, Center } from '@chakra-ui/react'
import Image from 'next/image'
import TopNavbar from '~/components/common/TopNavbar'
import withAuth, { type BaseProps } from '~/utils/withAuth'
import { SearchIcon } from '@chakra-ui/icons'




enum PageState {
  LOGIN,
  FORGET_PASSWORD,
}

const Tasks:React.FC<BaseProps> = ({ session }) => {

  const [searchQuery, setSearchQuery] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [currentDetails, setCurrentDetails] = useState('')
  const [currentName, setCurrentName] = useState('')



  const data = [
    {
      id: 1,
      status: 'Done',
      name: 'Join Telegram Group',
      due: '09/12/23',
      details: 'User should join the telegram group before their due date.'
    },
    {
        id: 2,
        status: 'In Progress',
        name: 'Have lunch',
        due: '1/4/24',
        details: 'Have lunch at school with friends.'
      },
      {
        id: 3,
        status: 'Incomplete',
        name: 'Attend first townhall',
        due: '23/5/24',
        details: 'Attend the first townhall to learn more about Fintech Society and its projects.'
      },
    
  ]
  

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )



  return (
    <>
    
      <Head>
        <title>Atlas | Login</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The login page for Atlas" />
      </Head>
      <TopNavbar  image={session.user?.image as string} isAdmin={session.isAdmin} />
      <main>
        <div className="relative h-screen w-screen  bg-[url('/images/tasks_background.svg')] bg-cover bg-fixed bg-center bg-no-repeat">
          {/* Nav element containing the logo */}
       

       

          {/* Login */}
          <div className="flex flex-col justify-center gap-8 font-[Inter]">
           
          
            <h1 className='flex justify-center font-bold text-4xl mt-[3%] text-white'>
             Tasks
            </h1>
            
           
                {/* <InputGroup>
      <InputLeftElement
        className="mt-[1%] ml-[8%] mb-4"
        pointerEvents="none"
        >
        <SearchIcon className="SearchIcon" color="gray.300" />
        
        </InputLeftElement>
       <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                borderWidth="3px"
                w={{ base: '150px', md: '300px' }}
                border="3px solid #F9813E"
                borderColor="#9BAFC2" 
                borderRadius="30px"
                className="mt-[1%] ml-[8%] mb-4 text-white"
                _placeholder={{
                pl: { base: '5px', lg: '3px' },
                fontStyle: 'italic',
                }}
            />
    </InputGroup> */}
              
                
              
              <Center>
              <div className="max-w-screen-lg mx-auto md:max-w-screen-md">

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Task
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Do By
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
        {filteredData.map((item) => (
           
      <tr key={item.id}>
         <td className="px-6 py-4 whitespace-nowrap">
         
          <h1 className="  text-white">{item.status == "Incomplete" && 
          <button
          disabled = {true}
          className="flex-col  items-center w-24 md:w-[150px] bg-opacity-100  text-md mx-auto rounded-full  bg-[#C51F29] py-1 px-5 font-medium transition"

            >
          <div className='font-[Inter] text-xs md:text-xl text-white'>
          {item.status}
          </div>
        </button>
          }
          {item.status == "In Progress" && <button
          disabled = {true}
          className="flex-col items-center w-24 md:w-[150px] bg-opacity-100  text-md mx-auto rounded-full  bg-[#FFBD3C] py-1 px-5 font-medium transition"
         
            >
          <div className='font-[Inter] text-xs md:text-xl text-white'>
          {item.status}
          </div>
        </button>}
          {item.status == "Done" && <button
          disabled = {true}
          className="flex-col items-center w-24 md:w-[150px] max-w-20 bg-opacity-100  text-md mx-auto rounded-full  bg-[#00C09D] py-1 px-5 font-medium transition"
         
            >
          <div className='font-[Inter] text-xs md:text-xl text-white'>
          {item.status}
          </div>
        </button>}
          </h1>
          </td>
          <td>  
            <Text
        as="span"
        cursor="pointer"
        _hover={{ textDecoration: 'underline' }}
        className='md:text-xl text-white'
        onClick={() => {setCurrentName(item.name); setCurrentDetails(item.details); onOpen()}}
       
      >
        {item.name}
      </Text>
      </td>
      <td>  <h1 className="md:text-xl text-white">{item.due}</h1></td>
          
          </tr>
          
    ))}

     
        
        </tbody>
      </table>
      
      <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay 
      bg='none'
      backdropFilter='auto'
      
      backdropBlur='2px'
      />
            
      <ModalContent>
      <ModalHeader fontSize='5xl' >{currentName}</ModalHeader>
      <ModalCloseButton />
      <ModalBody fontSize='3xl' >
          {currentDetails}
      
      </ModalBody>

      <ModalFooter>
     
      </ModalFooter>
  </ModalContent>
  
  </Modal>
    </div>
    
</Center>
            

          
          </div>
        </div>
      </main>
    </>
  )
}

export default withAuth(Tasks, false)