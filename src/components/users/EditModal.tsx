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
import { useContext, useCallback, useState } from 'react'
import { ModalContext } from '~/context/ModalContext'
import type { User } from '~/server/db/models/User'
import { roles } from '~/constant/roles'

const EditModal = () => {
  const modal = useContext(ModalContext)
  const toast = useToast()
  const [department, setDepartment] = useState('')
  const { register, handleSubmit } = useForm({
    mode: 'onSubmit',
  })

  const { data, isLoading, refetch } = trpc.user.getUserProfile.useQuery(
    modal.id
  )
  const { mutateAsync, isLoading: loading } =
    trpc.user.updateUserProfile.useMutation()

  const onSubmit = useCallback(
    async (data: Partial<User>) => {
      try {
        const projData = {
          id: data.id as string,
          name: data.name as string,
          email: data.email as string,
          department,
          role: data.role as string,
        }
        await mutateAsync(projData)
        await refetch()
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
    },
    [mutateAsync, toast, department, refetch]
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

              <FormLabel fontWeight={'semibold'}>Role</FormLabel>
              <Select
                marginBottom={5}
                isRequired
                {...register("role")}
                onChange={(e) => {
                  if (!e.target.value) return
                  const element = roles.filter(
                    (role) => role.role === e.target.value
                  )
                  if (!element || !element.length || !element[0]) return
                  setDepartment(element[0].department)
                }}
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
