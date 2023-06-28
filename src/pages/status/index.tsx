import Image from 'next/image'
import { Box, Center, Text, VStack } from '@chakra-ui/react'
import TopNavbar from '~/components/common/TopNavbar'
import ApplicationStatusListItem from '~/components/recruitment/ApplicantStatusListItem'
import withAuth from '~/utils/withAuth'
import type { BaseProps } from '~/utils/withAuth'
import React from 'react'
import Head from 'next/head'
import { ApplicationStatus } from '~/server/db/models/AppliedRole'
import InfoPopup from '~/components/recruitment/InfoPopup'

const ApplicationStatusPage: React.FC<BaseProps> = ({ session }) => {
  const roles = [
    {
      id: '1',
      applicantId: 'A1',
      department: 'Software Development',
      role: 'Software Engineer',
      rank: 1,
      status: ApplicationStatus.OFFERED,
      flag: false,
    },
    {
      id: '2',
      applicantId: 'A2',
      department: 'Machine Learning',
      role: 'A',
      rank: 2,
      status: ApplicationStatus.OFFERED,
      flag: false,
    },
  ]

  return (
    <>
      <Head>
        <title>Atlas | Status </title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The status page for applicants" />
      </Head>
      <TopNavbar
        image={session.user?.image as string}
        isAdmin={session.isAdmin}
      />
      <main>
        {/* Background image layout */}
        <div className="h-screen w-screen overflow-x-auto bg-[url('/images/applicants_background.svg')] bg-cover bg-fixed bg-scroll bg-center bg-no-repeat">
          {/* Main layout */}
          <Center>
            <div className="mb-2 font-[Inter] md:w-9/12">
              {/* Header */}
              <VStack rowGap={0} my={4}>
                <Text className="mx-4 mt-2 text-center text-4xl font-bold">
                  Hi User,
                </Text>
                <Text className="mx-4 text-center text-2xl  font-bold ">
                  your current statuses are:
                </Text>
              </VStack>

              {/* Applied Roles Status (Can improve list item component naming) */}
              <div className="mx-20 grid grid-cols-1 gap-y-5">
                {roles.map((role) => {
                  return (
                    <ApplicationStatusListItem
                      appliedRole={role}
                      key={role.id}
                    />
                  )
                })}
              </div>
            </div>
            <InfoPopup
              iconBgColor="#FFEBC5"
              iconColor="black"
              className="absolute bottom-20 right-10"
              popoverPlacement="left"
            />
          </Center>
        </div>
      </main>
    </>
  )
}

export default withAuth(ApplicationStatusPage, false)
