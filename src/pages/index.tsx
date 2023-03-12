import { useSession } from 'next-auth/react'
import LoadingScreen from '~/components/common/LoadingScreen'
import Head from 'next/head'
import HamburgerNavbar from '~/components/common/HamburgerNavbar'

const HomePage = () => {
  const { status, data: session } = useSession({ required: true })

  if (session && session.user) {
    return (
      <>
        <Head>
          <title>Atlas</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="The home page for Atlas" />
        </Head>
        <HamburgerNavbar studentId={session.user.id} />
        <div>Home Page</div>
      </>
    )
  }
}

export default HomePage
