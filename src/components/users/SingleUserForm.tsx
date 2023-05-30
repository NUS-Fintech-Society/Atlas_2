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

const roles = [
  {
    department: 'Software Engineering',
    role: 'Software Engineer',
  },
  {
    department: 'Software Engineering',
    role: 'Technical Lead',
  },
  {
    department: 'Software Engineering',
    role: 'UI/UX Designer',
  },
  {
    department: 'Software Engineering',
    role: 'Head of Design',
  },
  {
    department: 'Software Engineering',
    role: 'Co-Director',
  },
  {
    department: 'Blockchain',
    role: 'Co-Director',
  },
  {
    department: 'Blockchain',
    role: 'Core Developer',
  },
  {
    department: 'Blockchain',
    role: 'Community Manager',
  },
  {
    department: 'Blockchain',
    role: 'Developer',
  },
  {
    department: 'Blockchain',
    role: 'Lead Developer',
  },
  {
    department: 'Blockchain',
    role: 'Research Analyst',
  },
  {
    department: 'Blockchain',
    role: 'Research Community Developer',
  },
  {
    department: 'Machine Learning',
    role: 'Quant Tech Analyst',
  },
  ,
  {
    department: 'Machine Learning',
    role: 'Quant Tech Lead',
  },
  {
    department: 'Machine Learning',
    role: 'Quant wing head',
  },
  {
    department: 'Machine Learning',
    role: 'Project Tech Analyst',
  },
  {
    department: 'Machine Learning',
    role: 'Project Tech Lead',
  },
  {
    department: 'Machine Learning',
    role: 'Tech Analyst/Trainee',
  },
  {
    department: 'Machine Learning',
    role: 'Training Head',
  },
  {
    department: 'Internal Affairs',
    role: 'Co-Director',
  },
  {
    department: 'Internal Affairs',
    role: 'Community Development Executive',
  },
  {
    department: 'Internal Affairs',
    role: 'Community Development Lead',
  },
  {
    department: 'Internal Affairs',
    role: 'Finance Executive',
  },
  {
    department: 'Internal Affairs',
    role: 'Finance Lead',
  },
  {
    department: 'Internal Affairs',
    role: 'Project Manager Executive',
  },
  {
    department: 'Internal Affairs',
    role: 'Product Manager',
  },
  {
    department: 'Internal Affairs',
    role: 'Talent Management Executive',
  },
  {
    department: 'Internal Affairs',
    role: 'Talent Management Lead',
  },
  {
    department: 'External Relations',
    role: 'Partnerships Executive',
  },
  {
    department: 'External Relations',
    role: 'Director',
  },
  {
    department: 'External Relations',
    role: 'Marketing Executive',
  },
  {
    department: 'External Relations',
    role: 'Marketing Lead',
  },
  {
    department: 'External Relations',
    role: 'Partnerships Lead',
  },
  {
    department: 'External Relations',
    role: 'Finance Executive',
  },
  {
    department: 'External Relations',
    role: 'Finance Lead',
  },
] as { department: string; role: string }[]

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
