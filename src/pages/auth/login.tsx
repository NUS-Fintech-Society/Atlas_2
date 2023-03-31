import { useRouter } from 'next/router'
import { useSession, signIn } from 'next-auth/react'
import { useState, type FormEvent } from 'react'
import { Button, Input } from '~/components/utilities'
import LoadingScreen from '~/components/common/LoadingScreen'
import Container from '~/components/auth/Container'
import Head from 'next/head'
import Link from 'next/link'
import { useToast } from '@chakra-ui/react'
// import Image from 'next/image'

const LoginPage = () => {
  const router = useRouter()
  const { data:session , status } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const toast = useToast()

  const submitForm = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault()
    setSubmitting(true)
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (res && res.error) {
      setSubmitting(false)
      toast({
        description: res.error,
        duration: 3000,
        status: 'error',
        title: 'Oops, something went wrong!',
      })
      return
    }

    router.push('/')
  }

  if (status === 'loading') {
    return <LoadingScreen />
  }

  if (session) {
    router.push('/')
  }

  return (
    <>
      <Head>
        <title>Atlas | Login</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The login page for Atlas" />
      </Head>
      <div>
        {/* <Image
          alt="fintech-logo"
          width={200}
          height={200}
          src="/fintech_logo.png"
          className="top-5vh fixed max-w-xs cursor-pointer"
        /> */}
        <Container>
          <form onSubmit={submitForm}>
            <div className="flex flex-col items-start">
              {/* ---- Title ---- */}
              <h1 className="mb-2 self-center text-center font-[ubuntu] text-5xl">
                Login
              </h1>
              {/* ---- Title ---- */}

              {/* ---- Username ---- */}
              <label htmlFor="email" className="font-[ubuntu] text-2xl">
                Username
              </label>
              <div className="mt-2 flex w-full flex-row items-center">
                <Input
                  className="rounded text-black"
                  name="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="NUS Email"
                  type="text"
                  value={email}
                />
              </div>
              {/* ---- Username ---- */}

              {/* ---- Password ---- */}
              <label htmlFor="password" className="mt-4 font-[ubuntu] text-2xl">
                Password
              </label>
              <Input
                className="mt-2 rounded-md text-black"
                name="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                value={password}
              />
              {/* ---- Password ---- */}

              {/* ---- Forgot Your Password ---- */}
              <div className="mx-auto my-6">
                <Link href="/auth/forgetpassword">
                  <div className="font-medium">Forgot your password?</div>
                </Link>
              </div>
              {/* ---- Forgot Your Password ---- */}

              {/* ---- Login Button ---- */}
              <Button
                className="mt-2 w-40 self-center shadow-md"
                isLoading={submitting}
                type="submit"
              >
                SIGN IN
              </Button>
              {/* ---- Login Button ---- */}
            </div>
          </form>
        </Container>
      </div>
    </>
  )
}

export default LoginPage
