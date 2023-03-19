import Container from '~/components/auth/Container'
import Head from 'next/head'
import { CheckIcon } from '@chakra-ui/icons'

const confirmedPage = () => {
  return (
    <>
      <Head>
        <title>Atlas | confirmedPage</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="The confirmed attendance page for Atlas"
        />
      </Head>
      <Container>
        <div className="flex w-full flex-col items-start">
          <CheckIcon
            className="m-4 self-center"
            w={120}
            h={100}
            color="#01003D"
          />
          <h1 className="mb-2 self-center text-center font-[ubuntu] text-6xl font-medium">
            Attendance
          </h1>
          <h1 className="mb-2 self-center text-center font-[ubuntu] text-5xl font-medium">
            Confirmed!
          </h1>
        </div>
      </Container>
    </>
  )
}

export default confirmedPage
