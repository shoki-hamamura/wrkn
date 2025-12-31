/**
 * 精算結果 E2E テスト
 *
 * @description
 * 精算計算と結果表示に関するユーザーフローをテスト。
 *
 * テスト対象:
 * - 2人/3人での均等割り計算
 * - 複数会計の合計計算
 * - 精算不要ケースの表示
 * - ページ遷移（精算結果 ↔ ホーム）
 *
 * フロー:
 * 1. メンバー追加
 * 2. 会計追加
 * 3. 「精算結果を見る」→ /settlement に遷移
 * 4. 計算結果を検証
 */
import { expect, test } from '@playwright/test'
import {
  addExpense,
  addMember,
  clearLocalStorage,
  goToSettlement,
} from '../helpers'

test.describe('精算結果', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clearLocalStorage(page)
    await page.reload()
  })

  test('2人で均等割りが正しく計算される', async ({ page }) => {
    await addMember(page, 'Alice')
    await addMember(page, 'Bob')
    await addExpense(page, { name: '食事', amount: 10000, paidBy: 'Alice' })

    await goToSettlement(page)

    await expect(page.getByText('合計')).toBeVisible()
    await expect(page.getByText(/10,000/).first()).toBeVisible()
    await expect(page.getByText('1人あたり約')).toBeVisible()
    await expect(page.getByText('Bob')).toBeVisible()
    await expect(page.getByText('Alice')).toBeVisible()
    await expect(page.getByText(/5,000/).first()).toBeVisible()
  })

  test('3人で均等割りが正しく計算される', async ({ page }) => {
    await addMember(page, 'Alice')
    await addMember(page, 'Bob')
    await addMember(page, 'Charlie')
    await addExpense(page, { name: '食事', amount: 9000, paidBy: 'Alice' })

    await goToSettlement(page)

    await expect(page.getByText('合計')).toBeVisible()
    await expect(page.getByText(/9,000/).first()).toBeVisible()
  })

  test('複数の会計で精算が正しく計算される', async ({ page }) => {
    await addMember(page, 'Alice')
    await addMember(page, 'Bob')
    await addExpense(page, { name: '1次会', amount: 10000, paidBy: 'Alice' })
    await addExpense(page, { name: '2次会', amount: 5000, paidBy: 'Bob' })

    await goToSettlement(page)

    await expect(page.getByText('合計')).toBeVisible()
    await expect(page.getByText(/15,000/).first()).toBeVisible()
  })

  test('精算が不要な場合はメッセージが表示される', async ({ page }) => {
    await addMember(page, 'Alice')
    await addMember(page, 'Bob')
    await addExpense(page, { name: '1次会', amount: 5000, paidBy: 'Alice' })
    await addExpense(page, { name: '2次会', amount: 5000, paidBy: 'Bob' })

    await goToSettlement(page)

    await expect(page.getByText('精算は不要です')).toBeVisible()
  })

  test('結果をコピーボタンが表示される', async ({ page }) => {
    await addMember(page, 'Alice')
    await addMember(page, 'Bob')
    await addExpense(page, { name: '食事', amount: 10000, paidBy: 'Alice' })

    await goToSettlement(page)

    await expect(
      page.getByRole('button', { name: '結果をコピー' }),
    ).toBeVisible()
  })

  test('戻るボタンでホームに戻れる', async ({ page }) => {
    await addMember(page, 'Alice')
    await addMember(page, 'Bob')
    await addExpense(page, { name: '食事', amount: 10000, paidBy: 'Alice' })

    await goToSettlement(page)
    await page.getByRole('button', { name: '戻る' }).click()

    await expect(
      page.getByRole('button', { name: 'メンバーを追加' }),
    ).toBeVisible()
  })

  test('会計がない場合は精算ボタンが表示されない', async ({ page }) => {
    await addMember(page, 'Alice')
    await addMember(page, 'Bob')

    // 会計がない場合、「精算結果を見る」ボタンは表示されない
    await expect(
      page.getByRole('button', { name: /精算結果/ }),
    ).not.toBeVisible()
  })
})
