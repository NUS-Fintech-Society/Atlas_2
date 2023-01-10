import { trpc } from '../../../utils/trpc'
import {
  Button,
  Input,
  Select,
  useToast,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Layout from '~/components/common/Layout'
import { useState, type FormEvent } from 'react'

const UserForm = () => {
  const router = useRouter()
  const { mutateAsync, isLoading } = trpc.member.createSingleUser.useMutation()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [level, setLevel] = useState('')
  const [id, setId] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      if (email.endsWith('@u.nus.edu')) {
        toast({
          title: 'Incorrect email format',
          description: 'Remove the domain',
          status: 'error',
          duration: 3000,
        })
        return
      }

      setEmail(email + '@u.nus.edu')
      await mutateAsync({ email, password, level, id })
      toast({
        title: 'Successfully updated!',
        description: 'User successfully created',
        status: 'success',
        isClosable: true,
        duration: 9000,
      })
    } catch (e) {
      toast({
        title: 'Successfully updated!',
        description: 'User successfully created',
        status: 'success',
        isClosable: true,
        duration: 9000,
      })
    }
  }

  return (
    <Layout>
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
          <InputRightAddon> @u.nus.edu </InputRightAddon>
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
          <option value="super">Admin</option>
        </Select>

        <div className="flex">
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
    </Layout>
  )
}

export default UserForm
