'use client'

import type { ReactNode } from 'react'
import { MobileHeader, MobileSidebar, Sidebar } from '@/widgets/sidebar'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-[280px] lg:shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1">
        <MobileHeader className="lg:hidden" />
        {children}
      </div>

      <MobileSidebar />
    </div>
  )
}
