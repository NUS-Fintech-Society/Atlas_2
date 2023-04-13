import { BsCheckLg } from 'react-icons/bs'
import { Box } from '@chakra-ui/react'

const CheckIcon = () => {
  return (
    <Box
      backgroundColor="#97AEFF"
      padding={1}
      borderRadius={5}
      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
    >
      <BsCheckLg />
    </Box>
  )
}

export default CheckIcon
