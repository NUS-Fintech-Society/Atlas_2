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

const SingleUserForm = () => {
  const router = useRouter()
  const { mutateAsync, isLoading } = trpc.user.createSingleUser.useMutation()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [department, setDepartment] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [id, setId] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const handleSubmit = useCallback(async () => {
    try {
      await mutateAsync({
        name,
        department,
        email,
        password,
        id,
        isAdmin,
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
  }, [department, email, id, isAdmin, mutateAsync, name, password, role, toast])

  return (
    <>
      <Input
        id="name"
        isRequired
        marginY={5}
        name="name"
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        value={name}
        variant="outline"
      />

      <Input
        id="id"
        isRequired
        marginBottom={5}
        name="id"
        onChange={(e) => setId(e.target.value)}
        placeholder="Matriculation Number"
        value={id}
        variant="outline"
      />

      <InputGroup>
        <Input
          id="email"
          isRequired
          marginBottom={5}
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          value={email}
          variant="outline"
        />
      </InputGroup>

      <Input
        id="password"
        marginBottom={5}
        name="password"
        type="password"
        isRequired
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        value={password}
        variant="outline"
      />

      <Select
        marginBottom={5}
        isRequired
        onChange={(e) => {
          setRole(e.target.value)
          if (!e.target.value) return
          const element = roles.filter((role) => role.role === e.target.value)
          if (!element || !element.length || !element[0]) return
          setDepartment(element[0].department)
        }}
        placeholder="Select role"
      >
        {roles.map((role) => {
          return (
            <option key={role.role} value={role.role}>
              {role.role} ({role.department})
            </option>
          )
        })}
      </Select>

      <Checkbox
        onChange={(e) => {
          e.preventDefault()
          setIsAdmin(!isAdmin)
        }}
      >
        Give admin rights?
      </Checkbox>

      <div className="mt-5 flex">
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
          isLoading={isLoading}
          onClick={handleSubmit}
        >
          Create User
        </Button>
      </div>
    </>
  )
}

export default SingleUserForm
