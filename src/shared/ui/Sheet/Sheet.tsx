'use client'

import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import type { ComponentProps } from 'react'
import { Drawer } from 'vaul'
import { cn } from '@/shared/lib'

export interface SheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function SheetRoot({ open, onOpenChange, children }: SheetProps) {
  const drawerProps = {
    ...(open !== undefined && { open }),
    ...(onOpenChange !== undefined && { onOpenChange }),
  }

  return <Drawer.Root {...drawerProps}>{children}</Drawer.Root>
}

function SheetTrigger({
  children,
  className,
  ...props
}: ComponentProps<typeof Drawer.Trigger>) {
  return (
    <Drawer.Trigger className={className} {...props}>
      {children}
    </Drawer.Trigger>
  )
}

function SheetPortal({ children }: { children: React.ReactNode }) {
  return <Drawer.Portal>{children}</Drawer.Portal>
}

function SheetOverlay({
  className,
  ...props
}: ComponentProps<typeof Drawer.Overlay>) {
  return (
    <Drawer.Overlay
      className={cn('fixed inset-0 z-50 bg-black/40', className)}
      {...props}
    />
  )
}

function SheetContent({
  children,
  className,
  ...props
}: ComponentProps<typeof Drawer.Content>) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <Drawer.Content
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto max-h-[96%] flex-col rounded-t-3xl bg-surface',
          className,
        )}
        {...props}
      >
        <VisuallyHidden>
          <Drawer.Description />
        </VisuallyHidden>
        <div className="mx-auto mt-4 h-1.5 w-12 shrink-0 rounded-full bg-border" />
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </Drawer.Content>
    </SheetPortal>
  )
}

function SheetHeader({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

function SheetTitle({
  children,
  className,
  ...props
}: ComponentProps<typeof Drawer.Title>) {
  return (
    <Drawer.Title
      className={cn('text-lg font-semibold text-foreground', className)}
      {...props}
    >
      {children}
    </Drawer.Title>
  )
}

function SheetDescription({
  children,
  className,
  ...props
}: ComponentProps<typeof Drawer.Description>) {
  return (
    <Drawer.Description
      className={cn('text-sm text-foreground-muted', className)}
      {...props}
    >
      {children}
    </Drawer.Description>
  )
}

function SheetClose({
  children,
  className,
  ...props
}: ComponentProps<typeof Drawer.Close>) {
  return (
    <Drawer.Close className={className} {...props}>
      {children}
    </Drawer.Close>
  )
}

export const Sheet = {
  Root: SheetRoot,
  Trigger: SheetTrigger,
  Content: SheetContent,
  Header: SheetHeader,
  Title: SheetTitle,
  Description: SheetDescription,
  Close: SheetClose,
}
