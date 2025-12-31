'use client'

import { useState, type KeyboardEvent } from 'react'
import { cn } from '@/shared/lib'
import { Button, Input } from '@/shared/ui'
import { useWarikanActions } from '@/entities/warikan'

export interface AddMemberInputProps {
  className?: string
}

export function AddMemberInput({ className }: AddMemberInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const { addMember } = useWarikanActions()

  const handleSubmit = () => {
    if (name.trim()) {
      addMember(name.trim())
      setName('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
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
        className={cn('rounded-full', className)}
        aria-label="メンバーを追加"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-4"
        >
          <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
        </svg>
      </Button>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Input
        value={name}
        onChange={setName}
        onKeyDown={handleKeyDown}
        placeholder="名前を入力"
        className="h-8 w-32"
        autoFocus
      />
      <Button size="sm" onClick={handleSubmit} disabled={!name.trim()}>
        追加
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => {
          setIsOpen(false)
          setName('')
        }}
      >
        キャンセル
      </Button>
    </div>
  )
}
