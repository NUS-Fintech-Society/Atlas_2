/* eslint-disable */
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import LoadingScreen from '~/components/common/LoadingScreen'
import { useRouter } from 'next/router'
import { type Session } from 'next-auth'
import TopNavbar from '~/components/common/TopNavbar'

/**
 * withApplicantAuth is a wrapper method that ensures that the applicants
 * are only routed to specific pages.
 *
 * @param WrappedComponent The Next Page
 */
const withApplicantAuth = (WrappedComponent: any) => {
  const Wrapper = (props: any) => {
    const { data: session, status } = useSession({ required: true })
    const router = useRouter()

    useEffect(() => {
      // If the user is logged in and no longer an applicant, we can just push him to the home page.
      if (session && !session.isApplicant) {
        router.push('/')
      }
    }, [router, status, session])

    if (status === 'loading') {
      return <LoadingScreen />
    }

    return (
      <>
        <TopNavbar
          isAdmin={session.isAdmin}
          isApplicant={session.isApplicant}
          image={session.user?.image as string}
        />
        <WrappedComponent {...props} session={session} />
      </>
    )
  }
  return Wrapper
}

export interface BaseProps {
  session: Session
}

export default withApplicantAuth
