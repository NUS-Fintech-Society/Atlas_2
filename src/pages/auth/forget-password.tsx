import Container from '~/components/auth/Container'
import { useState } from 'react'
import { Button, Input } from '~/components/utilities'
import Head from 'next/head'
import Link from 'next/link'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')

  return (
    <>
      <Head>
        <title>Reset Password</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The reset password page for Atlas" />
      </Head>

      <Container>
        <div className="flex flex-col items-start w-full">
          {/* ---- Heading ---- */}
          <h1 className="mb-2 text-center self-center text-5xl font-[ubuntu] font-medium">
            Forgot Password
          </h1>
          {/* ---- Heading ---- */}

          <form className="w-full">
            {/* ---- Username ---- */}
            <label htmlFor="email" className="text-2xl font-[ubuntu]">
              Username
            </label>
            <div className="flex flex-row w-full items-center mt-2">
              <Input
                className="rounded text-black"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="NUS Email"
                required
                type="text"
                value={email}
              />
            </div>
            {/* ---- Username ---- */}

            {/* ---- Reset Password Link ---- */}
            <div className="flex flex-col">
              <Button className="shadow-md mt-2" type="submit">
                Send Reset Link
              </Button>
              {/* ---- Reset Password Link ---- */}

              <Link href="/auth/login">
                <Button className="shadow-md mt-2 w-full" type="button">
                  Return
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </Container>
    </>
  )
}

export default ForgotPasswordPage
