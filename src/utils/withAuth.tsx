/* eslint-disable */
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import LoadingScreen from '~/components/common/LoadingScreen'
import { useRouter } from 'next/router'
import { type Session } from 'next-auth'

/**
 * withAuth is a wrapper that forces the user to log in before
 * they are allowed to access the page. The additional boolean
 * paramter isAdminRightsNeeded can be passed so that it forces
 * the user to the home page if they do not have the admin rights.
 * Benefit of this is to cut down on the repeated code and ensure
 * that the files in the pages are not messy.
 *
 * @param WrappedComponent The Next Page
 * @param isAdminRightsNeeded Optional. Whether admin rights are needed
 */
const withAuth = (WrappedComponent: any, isAdminRightsNeeded?: boolean) => {
  const Wrapper = (props: any) => {
    const { data: session, status } = useSession({ required: true })
    const router = useRouter()

    useEffect(() => {
      if (isAdminRightsNeeded && session && !session.isAdmin) {
        router.push('/')
      }
    }, [router, status, session])

    if (status === 'loading') {
      return <LoadingScreen />
    }

    return <WrappedComponent {...props} session={session} />
  }
  return Wrapper
}

export interface BaseProps {
  session: Session
}

export default withAuth
