import { trpc } from '~/utils/trpc'
import {
  Button,
  Input,
  Select,
  useToast,
  InputGroup,
  Checkbox,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useState, useCallback } from 'react'
import { roles } from '~/constant/roles'

// For Frontend Form Validation
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert } from 'flowbite-react'
import { HiInformationCircle } from 'react-icons/hi'

const FormSchema = z.object({
  email: z.string().email(),
  id: z.string().min(1),
  isAdmin: z.boolean(),
  name: z.string(),
})

type FormSchemaType = z.infer<typeof FormSchema>

const SingleUserForm = () => {
  const router = useRouter()
  const { mutateAsync, isLoading } = trpc.user.createSingleUser.useMutation()
  const toast = useToast()
  const [department, setDepartment] = useState('')
  const [role, setRole] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  })

  const formSubmit = useCallback(
    async (formData: FormSchemaType) => {
      try {
        await mutateAsync({
          name: formData.name,
          department,
          email: formData.email,
          id: formData.id,
          isAdmin: formData.isAdmin,
          role,
        })
        toast({
          title: 'Successfully updated!',
          description: 'User successfully created',
          status: 'success',
          isClosable: true,
          duration: 9000,
        })
      } catch (e) {
        toast({
          title: 'Oops, something went wrong!',
          description: (e as Error).message,
          status: 'error',
          isClosable: true,
          duration: 9000,
        })
      }
    },
    [toast, department, role, mutateAsync]
  )

  return (
    <form onSubmit={handleSubmit(formSubmit)}>
      {(errors.email?.message || errors.id?.message) && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span>
            <p>{errors.email?.message || errors.id?.message}</p>
          </span>
        </Alert>
      )}

      <Input
        id="name"
        isRequired
        marginY={5}
        {...register('name')}
        placeholder="Name"
        variant="outline"
      />

      <Input
        id="id"
        isRequired
        marginBottom={5}
        {...register('id', { required: true })}
        placeholder="Matriculation Number"
        variant="outline"
      />

      <InputGroup>
        <Input
          id="email"
          isRequired
          marginBottom={5}
          {...register('email', { required: true })}
          placeholder="Email"
          variant="outline"
        />
      </InputGroup>

      <Select
        marginBottom={5}
        isRequired
        onChange={(e) => {
          // Potential bug in future if roles include ,
          const roleDeptArr = e.target.value.split(',')
          // If it is at "Select Role" (yet to select role)
          if (roleDeptArr.length <= 1) return
          const role = roleDeptArr[0] as string
          const dept = roleDeptArr[1] as string
          setRole(role)
          setDepartment(dept)
        }}
        placeholder="Select role"
      >
        {roles.map((role, index) => {
          return (
            <option key={index} value={`${role.role},${role.department}`}>
              {role.role} ({role.department})
            </option>
          )
        })}
      </Select>

      <Checkbox {...register('isAdmin')}>Give admin rights?</Checkbox>

      <div className="mt-5 flex">
        <Button
          bgColor="#97AEFF"
          className="mr-5 font-normal text-black"
          onClick={() => router.back()}
        >
          Return
        </Button>

        <Button
          bg="#97AEFF"
          className="text-black "
          isLoading={isLoading}
          type="submit"
        >
          Create User
        </Button>
      </div>
    </form>
  )
}

export default SingleUserForm
