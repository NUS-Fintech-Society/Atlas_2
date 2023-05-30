import { useRouter } from 'next/router'
import { useSession, signIn } from 'next-auth/react'
import { useState, useCallback } from 'react'
import Head from 'next/head'
import { useToast } from '@chakra-ui/react'
import Image from 'next/image'
import TopNavbar from '~/components/common/TopNavbar'
import withAuth, { BaseProps } from '~/utils/withAuth'

enum PageState {
  LOGIN,
  FORGET_PASSWORD,
}

const application_status:React.FC<BaseProps> = ({ session }) =>{

  //this part needs backend to update the status
  const application_status = "accepted"

  const [pageState, setPageState] = useState(PageState.LOGIN)

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
          
            <h1 className='flex justify-center font-bold text-8xl mt-10'>
              Hi User,
            </h1>
            <h2 className='flex justify-center  mt-3 font-bold text-6xl'>
              your current status is:
            </h2>
            {application_status == 'accepted' && 
            <h3 className='flex mt-3 justify-center text-5xl'>
        
              <Image
                alt="logo"
                src="/images/Ellipse 1.svg"
                height={35}
                width={35}
                className='mr-5'              
              />
                Accepted
              </h3>
            }
            {application_status == 'offered' && <h3 className='flex justify-center text-[55px]'>
        
              <Image
                alt="logo"
                src="/images/blue_dot.svg"
                height={35}
                width={35}
                className='mr-5'
              />
                Offered
              </h3>
            }
            {application_status == 'pending_review' && <h3 className='flex justify-center text-[55px]'>
              
              <Image
                alt="logo"
                src="/images/yellow_dot.svg"
                height={35}
                width={35}
                className='mr-5'             
              />
                Pending Review
              </h3>
            }
            {application_status == 'interviewed' && <h3 className='flex justify-center text-[55px]'>
              
              <Image
                alt="logo"
                src="/images/pink_dot.svg"
                height={35}
                width={35}
                className='mr-5'             
              />
                Interviewed
              </h3>
            }
            {application_status == 'rejected' && <h3 className='flex justify-center text-[55px]'>
              
              <Image
                alt="logo"
                src="/images/red_dot.svg"
                height={35}
                width={35}
                className='mr-5'             
              />
                Rejected
              </h3>
            }
            
            
            <div className="flex justify-center items-center mt-[80px]">
            {application_status != "rejected" &&
            <button
          
              className="shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex-col w-357px h-109px items-center bg-opacity-0 border-2 border-[#86C5FF]  text-md mx-auto rounded-full  bg-[#86C5FF] py-4 px-20 font-medium transition hover:bg-opacity-80"
             
            >
              <div className='font-[Inter] text-[25px]'>
                Update 
                  <div className="relative">
                  </div>
                Information
              </div>
            </button>
            }
            {application_status == "rejected" &&
            <button
              disabled = {true}
              className="shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex-col w-357px h-109px items-center bg-opacity-0 border-2 border-[#BFE0FF]  text-md mx-auto rounded-full  bg-[#86C5FF] py-4 px-20 font-medium transition"
             
            >
              <div className='font-[Inter] text-[25px] text-[#9AA8B6]'>
                Update 
                  <div className="relative">
                  </div>
                Information
              </div>
            </button>
            }

            
            
            {(application_status == "accepted" || application_status == "offered") && 
            <button
          
              className="shadow-[0_4px_4px_rgba(0,0,0,0.25)] -ml-5 w-357px h-109px items-center bg-opacity-0 border-2 border-[#86C5FF]  text-md mx-auto rounded-full  bg-[#86C5FF] py-4 px-20 font-medium transition hover:bg-opacity-80"
        
            >
              <div className='font-[Inter] text-[25px]'>
                Tasks to be
                  <div className="relative">
                  </div>
                Completed
              </div>
         
            </button>
            }
            
            {(application_status != "offered" && application_status != "accepted") &&
            <button
            disabled = {true}
            className="shadow-[0_4px_4px_rgba(0,0,0,0.25)] -ml-5 flex-col w-357px h-109px -ml-5 items-center bg-opacity-0 border-2 border-[#BFE0FF]  text-md mx-auto rounded-full  bg-[#86C5FF] py-4 px-20 font-medium transition"
           
            >
            <div className='font-[Inter] text-[25px] text-[#9AA8B6]'>
              Tasks to be
                <div className="relative">
                </div>
              Completed
            </div>
          </button>
            }
            
            </div>

          
          </div>
        </div>
      </main>
    </>
  )
}


export default withAuth(application_status, true)