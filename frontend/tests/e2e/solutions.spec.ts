import { expect, test, type Page } from '@playwright/test'

/**
 * 解决方案（PRD 4.3 / 12.2 / 12.3）自查：
 * - 列表页五条业务线、核心能力、流程四步
 * - 行业筛选已移除，改为同页锚点
 * - 详情页统一模板：介绍 / 核心能力 / 应用场景 / 联系入口 / 其他方案
 * - 详情页 SEO：title / description / canonical / hreflang / OG
 */

function viewportWidth(page: Page): number {
  return page.viewportSize()?.width ?? 1440
}

test.describe('解决方案', () => {
  test('列表页：五条业务线与锚点导航', async ({ page }, testInfo) => {
    const width = viewportWidth(page)
    await page.goto('/zh/solutions')

    await expect(page.locator('h1')).toHaveText(/连接数据、知识/)
    await expect(page.getByRole('heading', { name: '数据智能', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: '数据研究与洞察', exact: true })).toBeVisible()

    const anchors = page.locator('.solution-jumps a')
    await expect(anchors).toHaveCount(5)

    // 设计稿的行业筛选按钮不应存在（PRD 12.3）
    await expect(page.getByRole('button', { name: /全部行业|金融|制造|零售/ })).toHaveCount(0)

    await page.screenshot({ path: testInfo.outputPath(`solutions-zh-${width}.png`), fullPage: true })
  })

  test('详情页：统一模板与 SEO', async ({ page }, testInfo) => {
    const width = viewportWidth(page)
    await page.goto('/zh/solutions/data-intelligence')

    await expect(page.locator('h1')).toHaveText('数据智能')
    await expect(page.getByRole('heading', { name: '核心能力' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '应用场景' })).toBeVisible()
    await expect(page.getByText('数据采集与治理')).toBeVisible()
    await expect(page.getByRole('heading', { name: '其他解决方案' })).toBeVisible()

    await expect(page).toHaveTitle(/数据智能/)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /\/zh\/solutions\/data-intelligence$/,
    )
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /数据智能/)

    await page.screenshot({
      path: testInfo.outputPath(`solution-detail-zh-${width}.png`),
      fullPage: true,
    })
  })

  test('详情页英文：内容与描述来自 API', async ({ page }, testInfo) => {
    const width = viewportWidth(page)
    await page.goto('/en/solutions/enterprise-ai')

    await expect(page.locator('h1')).toHaveText('Enterprise AI Solutions')
    await expect(page.getByText('LLM applications', { exact: true })).toBeVisible()
    await expect(page.locator('link[rel="alternate"][hreflang="zh-CN"]')).toHaveAttribute(
      'href',
      /\/zh\/solutions\/enterprise-ai$/,
    )

    await page.screenshot({
      path: testInfo.outputPath(`solution-detail-en-${width}.png`),
      fullPage: true,
    })
  })

  test('不存在的 slug：展示空状态而非崩溃', async ({ page }, testInfo) => {
    await page.goto('/zh/solutions/not-a-real-solution')
    await expect(page.getByRole('main')).toContainText(/暂无内容|返回解决方案/)
  })
})
