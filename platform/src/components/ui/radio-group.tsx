'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  name?: string
}

interface RadioGroupItemProps extends React.HTMLAttributes<HTMLInputElement> {
  value: string
  label: string
  name?: string
  checked?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, children, value, onValueChange, name = 'radio-group', ...props }, ref) => {
    const id = React.useId()
    const groupName = name || `radio-group-${id}`

    return (
      <div
        ref={ref}
        className={cn('flex gap-2', className)}
        role="radiogroup"
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement<RadioGroupItemProps>(child)) {
            return React.cloneElement(child, {
              name: groupName,
              checked: child.props.value === value,
              onChange: () => onValueChange?.(child.props.value),
            })
          }
          return child
        })}
      </div>
    )
  }
)
RadioGroup.displayName = 'RadioGroup'

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, label, name, checked, onChange, ...props }, ref) => {
    return (
      <label className="relative flex-1 cursor-pointer">
        <input
          ref={ref}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="sr-only"
          {...props}
        />
        <span
          className={cn(
            'flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200',
            checked
              ? 'bg-[#e52129] text-white border-[#e52129] shadow-sm'
              : 'bg-white text-gray-600 border-gray-300 hover:border-[#e52129]/50 hover:text-[#e52129]',
            className
          )}
        >
          {label}
        </span>
      </label>
    )
  }
)
RadioGroupItem.displayName = 'RadioGroupItem'

export { RadioGroup, RadioGroupItem }