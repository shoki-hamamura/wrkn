# なかよしわりかん - アーキテクチャ

## 目的

AI駆動開発をメインとするため、以下を重視:
- **明確な境界**: AIが迷わない構造
- **厳格なルール**: 自動で品質担保
- **早期検知**: 問題を早く発見

## Feature-Sliced Design (FSD)

### レイヤー構成

```
src/
├── app/        # Next.js App Router エントリー
├── views/      # ページコンポーネント
├── widgets/    # 独立した大きなUI塊
├── features/   # ビジネスアクション
├── entities/   # ビジネスエンティティ
└── shared/     # 汎用ユーティリティ
```

### 依存ルール

```
app → views → widgets → features → entities → shared
```

下位レイヤーのみ参照可能（上位への参照は禁止）

### スライス構成

| セグメント | 内容 |
|-----------|------|
| `ui/` | React コンポーネント |
| `model/` | 状態管理、ビジネスロジック |
| `lib/` | ユーティリティ関数 |
| `index.ts` | Public API |

## ガードレール

| ツール | 目的 | 実行タイミング |
|--------|------|---------------|
| Ultracite (Biome) | コード品質、フォーマット | pre-commit, CI |
| TypeScript strict | 型安全 | pre-commit, CI |
| Steiger | FSD 違反検知 | pre-commit, CI |
| Vitest | ユニットテスト | pre-push, CI |
| Storybook | コンポーネントドキュメント | 開発時 |
| Chromatic | ビジュアルリグレッション | CI (PR) |

## 命名規則

| 種類 | 規則 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `MemberChip.tsx` |
| ユーティリティ | kebab-case | `use-calculator.ts` |
| ストーリー | `.stories.tsx` | `MemberChip.stories.tsx` |
| テスト | `.test.ts` | `calculate.test.ts` |

- 名前付きエクスポートを使用（デフォルトエクスポートは非推奨）
- Props 型は `ComponentNameProps` 形式
