'use client'

import { type ChangeEventHandler } from 'react'

interface AuthInputProps {
  name?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  required?: boolean
  type: 'text' | 'password' | 'email'
  value?: string | number | readonly string[]
}

const AuthInput: React.FC<AuthInputProps> = ({
  name,
  onChange,
  required,
  type,
  value,
}) => {
  return (
    <div className="relative mx-auto w-3/4 lg:w-1/2">
      <input
        className="text-md peer mx-auto block w-full appearance-none rounded-md px-6 pt-6 pb-1 focus:outline-none focus:ring-0"
        id={name}
        required={required}
        name={name}
        onChange={onChange}
        placeholder=" "
        type={type}
        value={value}
      />
      <label
        htmlFor={name}
        className="text-md absolute top-4 left-6 z-10 origin-[0] -translate-y-3 scale-75 transform text-zinc-400 duration-150 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75"
      >
        {name}
      </label>
    </div>
  )
}

export default AuthInput
