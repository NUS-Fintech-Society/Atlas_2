import { useState, useCallback } from 'react'
import Head from 'next/head'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import Image from 'next/image'
import TopNavbar from '~/components/common/TopNavbar'
import withAuth, { BaseProps } from '~/utils/withAuth'
import { Button } from 'flowbite-react'

enum PageState {
  LOGIN,
  FORGET_PASSWORD,
}

const Application_Status:React.FC<BaseProps> = ({ session }) =>{

  //this part needs backend to update the status
  const application_status = "accepted"
  const [isOpen, setIsOpen] = useState(false)
  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)  

  const [pageState, setPageState] = useState(PageState.LOGIN)
  const roles = [
    { 
      id:1,
      name: 'Software Engineer',
      status: 'accepted'
    },
    { 
      id:2,
      name: 'Technical Analyst',
      status: 'interviewed'
    },
    {
      id:3,
      name: 'Research Analyst',
      status: 'rejected'
    }

  ]

  return (
    <>
      <Head>
        <title>Atlas | Login</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The login page for Atlas" />
      </Head>
      <TopNavbar isAdmin={session.isAdmin} />
      <main>
        <div className="relative h-screen w-screen bg-[url('/images/applicants_background.svg')] bg-cover bg-fixed bg-center bg-no-repeat">
          {/* Nav element containing the logo */}
          
          <nav className="flex justify-center items-center  px-2 py-2 " >
          
            <Image
              alt="logo"
              src="/images/black_logo.svg"
              height={150}
              width={150}
            
            
            />
         
          </nav>
       

          {/* Login */}
          <div className="flex flex-col justify-center gap-8 font-[Inter]">
          
            <h1 className='flex justify-center font-bold text-8xl mt-4'>
              Hi User,
            </h1>
            <h2 className='flex justify-center  mt-3 font-bold text-6xl'>
              your current statuses are:
            </h2>
      
            {roles.map((item) => ( 
              <div key={item.id} className="flex  items-center mt-3 ">
                  <div className="flex-grow">
                {item.status == 'accepted' && 
                <h3 className='flex mt-3 justify-center text-5xl'>
                  {item.name}
                  <Image
                    alt="logo"
                    src="/images/Ellipse 1.svg"
                    height={35}
                    width={35}
                    className='flex flex-col  ml-14'              
                  />
                    {/* Accepted */}
                  </h3>
                }
              
                {item.status == 'offered' && <h3 className='flex justify-center text-5xl'>
                {item.name}
                  <Image
                    alt="logo"
                    src="/images/blue_dot.svg"
                    height={35}
                    width={35}
                    className='flex flex-col ml-14'
                  />
                    {/* Offered */}
                  </h3>
                }
                
                {item.status == 'pending_review' && <h3 className='flex justify-center text-5xl'>
                {item.name}
                  <Image
                    alt="logo"
                    src="/images/yellow_dot.svg"
                    height={35}
                    width={35}
                    className='ml-14'             
                  />
                    {/* Pending Review */}
                  </h3>
                }
                {item.status == 'interviewed' && <h3 className='flex justify-center text-5xl'>
                {item.name}
                  <Image
                    alt="logo"
                    src="/images/pink_dot.svg"
                    height={35}
                    width={35}
                    className='ml-14'             
                  />
                    {/* Interviewed */}
                  </h3>
                }
                {item.status == 'rejected' && <h3 className='flex justify-center text-5xl'>
                {item.name}
                  <Image
                    alt="logo"
                    src="/images/red_dot.svg"
                    height={35}
                    width={35}
                    className='ml-14'             
                  />
                    {/* Rejected */}
                  </h3>
                }
                </div>
                </div>

            ))}
             <div style={{ position: 'fixed', bottom: '40px', right: '60px' }}>
              <button 
                onClick={onOpen}       
                className="w-20 h-20 rounded-full 
                       bg-[#FFEBC5]  
                       hover:bg-[#FFD27C]
                       text-white
                       
                       
                       ">
                         <Image
                    alt="question_mark"
                    src="/images/question_mark.svg"
                    height={20}
                    width={20}
                    className='ml-7'  
                  
                        
                  />
            
        </button>
        </div>
        <Modal  isOpen={isOpen} onClose={onClose}>
            <ModalOverlay 
            bg='none'
            backdropFilter='auto'
            
          
            />
           
           
            <ModalContent 
        
             
            
        
            >
                
            <ModalHeader fontSize='5xl' ></ModalHeader>
            <ModalCloseButton />
            <ModalBody fontSize='3xl' >
              <div className='flex justify-left ml-24'>
              <Image
                    alt="logo"
                    src="/images/Ellipse 1.svg"
                    height={35}
                    width={35}
                    className='flex flex-col mr-5'              
                  />
                Accepted</div>
              <div  className='flex justify-left ml-24'>
              <Image
                    alt="logo"
                    src="/images/blue_dot.svg"
                    height={35}
                    width={35}
                    className='flex flex-col mr-5'
                  />
                  Offered</div>
              <div  className='flex justify-left ml-24'>
              <Image
                    alt="logo"
                    src="/images/yellow_dot.svg"
                    height={35}
                    width={35}
                    className='mr-5'             
                  />
                  Pending Review</div>
              <div className='flex justify-left ml-24'>
              <Image
                    alt="logo"
                    src="/images/pink_dot.svg"
                    height={35}
                    width={35}
                    className='mr-5'             
                  />Interviewed</div>
              <div className='flex justify-left ml-24'>
              <Image
                    alt="logo"
                    src="/images/red_dot.svg"
                    height={35}
                    width={35}
                    className='mr-5'             
                  />Rejected</div>


              
            
            </ModalBody>

            <ModalFooter>
           
            </ModalFooter>
        </ModalContent>
        
        </Modal>
      
       

           
            
          

          
          </div>
        </div>
      </main>
    </>
  )
}


export default withAuth(Application_Status)