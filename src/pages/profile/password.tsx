import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Button, Input } from '~/components/utilities'
import LoadingScreen from '~/components/common/LoadingScreen'
import Container from '~/components/auth/Container'
import Head from 'next/head'
import Link from 'next/link'

const LoginPage = () => {
  const { status } = useSession({ required: true })
  const [oldPassword, setOldPassword] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (status === 'loading') return <LoadingScreen />

  return (
    <>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The login page for Atlas" />
      </Head>
      <Container>
        <form>
          <div className="flex flex-col items-start">
            {/* ---- Title ---- */}
            <h1 className="mb-2 self-center text-center font-[ubuntu] text-5xl">
              Change Password
            </h1>
            {/* ---- Title ---- */}

            {/* ---- Old Password ---- */}
            <label htmlFor="old-password" className="font-[ubuntu] text-2xl">
              Current Password
            </label>
            <div className="mt-2 flex w-full flex-row items-center">
              <Input
                className="rounded text-black"
                name="old-password"
                required
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter your old password"
                type="password"
                value={oldPassword}
              />
            </div>
            {/* ---- Username ---- */}

            {/* ---- Password ---- */}
            <label
              htmlFor="new-password"
              className="mt-4 font-[ubuntu] text-2xl"
            >
              Password
            </label>
            <Input
              className="mt-2 rounded-md text-black"
              name="new-password"
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              type="password"
              value={password}
            />
            {/* ---- Password ---- */}

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
      </Container>
    </>
  )
}

export default LoginPage
