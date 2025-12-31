/**
 * リグレッションテスト
 *
 * @description
 * 上限値やエッジケースのテスト。
 * バグ修正後のデグレードを防ぐための回帰テスト。
 *
 * テスト対象:
 * - 上限値テスト
 *   - メンバー: 50人まで
 *   - 会計: 50件まで
 *   - 金額: 10桁まで
 * - バリデーション
 *   - 重複メンバー名の拒否
 *   - 大文字小文字の区別なし
 *   - 空白のトリム
 * - データ永続化
 *   - ページリロード後のデータ保持
 */
import { expect, test } from '@playwright/test'
import { addExpense, addMember, clearLocalStorage } from '../helpers'

test.describe('リグレッションテスト - 上限値', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clearLocalStorage(page)
    await page.reload()
  })

  test('メンバーを50人まで追加できる', async ({ page }) => {
    test.setTimeout(120000)

    for (let i = 1; i <= 50; i++) {
      await addMember(page, `Member${i}`)
    }

    await expect(page.getByText('Member50')).toBeVisible()
  })

  test('会計を50件まで追加できる', async ({ page }) => {
    test.setTimeout(180000)

    await addMember(page, 'Alice')
    await addMember(page, 'Bob')

    for (let i = 1; i <= 50; i++) {
      await addExpense(page, {
        name: `会計${i}`,
        amount: 1000,
        paidBy: 'Alice',
      })
    }

    await expect(page.getByText('会計50')).toBeVisible()
  })

  test('金額の最大桁数（10桁）まで入力できる', async ({ page }) => {
    await addMember(page, 'Alice')
    await addMember(page, 'Bob')

    await page.getByRole('button', { name: '会計を追加' }).click()

    for (let i = 0; i < 10; i++) {
      await page.getByRole('button', { name: '9', exact: true }).click()
    }

    await expect(page.getByText(/9,999,999,999/)).toBeVisible()
  })

  test('金額が10桁を超えると入力できない', async ({ page }) => {
    await addMember(page, 'Alice')
    await addMember(page, 'Bob')

    await page.getByRole('button', { name: '会計を追加' }).click()

    for (let i = 0; i < 11; i++) {
      await page.getByRole('button', { name: '9', exact: true }).click()
    }

    await expect(page.getByText(/9,999,999,999/)).toBeVisible()
    await expect(page.getByText(/99,999,999,999/)).not.toBeVisible()
  })
})

test.describe('リグレッションテスト - バリデーション', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clearLocalStorage(page)
    await page.reload()
  })

  test('重複したメンバー名は追加できない', async ({ page }) => {
    await addMember(page, 'Alice')
    await addMember(page, 'Alice')

    const aliceElements = page.locator('text=Alice')
    await expect(aliceElements).toHaveCount(1)
  })

  test('大文字小文字が異なる重複名は追加できない', async ({ page }) => {
    await addMember(page, 'Alice')
    await addMember(page, 'alice')

    const elements = page.getByText(/alice/i)
    await expect(elements).toHaveCount(1)
  })

  test('前後の空白はトリムされる', async ({ page }) => {
    await page.getByRole('button', { name: 'メンバーを追加' }).click()
    await page.getByPlaceholder('名前を入力').fill('  Bob  ')
    await page.getByRole('button', { name: '追加', exact: true }).click()

    await expect(page.getByText('Bob')).toBeVisible()
  })
})

test.describe('リグレッションテスト - データ永続化', () => {
  test('ページをリロードしてもデータが保持される', async ({ page }) => {
    await page.goto('/')
    await clearLocalStorage(page)
    await page.reload()

    await addMember(page, 'Alice')
    await addMember(page, 'Bob')
    await addExpense(page, {
      name: 'テスト会計',
      amount: 5000,
      paidBy: 'Alice',
    })

    await page.reload()

    await expect(page.getByText('Alice').first()).toBeVisible()
    await expect(page.getByText('Bob').first()).toBeVisible()
    await expect(page.getByText('テスト会計')).toBeVisible()
  })
})
