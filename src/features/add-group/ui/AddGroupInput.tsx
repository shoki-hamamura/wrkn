'use client'

import { useWarikanActions } from '@/entities/warikan'
import { AddItemInput } from '@/shared/ui'

export interface AddGroupInputProps {
  className?: string
}

export function AddGroupInput({ className }: AddGroupInputProps) {
  const { addGroup } = useWarikanActions()

  return (
    <AddItemInput
      onAdd={addGroup}
      placeholder="グループ名"
      ariaLabel="グループを追加"
      addLabel="追加"
      cancelLabel="キャンセル"
      className={className}
      buttonClassName="size-9 p-0"
    />
  )
}
