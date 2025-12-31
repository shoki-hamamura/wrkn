'use client'

import { CircleHelp, Settings } from 'lucide-react'
import { useState } from 'react'
import { HelpSheet } from '@/features/help'
import { SettingsSheet } from '@/features/settings'
import { Button } from '@/shared/ui'

export function HeaderActions() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setHelpOpen(true)}
        aria-label="ヘルプ"
      >
        <CircleHelp className="size-5" aria-hidden="true" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setSettingsOpen(true)}
        aria-label="設定"
      >
        <Settings className="size-5" aria-hidden="true" />
      </Button>

      <HelpSheet open={helpOpen} onOpenChange={setHelpOpen} />
      <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
}
