'use client'

import type { ReactElement } from 'react'
import { BIAS_PRESETS, type Member } from '@/entities/member'
import { useWarikanActions } from '@/entities/warikan'
import {
  Button,
  Popover,
  PopoverHeader,
  PopoverTitle,
  Slider,
} from '@/shared/ui'

export interface BiasPopoverProps {
  member: Member
  trigger: ReactElement
}

export function BiasPopover({ member, trigger }: BiasPopoverProps) {
  const { updateMemberBias } = useWarikanActions()

  const handlePreset = (value: number) => {
    updateMemberBias(member.id, value)
  }

  return (
    <Popover trigger={trigger}>
      <PopoverHeader>
        <PopoverTitle>{member.name}</PopoverTitle>
      </PopoverHeader>

      <div className="space-y-4">
        <div>
          <span className="mb-2 block text-sm font-medium text-foreground-muted">
            負担割合
          </span>
          <Slider
            value={member.bias}
            onChange={(value) => updateMemberBias(member.id, value)}
            min={0.5}
            max={2.0}
            step={0.1}
          />
          <p className="mt-2 text-center text-2xl font-bold text-foreground">
            {member.bias.toFixed(1)}倍
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
                variant={member.bias === preset.value ? 'primary' : 'outline'}
                onClick={() => handlePreset(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
            <Button
              size="sm"
              variant={member.bias === 1.0 ? 'primary' : 'outline'}
              onClick={() => handlePreset(1.0)}
            >
              標準
            </Button>
          </div>
        </div>
      </div>
    </Popover>
  )
}
