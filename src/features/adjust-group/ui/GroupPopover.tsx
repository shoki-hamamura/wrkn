'use client'

import { type ReactElement, useState } from 'react'
import type { ParticipantGroup } from '@/entities/group'
import { BIAS_PRESETS } from '@/entities/member'
import { useWarikanActions } from '@/entities/warikan'
import { MAX_GROUP_COUNT, MIN_GROUP_COUNT } from '@/shared/constants'
import {
  Button,
  Input,
  Popover,
  PopoverHeader,
  PopoverTitle,
  Slider,
} from '@/shared/ui'

export interface GroupPopoverProps {
  group: ParticipantGroup
  trigger: ReactElement
}

export function GroupPopover({ group, trigger }: GroupPopoverProps) {
  const { updateGroupCount, updateGroupBias, updateGroupName } =
    useWarikanActions()
  const [localCount, setLocalCount] = useState(group.count)
  const [localBias, setLocalBias] = useState(group.bias)
  const [localName, setLocalName] = useState(group.name)

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setLocalCount(group.count)
      setLocalBias(group.bias)
      setLocalName(group.name)
    } else {
      if (localCount !== group.count) {
        updateGroupCount(group.id, localCount)
      }
      if (localBias !== group.bias) {
        updateGroupBias(group.id, localBias)
      }
      if (localName !== group.name && localName.trim()) {
        updateGroupName(group.id, localName)
      }
    }
  }

  const handleCountChange = (value: string) => {
    const num = Number.parseInt(value, 10)
    if (!Number.isNaN(num)) {
      setLocalCount(Math.max(MIN_GROUP_COUNT, Math.min(MAX_GROUP_COUNT, num)))
    }
  }

  return (
    <Popover trigger={trigger} onOpenChange={handleOpenChange}>
      <PopoverHeader>
        <PopoverTitle>グループ設定</PopoverTitle>
      </PopoverHeader>

      <div className="space-y-4">
        <div>
          <span className="mb-2 block text-sm font-medium text-foreground-muted">
            グループ名
          </span>
          <Input
            value={localName}
            onChange={setLocalName}
            placeholder="グループ名"
            className="h-9"
          />
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-foreground-muted">
            人数
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setLocalCount(Math.max(MIN_GROUP_COUNT, localCount - 1))
              }
              disabled={localCount <= MIN_GROUP_COUNT}
            >
              -
            </Button>
            <input
              type="number"
              value={localCount}
              onChange={(e) => handleCountChange(e.target.value)}
              min={MIN_GROUP_COUNT}
              max={MAX_GROUP_COUNT}
              className="h-9 w-20 rounded-lg border border-border bg-surface px-3 text-center text-foreground"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setLocalCount(Math.min(MAX_GROUP_COUNT, localCount + 1))
              }
              disabled={localCount >= MAX_GROUP_COUNT}
            >
              +
            </Button>
            <span className="text-sm text-foreground-muted">人</span>
          </div>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-foreground-muted">
            負担割合
          </span>
          <Slider
            value={localBias}
            onChange={setLocalBias}
            min={0.5}
            max={2.0}
            step={0.1}
          />
          <p className="mt-2 text-center text-2xl font-bold text-foreground">
            {localBias.toFixed(1)}倍
          </p>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-foreground-muted">
            プリセット
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(BIAS_PRESETS).map(([key, preset]) => (
              <Button
                key={key}
                size="sm"
                variant={localBias === preset.value ? 'primary' : 'outline'}
                onClick={() => setLocalBias(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
            <Button
              size="sm"
              variant={localBias === 1.0 ? 'primary' : 'outline'}
              onClick={() => setLocalBias(1.0)}
            >
              標準
            </Button>
          </div>
        </div>
      </div>
    </Popover>
  )
}
