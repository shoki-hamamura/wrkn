# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**なかよしわりかん** - A bill-splitting web app for group expenses (dining, travel, etc.) with multi-currency support and bias adjustments.

- **Tech Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Zustand, Vitest
- **Package Manager**: pnpm

## Commands

```bash
# Development
pnpm dev              # Start dev server with Turbopack

# Testing
pnpm test             # Run vitest in watch mode
pnpm test:run         # Run tests once
pnpm test -- src/shared/lib/cn.test.ts  # Run single test file

# Linting & Type Check
pnpm lint             # Biome check (ultracite)
pnpm lint:fix         # Auto-fix lint issues
pnpm lint:fsd         # FSD layer violations check (steiger)
npx tsc --noEmit      # Type check

# Build
pnpm build            # Production build

# E2E Testing (Playwright)
pnpm e2e              # Run E2E tests
pnpm e2e:ui           # Run with interactive UI
pnpm e2e:headed       # Run in headed browser

# Storybook
pnpm storybook        # Start Storybook at port 6006
pnpm build-storybook  # Build Storybook
pnpm chromatic        # Visual regression test
```

## Architecture: Feature-Sliced Design (FSD)

```
src/
├── app/        # Next.js App Router entry, globals.css
├── views/      # Page-level view compositions
├── widgets/    # Large independent UI blocks
├── features/   # Business actions (add-member, add-expense, etc.)
├── entities/   # Business entities (member, expense, settlement, warikan)
└── shared/     # Shared utilities, UI components, types
```

### Layer Dependency Rule

```text
app → views → widgets → features → entities → shared
```

Only import from lower layers. Upper-layer imports are **forbidden** and checked by Steiger.

### Slice Structure

Each slice contains:
- `ui/` - React components
- `model/` - State management, business logic
- `lib/` - Utility functions
- `index.ts` - Public API (only export via this file)

## TypeScript Rules

- **Strict mode enabled** with additional checks: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`
- **`any` is forbidden** - use proper types
- Use branded types for IDs: `MemberId`, `ExpenseId`
- Path alias: `@/*` maps to `./src/*`

## Coding Conventions

- Named exports only (no default exports)
- File naming: PascalCase for components, kebab-case for utilities
- Props types: `ComponentNameProps`
- Tests: `*.test.ts` files co-located with source
- Stories: `*.stories.tsx` files co-located with components

## State Management

Central Zustand store at `src/entities/warikan/model/store.ts`:
- Persisted to localStorage with key `nakayoshi-warikan`
- Uses immer middleware for immutable updates
- Multi-session support with migration from older schema (version 3)
- Access via `useWarikanStore` hook

## Domain Model

Core types in `src/shared/types/`:
- `Session` - Contains members, groups, expenses, settings
- `Member` - Individual participant with bias adjustment (0.1-2.0)
- `ParticipantGroup` - Batch participants (e.g., "友人5人")
- `Expense` - Payment record with payer and participants
- `Settlement` - Calculated transfer (who pays whom)

## Pre-commit Hooks (Lefthook)

- `gitleaks` - Secret detection
- `ultracite check` - Biome linting
- `tsc --noEmit` - Type check
- Tests run on pre-push
