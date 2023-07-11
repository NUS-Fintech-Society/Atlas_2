import React, { useRef } from 'react'
import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react'

type AlertDialogProps = {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
  header: string
  body: string
  onClick?: () => void
}

const CustomDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  header,
  body,
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      {/* <Button colorScheme="red" onClick={onOpen}>
        {header}
      </Button> */}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {header}
            </AlertDialogHeader>

            <AlertDialogBody>{body}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="green" onClick={onClose} ml={3}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default CustomDialog
