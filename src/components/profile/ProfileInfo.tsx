import { Box, Table, TableContainer, Tbody, Td, Tr } from '@chakra-ui/react'

type ProfilePageType = {
  batch: string | undefined
}

const ProfileInfo = (props: ProfilePageType) => {
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
                BATCH
              </Td>
              <Td textColor="#002D70" className="font-light">
                {props.batch}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default ProfileInfo
