import type { NextPage } from 'next'
import { trpc } from '~/utils/trpc'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Button } from '~/components/utilities'
import Layout from '~/components/common/Layout'
import LoadingScreen from '~/components/common/LoadingScreen'
import toast, { Toaster } from 'react-hot-toast'

const CreateAnnouncementPage: NextPage = () => {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')

  const { data: session, status } = useSession({ required: true })
  const router = useRouter()
  const handleSubmit = async () => {
    try {
      await mutateAsync({
        content,
        title,
      })
    } catch (e) {
      toast.error('Oops, something went wrong. Please try again', {
        duration: 2000,
        position: 'bottom-center',
      })
    }
  }

  const { isLoading, mutateAsync } =
    trpc.announcement.createAnnouncements.useMutation()

  if (status === 'loading') return <LoadingScreen />
  if (session.level !== 'super') router.push('/user')

  return (
    <Layout>
      <div className="flex flex-col justify-evenly">
        <h1 className="my-2 text-3xl font-bold">Create Announcement</h1>

        <p className="my-2">
          Simply create an announcement now and let everyone know! Fill in the
          title and content and click submit
        </p>

        <form onSubmit={handleSubmit}>
          <input
            className="mb-3 min-w-full rounded-lg border border-solid border-gray-300 px-2 py-1 focus:outline-blue-500"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title"
            required
          />

          <textarea
            id="content"
            className="mb-3 min-w-full rounded-lg border border-solid border-gray-300 px-2 py-1 focus:outline-blue-500"
            maxLength={500}
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter a content"
            required
          />
          <Button
            disabled={!content || !title}
            isLoading={isLoading}
            type="submit"
          >
            Create Announcement
          </Button>
        </form>
      </div>
      <Toaster />
    </Layout>
  )
}

export default CreateAnnouncementPage
