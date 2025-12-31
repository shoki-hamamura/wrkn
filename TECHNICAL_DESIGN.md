# なかよしわりかん - 技術設計書

## ブラウザサポート

モダンブラウザのみ（ES2020+）:
- Chrome 80+, Firefox 75+, Safari 14+, Edge 80+

## アーキテクチャ

Feature-Sliced Design (FSD) に準拠:

```
src/
├── app/        # Next.js App Router エントリー
├── views/      # FSD: ページコンポーネント (※Next.js の pages と競合回避)
├── widgets/    # FSD: 独立した UI 塊
├── features/   # FSD: ビジネスアクション
├── entities/   # FSD: ビジネスエンティティ
└── shared/     # FSD: 共有ユーティリティ
```

レイヤー依存ルール: `app → views → widgets → features → entities → shared`

## データ構造

- **MemberId / ExpenseId**: ブランド型で型安全性向上
- **Member**: id, name, bias (デフォルト 1.0)
- **Expense**: id, name, amount, paidBy, participants (空 = 全員), createdAt
- **Settings**: currency, roundingUnit

## 状態管理

**Zustand** を採用:
- Selector パターンで再レンダリング最適化
- persist ミドルウェアで LocalStorage 自動同期
- immer ミドルウェアでイミュータブル更新

## 精算アルゴリズム

1. 各メンバーの負担額を計算（bias 考慮）
2. 各メンバーの立替額を集計
3. 差分（バランス）を計算
4. 貪欲法で支払いフローを最小化
5. 端数処理を適用

## テスト戦略

- 単体テスト: Vitest（アルゴリズム、hooks）
- コンポーネント: Storybook + Chromatic
- E2E: Playwright（将来）
