import { Input, Text } from '@chakra-ui/react'
import type { UseFormRegister } from 'react-hook-form'

const DynamicInputField = ({
  edit,
  isSubmitting,
  register,
  field,
  fieldValue,
}: {
  edit: boolean
  isSubmitting: boolean
  register: UseFormRegister<any>
  field: string
  fieldValue: string | null
}) => {
  return (
    <>
      {edit ? (
        <Input
          size="xs"
          variant="flushed"
          htmlSize={26}
          width="auto"
          textColor="#01003D"
          className="font-extralight"
          fontSize="l"
          type="text"
          disabled={isSubmitting}
          {...register(field)}
        />
      ) : (
        <Text textColor="#01003D" className="text-base font-extralight">
          {fieldValue}
        </Text>
      )}
    </>
  )
}

export default DynamicInputField
