'use client'

import { useSidebar } from '@/shared/lib'
import { Drawer } from '@/shared/ui'
import { SidebarContent } from './SidebarContent'

export function MobileSidebar() {
  const isOpen = useSidebar((s) => s.isOpen)
  const close = useSidebar((s) => s.close)

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && close()}>
      <Drawer.Content>
        <SidebarContent />
      </Drawer.Content>
    </Drawer.Root>
  )
}
