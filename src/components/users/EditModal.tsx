import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
} from '@chakra-ui/react'

import { useForm } from 'react-hook-form'
import { trpc } from '~/utils/trpc'
import { useContext } from 'react'
import { ModalContext } from '~/context/ModalContext'
import type { User } from '~/server/db/models/User'

const EditModal = () => {
  const modal = useContext(ModalContext)
  const toast = useToast()
  const { register, handleSubmit } = useForm({
    mode: 'onSubmit',
  })

  const { data, isLoading } = trpc.user.getUserProfile.useQuery(modal.id)
  const { mutateAsync } = trpc.user.updateUserProfile.useMutation()

  const onSubmit = async (data: any) => {
    try {
      const projData = {
        id: data.id,
        name: data.name,
        email: data.email,
        department: data.department,
        role: data.roles,
      }
      await mutateAsync(projData)
      toast({
        duration: 9000,
        description: 'User has been successfully updated',
        title: 'Successfully updated',
        status: 'success',
      })
    } catch (e) {
      toast({
        duration: 9000,
        description: (e as Error).message,
        title: 'Oops, something went wrong',
        status: 'error',
      })
    }
  }

  if (!modal.id || isLoading) return null

  return (
    <Modal isOpen={modal.isOpen} onClose={modal.onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
          <ModalHeader>Edit User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* for form in modal */}

            <FormControl isRequired>
              <FormLabel fontWeight={'semibold'}>Metric No.</FormLabel>
              <Input
                {...register('id')}
                mb={'5'}
                type="text"
                defaultValue={(data as User).id}
              />

              <FormLabel fontWeight={'semibold'}>Name</FormLabel>
              <Input
                mb={'5'}
                type="text"
                {...register('name')}
                defaultValue={(data as User).name}
              />

              <FormLabel fontWeight={'semibold'}>Email address</FormLabel>
              <Input
                mb={'5'}
                {...register('email')}
                type="email"
                defaultValue={(data as User).email}
              />

              <FormLabel fontWeight={'semibold'}>Department</FormLabel>
              <Select
                mb={'5'}
                {...register('department')}
                defaultValue={(data as User).department}
              >
                <option value="EXCO">EXCO</option>
                <option value="Software Development">
                  Software Development
                </option>
              </Select>

              <FormLabel fontWeight={'semibold'}>Role</FormLabel>
              <Select
                mb={'5'}
                {...register('roles')}
                defaultValue={(data as User).role}
              >
                <option value="President">President</option>
                <option value="Vice">Vice</option>
                <option value="SWE">SWE</option>
                <option value="Director">Director</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant={'ghost'} mr={3} onClick={modal.onClose}>
              Close
            </Button>
            <Button colorScheme="facebook" type="submit">
              Submit
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default EditModal
