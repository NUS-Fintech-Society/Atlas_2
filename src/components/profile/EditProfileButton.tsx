import { IconContext } from 'react-icons'
import { Box, Button } from '@chakra-ui/react'
import EditIcon from './EditIcon'

const EditProfileBtn = ({
  onEdit,
  edit,
}: {
  studentId: string | null
  onEdit: () => void
  edit: boolean
}) => {
  return (
    <Box className="absolute top-7 right-5">
      <Button
        variant="ghost"
        size="xs"
        onClick={onEdit}
        _hover={{ bg: 'None' }}
      >
        <IconContext.Provider value={{ size: '20px' }}>
          <EditIcon active={edit} />
        </IconContext.Provider>
      </Button>
    </Box>
  )
}

export default EditProfileBtn
