import { IconContext } from 'react-icons'
import { Box, Button } from '@chakra-ui/react'
import CheckIcon from './CheckIcon'

const SubmitEditBtn = () => {
  return (
    <Box className="absolute bottom-7 right-5">
      <Button variant="ghost" size="xs" _hover={{ bg: 'None' }} type="submit">
        <IconContext.Provider value={{ size: '20px' }}>
          <CheckIcon />
        </IconContext.Provider>
      </Button>
    </Box>
  )
}

export default SubmitEditBtn
