import { useRouter, } from 'next/router'
import { useSession} from 'next-auth/react'
import { useState, useCallback, useRef } from 'react'
import Head from 'next/head'
import {  Box, Button, Grid, GridItem, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Portal, useDisclosure, useToast, Text } from '@chakra-ui/react'
import Image from 'next/image'
import TopNavbar from '~/components/common/TopNavbar'
import withAuth, { type BaseProps } from '~/utils/withAuth'




enum PageState {
  LOGIN,
  FORGET_PASSWORD,
}

const tasks:React.FC<BaseProps> = ({ session }) => {

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
      details: 'User should join the telegram group before they due date.'
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
      <TopNavbar isAdmin={session.isAdmin} />
      <main>
        <div className="relative h-screen w-screen bg-[url('/images/tasks_background.svg')] bg-cover bg-fixed bg-center bg-no-repeat">
          {/* Nav element containing the logo */}
       

       

          {/* Login */}
          <div className="flex flex-col justify-center gap-8 font-[Inter]">
           
          
            <h1 className='flex justify-center font-bold text-4xl mt-[3%] text-white'>
             Tasks
            </h1>
            
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
                pl: { base: '65px', lg: '210px' },
                fontStyle: 'italic',
                }}
            />
           <Box
  overflowY="auto"
  maxHeight="40vh"
  sx={{
    '&::-webkit-scrollbar': {
      width: '30px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: `#004B90`,
      borderRadius: '20px',
      border: '5px solid transparent',
      backgroundClip: 'content-box',
    },
  }}
  className="p-16"
>
  <Grid
  className='ml-[11%]'
    templateColumns={{
      base: 'repeat(3, 1fr)',
      md: 'repeat(3, 1fr)',
    }}
    gridGap={{ base: '4' }}
    gridRowGap={{ base: '4', md: '12' }}
  >
    {/* Column headings */}
    <GridItem colSpan={1} className="justify-content-center flex flex-col">
      <h1 className="text-xl font-bold text-white">Status</h1>
    </GridItem>
    <GridItem colSpan={1} className="justify-content-center flex flex-col">
      <h1 className="text-xl font-bold text-white">Task</h1>
    </GridItem>
    <GridItem colSpan={1} className="justify-content-center flex flex-col">
      <h1 className="text-xl font-bold text-white">Do By</h1>
    </GridItem>
    </Grid>

    {/* Data rows */}
    {filteredData.map((item) => (
      <Grid
      className='mt-[2%] ml-[11%]'
      templateColumns={{
        base: 'repeat(3, 1fr)',
        md: 'repeat(3, 1fr)',
      }}
      gridGap={{ base: '4' }}
      gridRowGap={{ base: '4', md: '12' }}

    >
      
        <GridItem colSpan={1} className="justify-content-center flex flex-col">
          
          <h1 className="  text-white">{item.status == "Incomplete" && 
          <button
          disabled = {true}
          className="flex-col  items-center w-[150px] bg-opacity-100  text-md mx-auto rounded-full  bg-[#C51F29] py-1 px-5 font-medium transition"

            >
          <div className='font-[Inter] text-xl text-white'>
          {item.status}
          </div>
        </button>
          }
          {item.status == "In Progress" && <button
          disabled = {true}
          className="flex-col items-center w-[150px] bg-opacity-100  text-md mx-auto rounded-full  bg-[#FFBD3C] py-1 px-5 font-medium transition"
         
            >
          <div className='font-[Inter] text-xl text-white'>
          {item.status}
          </div>
        </button>}
          {item.status == "Done" && <button
          disabled = {true}
          className="flex-col items-center w-[150px] max-w-20 bg-opacity-100  text-md mx-auto rounded-full  bg-[#00C09D] py-1 px-5 font-medium transition"
         
            >
          <div className='font-[Inter] text-xl text-white'>
          {item.status}
          </div>
        </button>}
          </h1>
          
        </GridItem>
      
       
        
      
        
       
        <GridItem colSpan={1} className="justify-content-center flex flex-col">
         
          <Text
        as="span"
        cursor="pointer"
        _hover={{ textDecoration: 'underline' }}
        className='text-xl text-white'
        onClick={() => { setCurrentName(item.name); setCurrentDetails(item.details); onOpen()}}
       
      >
        {item.name}
      </Text>
     
          <Modal  isOpen={isOpen} onClose={onClose}>
            <ModalOverlay 
            bg='none'
            backdropFilter='auto'
            
            backdropBlur='2px'
            />
           
            
            <ModalContent 
           
            
        
            >
            <ModalHeader fontSize='5xl' >{currentName}</ModalHeader>
            <ModalCloseButton />
            <ModalBody fontSize='3xl' >
                {currentDetails}
            
            </ModalBody>

            <ModalFooter>
           
            </ModalFooter>
        </ModalContent>
        
        </Modal>
       
 
        </GridItem>
        <GridItem colSpan={1} className="justify-content-center flex flex-col">
          <h1 className="text-xl text-white">{item.due}</h1>
        </GridItem>
    </Grid>
  
       
    ))}
 
</Box>
            

          
          </div>
        </div>
      </main>
    </>
  )
}

export default withAuth(tasks, true)