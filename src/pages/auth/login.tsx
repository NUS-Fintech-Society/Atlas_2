import { useRouter } from 'next/router'
import { useSession, signIn } from 'next-auth/react'
import { useState, useCallback } from 'react'
import { AuthInput } from '~/components/utilities'
import { trpc } from '~/utils/trpc'
import LoadingScreen from '~/components/common/LoadingScreen'
import Head from 'next/head'
import { useToast } from '@chakra-ui/react'
import Image from 'next/image'

enum PageState {
  LOGIN,
  FORGET_PASSWORD,
}

const LoginPage = () => {
  const { status } = useSession()
  const toast = useToast()
  const router = useRouter()
  const { mutateAsync, isLoading } = trpc.auth.resetPassword.useMutation()
  const [loginLoading, setLoginLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pageState, setPageState] = useState(PageState.LOGIN)

  const togglePageState = useCallback(() => {
    setPageState((current) =>
      current === PageState.LOGIN ? PageState.FORGET_PASSWORD : PageState.LOGIN
    )
  }, [])

  const signin = async () => {
    setLoginLoading(true)
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (res && res.error) {
      toast({
        description: res.error,
        duration: 3000,
        status: 'error',
        title: 'Oops, something went wrong!',
      })
      setLoginLoading(false)
      return
    }

    router.push('/')
  }

  const resetPassword = async () => {
    try {
      await mutateAsync(email)
    } catch (e) {
      toast({
        title: 'Something went wrong',
        description: (e as Error).message,
        status: 'error',
        duration: 3000,
      })
      return
    }
    toast({
      title: 'Successful',
      description:
        'If your email can be found in our database, you should receive an email regarding the steps to reset your password.',
      status: 'success',
      duration: 3000,
    })
  }

  if (status === 'loading') {
    return <LoadingScreen />
  } else if (status === 'authenticated') {
    router.push('/')
  }

  return (
    <>
      <Head>
        <title>Atlas | Login</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The login page for Atlas" />
      </Head>
      <main>
        <div className="relative h-screen w-screen bg-[url('/images/background.svg')] bg-cover bg-fixed bg-center bg-no-repeat">
          {/* Nav element containing the logo */}
          <nav className="px-2 py-2">
            <Image
              alt="logo"
              src="/images/fintech_logo.png"
              height={150}
              width={150}
            />
          </nav>

          {/* Login */}
          <div className="flex flex-col justify-center gap-8 font-[Ubuntu]">
            <h1 className="my-5 text-center text-5xl font-bold text-white">
              {pageState === PageState.LOGIN ? 'Login' : 'Reset Password'}
            </h1>
            <AuthInput
              type="email"
              name="Email"
              required
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />

            {pageState === PageState.LOGIN && (
              <AuthInput
                type="password"
                name="Password"
                required
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
              />
            )}

            <p
              onClick={togglePageState}
              className="mt-4 text-center text-xl font-medium text-white hover:cursor-pointer"
            >
              {pageState === PageState.LOGIN
                ? 'Forget your password?'
                : 'Return to login page'}
            </p>

            <button
              className="max-w-60 text-md mx-auto rounded-md bg-[#97AEFF] py-4 px-20 font-medium transition hover:bg-opacity-80"
              onClick={pageState === PageState.LOGIN ? signin : resetPassword}
            >
              {isLoading || loginLoading
                ? 'Loading'
                : pageState === PageState.LOGIN
                ? 'SIGN IN'
                : 'SEND RESET LINK'}
            </button>
          </div>
        </div>
      </main>
    </>
  )
}

export default LoginPage
