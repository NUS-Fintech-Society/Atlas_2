import {
    Box,
    Button,
    Checkbox,
    CheckboxGroup,
    Container,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    Textarea,
    VStack,
    useToast
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { ModalContext } from '~/context/ModalContext'
import { trpc } from '~/utils/trpc'
import LoadingScreen from '../common/LoadingScreen'
import type { Attendees } from '../events/DataTable'
import { DataTable } from '../events/DataTable'
import createEventFormSchema from '../utilities/calendar/createEventFormSchema'

type useInFormProps = {
    setAttendees: React.Dispatch<React.SetStateAction<string[]>>;
    invalidAttendees: boolean;
    register: any;
    errors: any;
    isSubmitting: boolean;
    submitBefore: boolean;
};

const CreateEventModal = () => {
    const modal = useContext(ModalContext)

    if (!modal.id) {
        console.log("modal id is undefined")
        // return null
    }

    const router = useRouter()
    const toast = useToast()
    const [attendees, setAttendees] = useState<string[]>([])
    // hacky use for attendees validation
    const [submitBefore, setSubmitBefore] = useState(false)
    const FormSchema = createEventFormSchema()

    type FormSchemaType = z.infer<typeof FormSchema>

    // useForm for state management except attendees which belongs in DataTable (child)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema),
    })

    const { data } = trpc.attendance.getAllAttendanceButSelf.useQuery()
    const { mutateAsync, isLoading: isSubmitting } =
        trpc.event.createEvent.useMutation()

    const invalidAttendees = attendees.length === 0
    const useInForm = { setAttendees, invalidAttendees, register, errors, isSubmitting, submitBefore }

    if (!data) return <LoadingScreen />

    const formSubmit = async (formData: FormSchemaType) => {
        try {
            // Hacky soluton since attendees not linked to React-hook-form
            if (invalidAttendees) {
                throw new Error("At least one attendee must be selected")
            }

            await mutateAsync({
                name: formData.eventName,
                startDate: new Date(formData.startDate),
                endDate: new Date(formData.endDate),
                venue: formData.venue,
                departments: formData.dept,
                secretCode: formData.secretCode,
                description: formData.description,
                invitedAttendees: attendees,
            })
            toast({
                duration: 3000,
                status: 'success',
                title: 'Success',
                description: 'A new event has been successfully created',
            })
            modal.onClose()
        } catch (e) {
            toast({
                description: (e as Error).message,
                duration: 3000,
                status: 'error',
                title: 'Oops, an error occured!',
            })
        }
    }

    return (
        <Modal
            isCentered={true}
            isOpen={modal.isOpen}
            onClose={modal.onClose}
            scrollBehavior="inside"
        >
            <ModalOverlay />
            <ModalContent minW="1000px" borderRadius="1.2rem" overflowY={"scroll"}>
                <ModalHeader className="bg-[#01003D] text-white">
                    <Header />
                </ModalHeader>
                <form onSubmit={handleSubmit(formSubmit)}>
                    <ModalBody className="text-xl" textColor="#01003D">
                        <Body attendeeData={data} useInForm={useInForm} />
                    </ModalBody>
                    <ModalFooter display="flex" justifyContent="space-between">
                        <Button
                            bgColor="#0C1747"
                            width={150}
                            className="mb-10 text-white"
                            type="submit"
                            onClick={() => modal.onClose()}
                        >
                            Back
                        </Button>



                        <Button
                            bgColor="#0C1747"
                            width={215}
                            className="mb-10 text-white"
                            type="submit"
                            onClick={() => setSubmitBefore(true)}
                        >
                            Submit
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal >
    )
}

const Header: React.FC<object> = () => {
    return (
        <Box py={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize={30}
        >
            Create an Event
        </Box>

    )
}

const Body: React.FC<{ attendeeData: Attendees[], useInForm: useInFormProps }> = ({ attendeeData, useInForm }) => {
    if (!attendeeData) return <LoadingScreen />
    const { setAttendees, invalidAttendees, register, errors, isSubmitting, submitBefore }: useInFormProps = useInForm

    return (
        <Container>
            <VStack align="left" spacing="6">
                <div>
                    <FormLabel>Event Name</FormLabel>
                    <Input
                        type="text"
                        disabled={isSubmitting}
                        {...register('eventName', { required: true })}
                    />
                    {errors.eventName && (
                        <Text color="tomato" className="pt-1">
                            {errors.eventName.message}
                        </Text>
                    )}
                </div>
                <div>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                        disabled={isSubmitting}
                        maxH={200}
                        {...register('description', { required: true })}

                    />
                    {errors.description && (
                        <Text color="tomato" className="pt-1">
                            {errors.description.message}
                        </Text>
                    )}
                </div>
                <div>
                    <FormLabel>Venue</FormLabel>
                    <Input
                        type="text"
                        disabled={isSubmitting}
                        {...register('venue', { required: true })}
                    />
                    {errors.venue && (
                        <Text color="tomato" className="pt-1">
                            {errors.venue.message}
                        </Text>
                    )}
                </div>
                <VStack align="left">
                    <div className="flex">
                        <FormLabel>Department</FormLabel>
                        <CheckboxGroup>
                            <Stack spacing={[1, 5]} direction={['row', 'column']}>
                                <Checkbox value="Machine Learning" {...register('dept')}>
                                    Machine Learning
                                </Checkbox>
                                <Checkbox
                                    value="Software Development"
                                    {...register('dept')}
                                >
                                    Software Development
                                </Checkbox>
                                <Checkbox value="Blockchain" {...register('dept')}>
                                    Blockchain
                                </Checkbox>
                                <Checkbox value="Internal Affairs" {...register('dept')}>
                                    Internal Affairs
                                </Checkbox>
                                <Checkbox value="External Relations" {...register('dept')}>
                                    External Relations
                                </Checkbox>
                            </Stack>
                        </CheckboxGroup>
                    </div>
                    {errors.dept && (
                        <Text color="tomato" className="pt-1">
                            {'At least one department is required'}
                        </Text>
                    )}
                </VStack>
                <DataTable data={attendeeData} setAttendees={setAttendees} />
                {submitBefore && invalidAttendees && (
                    <Text color="tomato" className="pt-1">At least one attendee is required</Text>
                )}
                <div>
                    <FormLabel>Start Date</FormLabel>
                    <Input
                        placeholder="Select Date and Time"
                        size="md"
                        type="datetime-local"
                        disabled={isSubmitting}
                        {...register('startDate', { required: true })}
                    />
                    {errors.startDate && (
                        <Text color="tomato" className="pt-1">
                            {errors.startDate.message}
                        </Text>
                    )}
                </div>
                <div>
                    <FormLabel>End Date</FormLabel>
                    <Input
                        placeholder="Select Date and Time"
                        size="md"
                        type="datetime-local"
                        disabled={isSubmitting}
                        {...register('endDate', { required: true })}
                    />
                    {errors.endDate && (
                        <Text color="tomato" className="pt-1">
                            {errors.endDate.message}
                        </Text>
                    )}
                </div>
                <div>
                    <FormLabel>Secret Code</FormLabel>
                    <Input
                        type="text"
                        disabled={isSubmitting}
                        {...register('secretCode', { required: true })}
                    />
                    {errors.secretCode && (
                        <Text color="tomato" className="pt-1">
                            {errors.secretCode.message}
                        </Text>
                    )}
                </div>
            </VStack>
        </Container>
    )
}

export default CreateEventModal
