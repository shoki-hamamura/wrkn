'use client'

import { type ReactElement, useState } from 'react'
import { BIAS_PRESETS, type Member } from '@/entities/member'
import { useWarikanActions } from '@/entities/warikan'
import { useIsDesktop } from '@/shared/lib'
import {
  Button,
  Popover,
  PopoverHeader,
  PopoverTitle,
  Sheet,
  Slider,
} from '@/shared/ui'

export interface BiasPopoverProps {
  member: Member
  trigger: ReactElement
}

export function BiasPopover({ member, trigger }: BiasPopoverProps) {
  const { updateMemberBias } = useWarikanActions()
  const [localBias, setLocalBias] = useState(member.bias)
  const [open, setOpen] = useState(false)
  const isDesktop = useIsDesktop()

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setLocalBias(member.bias)
    } else {
      if (localBias !== member.bias) {
        updateMemberBias(member.id, localBias)
      }
    }
    setOpen(newOpen)
  }

  const content = (
    <div className="space-y-4">
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
  )

  if (isDesktop) {
    return (
      <Popover
        trigger={trigger}
        open={open}
        onOpenChange={handleOpenChange}
        align="start"
      >
        <PopoverHeader>
          <PopoverTitle>{member.name}</PopoverTitle>
        </PopoverHeader>
        {content}
      </Popover>
    )
  }

  return (
    <Sheet.Root open={open} onOpenChange={handleOpenChange}>
      <Sheet.Trigger asChild>{trigger}</Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Header>
          <Sheet.Title>{member.name}</Sheet.Title>
        </Sheet.Header>
        {content}
      </Sheet.Content>
    </Sheet.Root>
  )
}
