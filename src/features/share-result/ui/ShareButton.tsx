'use client'

import { Check, Copy, Share2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useIsDesktop, vibrate } from '@/shared/lib'
import { Button, type ButtonProps } from '@/shared/ui'

export interface ShareButtonProps extends Omit<ButtonProps, 'onClick'> {
  text: string
  title?: string
  onShared?: () => void
}

function canUseWebShare(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator
}

export function ShareButton({
  text,
  title = 'なかよしわりかん - 精算結果',
  onShared,
  children,
  ...props
}: ShareButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'shared' | 'error'>(
    'idle',
  )
  const isDesktop = useIsDesktop()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const resetStatusAfterDelay = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => setStatus('idle'), 2000)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setStatus('copied')
      vibrate('success')
      onShared?.()
      resetStatusAfterDelay()
    } catch (error) {
      console.error('Failed to copy:', error)
      setStatus('error')
      vibrate('error')
      resetStatusAfterDelay()
    }
  }

  const handleShare = async () => {
    if (!isDesktop && canUseWebShare()) {
      try {
        await navigator.share({ title, text })
        setStatus('shared')
        vibrate('success')
        onShared?.()
        resetStatusAfterDelay()
      } catch (error) {
        const isAbortError =
          error instanceof Error && error.name === 'AbortError'
        if (!isAbortError) {
          await copyToClipboard()
        }
      }
    } else {
      await copyToClipboard()
    }
  }

  const getContent = () => {
    if (status === 'error') {
      return (
        <>
          <X className="mr-2 inline size-5" aria-hidden="true" />
          失敗しました
        </>
      )
    }
    if (status === 'shared') {
      return (
        <>
          <Check className="mr-2 inline size-5" aria-hidden="true" />
          共有しました
        </>
      )
    }
    if (status === 'copied') {
      return (
        <>
          <Check className="mr-2 inline size-5" aria-hidden="true" />
          コピーしました
        </>
      )
    }
    if (isDesktop) {
      return (
        <>
          <Copy className="mr-2 inline size-5" aria-hidden="true" />
          {children ?? '結果をコピー'}
        </>
      )
    }
    return (
      <>
        <Share2 className="mr-2 inline size-5" aria-hidden="true" />
        {children ?? '結果をシェア'}
      </>
    )
  }

  const getAriaMessage = () => {
    switch (status) {
      case 'shared':
        return '共有しました'
      case 'copied':
        return 'コピーしました'
      case 'error':
        return '失敗しました'
      default:
        return null
    }
  }

  const ariaMessage = getAriaMessage()

  return (
    <Button onClick={handleShare} {...props}>
      {getContent()}
      {ariaMessage && (
        <span className="sr-only" aria-live="polite">
          {ariaMessage}
        </span>
      )}
    </Button>
  )
}
