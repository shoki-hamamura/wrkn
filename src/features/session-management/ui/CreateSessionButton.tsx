'use client'

import { Plus } from 'lucide-react'
import { useSessionActions } from '@/entities/warikan'
import { useSidebar } from '@/shared/lib'
import { Button } from '@/shared/ui'

export function CreateSessionButton() {
  const { createSession } = useSessionActions()
  const closeSidebar = useSidebar((s) => s.close)

  const handleCreate = () => {
    createSession()
    closeSidebar()
  }

  return (
    <Button variant="outline" className="w-full" onClick={handleCreate}>
      <Plus className="mr-2 size-4" />
      新しい会計
    </Button>
  )
}
