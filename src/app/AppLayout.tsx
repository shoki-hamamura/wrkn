'use client'

import type { ReactNode } from 'react'
import { MobileHeader, MobileSidebar, Sidebar } from '@/widgets/sidebar'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen lg:pl-[280px]">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div>
        <MobileHeader className="lg:hidden" />
        {children}
      </div>

      <MobileSidebar />
    </div>
  )
}
