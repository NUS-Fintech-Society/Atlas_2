import { clsx } from 'clsx'
import type { MouseEventHandler } from 'react'

const Button = ({
  className,
  children,
  disabled,
  isLoading,
  onClick,
  type,
}: ButtonType) => {
  return (
    <button
      className={clsx(
        className, // ADDITIONAL PROPERTIES IF REQUIRED
        'rounded-md px-4 py-2 font-bold text-white', // COMMON PROPERTIES
        !isLoading && 'bg-[#4365DD]', // DEFAULT COLOUR WHEN NOT LOADING
        isLoading && 'bg-[#7996FC]', // DEFAULT WHEN LOADING
        'hover:bg-[#7996FC]', // ON HOVER
        'disabled:bg-gray-200 disabled:hover:bg-gray-200' // WHEN BUTTON IS DISABLED
      )}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  )
}

/**
 * children: The button text
 * className: Additional properties
 * disabled: Disables the button
 * isLoading: Shows the loading text
 * onClick: Click Handler
 * type: Used when submitting forms
 */
type ButtonType = {
  children: string | JSX.Element
  className?: string
  disabled?: boolean
  isLoading?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  type?: 'submit' | 'button'
}

export default Button
