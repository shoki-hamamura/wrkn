'use client'

import { Users } from 'lucide-react'
import { MemberChip } from '@/entities/member'
import { useMembers, useWarikanActions } from '@/entities/warikan'
import { AddMemberInput } from '@/features/add-member'
import { BiasPopover } from '@/features/adjust-bias'

export interface MemberListProps {
  className?: string
}

export function MemberList({ className }: MemberListProps) {
  const members = useMembers()
  const { removeMember } = useWarikanActions()

  return (
    <div className={className}>
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground-muted">
        <Users className="size-4 text-primary" aria-hidden="true" />
        メンバー（立替者）
      </h2>
      <div className="flex flex-wrap items-center gap-2">
        {members.map((member) => (
          <BiasPopover
            key={member.id}
            member={member}
            trigger={
              <MemberChip
                member={member}
                onRemove={() => removeMember(member.id)}
              />
            }
          />
        ))}
        <AddMemberInput />
      </div>
      {members.length === 0 && (
        <p className="mt-2 text-sm text-foreground-muted">
          メンバーを追加してください
        </p>
      )}
    </div>
  )
}
