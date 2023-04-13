import { BsFillPencilFill } from 'react-icons/bs'
import { Box } from '@chakra-ui/react'

const EditIcon = ({ active }: { active: boolean }) => {
  return (
    <Box
      backgroundColor={active ? '#445BAE' : '#97AEFF'}
      padding={1}
      borderRadius={5}
      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
    >
      <BsFillPencilFill />
    </Box>
  )
}

export default EditIcon
