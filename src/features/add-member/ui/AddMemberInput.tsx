'use client'

import { useWarikanActions } from '@/entities/warikan'
import { AddItemInput } from '@/shared/ui'

export interface AddMemberInputProps {
  className?: string
}

export function AddMemberInput({ className }: AddMemberInputProps) {
  const { addMember } = useWarikanActions()

  return (
    <AddItemInput
      onAdd={addMember}
      placeholder="名前を入力"
      ariaLabel="メンバーを追加"
      addLabel="追加"
      cancelLabel="キャンセル"
      className={className}
    />
  )
}
