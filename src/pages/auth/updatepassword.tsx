import Container from '~/components/auth/Container'
import { type FormEvent, useState } from 'react'
import { Button, Input } from '~/components/utilities'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('e0XXXXXX@u.nus.edu')
  const [password, setPassword] = useState('')
  // Password for double confirmation 
  const [password2, setPassword2] = useState('')
  const [submitting, setSubmitting] = useState(false)
  return (
    <>
      <Head>
        <title>Atlas | Update Password</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The update password page for Atlas" />
      </Head>
      <div>
        <Image
          alt="fintech-logo"
          width={200}
          height={200}
          src="/fintech_logo.png"
          className="top-5vh fixed max-w-xs cursor-pointer"
        />
        <Container>
          <div className="flex w-full flex-col items-start">
          <h1 className="mb-2 self-center text-center font-[ubuntu] text-5xl">
                Change Password
              </h1>
            <h1 className="mb-2 text-center font-[ubuntu] text-2xl">
                Welcome {email},
            </h1>
            <label htmlFor="password" className="font-[ubuntu] text-2xl">
                New Password:
              </label>
              <div className="mt-2 flex w-full flex-row items-center m-2">
                <Input
                  className="rounded text-black"
                  name="password"
                  required
                  onChange={(p) => setPassword(p.target.value)}
                  placeholder="New Password"
                  type="text"
                  value={password}
                />
              </div>
              <div className='m-2'>
              </div>
              <label htmlFor="password" className="font-[ubuntu] text-2xl">
                Confirm New Password:
              </label>
              <div className="mt-2 flex w-full flex-row items-center m-2">
                <Input
                  className="rounded text-black"
                  name="password2"
                  required
                  onChange={(p) => setPassword2(p.target.value)}
                  placeholder="Confirm New Password"
                  type="text"
                  value={password2}
                />
              </div>
              <Button
                className="mt-2 w-40 self-center shadow-md"
                isLoading={submitting}
                type="submit"
               >
                CHANGE <br/>
                PASSWORD
              </Button>
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