import { useRouter } from 'next/router'
import { useSession, signIn } from 'next-auth/react'
import { useState, type FormEvent } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Button, Input } from '~/components/utilities'
import LoadingScreen from '~/components/common/LoadingScreen'
import Container from '~/components/auth/Container'
import Head from 'next/head'
import Link from 'next/link'

const LoginPage = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submitForm = async (e: FormEvent<HTMLElement>) => {
    try {
      e.preventDefault()
      setSubmitting(true)
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (res && res.ok) {
        router.push('/users')
        return
      }

      if (res && res.error) {
        setSubmitting(false)
        toast.error(res.error, {
          duration: 2000,
          position: 'bottom-center',
        })
        return
      }
    } catch (e) {
      setSubmitting(false)
      toast.error('Oops, something went wrong. Please try again', {
        duration: 2000,
        position: 'bottom-center',
      })
    }
  }

  if (status === 'loading') return <LoadingScreen />
  if (session) {
    if (session.level === 'admin') router.push('/admin')
    router.push('/user')
  }

  return (
    <>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The login page for Atlas" />
      </Head>
      <Container>
        <form onSubmit={submitForm}>
          <div className="flex flex-col items-start">
            {/* ---- Title ---- */}
            <h1 className="mb-2 text-center self-center text-5xl font-[ubuntu]">
              Login
            </h1>
            {/* ---- Title ---- */}

            {/* ---- Username ---- */}
            <label htmlFor="email" className="text-2xl font-[ubuntu]">
              Username
            </label>
            <div className="flex flex-row w-full items-center mt-2">
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
            <label htmlFor="password" className="text-2xl font-[ubuntu] mt-4">
              Password
            </label>
            <Input
              className="rounded-md mt-2 text-black"
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
              <Link href="/auth/forget-password">
                <div className="font-medium">Forgot your password?</div>
              </Link>
            </div>
            {/* ---- Forgot Your Password ---- */}

            {/* ---- Login Button ---- */}
            <Button
              className="mt-2 self-stretch shadow-md"
              isLoading={submitting}
              type="submit"
            >
              Login
            </Button>
            {/* ---- Login Button ---- */}
          </div>
        </form>
        <Toaster />
      </Container>
    </>
  )
}

export default LoginPage
