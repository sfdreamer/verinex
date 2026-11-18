import { expect, test, type Page } from '@playwright/test'

/**
 * 关于我们（PRD 4.2 / 12.1）自查：
 * - 品牌介绍 / 使命愿景 / 价值观完整；不展示团队与历程
 * - 不展示成立年份、员工规模、专利、发展历程时间轴、团队成员姓名照片
 */

function viewportWidth(page: Page): number {
  return page.viewportSize()?.width ?? 1440
}

const FORBIDDEN = ['2016', '680+', '46 项', '99.9%', '120+', 'SOC 2', '沈明远', 'Marcus Lee', 'Elena Rossi']

test.describe('关于我们', () => {
  test('中文：区块完整且不含未确认事实内容', async ({ page }, testInfo) => {
    const width = viewportWidth(page)
    await page.goto('/zh/about')

    await expect(page.locator('h1')).toHaveText(/以真实为起点/ )
    await expect(
      page.getByRole('heading', { name: '让每一个智能决策，都能被验证与信任' }),
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: '我们所坚持的四条原则' })).toBeVisible()
    await expect(page.getByRole('heading', { name: /技术理念|团队|历程/ })).toHaveCount(0)

    // 使命 / 愿景 / 价值观（API 数据）
    await expect(page.getByText('让人工智能创造真实价值。')).toBeVisible()
    await expect(page.getByText('成为值得信赖的企业智能化创新伙伴。')).toBeVisible()
    for (const value of ['真实', '专业', '创新', '责任']) {
      await expect(page.getByRole('heading', { name: value, exact: true })).toBeVisible()
    }

    const main = page.locator('main')
    const bodyText = await main.innerText()
    for (const item of FORBIDDEN) {
      expect(bodyText, `页面不应出现未确认内容：${item}`).not.toContain(item)
    }

    await page.screenshot({ path: testInfo.outputPath(`about-zh-${width}.png`), fullPage: true })
  })

  test('英文：内容随语言切换', async ({ page }, testInfo) => {
    const width = viewportWidth(page)
    await page.goto('/en/about')

    await expect(page.locator('h1')).toHaveText(/Grounded in truth/ )
    await expect(
      page.getByRole('heading', { name: 'Four principles we stand by' }),
    ).toBeVisible()
    await expect(page.getByText('Create real value through artificial intelligence.')).toBeVisible()
    for (const value of ['Authenticity', 'Professionalism', 'Innovation', 'Responsibility']) {
      await expect(page.getByRole('heading', { name: value, exact: true })).toBeVisible()
    }

    await page.screenshot({ path: testInfo.outputPath(`about-en-${width}.png`), fullPage: true })
  })
})
