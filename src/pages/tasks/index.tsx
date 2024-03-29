import { useState } from 'react'
import Head from 'next/head'
import { trpc } from '~/utils/trpc'
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
  Button,
  useToast,
} from '@chakra-ui/react'

import { useRouter } from 'next/router'
import withAuth, { type BaseProps } from '~/utils/withAuth'
import { type TaskInfos } from '~/types/task/task.type'
import { getSession } from 'next-auth/react'
import { type GetServerSidePropsContext } from 'next'

const Tasks: React.FC<BaseProps> = ({ session }) => {
  const router = useRouter()
  const toast = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [currentDetails, setCurrentDetails] = useState('')
  const [currentStatus, setCurrentStatus] = useState('')
  const [currentName, setCurrentName] = useState('')
  const [taskInfoData, setTaskInfoData] = useState<TaskInfos[]>([])
  const [taskID, setTaskID] = useState('')

  if (!session.isAdmin) {
    trpc.recruitment.getAllTasksOfUser.useQuery(undefined, {
      onSuccess: (data: TaskInfos[]) => setTaskInfoData(data),
    })
  } else {
    //Show all tasks created within Department for Admin View
    trpc.recruitment.getAllTasks.useQuery(undefined, {
      onSuccess: (data: TaskInfos[]) => setTaskInfoData(data),
    })
  }

  const filteredData =
    taskInfoData &&
    taskInfoData.filter((item) =>
      item.taskName.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const { mutateAsync } = trpc.user.updateTaskOfUser.useMutation()

  const updateTask = async () => {
    try {
      await mutateAsync({
        taskID: taskID,
        status: 'Done',
      })
      toast({
        duration: 3000,
        status: 'success',
        title: 'Success',
        description: 'Task status has been successfully updated',
      })
      location.reload()
    } catch (e) {
      toast({
        description: (e as Error).message,
        duration: 3000,
        status: 'error',
        title: 'Oops, an error occured!',
      })
    }
  }

  return (
    <>
      <Head>
        <title>Tasks</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The task page for Atlas" />
      </Head>
      <main>
        <div className="relative h-screen w-screen overflow-x-auto bg-[url('/images/tasks_background.svg')] bg-cover bg-fixed bg-center bg-no-repeat">
          {/* Nav element containing the logo */}
          {/* Login */}
          <div className="flex flex-col justify-center gap-8">
            <h1 className="mt-[3%] flex justify-center text-4xl font-semibold text-white">
              {session.isAdmin
                ? 'All Tasks Assigned in Department (Admin View)'
                : 'Assigned Tasks'}
            </h1>

            <div className="mx-auto  max-w-screen-lg md:max-w-screen-md">
              {session.isAdmin ? (
                <Button
                  bgColor="#97AEFF"
                  width={215}
                  className="prose mb-10 font-normal text-black"
                  onClick={() => router.push('/tasks/create-task')}
                >
                  Create Task
                </Button>
              ) : null}
            </div>
            <Center>
              <div className="mx-auto max-w-screen-lg md:max-w-screen-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="">
                    <tr>
                      <th
                        scope="col"
                        className="text-bold px-6 py-3 text-left text-lg tracking-wider text-white"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="text-bold px-6 py-3 text-left text-lg tracking-wider text-white"
                      >
                        Task
                      </th>
                      <th
                        scope="col"
                        className="text-bold px-6 py-3 text-left text-lg tracking-wider text-white"
                      >
                        Task Creator
                      </th>
                      <th
                        scope="col"
                        className="text-bold px-6 py-3 text-left text-lg tracking-wider text-white"
                      >
                        Do By
                      </th>
                      <th
                        scope="col"
                        className="text-bold min-w-full px-6 py-3 text-left text-lg tracking-wider text-white"
                      >
                        {session.isAdmin
                          ? 'Not completed \n[Exclude Admins]'
                          : null}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData &&
                      filteredData.map((item) => (
                        <tr key={item.id}>
                          <td className="whitespace-nowrap px-6 py-4">
                            <h1 className="  text-white">
                              {item.status == 'Incomplete' && (
                                <button className="text-md  mx-auto w-24 flex-col items-center  rounded-full bg-[#C51F29] bg-opacity-100  py-1 px-5 font-medium transition md:w-[150px]">
                                  <div className="font-sans text-xs text-white md:text-xl">
                                    {item.status}
                                  </div>
                                </button>
                              )}
                              {/* {item.status == 'In Progress' && (
                                <button className="text-md mx-auto w-24 flex-col items-center  rounded-full bg-[#FFBD3C] bg-opacity-100  py-1 px-5 font-medium transition md:w-[150px]">
                                  <div className="font-[Inter] text-xs text-white md:text-xl">
                                    {item.status}
                                  </div>
                                </button>
                              )} */}
                              {item.status == 'Done' && (
                                <button className="max-w-20 text-md mx-auto w-24 flex-col items-center  rounded-full bg-[#00C09D] bg-opacity-100  py-1 px-5 font-medium transition md:w-[150px]">
                                  <div className="font-sans text-xs text-white md:text-xl">
                                    {item.status}
                                  </div>
                                </button>
                              )}
                            </h1>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <Text
                              as="span"
                              cursor="pointer"
                              _hover={{ textDecoration: 'underline' }}
                              className="text-white md:text-xl"
                              onClick={() => {
                                setCurrentName(item.taskName)
                                setCurrentDetails(item.description)
                                setCurrentStatus(item.status)
                                setTaskID(item.id)
                                onOpen()
                              }}
                            >
                              {item.taskName}
                            </Text>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <Text
                              as="span"
                              cursor="pointer"
                              _hover={{ textDecoration: 'underline' }}
                              className="text-white md:text-xl"
                              onClick={() => {
                                setCurrentName(item.taskName)
                                setCurrentDetails(item.description)
                                setCurrentStatus(item.status)
                                setTaskID(item.id)
                                onOpen()
                              }}
                            >
                              {item.taskCreatorName}
                            </Text>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <Text
                              as="span"
                              cursor="pointer"
                              _hover={{ textDecoration: 'underline' }}
                              className="text-white md:text-xl"
                              onClick={() => {
                                setCurrentName(item.taskName)
                                setCurrentDetails(item.description)
                                setCurrentStatus(item.status)
                                setTaskID(item.id)
                                onOpen()
                              }}
                            >
                              {new Date(item.due).toLocaleDateString()}
                            </Text>
                          </td>

                          {/* To track count of task completion */}
                          <td className="whitespace-nowrap px-6 py-4">
                            <h1 className="font-normal text-white md:text-xl">
                              {session.isAdmin ? item.taskCompletion : null}
                            </h1>
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
                    <ModalHeader fontSize="3xl">{currentName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody fontSize="xl">{currentDetails}</ModalBody>
                    <ModalBody fontSize="xl">
                      {' '}
                      Status: {currentStatus}
                    </ModalBody>
                    {!session.isAdmin && currentStatus === 'Incomplete' && (
                      <Button
                        bgColor="#97AEFF"
                        width={215}
                        className="mb-3 mt-3 ml-5  text-black"
                        onClick={() => {
                          updateTask()
                          onClose()
                        }}
                      >
                        Mark Status as Done
                      </Button>
                    )}
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

export default withAuth(Tasks)

// tasks
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  // If not logged in, redirect to the login page.
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    }
  }
  return {
    props: {},
  }
}
