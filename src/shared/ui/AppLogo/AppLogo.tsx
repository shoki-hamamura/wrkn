import { cn } from '@/shared/lib'

export type AppLogoSize = 'sm' | 'md'

export interface AppLogoProps {
  size?: AppLogoSize
  className?: string
}

const sizeStyles: Record<AppLogoSize, { icon: string; text: string }> = {
  sm: { icon: 'size-8 text-lg', text: 'text-lg' },
  md: { icon: 'size-12 text-2xl', text: 'text-3xl' },
}

export function AppLogo({ size = 'md', className }: AppLogoProps) {
  const styles = sizeStyles[size]

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-md',
          styles.icon,
        )}
      >
        <span className="font-bold text-white">¥</span>
      </div>
      <span className={cn('font-black italic text-foreground', styles.text)}>
        なかよしわりかん
      </span>
    </div>
  )
}
