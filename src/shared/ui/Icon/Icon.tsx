import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib'

export type IconSize = 'sm' | 'md' | 'lg' | 'xl'

export interface IconProps {
  icon: LucideIcon
  size?: IconSize
  className?: string
}

const sizeStyles: Record<IconSize, string> = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
  xl: 'size-8',
}

export function Icon({
  icon: LucideIconComponent,
  size = 'md',
  className,
}: IconProps) {
  return <LucideIconComponent className={cn(sizeStyles[size], className)} />
}
