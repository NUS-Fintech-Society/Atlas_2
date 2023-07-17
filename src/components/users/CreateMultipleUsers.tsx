import { useToast, Stack, Button } from '@chakra-ui/react'
import { parse, type ParseResult } from 'papaparse'
import { trpc } from '~/utils/trpc'
import DataTable from '~/components/users/DataTable'
import type { AddUsersType, AddUsersCSVType } from '~/types/admin.type'
import { useRouter } from 'next/router'
import { useState, useCallback } from 'react'

const CreateMultipleUsers = () => {
  const router = useRouter()
  const toast = useToast()
  const [users, setUsers] = useState<AddUsersType[]>([])

  const { isLoading, mutateAsync } = trpc.user.createManyUsers.useMutation()

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length && e.target.files[0]) {
      parse(e.target.files[0], {
        header: true,
        complete: (results: ParseResult<AddUsersCSVType>) => {
          const items = results.data.map((item) => {
            return {
              department: item['Department'] || '',
              name: item['Full Name'],
              nus_email: item['NUS email (xxx@u.nus.edu)'],
              personal_email: item['Gmail'],
              role: item['Appointed Role '] || '',
              student_id: item['Student ID (AXXXXXXXX)'] || '',
              year: item['Year of Study'] || '',
            }
          })

          setUsers(items)
        },
      })
    }
  }, [])

  const clickHandler = useCallback(async () => {
    try {
      if (!users.length) return
      await mutateAsync(users)
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
  }, [mutateAsync, toast, users])

  return (
    <div className="flex flex-col">
      {users.length ? <DataTable data={users} /> : null}
      <Stack direction={['row', 'column']}>
        <input accept=".csv" onChange={handleFile} type="file" />
        <div className="flex flex-row">
          <Button
            bg="#97AEFF"
            className="mr-5 text-black"
            onClick={() => router.back()}
          >
            Return
          </Button>
          <Button
            bg="#97AEFF"
            className="text-black"
            disabled={!users.length}
            isLoading={isLoading}
            onClick={clickHandler}
          >
            Submit File
          </Button>
        </div>
      </Stack>
    </div>
  )
}

export default CreateMultipleUsers
