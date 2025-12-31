'use client'

import { Sheet } from '@/shared/ui'

export interface HelpSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HelpSheet({ open, onOpenChange }: HelpSheetProps) {
  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Content>
        <Sheet.Header>
          <Sheet.Title>なかよしわりかんとは</Sheet.Title>
        </Sheet.Header>

        <div className="space-y-4 text-foreground-muted">
          <p>
            グループでの食事や旅行など、複数人で費用を分担する際に便利な割り勘計算アプリです。
          </p>

          <div>
            <h3 className="mb-2 font-medium text-foreground">使い方</h3>
            <ol className="list-inside list-decimal space-y-1 text-sm">
              <li>メンバーを追加する</li>
              <li>支払いを登録する（誰が何を払ったか）</li>
              <li>精算結果を確認して、誰が誰にいくら払うかをチェック</li>
            </ol>
          </div>

          <div>
            <h3 className="mb-2 font-medium text-foreground">特徴</h3>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>傾斜配分に対応（多めに払う人を設定可能）</li>
              <li>複数通貨をサポート</li>
              <li>端数処理の単位を選択可能</li>
            </ul>
          </div>
        </div>
      </Sheet.Content>
    </Sheet.Root>
  )
}
