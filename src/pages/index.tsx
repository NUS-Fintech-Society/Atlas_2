import { useSession } from 'next-auth/react'
import LoadingScreen from '~/components/common/LoadingScreen'
import Head from 'next/head'
import TopNavbar from '~/components/common/TopNavbar'

const HomePage = () => {
  const { status, data: session } = useSession({ required: true })

  if (status === 'loading') {
    return <LoadingScreen />
  }

  if (session && session.user) {
    return (
      <>
        <Head>
          <title>Atlas</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="The home page for Atlas" />
        </Head>
        <TopNavbar />
      </>
    )
  }
}

export default HomePage
