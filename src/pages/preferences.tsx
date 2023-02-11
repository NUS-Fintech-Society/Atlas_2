import { useSession } from 'next-auth/react'
import { type FormEvent, useState } from 'react'
import { Button, Input } from '~/components/utilities'
import LoadingScreen from '~/components/common/LoadingScreen'
import Container from '~/components/auth/Container'
import Head from 'next/head'
import { useToast } from '@chakra-ui/react'
import { trpc } from '~/utils/trpc'
import Link from 'next/link'

const ChangePasswordPage = () => {
  const toast = useToast()
  const { mutateAsync, isLoading } = trpc.profile.changePassword.useMutation()
  const { status } = useSession({ required: true })
  const [oldPassword, setOldPassword] = useState('')
  const [password, setPassword] = useState('')

  // Use to submit the form to change the password
  const formHandler = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      await mutateAsync({
        password,
        oldPassword,
      })

      toast({
        description: 'Password changed successfully',
        duration: 3000,
        status: 'success',
        title: 'Success!',
      })
    } catch (e) {
      toast({
        description: (e as Error).message,
        duration: 3000,
        status: 'error',
        title: 'Oops, an error occured!',
      })
    }
  }

  if (status === 'loading') return <LoadingScreen />

  return (
    <>
      <Head>
        <title>Atlas | Preferences</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="The user preferences page for Atlas"
        />
      </Head>
      <Container>
        <form onSubmit={formHandler}>
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
              className="my-4 mt-2 rounded-md text-black"
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
              className="my-2 self-stretch shadow-md"
              disabled={!oldPassword || !password}
              isLoading={isLoading}
              type="submit"
            >
              Change password
            </Button>

            <div className="w-full">
              <Link href="/profile">
                <Button
                  className="mt-2 w-full self-stretch shadow-md"
                  type="button"
                >
                  Return
                </Button>
              </Link>
            </div>
            {/* ---- Login Button ---- */}
          </div>
        </form>
      </Container>
    </>
  )
}

export default ChangePasswordPage
