import {
  Input,
  FormLabel,
  Checkbox,
  CheckboxGroup,
  Stack,
  VStack,
  Button,
  useToast,
  Text,
} from '@chakra-ui/react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '~/utils/trpc'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Head from 'next/head'
import LoadingScreen from '~/components/common/LoadingScreen'
import Container from '~/components/auth/Container'
import { useRouter } from 'next/router'
import withAuth, { type BaseProps } from '~/utils/withAuth'
import { getSession } from 'next-auth/react'
import type { GetServerSidePropsContext } from 'next'

const TaskPage = () => {
  const router = useRouter()
  const toast = useToast()
  const [submitBefore, setSubmitBefore] = useState(false) // hacky use for assignees validation

  const { data } = trpc.recruitment.getAllTasks.useQuery()

  const FormSchema = z.object({
    taskName: z.string().min(1, { message: 'Invalid name' }),
    description: z.string().min(1, { message: 'Invalid description' }),
    dept: z
      .array(
        z.string({
          required_error: 'At least one department must be chosen',
          invalid_type_error: 'At least one department must be chosen',
        })
      )
      .nonempty({
        message: 'At least one department must be chosen',
      }),

    due: z.preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
    }, z.date().min(new Date(), { message: 'Invalid date' }).max(new Date('2100'), { message: 'Invalid date' })),
  })

  type FormSchemaType = z.infer<typeof FormSchema>

  // useForm for state management except assignees which belongs in DataTable (child)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  })

  const { mutateAsync, isLoading: isSubmitting } =
    trpc.recruitment.createTask.useMutation()

  const formSubmit = async (formData: FormSchemaType) => {
    try {
      await mutateAsync({
        taskName: formData.taskName,
        due: formData.due,
        departments: formData.dept,
        description: formData.description,
      })
      toast({
        duration: 3000,
        status: 'success',
        title: 'Success',
        description: 'A new task has been successfully created',
      })
      router.push('./')
    } catch (e) {
      toast({
        description: (e as Error).message,
        duration: 3000,
        status: 'error',
        title: 'Oops, an error occured!',
      })
    }
  }
  const redirectHome = () => router.push('/tasks')

  if (!data) return <LoadingScreen />

  return (
    <>
      <Head>
        <title>Atlas | Create Task</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The create task page for Atlas" />
      </Head>
      <Container>
        <form onSubmit={handleSubmit(formSubmit)}>
          <h1 className="mb-10 text-center text-2xl font-bold">
            Create New Task
          </h1>
          <VStack align="left" spacing="6">
            <div>
              <FormLabel>Task Name</FormLabel>
              <Input
                type="text"
                disabled={isSubmitting}
                {...register('taskName', { required: true })}
              />
              {errors.taskName && (
                <Text color="tomato" className="pt-2">
                  {errors.taskName.message}
                </Text>
              )}
            </div>
          </VStack>

          <VStack align="left" spacing="6">
            <div>
              <FormLabel>Task Description</FormLabel>
              <Input
                type="text"
                disabled={isSubmitting}
                {...register('description', { required: true })}
              />
              {errors.taskName && (
                <Text color="tomato" className="pt-2">
                  {errors.taskName.message}
                </Text>
              )}
            </div>
            <VStack align="left">
              <div className="flex">
                <FormLabel>Department</FormLabel>
                <CheckboxGroup>
                  <Stack spacing={[1, 5]} direction={['row', 'column']}>
                    <Checkbox value="Machine Learning" {...register('dept')}>
                      Machine Learning
                    </Checkbox>
                    <Checkbox
                      value="Software Development"
                      {...register('dept')}
                    >
                      Software Development
                    </Checkbox>
                    <Checkbox value="Blockchain" {...register('dept')}>
                      Blockchain
                    </Checkbox>
                    <Checkbox value="Internal Affairs" {...register('dept')}>
                      Internal Affairs
                    </Checkbox>
                    <Checkbox value="External Relations" {...register('dept')}>
                      External Relations
                    </Checkbox>
                  </Stack>
                </CheckboxGroup>
              </div>
            </VStack>
            <div>
              <FormLabel>Due Date</FormLabel>
              <Input
                placeholder="Select Date and Time"
                size="md"
                type="datetime-local"
                disabled={isSubmitting}
                {...register('due', { required: true })}
              />
              {errors.due && (
                <Text color="tomato" className="pt-2">
                  {errors.due.message}
                </Text>
              )}
            </div>

            {/* <DataTable data={data} setAssignees={setAssignees} /> */}
            {submitBefore}
            <div className="flex justify-between">
              <Button
                bgColor="#FF9900"
                width={150}
                textColor="white"
                onClick={redirectHome}
              >
                Back
              </Button>
              <Button
                bgColor="#4365DD"
                width={150}
                className="text-white"
                type="submit"
                disabled={isSubmitting}
                onClick={() => setSubmitBefore(true)}
              >
                Create Task
              </Button>
            </div>
          </VStack>
        </form>
      </Container>
    </>
  )
}

export default withAuth(TaskPage, true)

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  // If not logged in, redirect to the login page.
  // If he is an applicant, redirect him to the applicant page.
  // If he does not have admin access, redirect to the home page.
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    }
  } else if (session.isApplicant) {
    return {
      redirect: {
        destination: '/status',
        permanent: false,
      },
    }
  } else if (!session.isAdmin) {
    return {
      redirect: {
        destination: '/calendar',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
