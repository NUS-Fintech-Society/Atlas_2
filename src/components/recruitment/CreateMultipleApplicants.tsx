import { useToast, Stack, Button } from '@chakra-ui/react'
import { parse, type ParseResult } from 'papaparse'
import { trpc } from '~/utils/trpc'
import type {
  AddApplicantsType,
  AddAppliedRolesType,
  AddApplicantsCSVType,
} from '~/types/admin.type'
import { useRouter } from 'next/router'
import { useState, useCallback } from 'react'

const CreateMultipleApplicants = () => {
  const router = useRouter()
  const toast = useToast()
  const [users, setUsers] = useState<AddApplicantsType[]>([])
  const [appliedRoles, setAppliedRoles] = useState<AddAppliedRolesType[]>([])

  const { isLoading: isLoadingUsers, mutateAsync: mutateAsyncUsers } =
    trpc.user.createManyUsers.useMutation()
  const {
    isLoading: isLoadingAppliedRoles,
    mutateAsync: mutateAsyncAppliedRoles,
  } = trpc.recruitment.createManyAppliedRoles.useMutation()

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length && e.target.files[0]) {
      parse(e.target.files[0], {
        header: true,
        complete: (results: ParseResult<AddApplicantsCSVType>) => {
          const usersFromData = results.data.map((item) => {
            return {
              department: 'Unassigned',
              name: item['Full Name'],
              nus_email: item['NUS email (xxx@u.nus.edu)'],
              role: 'Applicant',
              student_id: item['Student ID (AXXXXXXXX)'] || '',
            }
          })
          setUsers(usersFromData)

          const appliedRolesFromData = results.data.map((item) => {
            return {
              applicantId: item['Student ID (AXXXXXXXX)'],
              firstRole: item['First Choice Role'],
              firstDepartment: item['First Choice Department'],
              secondRole: item['Second Choice Role'],
              secondDepartment: item['Second Choice Department'],
            }
          })
          setAppliedRoles(appliedRolesFromData)
        },
      })
    }
  }, [])

  const clickHandler = useCallback(async () => {
    try {
      if (!users.length) return
      await mutateAsyncUsers(users)
      await mutateAsyncAppliedRoles(appliedRoles)
      toast({
        title: 'Successfully Added!',
        description: 'You have successfully added all the applicants',
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
  }, [mutateAsyncUsers, mutateAsyncAppliedRoles, toast, users, appliedRoles])

  return (
    <div className="flex flex-col">
      <Stack direction={['column']} rowGap={4}>
        <input accept=".csv" onChange={handleFile} type="file" />
        <div className="flex flex-row">
          <Button
            bg="light.secondary.primary"
            className="mr-5 text-white"
            onClick={() => router.back()}
          >
            Return
          </Button>
          <Button
            bg="light.secondary.primary"
            className="text-white"
            disabled={!users.length}
            isLoading={isLoadingUsers && isLoadingAppliedRoles}
            onClick={clickHandler}
          >
            Submit File
          </Button>
        </div>
      </Stack>
    </div>
  )
}

export default CreateMultipleApplicants
