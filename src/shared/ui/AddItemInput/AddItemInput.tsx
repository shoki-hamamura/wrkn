'use client'

import { Plus } from 'lucide-react'
import { type KeyboardEvent, useState } from 'react'
import { cn } from '@/shared/lib'
import { Button } from '../Button'
import { Input } from '../Input'

export interface AddItemInputProps {
  onAdd: (name: string) => void
  placeholder: string
  ariaLabel: string
  addLabel: string
  cancelLabel: string
  className?: string | undefined
  buttonClassName?: string | undefined
}

export function AddItemInput({
  onAdd,
  placeholder,
  ariaLabel,
  addLabel,
  cancelLabel,
  className,
  buttonClassName,
}: AddItemInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd(name.trim())
      setName('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleSubmit()
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setName('')
    }
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={cn('rounded-full', buttonClassName)}
        aria-label={ariaLabel}
      >
        <Plus className="size-4" aria-hidden="true" />
      </Button>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Input
        value={name}
        onChange={setName}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-9 w-32"
        autoFocus
      />
      <Button size="sm" onClick={handleSubmit} disabled={!name.trim()}>
        {addLabel}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => {
          setIsOpen(false)
          setName('')
        }}
      >
        {cancelLabel}
      </Button>
    </div>
  )
}
