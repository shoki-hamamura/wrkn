/**
 * 会計管理 E2E テスト
 *
 * @description
 * 会計の追加・編集に関するユーザーフローをテスト。
 *
 * テスト対象:
 * - 会計追加（名前、金額、立替者）
 * - 電卓操作（数字入力、削除、00）
 * - バリデーション（金額0の拒否）
 *
 * 前提条件:
 * - テスト前にメンバー Alice, Bob を追加
 */
import { expect, test } from '@playwright/test'
import { addExpense, addMember, clearLocalStorage } from '../helpers'

test.describe('会計管理', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clearLocalStorage(page)
    await page.reload()
    await addMember(page, 'Alice')
    await addMember(page, 'Bob')
  })

  test('会計を追加できる', async ({ page }) => {
    await addExpense(page, { name: '1次会', amount: 10000, paidBy: 'Alice' })

    await expect(page.getByText('1次会')).toBeVisible()
    await expect(page.getByText(/10,000/).first()).toBeVisible()
  })

  test('電卓で金額を入力できる', async ({ page }) => {
    await page.getByRole('button', { name: '会計を追加' }).click()

    await page.getByRole('button', { name: '1', exact: true }).click()
    await page.getByRole('button', { name: '2', exact: true }).click()
    await page.getByRole('button', { name: '3', exact: true }).click()
    await page.getByRole('button', { name: '4', exact: true }).click()
    await page.getByRole('button', { name: '5', exact: true }).click()

    await expect(page.getByText(/12,345/)).toBeVisible()
  })

  test('電卓の削除ボタンで1桁削除できる', async ({ page }) => {
    await page.getByRole('button', { name: '会計を追加' }).click()

    await page.getByRole('button', { name: '1', exact: true }).click()
    await page.getByRole('button', { name: '2', exact: true }).click()
    await page.getByRole('button', { name: '3', exact: true }).click()
    await page.getByRole('button', { name: '削除' }).click()

    await expect(page.getByText(/[¥￥]\s*12(?!,)/)).toBeVisible()
  })

  test('00ボタンで00を入力できる', async ({ page }) => {
    await page.getByRole('button', { name: '会計を追加' }).click()

    await page.getByRole('button', { name: '1', exact: true }).click()
    await page.getByRole('button', { name: '00' }).click()

    await expect(page.getByText(/[¥￥]\s*100(?!,)/)).toBeVisible()
  })

  test('立て替えた人を変更できる', async ({ page }) => {
    await page.getByRole('button', { name: '会計を追加' }).click()
    await page.getByRole('button', { name: '1', exact: true }).click()
    await page.getByRole('button', { name: '0', exact: true }).click()
    await page.getByRole('button', { name: '0', exact: true }).click()
    await page.getByRole('button', { name: '0', exact: true }).click()

    await page.getByRole('button', { name: 'Bob' }).click()
    await page.getByRole('button', { name: '追加する' }).click()

    await expect(page.getByText('立替: Bob')).toBeVisible()
  })

  test('金額が0の場合は追加ボタンが無効', async ({ page }) => {
    await page.getByRole('button', { name: '会計を追加' }).click()

    const addButton = page.getByRole('button', { name: '追加する' })
    await expect(addButton).toBeDisabled()
  })

  test('複数の会計を追加できる', async ({ page }) => {
    await addExpense(page, { name: '1次会', amount: 10000, paidBy: 'Alice' })
    await addExpense(page, { name: '2次会', amount: 5000, paidBy: 'Bob' })

    await expect(page.getByText('1次会')).toBeVisible()
    await expect(page.getByText('2次会')).toBeVisible()
  })

  test('会計名を省略すると「会計」になる', async ({ page }) => {
    await page.getByRole('button', { name: '会計を追加' }).click()
    await page.getByRole('button', { name: '1', exact: true }).click()
    await page.getByRole('button', { name: '0', exact: true }).click()
    await page.getByRole('button', { name: '0', exact: true }).click()
    await page.getByRole('button', { name: '0', exact: true }).click()
    await page.getByRole('button', { name: '追加する' }).click()

    await expect(page.getByText('会計').first()).toBeVisible()
  })
})
