import { useState } from 'react'

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
import withAuth, { type BaseProps } from '~/utils/withAuth'
import React from 'react'
import Head from 'next/head'
import { getSession } from 'next-auth/react'
import { type GetServerSidePropsContext } from 'next'

const Application_Status: React.FC<BaseProps> = ({ session }) => {
  //this part needs backend to update the status
  const [isOpen, setIsOpen] = useState(false)
  const [isAcceptOpen, setIsAcceptOpen] = useState(false)
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const onOpenAccept = () => setIsAcceptOpen(true)
  const onCloseAccept = () => setIsAcceptOpen(false)
  const onOpenReject = () => setIsRejectOpen(true)
  const onCloseReject = () => setIsRejectOpen(false)
  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)
  //better to fetch from backend
  const [isRejected, setIsRejected] = useState(false)
  const [isAccepted, setIsAccepted] = useState(false)

  const roles = [
    {
      id: 1,
      department: 'Software Engineering',
      name: 'Software Engineer',
      status: 'offered',
    },
    {
      id: 2,
      department: 'Machine Learning',
      name: 'Technical Analyst',
      status: 'interviewed',
    },
    {
      id: 3,
      department: 'Blockchain',
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
        isApplicant={session.isApplicant}
      />
      <main>
        <div className="relative h-screen w-screen overflow-x-auto bg-[url('/images/applicants_background.svg')] bg-cover bg-fixed bg-center bg-no-repeat">
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
            <h1 className="mt-4 flex justify-center text-4xl font-bold lg:text-8xl">
              Hi User,
            </h1>
            <h2 className="mt-3 flex justify-center text-2xl font-bold lg:text-6xl">
              your current statuses are:
            </h2>

            {roles.map((item) => (
              <div key={item.id} className="mt-3 flex items-center ">
                <div className="flex-grow">
                  {item.status == 'offered' && (
                    <div className="flex justify-center">
                      <span className="mt-3  flex  text-xl lg:text-4xl">
                        {item.department} - {item.name}
                        <Image
                          alt="logo"
                          src={
                            isRejected
                              ? '/images/red_dot.svg'
                              : isAccepted
                              ? 'images/Ellipse 1.svg'
                              : '/images/blue_dot.svg'
                          }
                          height={35}
                          width={35}
                          className="ml-2 flex flex-col  md:ml-14"
                        />
                      </span>

                      {isAccepted || isRejected ? (
                        <div></div>
                      ) : (
                        <div className="ml-3 flex md:ml-14 ">
                          <button
                            onClick={onOpenAccept}
                            className=" rounded  bg-green-500 font-bold text-white hover:bg-green-600 md:ml-5 md:py-2 md:px-4 md:text-2xl"
                          >
                            Accept
                          </button>
                          <button
                            onClick={onOpenReject}
                            className="ml-3 rounded bg-red-500 font-bold text-white hover:bg-red-600  md:ml-5 md:py-2 md:px-4 md:text-2xl"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      <Modal
                        isOpen={isAcceptOpen}
                        onClose={onCloseAccept}
                        size="xs"
                      >
                        <ModalOverlay bg="none" backdropFilter="auto" />
                        <ModalContent>
                          <ModalHeader fontSize="5xl"></ModalHeader>
                          <ModalCloseButton />
                          <ModalBody fontSize="3xl ">
                            <div className=" flex-col justify-center">
                              <div className="items-center">
                                Confirm Acceptance?
                                <button
                                  onClick={() => {
                                    onCloseAccept()
                                    setIsAccepted(true)
                                  }}
                                  className="mt-5 rounded bg-green-500 py-2 px-4 text-2xl font-bold text-white hover:bg-green-600"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={onCloseAccept}
                                  className="ml-10 mt-5 rounded bg-red-500 py-2 px-4 text-2xl font-bold text-white hover:bg-red-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </ModalBody>
                          <ModalFooter></ModalFooter>
                        </ModalContent>
                      </Modal>
                      <Modal
                        isOpen={isRejectOpen}
                        onClose={onCloseReject}
                        size="xs"
                      >
                        <ModalOverlay bg="none" backdropFilter="auto" />
                        <ModalContent>
                          <ModalHeader fontSize="5xl"></ModalHeader>
                          <ModalCloseButton />
                          <ModalBody fontSize="3xl">
                            <div className="flex flex-col items-start">
                              <div className="items-center">
                                Confirm Rejection?
                                <button
                                  onClick={() => {
                                    onCloseReject()
                                    setIsRejected(true)
                                  }}
                                  className="mt-5 rounded bg-green-500 py-2 px-4 text-2xl font-bold text-white hover:bg-green-600"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={onCloseReject}
                                  className="ml-10 mt-5 rounded bg-red-500 py-2 px-4 text-2xl font-bold text-white hover:bg-red-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </ModalBody>
                          <ModalFooter></ModalFooter>
                        </ModalContent>
                      </Modal>
                    </div>
                  )}

                  {item.status == 'accepted' && (
                    <h3 className="flex justify-center text-xl lg:text-4xl">
                      {item.department} - {item.name}
                      <Image
                        alt="logo"
                        src="/images/Ellipse 1.svg"
                        height={35}
                        width={35}
                        className="ml-14 flex flex-col"
                      />
                      {/* Offered */}
                    </h3>
                  )}

                  {item.status == 'pending_review' && (
                    <h3 className="justify-centertext-2xl flex text-xl lg:text-4xl">
                      {item.department} - {item.name}
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
                    <h3 className="flex justify-center text-xl lg:text-4xl">
                      {item.department} - {item.name}
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
                    <h3 className="flex justify-center text-xl lg:text-4xl">
                      {item.department} - {item.name}
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
            <div className="fixed bottom-10 right-6 md:right-20">
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  // If not logged in, redirect to the login page.
  // If he is an applicant, redirect him to the applicant page.
  // If he does not have admin access, redirect to the home page.
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    }
  } else if (!session.isApplicant) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
