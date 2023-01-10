import Container from '~/components/auth/Container'
import { FormEvent, FormEventHandler, useState } from 'react'
import { Button, Input } from '~/components/utilities'
import Head from 'next/head'
import Link from 'next/link'
import { trpc } from '~/utils/trpc'
import { useToast } from '@chakra-ui/react'

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
        <title>Reset Password</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The reset password page for Atlas" />
      </Head>

      <Container>
        <div className="flex w-full flex-col items-start">
          {/* ---- Heading ---- */}
          <h1 className="mb-2 self-center text-center font-[ubuntu] text-5xl font-medium">
            Forgot Password
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
            <div className="flex flex-col">
              <Button 
                isLoading={isLoading} 
                className="mt-2 shadow-md" 
                type="submit"
              >
                Send Reset Link
              </Button>
              {/* ---- Reset Password Link ---- */}

              <Link href="/auth/login">
                <Button className="mt-2 w-full shadow-md" type="button">
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
