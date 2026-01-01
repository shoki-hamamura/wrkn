'use client'

import { SidebarContent } from './SidebarContent'

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-[280px] border-r border-border">
      <SidebarContent />
    </aside>
  )
}
