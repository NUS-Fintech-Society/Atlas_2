import { type ChangeEventHandler } from 'react'
import { clsx } from 'clsx'

const Input = ({
  className,
  name,
  onChange,
  placeholder,
  required,
  type,
  value,
}: InputType) => {
  return (
    <input
      className={clsx(className, 'w-full pl-4 py-2 outline outline-gray-200')}
      id={name}
      required={required}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      value={value}
    />
  )
}

export default Input

type InputType = {
  className?: string
  name?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  placeholder?: string
  required?: boolean
  type: 'text' | 'password'
  value?: string | number | readonly string[]
}
