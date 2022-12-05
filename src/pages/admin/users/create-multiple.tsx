import type { NextPage } from 'next'
import { useToast, Stack, Button } from '@chakra-ui/react'
import { parse, type ParseResult } from 'papaparse'
import { trpc } from '~/utils/trpc'
import DataTable from '~/components/admin/DataTable'
import { add } from '~/store/admin/dashboard'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '~/store/store'
import type { AddUsersType, CSVType } from '~/store/types/admin.type'
import type { MouseEvent } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Layout from '~/components/common/Layout'
import LoadingScreen from '~/components/common/LoadingScreen'

const DashboardPage: NextPage = () => {
  const router = useRouter()
  const toast = useToast()
  const data = useSelector<RootState, AddUsersType[]>(
    (state) => state.dashboard
  )

  const dispatch = useDispatch()
  const { isLoading, mutateAsync } = trpc.member.addMultipleUsers.useMutation()
  const { status, data: session } = useSession({ required: true })
  if (status === 'loading') return <LoadingScreen />
  if (session.level !== 'super') router.push('/user')

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files.length && e.target.files[0]) {
      parse(e.target.files[0], {
        header: true,
        complete: (results: ParseResult<CSVType>) => dispatch(add(results)),
      })
    }
  }

  const clickHandler = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    try {
      e.preventDefault()
      if (!data.length) return
      await mutateAsync(data)
      toast({
        title: 'Successfully Added!',
        description: 'You have successfully added all the users',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    } catch (e) {
      toast({
        title: 'Something went wrong',
        description: (e as Error).message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  return (
    <Layout>
      <div className="flex flex-col">
        {data.length ? <DataTable /> : null}
        <Stack direction={['row', 'column']}>
          <input accept=".csv" onChange={handleFile} type="file" />
          <div className="flex flex-row">
            <Button
              bg="light.secondary.primary"
              className="text-white mr-5"
              onClick={() => router.back()}
            >
              Return
            </Button>
            <Button
              bg="light.secondary.primary"
              className="text-white"
              disabled={!data.length}
              isLoading={isLoading}
              onClick={clickHandler}
            >
              Submit File
            </Button>
          </div>
        </Stack>
      </div>
    </Layout>
  )
}

export default DashboardPage
