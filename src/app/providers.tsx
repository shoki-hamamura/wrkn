'use client'

import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
  nonce: string
}

export function Providers({ children, nonce }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      nonce={nonce}
    >
      {children}
    </ThemeProvider>
  )
}
