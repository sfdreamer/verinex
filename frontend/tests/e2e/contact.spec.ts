import { expect, test, type Page } from '@playwright/test'

/**
 * 联系我们（PRD 4.7）自查：
 * - 九个字段与必填标记
 * - 前端校验：空提交展示字段错误
 * - 成功提交展示成功状态
 * - 重复提交展示 429 限流状态
 * - 不出现办公地址、电话、交付周期承诺、FAQ 承诺
 */

function viewportWidth(page: Page): number {
  return page.viewportSize()?.width ?? 1440
}

async function fillForm(page: Page, email: string): Promise<void> {
  await page.fill('#contact-name', 'Alex Zhang')
  await page.fill('#contact-company', 'Example Technology Co.')
  await page.fill('#contact-email', email)
  await page.fill('#contact-phone', '+86 138 0000 0000')
  await page.selectOption('#contact-industry', 'manufacturing')
  await page.selectOption('#contact-cooperation', 'enterprise-ai')
  await page.selectOption('#contact-product', 'verimind')
  await page.fill('#contact-message', 'We would like to learn more about your enterprise AI solutions.')
  await page.check('#contact-consent')
}

test.describe('联系我们', () => {
  test('九字段表单与前端口径校验', async ({ page }, testInfo) => {
    const width = viewportWidth(page)
    await page.goto('/zh/contact')

    await expect(page.locator('h1')).toHaveText(/从您的业务问题/)

    for (const id of [
      'contact-name',
      'contact-company',
      'contact-email',
      'contact-phone',
      'contact-industry',
      'contact-cooperation',
      'contact-product',
      'contact-message',
      'contact-consent',
    ]) {
      await expect(page.locator(`#${id}`)).toBeVisible()
    }

    // 行业下拉来自 API（五个行业 + 占位）
    await expect(page.locator('#contact-industry option')).toHaveCount(6)
    // 意向产品：占位 + 暂不确定 + 五个产品
    await expect(page.locator('#contact-product option')).toHaveCount(7)

    // 空提交 → 字段错误
    await page.getByRole('button', { name: '提交咨询' }).click()
    await expect(page.locator('#contact-name-error')).toBeVisible()
    await expect(page.locator('#contact-company-error')).toBeVisible()
    await expect(page.locator('#contact-email-error')).toBeVisible()
    await expect(page.locator('#contact-message-error')).toBeVisible()
    await expect(page.locator('#contact-consent-error')).toBeVisible()

    // PRD 12.1 / 4.7：不出现办公地址、电话与交付周期承诺
    const main = page.locator('main')
    const text = await main.innerText()
    for (const forbidden of ['上海市', '北京', '新加坡', '伦敦', '硅谷', '10-14 周', '+86 21']) {
      expect(text, `不应出现未确认信息：${forbidden}`).not.toContain(forbidden)
    }
    await expect(main.getByText(/常见问题|FAQ/)).toHaveCount(0)

    await page.screenshot({ path: testInfo.outputPath(`contact-zh-${width}.png`), fullPage: true })
  })

  test('成功提交后展示成功状态', async ({ page }, testInfo) => {
    const width = viewportWidth(page)
    const email = `e2e-${Date.now()}-${width}@example.com`

    await page.goto('/zh/contact')
    await fillForm(page, email)
    await page.getByRole('button', { name: '提交咨询' }).click()

    await expect(page.getByText('咨询已提交')).toBeVisible({ timeout: 15_000 })
    await page.screenshot({
      path: testInfo.outputPath(`contact-success-${width}.png`),
      fullPage: true,
    })
  })

  test('重复提交触发 429 限流提示', async ({ page }, testInfo) => {
    const email = `e2e-duplicate-${Date.now()}-${viewportWidth(page)}@example.com`

    await page.goto('/zh/contact')
    await fillForm(page, email)
    await page.getByRole('button', { name: '提交咨询' }).click()
    await expect(page.getByText('咨询已提交')).toBeVisible({ timeout: 15_000 })

    await page.getByRole('button', { name: '再次提交' }).click()
    await fillForm(page, email)
    await page.getByRole('button', { name: '提交咨询' }).click()

    await expect(page.getByText('提交过于频繁')).toBeVisible({ timeout: 15_000 })
  })

  test('英文页面：提交成功提示为英文', async ({ page }, testInfo) => {
    const width = viewportWidth(page)
    const email = `e2e-en-${Date.now()}-${width}@example.com`

    await page.goto('/en/contact')
    await page.fill('#contact-name', 'Alex Zhang')
    await page.fill('#contact-company', 'Example Technology Co.')
    await page.fill('#contact-email', email)
    await page.selectOption('#contact-cooperation', 'enterprise-ai')
    await page.fill('#contact-message', 'We would like to learn more about your enterprise AI solutions.')
    await page.check('#contact-consent')
    await page.getByRole('button', { name: 'Submit enquiry' }).click()

    await expect(page.getByText('Enquiry received')).toBeVisible({ timeout: 15_000 })
  })
})
