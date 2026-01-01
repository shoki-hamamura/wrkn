/**
 * E2E テスト用ヘルパー関数
 *
 * 各関数は Playwright の Page オブジェクトを受け取り、
 * よく使う操作をラップして再利用可能にしています。
 */
import type { Page } from '@playwright/test'

/**
 * localStorage をクリアしてテスト状態をリセット
 *
 * @description
 * テスト前に呼び出して、前回のテストデータをクリアします。
 * Zustand の persist middleware が localStorage を使用するため必要。
 */
export async function clearLocalStorage(page: Page) {
  await page.evaluate(() => localStorage.clear())
}

/**
 * メンバーを追加する
 *
 * @description
 * 1. 「メンバーを追加」ボタンをクリック
 * 2. 名前を入力
 * 3. 「追加」ボタンをクリック
 */
export async function addMember(page: Page, name: string) {
  const addButton = page.getByRole('button', { name: 'メンバーを追加' })
  const nameInput = page.getByPlaceholder('名前を入力')

  // 入力フォームが表示されていない場合は「メンバーを追加」ボタンをクリック
  if (!(await nameInput.isVisible())) {
    await addButton.click()
  }

  await nameInput.fill(name)
  await page.getByRole('button', { name: '追加', exact: true }).click()

  // メンバーが追加されたことを確認
  await page.getByText(name).waitFor({ state: 'visible' })
}

/**
 * 会計を追加する
 *
 * @description
 * 1. 「会計を追加」ボタンをクリック → Sheet が開く
 * 2. 名前を入力（オプション）
 * 3. 電卓で金額を入力（各桁をクリック）
 * 4. 立替者を選択（オプション）
 * 5. 「追加する」ボタンをクリック
 */
export async function addExpense(
  page: Page,
  options: {
    name?: string
    amount: number
    paidBy?: string
  },
) {
  await page.getByRole('button', { name: '会計を追加' }).click()

  if (options.name) {
    await page.getByPlaceholder('1次会').fill(options.name)
  }

  const amountStr = options.amount.toString()
  for (const digit of amountStr) {
    await page.getByRole('button', { name: digit, exact: true }).click()
  }

  if (options.paidBy) {
    await page.getByRole('button', { name: options.paidBy }).click()
  }

  await page.getByRole('button', { name: '追加する' }).click()
}

/**
 * 精算結果ページに遷移する
 *
 * @description
 * 「精算結果を見る」ボタンをクリックして /settlement に遷移
 */
export async function goToSettlement(page: Page) {
  await page.getByRole('button', { name: /精算結果/ }).click()
}

/**
 * ホームページに戻る
 *
 * @description
 * 「戻る」ボタンをクリックして / に遷移
 */
export async function goBackToHome(page: Page) {
  await page.getByRole('button', { name: '戻る' }).click()
}
