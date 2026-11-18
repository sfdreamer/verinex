import { expect, test, type Page } from '@playwright/test'

/**
 * 产品中心（PRD 4.4 / 12.1 / 12.3）自查：
 * - 列表页五个产品、成熟度标签、无白皮书/产品文档入口
 * - 详情页：描述 / 核心能力 / 成熟度说明 / 联系入口 / 其他产品
 */

function viewportWidth(page: Page): number {
  return page.viewportSize()?.width ?? 1440
}

test.describe('产品中心', () => {
  test('列表页：五个产品与 PLANNED 标签', async ({ page }, testInfo) => {
    const width = viewportWidth(page)
    await page.goto('/zh/products')

    await expect(page.locator('h1')).toHaveText(/各有所长/)

    const main = page.locator('main')
    for (const name of ['VERICORPUS', 'VERIMIND', 'VERISTUDIO', 'VERIINSIGHT', 'VERIBRAND']) {
      await expect(main.getByRole('heading', { name, exact: true })).toBeVisible()
    }
    await expect(main.locator('.stage-badge')).toHaveCount(5)

    // PRD 12.3：不得出现白皮书 / 产品文档入口
    await expect(main.getByRole('link', { name: /白皮书|产品文档|Whitepaper/ })).toHaveCount(0)

    await page.screenshot({ path: testInfo.outputPath(`products-zh-${width}.png`), fullPage: true })
  })

  test('详情页：能力、成熟度说明与 SEO', async ({ page }, testInfo) => {
    const width = viewportWidth(page)
    await page.goto('/zh/products/verimind')

    await expect(page.locator('h1')).toHaveText('VERIMIND')
    await expect(page.getByRole('heading', { name: '核心能力' })).toBeVisible()
    for (const feature of ['AI 智能体', 'RAG', '智能问答', '智能工作流', '多模型接入']) {
      await expect(page.getByText(feature, { exact: true }).first()).toBeVisible()
    }
    await expect(page.getByText(/该产品目前处于规划阶段/).first()).toBeVisible()
    await expect(page.getByRole('heading', { name: '其他产品' })).toBeVisible()

    await expect(page).toHaveTitle(/VERIMIND/)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /\/zh\/products\/verimind$/,
    )

    await page.screenshot({
      path: testInfo.outputPath(`product-detail-zh-${width}.png`),
      fullPage: true,
    })
  })

  test('英文详情页：内容与语言一致', async ({ page }, testInfo) => {
    const width = viewportWidth(page)
    await page.goto('/en/products/vericorpus')

    await expect(page.locator('h1')).toHaveText('VERICORPUS')
    await expect(page.getByText('Planned').first()).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Core capabilities' })).toBeVisible()

    await page.screenshot({
      path: testInfo.outputPath(`product-detail-en-${width}.png`),
      fullPage: true,
    })
  })
})
