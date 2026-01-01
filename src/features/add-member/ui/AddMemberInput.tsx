'use client'

import { Plus } from 'lucide-react'
import { type KeyboardEvent, useState } from 'react'
import { useWarikanActions } from '@/entities/warikan'
import { cn } from '@/shared/lib'
import { Button, Input } from '@/shared/ui'

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
        className={cn('rounded-full', className)}
        aria-label="メンバーを追加"
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
        placeholder="名前を入力"
        className="h-9 w-32"
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
