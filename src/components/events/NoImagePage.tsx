import Image from 'next/image'
import Button from '~/components/utilities/Button'
import Link from 'next/link'
import Head from 'next/head'

const NoImagePage = () => {
  return (
    <>
      <Head>
        <title>Atlas | No Event Found</title>
      </Head>
      <div>
        <div className="w-full">
          <Image
            alt="Warning Triangle"
            className="mx-auto"
            src="/events/warning-triangle.svg"
            width={400}
            height={400}
          />

          <h1 className="text-center text-4xl font-bold">No Event Found!</h1>
          <div className="mt-5 flex justify-center">
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default NoImagePage
