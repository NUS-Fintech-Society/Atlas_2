import { Box, Table, TableContainer, Tbody, Td, Tr } from '@chakra-ui/react'

type ProfilePageType = {
  gender: string | null
  batch: string | null
  year: string | null
  faculty: string | null
  major: string | null
  // projects: Projects[]
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
                GENDER
              </Td>
              <Td textColor="#002D70" className="font-light">
                {props.gender}
              </Td>
            </Tr>
            <Tr>
              <Td textColor="#002D70" className="font-medium">
                BATCH
              </Td>
              <Td textColor="#002D70" className="font-light">
                {props.batch}
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
            {/* <Tr>
              <Td textColor="#002D70" className="font-medium">
                PROJECTS
              </Td>
              {props.projects.map((project: Project) => {
                return (
                  <Td
                    key={project.project_id}
                    textColor="#002D70"
                    className="font-light"
                  >
                    {project.name}
                  </Td>
                )
              })}
            </Tr> */}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default ProfileInfo
