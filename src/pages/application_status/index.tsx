import { useState} from 'react'
import Head from 'next/head'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import Image from 'next/image'
import TopNavbar from '~/components/common/TopNavbar'
import withAuth, { BaseProps } from '~/utils/withAuth'


enum PageState {
  LOGIN,
  FORGET_PASSWORD,
}

const Application_Status: React.FC<BaseProps> = ({ session }) => {
  //this part needs backend to update the status
  const [isOpen, setIsOpen] = useState(false)
  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)

  const roles = [
    {
      id: 1,
      name: 'Software Engineer',
      status: 'accepted',
    },
    {
      id: 2,
      name: 'Technical Analyst',
      status: 'interviewed',
    },
    {
      id: 3,
      name: 'Research Analyst',
      status: 'rejected',
    },
  ]

  return (
    <>
      <Head>
        <title>Atlas | Login</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The login page for Atlas" />
      </Head>
      <TopNavbar
        image={session.user?.image as string}
        isAdmin={session.isAdmin}
      />
      <main>
        <div className="relative h-screen w-screen bg-[url('/images/applicants_background.svg')] bg-cover bg-fixed bg-center bg-no-repeat">
          {/* Nav element containing the logo */}

          <nav className="flex items-center justify-center  px-2 py-2 ">
            <Image
              alt="logo"
              src="/images/black_logo.svg"
              height={150}
              width={150}
            />
          </nav>

          {/* Login */}
          <div className="flex flex-col justify-center gap-8 font-[Inter]">
            <h1 className="mt-4 flex justify-center text-4xl font-bold md:text-8xl">
              Hi User,
            </h1>
            <h2 className="mt-3 flex justify-center text-2xl font-bold md:text-6xl">
              your current statuses are:
            </h2>

            {roles.map((item) => (
              <div key={item.id} className="mt-3 flex items-center ">
                <div className="flex-grow">
                  {item.status == 'accepted' && (
                    <h3 className="mt-3 flex justify-center text-2xl md:text-5xl">
                      {item.name}
                      <Image
                        alt="logo"
                        src="/images/Ellipse 1.svg"
                        height={35}
                        width={35}
                        className="ml-14 flex  flex-col"
                      />
                      {/* Accepted */}
                    </h3>
                  )}

                  {item.status == 'offered' && (
                    <h3 className="flex justify-center text-2xl md:text-5xl">
                      {item.name}
                      <Image
                        alt="logo"
                        src="/images/blue_dot.svg"
                        height={35}
                        width={35}
                        className="ml-14 flex flex-col"
                      />
                      {/* Offered */}
                    </h3>
                  )}

                  {item.status == 'pending_review' && (
                    <h3 className="justify-centertext-2xl flex md:text-5xl">
                      {item.name}
                      <Image
                        alt="logo"
                        src="/images/yellow_dot.svg"
                        height={35}
                        width={35}
                        className="ml-14"
                      />
                      {/* Pending Review */}
                    </h3>
                  )}
                  {item.status == 'interviewed' && (
                    <h3 className="flex justify-center text-2xl md:text-5xl">
                      {item.name}
                      <Image
                        alt="logo"
                        src="/images/pink_dot.svg"
                        height={35}
                        width={35}
                        className="ml-14"
                      />
                      {/* Interviewed */}
                    </h3>
                  )}
                  {item.status == 'rejected' && (
                    <h3 className="flex justify-center text-2xl md:text-5xl">
                      {item.name}
                      <Image
                        alt="logo"
                        src="/images/red_dot.svg"
                        height={35}
                        width={35}
                        className="ml-14"
                      />
                      {/* Rejected */}
                    </h3>
                  )}
                </div>
              </div>
            ))}
            <div className="fixed bottom-20 right-6 md:right-28">
              <button
                onClick={onOpen}
                className="h-16 w-16 rounded-full bg-[#FFEBC5] text-white 
                       hover:bg-[#FFD27C]  
                       md:h-20
                       md:w-20
                       
                       
                       "
              >
                <Image
                  alt="question_mark"
                  src="/images/question_mark.svg"
                  height="20"
                  width={20}
                  className="ml-5 md:ml-7"
                />
              </button>
            </div>
            <Modal isOpen={isOpen} onClose={onClose} size="xs">
              <ModalOverlay bg="none" backdropFilter="auto" />

              <ModalContent>
                <ModalHeader fontSize="5xl"></ModalHeader>
                <ModalCloseButton />
                <ModalBody fontSize="3xl">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center">
                      <Image
                        alt="logo"
                        src="/images/Ellipse 1.svg"
                        height={35}
                        width={35}
                        className="mr-5 flex flex-col"
                      />
                      Accepted
                    </div>
                  </div>

                  <div className="flex flex-col items-start">
                    <div className="flex items-center">
                      <Image
                        alt="logo"
                        src="/images/blue_dot.svg"
                        height={35}
                        width={35}
                        className="mr-5 flex flex-col"
                      />
                      Offered
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="flex items-center">
                      <Image
                        alt="logo"
                        src="/images/yellow_dot.svg"
                        height={35}
                        width={35}
                        className="mr-5"
                      />
                      Pending Review
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="flex items-center">
                      <Image
                        alt="logo"
                        src="/images/pink_dot.svg"
                        height={35}
                        width={35}
                        className="mr-5"
                      />
                      Interviewed
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="flex items-center">
                      <Image
                        alt="logo"
                        src="/images/red_dot.svg"
                        height={35}
                        width={35}
                        className="mr-5"
                      />
                      Rejected
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter></ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </div>
      </main>
    </>
  )
}

export default withAuth(Application_Status, false)
