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
    
  } from '@chakra-ui/react'

  import { useForm } from "react-hook-form";
  import { trpc } from '~/utils/trpc';


interface editModalProps {
    editIsOpen: boolean;
    editOnClose: () => void;
    data: any;
}

const EditModal: React.FC<editModalProps> = props => {

    const { register, handleSubmit} = useForm({
      mode: "onSubmit"
    });

    const { mutateAsync, isLoading: isSubmitting } =
    trpc.member.updateProfile.useMutation()
    const onSubmit = async (data: any) => {
      try {
        const projData = {
          id: data.id,
          name: data.name,
          email: data.email,
          department: data.department,
          roles: data.roles,
        } 
        await mutateAsync(projData);
      } catch (e) {
        console.log(e);
      }
      
      
    }
    // console.log('projdata', props.data);
   
    

    return (
        <Modal isOpen={props.editIsOpen} onClose={props.editOnClose}>
            <ModalOverlay />
            <ModalContent>
              <form onSubmit={handleSubmit((data)=> onSubmit(data))}>
              <ModalHeader>Edit User</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                    {/* for form in modal */}
                    
                    <FormControl isRequired >
                        <FormLabel fontWeight={'semibold'}>Metric No.</FormLabel>
                        <Input {...register("id")} mb={'5'} type='text' defaultValue={props.data.id} />
                        
                        
                        <FormLabel fontWeight={'semibold'}>Name</FormLabel>
                        <Input mb={'5'} type='text'  
                          {...register("name")}  defaultValue={props.data.name} />
                        
                        <FormLabel fontWeight={'semibold'} >Email address</FormLabel>
                        <Input mb={'5'} {...register("email")} type='email' defaultValue={props.data.email} />
                        
                        <FormLabel fontWeight={'semibold'} >Department</FormLabel>
                        <Select mb={'5'} {...register("department")} defaultValue={props.data.department}>
                            <option value='EXCO'>EXCO</option>
                            <option value='Software Development'>Software Development</option>
                        </Select>
                        
                        <FormLabel fontWeight={'semibold'}>Role</FormLabel>
                        <Select mb={'5'} {...register("roles")} defaultValue={props.data.roles}>
                            <option value='President'>President</option>
                            <option value='Vice'>Vice</option>
                            <option value='SWE'>SWE</option>
                            <option value='Director'>Director</option>
                        </Select>
                        
                    </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button variant={'ghost'} mr={3} onClick={props.editOnClose}>
                  Close
                </Button>
                <Button colorScheme='facebook' type='submit'>Submit</Button>
              </ModalFooter>
              </form>
            </ModalContent>
            
          </Modal>
      )
}

export default EditModal;