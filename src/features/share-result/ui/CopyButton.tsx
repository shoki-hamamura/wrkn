'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { Button, type ButtonProps } from '@/shared/ui'

export interface CopyButtonProps extends Omit<ButtonProps, 'onClick'> {
  text: string
  onCopied?: () => void
}

export function CopyButton({
  text,
  onCopied,
  children,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      onCopied?.()
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <Button onClick={handleCopy} {...props}>
      <span aria-live="polite">
        {copied ? (
          <>
            <Check className="mr-2 inline size-5" aria-hidden="true" />
            コピーしました
          </>
        ) : (
          <>
            <Copy className="mr-2 inline size-5" aria-hidden="true" />
            {children ?? '結果をコピー'}
          </>
        )}
      </span>
    </Button>
  )
}
