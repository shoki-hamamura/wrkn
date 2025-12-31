/**
 * メンバー管理 E2E テスト
 *
 * @description
 * メンバーの追加・削除に関する基本的なユーザーフローをテスト。
 *
 * テスト対象:
 * - メンバー追加（ボタン、Enter キー）
 * - メンバー削除
 * - 入力キャンセル（ボタン、Escape キー）
 * - バリデーション（空名前の拒否）
 */
import { expect, test } from '@playwright/test'
import { addMember, clearLocalStorage } from '../helpers'

test.describe('メンバー管理', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clearLocalStorage(page)
    await page.reload()
  })

  /**
   * フロー: + ボタン → 名前入力 → 追加 → リストに表示
   */
  test('メンバーを追加できる', async ({ page }) => {
    await addMember(page, 'Alice')

    await expect(page.getByText('Alice')).toBeVisible()
  })

  test('複数のメンバーを追加できる', async ({ page }) => {
    await addMember(page, 'Alice')
    await addMember(page, 'Bob')
    await addMember(page, 'Charlie')

    await expect(page.getByText('Alice')).toBeVisible()
    await expect(page.getByText('Bob')).toBeVisible()
    await expect(page.getByText('Charlie')).toBeVisible()
  })

  test('メンバーを削除できる', async ({ page }) => {
    await addMember(page, 'Alice')
    await expect(page.getByText('Alice')).toBeVisible()

    await page.getByRole('button', { name: 'Aliceを削除', exact: true }).click()

    await expect(page.getByText('Alice')).not.toBeVisible()
  })

  test('空の名前は追加できない', async ({ page }) => {
    await page.getByRole('button', { name: 'メンバーを追加' }).click()

    const addButton = page.getByRole('button', { name: '追加', exact: true })
    await expect(addButton).toBeDisabled()
  })

  test('キャンセルボタンで入力をキャンセルできる', async ({ page }) => {
    await page.getByRole('button', { name: 'メンバーを追加' }).click()
    await page.getByPlaceholder('名前を入力').fill('Test')

    await page.getByRole('button', { name: 'キャンセル' }).click()

    await expect(page.getByPlaceholder('名前を入力')).not.toBeVisible()
  })

  test('Enterキーでメンバーを追加できる', async ({ page }) => {
    await page.getByRole('button', { name: 'メンバーを追加' }).click()
    await page.getByPlaceholder('名前を入力').fill('Alice')
    await page.getByPlaceholder('名前を入力').press('Enter')

    await expect(page.getByText('Alice')).toBeVisible()
  })

  test('Escapeキーで入力をキャンセルできる', async ({ page }) => {
    await page.getByRole('button', { name: 'メンバーを追加' }).click()
    await page.getByPlaceholder('名前を入力').fill('Test')
    await page.getByPlaceholder('名前を入力').press('Escape')

    await expect(page.getByPlaceholder('名前を入力')).not.toBeVisible()
  })
})
