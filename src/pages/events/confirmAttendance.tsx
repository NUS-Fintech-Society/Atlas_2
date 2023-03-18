import Container from '~/components/auth/Container'
import { Button } from '~/components/utilities'
import Head from 'next/head'

const confirmAttendance = () => {
  const event = 'EVENT NAME'
  const date = '3 February 2023'
  return (
    <>
      <Head>
        <title>Atlas | confirmAttendancePage</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="The confirm attendance page for Atlas"
        />
      </Head>
      <Container>
        <div className="flex w-full flex-col items-start">
          <h1 className="mb-2 self-center text-center text-5xl font-bold font-medium">
            {event}
          </h1>
          <h1 className="mb-2 self-center text-center text-3xl font-medium">
            {date}
          </h1>
          <Button
            className="mt-2 self-center bg-orange-500 text-center"
            type="button"
          >
            Confirm Attendance 
          </Button>
        </div>
      </Container>
    </>
  )
}

export default confirmAttendance
