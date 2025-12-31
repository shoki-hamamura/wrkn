'use client'

import { GroupChip } from '@/entities/group'
import { useGroups, useWarikanActions } from '@/entities/warikan'
import { AddGroupInput } from '@/features/add-group'
import { GroupPopover } from '@/features/adjust-group'

export interface GroupListProps {
  className?: string
}

export function GroupList({ className }: GroupListProps) {
  const groups = useGroups()
  const { removeGroup } = useWarikanActions()

  return (
    <div className={className}>
      <h2 className="mb-3 text-sm font-medium text-foreground-muted">
        グループ
      </h2>
      <div className="flex flex-wrap items-center gap-2">
        {groups.map((group) => (
          <GroupPopover
            key={group.id}
            group={group}
            trigger={
              <GroupChip group={group} onRemove={() => removeGroup(group.id)} />
            }
          />
        ))}
        <AddGroupInput />
      </div>
      {groups.length === 0 && (
        <p className="mt-2 text-sm text-foreground-muted">
          大人数の割り勘に便利です
        </p>
      )}
    </div>
  )
}
