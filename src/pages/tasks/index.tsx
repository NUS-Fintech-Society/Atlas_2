import { useState } from 'react'
import Head from 'next/head'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  Center,
} from '@chakra-ui/react'
import TopNavbar from '~/components/common/TopNavbar'
import withAuth, { type BaseProps } from '~/utils/withAuth'

const Tasks: React.FC<BaseProps> = ({ session }) => {
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
      details: 'User should join the telegram group before their due date.',
    },
    {
      id: 2,
      status: 'In Progress',
      name: 'Have lunch',
      due: '1/4/24',
      details: 'Have lunch at school with friends.',
    },
    {
      id: 3,
      status: 'Incomplete',
      name: 'Attend first townhall',
      due: '23/5/24',
      details:
        'Attend the first townhall to learn more about Fintech Society and its projects.',
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
      <TopNavbar
        image={session.user?.image as string}
        isAdmin={session.isAdmin}
      />
      <main>
        <div className="relative h-screen w-screen  bg-[url('/images/tasks_background.svg')] bg-cover bg-fixed bg-center bg-no-repeat">
          {/* Nav element containing the logo */}

          {/* Login */}
          <div className="flex flex-col justify-center gap-8 font-[Inter]">
            <h1 className="mt-[3%] flex justify-center text-4xl font-bold text-white">
              Tasks
            </h1>
            <Center>
              <div className="mx-auto max-w-screen-lg md:max-w-screen-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Task
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Do By
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map((item) => (
                      <tr key={item.id}>
                        <td className="whitespace-nowrap px-6 py-4">
                          <h1 className="text-white">
                            {item.status == 'Incomplete' && (
                              <button
                                disabled={true}
                                className="text-md  mx-auto w-24 flex-col items-center  rounded-full bg-[#C51F29] bg-opacity-100  py-1 px-5 font-medium transition md:w-[150px]"
                              >
                                <div className="font-[Inter] text-xs text-white md:text-xl">
                                  {item.status}
                                </div>
                              </button>
                            )}
                            {item.status == 'In Progress' && (
                              <button
                                disabled={true}
                                className="text-md mx-auto w-24 flex-col items-center  rounded-full bg-[#FFBD3C] bg-opacity-100  py-1 px-5 font-medium transition md:w-[150px]"
                              >
                                <div className="font-[Inter] text-xs text-white md:text-xl">
                                  {item.status}
                                </div>
                              </button>
                            )}
                            {item.status == 'Done' && (
                              <button
                                disabled={true}
                                className="max-w-20 text-md mx-auto w-24 flex-col items-center  rounded-full bg-[#00C09D] bg-opacity-100  py-1 px-5 font-medium transition md:w-[150px]"
                              >
                                <div className="font-[Inter] text-xs text-white md:text-xl">
                                  {item.status}
                                </div>
                              </button>
                            )}
                          </h1>
                        </td>
                        <td>
                          <Text
                            as="span"
                            cursor="pointer"
                            _hover={{ textDecoration: 'underline' }}
                            className="text-white md:text-xl"
                            onClick={() => {
                              setCurrentName(item.name)
                              setCurrentDetails(item.details)
                              onOpen()
                            }}
                          >
                            {item.name}
                          </Text>
                        </td>
                        <td>
                          {' '}
                          <h1 className="text-white md:text-xl">{item.due}</h1>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay
                    bg="none"
                    backdropFilter="auto"
                    backdropBlur="2px"
                  />

                  <ModalContent>
                    <ModalHeader fontSize="5xl">{currentName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody fontSize="3xl">{currentDetails}</ModalBody>

                    <ModalFooter></ModalFooter>
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
