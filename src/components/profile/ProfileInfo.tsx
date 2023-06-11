import { Box, Table, TableContainer, Tbody, Td, Tr } from '@chakra-ui/react'
import type { User } from '~/server/db/models/User'

const ProfileInfo = (props: User) => {
  return (
    <Box
      backgroundColor="rgba(242, 235, 255, 0.58)"
      borderRadius="55px"
      padding={10}
      className="h-full"
    >
      <TableContainer>
        <Table variant="unstyled" size="sm">
          <Tbody>
            <Tr>
              <Td textColor="#002D70" className="font-medium">
                Dietary
              </Td>
              <Td textColor="#002D70" className="font-light">
                {props.dietary}
              </Td>
            </Tr>
            <Tr>
              <Td textColor="#002D70" className="font-medium">
                YEAR
              </Td>
              <Td textColor="#002D70" className="font-light">
                {props.year}
              </Td>
            </Tr>
            <Tr>
              <Td textColor="#002D70" className="font-medium">
                FACULTY
              </Td>
              <Td textColor="#002D70" className="font-light">
                {props.faculty}
              </Td>
            </Tr>
            <Tr>
              <Td textColor="#002D70" className="font-medium">
                MAJOR
              </Td>
              <Td textColor="#002D70" className="font-light">
                {props.major}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default ProfileInfo
