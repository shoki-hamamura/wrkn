'use client'

import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import type { ComponentProps } from 'react'
import { Drawer as VaulDrawer } from 'vaul'
import { cn } from '@/shared/lib'

export interface DrawerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function DrawerRoot({ open, onOpenChange, children }: DrawerProps) {
  const drawerProps = {
    direction: 'left' as const,
    shouldScaleBackground: false,
    ...(open !== undefined && { open }),
    ...(onOpenChange !== undefined && { onOpenChange }),
  }

  return <VaulDrawer.Root {...drawerProps}>{children}</VaulDrawer.Root>
}

function DrawerPortal({ children }: { children: React.ReactNode }) {
  return <VaulDrawer.Portal>{children}</VaulDrawer.Portal>
}

function DrawerOverlay({
  className,
  ...props
}: ComponentProps<typeof VaulDrawer.Overlay>) {
  return (
    <VaulDrawer.Overlay
      className={cn('fixed inset-0 z-50 bg-black/40', className)}
      {...props}
    />
  )
}

function DrawerContent({
  children,
  className,
  title = 'メニュー',
  ...props
}: ComponentProps<typeof VaulDrawer.Content> & { title?: string }) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <VaulDrawer.Content
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-full w-[280px] flex-col bg-surface',
          className,
        )}
        {...props}
      >
        <VisuallyHidden>
          <VaulDrawer.Title>{title}</VaulDrawer.Title>
        </VisuallyHidden>
        {children}
      </VaulDrawer.Content>
    </DrawerPortal>
  )
}

function DrawerClose({
  children,
  className,
  ...props
}: ComponentProps<typeof VaulDrawer.Close>) {
  return (
    <VaulDrawer.Close className={className} {...props}>
      {children}
    </VaulDrawer.Close>
  )
}

export const Drawer = {
  Root: DrawerRoot,
  Content: DrawerContent,
  Close: DrawerClose,
}
