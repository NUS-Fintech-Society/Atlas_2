import { useSession } from 'next-auth/react'
import { type FormEvent, useState } from 'react'
import { Button, Input } from '~/components/utilities'
import LoadingScreen from '~/components/common/LoadingScreen'
import Container from '~/components/auth/Container'
import Head from 'next/head'
import { trpc } from '~/utils/trpc'
import Navbar from '~/components/common/Navbar'


const EventsPage = () => {
    const { status } = useSession({ required: true })
    
    if (status === 'loading') return <LoadingScreen />

    return (
      <>
        <Head>
          <title>Atlas | Events</title>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="The events page for Atlas"
          />
        </Head>
        <div className="flex flex-col items-center bg-black text-white h-screen">
          <div className="my-4">
            <Navbar/>
          </div>
          <h1 className='text-4xl my-4'>Attendance</h1>
          <Button 
            className="my-2 mx-4 shadow-md"
            type="button"
          >Create Event
          </Button>

          <div className='bg-white text-black mt-12 px-24 py-48 rounded-md'>
            <h3>Table placeholder</h3>
          </div>
        </div>
      </>
    )
}

export default EventsPage