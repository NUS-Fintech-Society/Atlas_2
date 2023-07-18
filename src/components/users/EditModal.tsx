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
import { useRouter } from 'next/router'
import { trpc } from '~/utils/trpc'
import { useContext, useCallback } from 'react'
import { ModalContext } from '~/context/ModalContext'
import type { User } from '~/server/db/models/User'
import { roles } from '~/constant/roles'

const EditModal = () => {
  const modal = useContext(ModalContext)
  const toast = useToast()
  const router = useRouter()

  const { register, handleSubmit } = useForm({
    mode: 'onSubmit',
  })

  const { data, isLoading } = trpc.user.getUserProfile.useQuery(
    modal.id
  )
  const { mutateAsync, isLoading: loading } =
    trpc.user.updateUserProfile.useMutation()
  const { refetch } = trpc.user.getAllUsersForTable.useQuery()

  const onSubmit = useCallback(
    async (formData: Partial<User>) => {
      try {
        const filteredRole = roles.find(role => role.role === formData.role)

        const department = filteredRole ? filteredRole.department : data?.department

        await mutateAsync({
          id: data?.id as string,
          name: formData.name as string,
          email: formData.email as string,
          department: department as string,
          role: formData.role as string,
        })

        await refetch()

        toast({
          duration: 3000,
          description: 'User has been successfully updated',
          title: 'Successfully updated',
          status: 'success',
        })

        modal.onClose()
      } catch (e) {
        toast({
          duration: 9000,
          description: (e as Error).message,
          title: 'Oops, something went wrong',
          status: 'error',
        })
      }
    },
    [mutateAsync, data?.id, toast, data?.department, router, refetch]
  )

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
            <FormControl>
              <FormLabel fontWeight={'semibold'}>Name</FormLabel>
              <Input
                mb={'5'}
                type="text"
                {...register('name')}
                defaultValue={(data as User).name}
              />

              <FormLabel fontWeight={'semibold'}>NUS Email</FormLabel>
              <Input
                mb={'5'}
                {...register('email')}
                type="email"
                defaultValue={(data as User).email}
              />

              <FormLabel fontWeight={'semibold'}>Role</FormLabel>
              <Select
                marginBottom={5}
                isRequired
                defaultValue={(data as User).role}
                {...register('role')}
                placeholder="Select role"
              >
                {roles.map((role, index) => {
                  return (
                    <option key={index} value={role.role}>
                      {role.role} ({role.department})
                    </option>
                  )
                })}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant={'ghost'} mr={3} onClick={modal.onClose}>
              Close
            </Button>
            <Button colorScheme="facebook" type="submit" disabled={loading}>
              Submit
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default EditModal
