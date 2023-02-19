import { trpc } from '~/utils/trpc'
import {
  Button,
  TableContainer,
  Table,
  Thead,
  Text,
  Tbody,
  useDisclosure,
} from '@chakra-ui/react'
import LoadingScreen from '~/components/common/LoadingScreen'
import ProfileInfoModal from '~/components/users/ProfileModal'
import { useState } from 'react'
import type { Session } from 'next-auth'

// TODO: ABLE TO SEND EMAIL TO A USER NEXT TIME
const UserTable = ({ session }: { session: Session }) => {
  const { isLoading, data } = trpc.user.getAllUsers.useQuery()
  const [selected, setSelected] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (isLoading) return <LoadingScreen />

  const render = data?.map((data) => (
    <tr key={data.id} className="text-center">
      <td>
        <Button
          variant="link"
          colorScheme="black"
          onClick={(e) => {
            e.preventDefault()
            setSelected(data.id)
            onOpen()
          }}
        >
          {data.id}
        </Button>
      </td>
      <td>{data.name}</td>
      <td>{data.roles}</td>
      <td>{data.department}</td>
    </tr>
  ))

  return (
    <div className="mt-5">
      {render && render?.length ? (
        <>
          <TableContainer className="border-4 border-black">
            <Table
              align="center"
              variant="striped"
              colorScheme="teal"
              size="sm"
            >
              <Thead>
                <tr className="text-center">
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Telegram</th>
                  <th>Department</th>
                </tr>
              </Thead>
              <Tbody>{render}</Tbody>
            </Table>
          </TableContainer>
          <ProfileInfoModal
            session={session}
            isOpen={isOpen}
            onClose={onClose}
            studentId={selected}
          />
        </>
      ) : (
        <Text fontSize="xl" fontWeight="bold">
          No users found
        </Text>
      )}
    </div>
  )
}

export default UserTable
