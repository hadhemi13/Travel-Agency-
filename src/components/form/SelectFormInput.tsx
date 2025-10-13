'use client'

import { type ReactElement } from 'react'

export type SelectFormInputProps = {
  children: ReactElement[]
  multiple?: boolean
  className?: string
  onChange?: (value: string) => void
  'data-search-enabled'?: string
}

const SelectFormInput = ({
  children,
  multiple,
  className = '',
  onChange,
  ...props
}: SelectFormInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value)
    }
  }

  return (
    <select
      multiple={multiple}
      className={`w-full h-14 px-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none ${className}`}
      onChange={handleChange}
      {...props}
    >
      {children}
    </select>
  )
}

export default SelectFormInput