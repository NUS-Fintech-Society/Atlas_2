import {
    Button,
    Box,
    Flex,
    ModalHeader,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalFooter,
    Container,
    useToast,
    VStack,
    FormLabel,
    Input,
    CheckboxGroup,
    Checkbox,
    Stack,
    Text,
    Textarea,
} from '@chakra-ui/react'
import { useContext, useState } from 'react'
import { ModalContext } from '~/context/ModalContext'
import { trpc } from '~/utils/trpc'
import LoadingScreen from '../common/LoadingScreen'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'
import { type BodyProps } from '~/types/event/event.type'
import { useRouter } from 'next/router'
import { z } from 'zod'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DataTable } from '../events/DataTable'

const CreateEventModal = () => {

    const modal = useContext(ModalContext)
    const { data, isLoading } = trpc.event.getEvent.useQuery(modal.id)

    if (!modal.id) {
        return null
    }

    // const methods = useForm();

    return (
        <Modal
            isCentered
            isOpen={modal.isOpen}
            onClose={modal.onClose}
            scrollBehavior="inside"
        // blockScrollOnMount={false}
        >
            <ModalOverlay />
            <ModalContent minW="1000px" borderRadius="1.2rem" overflowY={"scroll"}>
                <ModalHeader className="bg-[#01003D] text-white">
                    {isLoading ? (
                        'Please wait while we are fetching the event'
                    ) : (
                        <Header data={data} />
                    )}
                </ModalHeader>
                <ModalBody className="text-xl" textColor="#01003D">
                    {isLoading ? <LoadingScreen /> : <Body data={data} />}
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
                    // disabled={isSubmitting}
                    // onClick={() => setSubmitBefore(true)}
                    >
                        Submit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

const Header: React.FC<{ data: BodyProps | null | undefined }> = ({ data }) => {
    if (!data) {
        return <></>
    }

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

const Body: React.FC<{ data: BodyProps | null | undefined }> = ({ data: info }) => {
    const router = useRouter()
    const toast = useToast()
    const [attendees, setAttendees] = useState<string[]>([])
    const [department, setDepartment] = useState<string[]>([])
    const [submitBefore, setSubmitBefore] = useState(false) // hacky use for attendees validation
    const [isQrRequired, setIsQrRequired] = useState(false)
    const FormSchema = z
        .object({
            eventName: z.string().min(1, { message: 'Invalid name' }),
            venue: z.string()
                .nonempty({
                    message: 'Venue must be specified, if not confirmed add (TBC)',
                }),
            description: z.string()
                .nonempty({
                    message: 'Please add a brief description',
                })
                .length(50, { message: 'Max 50 words allowed' }),
            dept: z
                .array(
                    z.string({
                        required_error: 'At least one department must be chosen',
                        invalid_type_error: 'At least one department must be chosen',
                    })
                )
                .nonempty({
                    message: 'At least one department must be chosen',
                }),
            startDate: z.preprocess((arg) => {
                if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
            }, z.date().min(new Date(), { message: 'Invalid date' }).max(new Date('2100'), { message: 'Invalid date' })),
            endDate: z.preprocess((arg) => {
                if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
            }, z.date().min(new Date(), { message: 'Invalid date' }).max(new Date('2100'), { message: 'Invalid date' })),
            secretCode: z.string().length(6, { message: "Must be exactly 6 characters long" }),
        })
        .refine(
            (data) => {
                const { startDate, endDate } = data
                return startDate <= endDate
            },
            {
                message: 'End date cannot be earlier than start date',
                path: ['endDate'],
            }
        )

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
    const invalidDepartment = attendees.length === 0

    const formSubmit = async (formData: FormSchemaType) => {
        try {
            // Hacky soluton since attendees not linked to React-hook-form
            if (invalidAttendees) {
                return false
            }

            if (invalidDepartment) {
                return false
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

            router.push('/events')
        } catch (e) {
            toast({
                description: (e as Error).message,
                duration: 3000,
                status: 'error',
                title: 'Oops, an error occured!',
            })
        }
    }


    const redirectHome = () => router.push('/events')

    if (!info) return <LoadingScreen />
    if (!data) return <LoadingScreen />

    dayjs.extend(LocalizedFormat)
    const startDate = dayjs(info.startDate).format('lll')
    const endDate = dayjs(info.endDate).format('lll')

    return (
        <Container>
            <form onSubmit={handleSubmit(formSubmit)}>
                <VStack align="left" spacing="6">
                    <div>
                        <FormLabel>Event Name</FormLabel>
                        <Input
                            type="text"
                            disabled={isSubmitting}
                            {...register('eventName', { required: true })}
                        />
                        {errors.eventName && (
                            <Text color="tomato" className="pt-2">
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
                            <Text color="tomato" className="pt-2">
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
                            <Text color="tomato" className="pt-2">
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
                            <Text color="tomato" className="pt-2">
                                {'At least one department is required'}
                            </Text>
                        )}
                    </VStack>
                    <DataTable data={data} setAttendees={setAttendees} />
                    {submitBefore && invalidAttendees && (
                        <Text color="tomato">At least one attendee is required</Text>
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
                            <Text color="tomato" className="pt-2">
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
                            <Text color="tomato" className="pt-2">
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
                            <Text color="tomato" className="pt-2">
                                {errors.secretCode.message}
                            </Text>
                        )}
                    </div>
                </VStack>
            </form>
        </Container>
    )
}

export default CreateEventModal
