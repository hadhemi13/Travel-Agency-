'use client'
import Choices from 'choices.js'
import {type Options as ChoiceOption} from 'choices.js'
import {type ReactElement, useEffect, useRef} from 'react'

export type ChoiceProp = Partial<ChoiceOption> & {
  children: ReactElement[]
  multiple?: boolean
  className?: string
  onChange?: (text: string) => void
}

const SelectFormInput = ({children, multiple, className, onChange, ...choiceOptions}: ChoiceProp) => {
  const selectE = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    if (selectE.current) {
      const choices = new Choices(selectE.current, {
        ...choiceOptions,
        placeholder: true,
        placeholderValue: 'Type and hit enter',
        allowHTML: true,
        shouldSort: false,
      })
      choices.passedElement.element.addEventListener('change', (e: Event) => {
        if (!(e.target instanceof HTMLSelectElement)) return
        if (onChange) {
          onChange(e.target.value)
        }
      })
    }
  }, [selectE])

  return (
      <select ref={selectE} multiple={multiple} className={className}>
        {children}
      </select>
  )
}

export default SelectFormInput
