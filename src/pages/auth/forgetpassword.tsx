import Container from '~/components/auth/Container'
import { type FormEvent, useState } from 'react'
import { Button, Input } from '~/components/utilities'
import Head from 'next/head'
import Link from 'next/link'
import { trpc } from '~/utils/trpc'
import { useToast } from '@chakra-ui/react'
// import Image from 'next/image'

const ForgotPasswordPage = () => {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const { mutateAsync, isLoading } = trpc.auth.resetPassword.useMutation()
  const formHandler = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
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

  return (
    <>
      <Head>
        <title>Atlas | Forget Password</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The reset password page for Atlas" />
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
          <div className="flex w-full flex-col items-start">
            {/* ---- Heading ---- */}
            <h1 className="mb-2 self-center text-center font-[ubuntu] text-5xl font-medium">
              Reset Password
            </h1>
            {/* ---- Heading ---- */}

            <form className="w-full" onSubmit={formHandler}>
              {/* ---- Username ---- */}
              <label htmlFor="email" className="font-[ubuntu] text-2xl">
                Email
              </label>
              <div className="mt-2 flex w-full flex-row items-center">
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
              <div className="m-4 flex flex-col">
                <Button
                  isLoading={isLoading}
                  className="m-24 mt-2 w-40 self-center shadow-md"
                  type="submit"
                >
                  Send Reset Link
                </Button>
                {/* ---- Reset Password Link ---- */}
              </div>
            </form>
          </div>
          <Link href="/auth/login">
            <Button className="mt-2 shadow-md" type="button">
              Back
            </Button>
          </Link>
        </Container>
      </div>
    </>
  )
}

export default ForgotPasswordPage
