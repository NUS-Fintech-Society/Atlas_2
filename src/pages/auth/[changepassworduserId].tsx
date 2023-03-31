import Container from '~/components/auth/Container'
import { type FormEvent, useState } from 'react'
import { Button, Input } from '~/components/utilities'
import Head from 'next/head'
import Link from 'next/link'
import { trpc } from '~/utils/trpc'
import { useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { hash } from 'bcryptjs'

const ChangePasswordPage = () => {

  const toast = useToast()
  const [newPassword, setnewPassword] = useState('')
  const [confirmNewPassword, setconfirmNewPassword] = useState('')
  const router = useRouter()
  const { mutateAsync, isLoading } = trpc.auth.changePassword.useMutation()
  const handleChangePassword = async (password: string) => {
    const userID = String(router.query.changepassworduserId)
    console.log(userID)
    const hashedPassword = await hash(password, 10)
    console.log(hashedPassword)
    await mutateAsync({userId: userID, password: hashedPassword})
  }
  const formHandler = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      if (newPassword == confirmNewPassword) {
        handleChangePassword(newPassword)
      } else {
        toast({
          title: 'Something went wrong',
          description: 'Your 2 passwords do not match',
          status: 'error',
          duration: 3000,
        })
      }

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
        'Your password has been changed successfully',
      status: 'success',
      duration: 3000,
    })
    router.push('/')
    
  }



  return (
    <>
      <Head>
        <title>Atlas | Change Password</title>
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
              Change Password
            </h1>
            <h1 className="mb-2 font-[ubuntu] text-2xl font-medium">
              Welcome e0XXXXXX@u.nus.edu,
            </h1>
            {/* ---- Heading ---- */}

            <form className="w-full" onSubmit={formHandler}>
              {/* ---- Username ---- */}
              <label htmlFor="email" className="font-[ubuntu] text-2xl">
                New Password:
              </label>
              <div className="mt-2 flex w-full flex-row items-center h-12">
                <Input
                  className="rounded text-black"
                  name="New Password"
                  onChange={(e) => setnewPassword(e.target.value)}
                  placeholder="New Password"
                  required
                  type="text"
                  value={newPassword}
                />
              </div>

              <label htmlFor="email" className="font-[ubuntu] text-2xl">
                Confirm New Password:
              </label>
              <div className="mt-2 flex w-full flex-row items-center">
                <Input
                  className="rounded text-black"
                  name="Confirm New Password"
                  onChange={(e) => setconfirmNewPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  required
                  type="text"
                  value={confirmNewPassword}
                />
              </div>
              {/* ---- Username ---- */}

              {/* ---- Reset Password Link ---- */}
              <div className="m-4 flex flex-col">
                <Button
                  isLoading={isLoading}
                  className="m-12 mt-2 w-30 self-center shadow-md"
                  type="submit"
                >
                  Change Password
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

export default ChangePasswordPage