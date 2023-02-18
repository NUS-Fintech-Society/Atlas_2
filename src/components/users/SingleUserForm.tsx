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
import { useState, type FormEvent } from 'react'

const SingleUserForm = () => {
  const router = useRouter()
  const { mutateAsync } = trpc.member.createSingleUser.useMutation()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [level, setLevel] = useState('')
  const [id, setId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      setIsLoading(true)
      await mutateAsync({ email, password, level, id, isAdmin })
      toast({
        title: 'Successfully updated!',
        description: 'User successfully created',
        status: 'success',
        isClosable: true,
        duration: 9000,
      })
      setIsLoading(false)
    } catch (e) {
      setIsLoading(false)
      toast({
        title: 'Oops, something went wrong!',
        description: 'An error went wrong while creating the user',
        status: 'error',
        isClosable: true,
        duration: 9000,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        id="id"
        isRequired
        marginY={5}
        name="id"
        onChange={(e) => setId(e.target.value)}
        placeholder="Enter the student id"
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
          placeholder="Enter a email"
          value={email}
          variant="outline"
        />
      </InputGroup>

      <Input
        id="password"
        marginBottom={5}
        name="password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter a password. If no password is provided, a random one will be generated"
        value={password}
        variant="outline"
      />

      <Select
        marginBottom={5}
        isRequired
        onChange={(e) => setLevel(e.target.value)}
        placeholder="Select the level"
      >
        <option value="member">Member</option>
        <option value="lead">Lead</option>
        <option value="codirector">Co-Director</option>
        <option value="director">Director</option>
      </Select>

      <Checkbox
        onChange={(e) => {
          e.preventDefault()
          setIsAdmin(!isAdmin)
        }}
      >
        Give admin rights?
      </Checkbox>

      <div className="flex mt-5">
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
          type="submit"
        >
          Create User
        </Button>
      </div>
    </form>
  )
}

export default SingleUserForm
