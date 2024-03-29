import { Center, Text, VStack } from '@chakra-ui/react'
import withApplicantAuth from '~/utils/withApplicantAuth'
import type { BaseProps } from '~/utils/withApplicantAuth'
import React from 'react'
import Head from 'next/head'
import InfoPopup from '~/components/recruitment/InfoPopup'
import AppliedRolesList from '~/components/recruitment/applicant/AppliedRolesList'
import { getSession } from 'next-auth/react'
import type { GetServerSidePropsContext } from 'next'
import { Actor } from '~/constant/actor'

const ApplicationStatusPage: React.FC<BaseProps> = ({ session }) => {
  return (
    <>
      <Head>
        <title>Atlas | Status </title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The status page for applicants" />
      </Head>
      <main>
        {/* Background image layout */}
        <div className="h-screen w-screen overflow-x-auto bg-[url('/images/applicants_background.svg')] bg-cover bg-fixed bg-scroll bg-center bg-no-repeat">
          {/* Main layout */}
          <Center>
            <div className="mb-2 font-[Inter] md:w-9/12">
              {/* Header */}
              <VStack rowGap={0} my={4}>
                <Text className="mx-4 mt-2 text-center text-4xl font-bold">
                  Hi {session.user?.name},
                </Text>
                <Text className="mx-4 text-center text-2xl  font-bold ">
                  your current statuses are:
                </Text>
              </VStack>
              <AppliedRolesList applicantId={session.user?.id as string} />
            </div>
            <InfoPopup
              iconBgColor="#FFEBC5"
              iconColor="black"
              className="absolute right-20 bottom-40"
              popoverPlacement="left"
              view={Actor.APPLICANT}
            />
          </Center>
        </div>
      </main>
    </>
  )
}

export default withApplicantAuth(ApplicationStatusPage)

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

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
        destination: '/calendar',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
