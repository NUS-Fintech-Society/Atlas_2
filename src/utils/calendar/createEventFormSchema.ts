import { z } from 'zod'

const createEventFormSchema = () => {
    return (
        z.object({
            eventName: z.string().min(1, { message: 'Invalid name' }),
            venue: z.string()
                .nonempty({
                    message: 'Venue must be specified, if not confirmed add (TBC)',
                }),
            description: z.string()
                .nonempty({
                    message: 'Please add a brief description',
                })
                .max(150, { message: 'Max 50 words allowed' }),
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
    )


}

export default createEventFormSchema