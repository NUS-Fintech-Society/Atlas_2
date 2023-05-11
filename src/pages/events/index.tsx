import { VStack, Button, Progress, useBreakpointValue } from '@chakra-ui/react'
import { DataTable } from '~/components/attendance/DataTable'
import { trpc } from '~/utils/trpc'
import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { createColumnHelper } from '@tanstack/react-table'
import { AddIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import TopNavbar from '~/components/common/TopNavbar'
import withAuth, { type BaseProps } from '~/utils/withAuth'

const AttendancePage: React.FC<BaseProps> = ({session}) => {
  const router = useRouter()
  const isSmallScreen = useBreakpointValue({ base: true, md: false })
  const [eventInfoData, setEventInfoData] = useState<eventInfos[]>([])

  trpc.attendance.getAllAttendance.useQuery(undefined, {
    onSuccess: (data: eventInfos[]) => setEventInfoData(data),
  })

  type eventInfos = {
    number: string
    name: string
    total_users: string
    total_attendees: string
    startDate: string
    endDate: string
  }

  const columnHelper = createColumnHelper<eventInfos>()

  const columns = [
    columnHelper.accessor('name', {
      cell: (info) => info.getValue(),
      header: 'Name',
    }),
    columnHelper.accessor('startDate', {
      cell: (info) => {
        const date = new Date(info.getValue().toString())
        const formattedDate = date.toLocaleDateString('en-GB')
        return formattedDate
      },
      header: 'Start Date',
    }),
    columnHelper.accessor('endDate', {
      cell: (info) => {
        const date = new Date(info.getValue().toString())
        const formattedDate = date.toLocaleDateString('en-GB')
        return formattedDate
      },
      header: 'End Date',
    }),
    columnHelper.accessor(
      (row) => ({
        total_attendees: row.total_attendees,
        total_users: row.total_users,
      }),
      {
        cell: (info) => {
          return (
            <div>
              <p className="mb-2">
                {info.getValue().total_attendees.toString()}/
                {info.getValue().total_users.toString()}
              </p>
              <Progress 
                rounded="md"
                background="#4365DD" 
                colorScheme="progress"
                value={
                  (Number(info.getValue().total_attendees.toString()) /
                    Number(info.getValue().total_users.toString())) *
                  100
                }
              ></Progress>
            </div>
          )
        },
        header: 'Attendance',
      }
    ),
  ] 

  return (
    <>
      <Head>
        <title>Attendance</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The attendance page for Atlas" />
      </Head>
      <TopNavbar isAdmin={session.isAdmin} />
      <div className="px-2 sm:px-6 sm:pt-5 md:px-20 md:pt-5 lg:px-28 lg:pt-5">
        <h1 className="mb-10 text-center text-2xl font-bold">Attendance</h1>
        <VStack align="left" className="mb-10">
          {isSmallScreen ? ( 
            <Button 
              bgColor="#97AEFF"
              width={45}
              className="mb-10 text-black"
              borderRadius="full"
              fontSize={15}
              onClick={() => router.push('/events/create')}
            >
              <AddIcon />
            </Button>
          ) : (
            <Button
              bgColor="#97AEFF"
              width={215}
              className="mb-10 text-black"
              onClick={() => router.push('/events/create')} 
            >
              Create Event
            </Button>
          )}
          <DataTable columns={columns} data={eventInfoData} />
        </VStack>
      </div>
    </>
  )
}

export default withAuth(AttendancePage)
