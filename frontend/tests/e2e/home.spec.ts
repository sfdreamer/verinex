import { expect, test, type Page } from '@playwright/test'

/**
 * Phase 2 首页：六个内容区域，行业并入业务区，技术与洞察合并。
 * - 数据来自 API（五解决方案、五产品、五行业、三篇文章）
 * - PRD 12.1：页面不得出现未确认指标数字（120+、99.98% 等）
 * - 中英文、四视口、图片失败降级与 API 重试
 */

function viewportWidth(page: Page): number {
  return page.viewportSize()?.width ?? 1440
}

const FORBIDDEN_METRICS = ['120+', '99.98%', '40亿', '46 项', '680+', 'SOC 2', '12ms']

/** 逐个滚入视口，确认真实懒加载完成后截图，避免整页截图中出现未加载的空图。 */
async function loadEditorialImages(page: Page): Promise<void> {
  for (const img of await page.locator('main img').all()) {
    await img.scrollIntoViewIfNeeded()
    await img.evaluate((element: HTMLImageElement) => element.decode())
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
}

test.describe('首页', () => {
  test('中文：全部区块渲染且数据完整', async ({ page }, testInfo) => {
    const width = viewportWidth(page)
    await page.goto('/zh')

    await expect(page.locator('h1')).toHaveText(/以可信为基，以智能致远。/)

    await expect(page.getByRole('heading', { name: /从业务问题，\s*找到智能路径。/ })).toBeVisible()
    await expect(page.getByRole('heading', { name: /五个产品方向。\s*一个智能愿景。/ })).toBeVisible()
    await expect(page.getByRole('heading', { name: '技术为基，洞察向前。' })).toBeVisible()

    // 数据仍来自真实 API：5 解决方案、5 产品、5 行业、3 文章；CTA 为第六区。
    const main = page.locator('main')
    await expect(main.locator('section')).toHaveCount(6)
    await expect(main.locator('a[href^="/zh/solutions/"]')).toHaveCount(5)
    await expect(main.locator('a[href^="/zh/products/"]')).toHaveCount(5)
    await expect(main.locator('a[href^="/zh/insights/"]')).toHaveCount(3)
    await expect(main.locator('.industry-strip li')).toHaveCount(5)
    await expect(main.locator('.stage-badge')).toHaveCount(5)
    await expect(main.locator('.stage-badge')).toHaveText(Array(5).fill('规划中'))
    await expect(main.getByRole('link', { name: /预约演示|白皮书/ })).toHaveCount(0)
    await expect(main.getByText('VERICORPUS')).toBeVisible()
    await expect(main.getByText('VERIBRAND')).toBeVisible()
    await expect(main.getByText('智能制造')).toBeVisible()

    // PRD 12.1：未确认指标不得出现
    const bodyText = await main.innerText()
    for (const metric of FORBIDDEN_METRICS) {
      expect(bodyText, `页面不应出现未确认指标：${metric}`).not.toContain(metric)
    }

    await loadEditorialImages(page)
    await page.screenshot({ path: testInfo.outputPath(`home-zh-${width}.png`), fullPage: true })
    await page.screenshot({ path: testInfo.outputPath(`hero-zh-${width}.png`) })

    await main.getByRole('link', { name: /VERIMIND/ }).click()
    await expect(page).toHaveURL(/\/zh\/products\/verimind$/)
    await expect(page.locator('h1')).toContainText('VERIMIND')
  })

  test('英文：内容随语言切换且无中文残留', async ({ page }, testInfo) => {
    const width = viewportWidth(page)
    await page.goto('/en')

    await expect(page.locator('h1')).toHaveText(/Intelligence Built on Trust\./)
    await expect(
      page.getByRole('heading', { name: /Business challenges\.\s*Intelligent possibilities\./ }),
    ).toBeVisible()
    await expect(page.getByText('Intelligent Manufacturing')).toBeVisible()
    await expect(page.getByText('Planned').first()).toBeVisible()
    expect(await page.locator('main').innerText()).not.toMatch(/[\u3400-\u9fff]/)

    await loadEditorialImages(page)
    await page.screenshot({ path: testInfo.outputPath(`home-en-${width}.png`), fullPage: true })
    await page.screenshot({ path: testInfo.outputPath(`hero-en-${width}.png`) })
  })

  test('图片加载失败时保留产品、文章和联系入口', async ({ page }) => {
    await page.route('**/media/editorial-v2/**', route => route.abort())
    await page.goto('/zh')
    const main = page.locator('main')
    await expect(main.getByRole('link', { name: /VERIBRAND/ })).toBeVisible()
    await main.getByRole('link', { name: /VERIBRAND/ }).scrollIntoViewIfNeeded()
    await main.locator('.insights-edit__featured').scrollIntoViewIfNeeded()
    await expect(main.locator('img')).toHaveCount(0)
    await expect(main.locator('a[href^="/zh/products/"]')).toHaveCount(5)
    await expect(main.locator('a[href^="/zh/insights/"]')).toHaveCount(3)
    await main.getByRole('link', { name: /洽谈合作/ }).click()
    await expect(page).toHaveURL(/\/zh\/contact$/)
    await expect(page.locator('#contact-name')).toBeVisible()
  })

  test('API 出错时可重试恢复真实内容', async ({ page }) => {
    await page.route('**/api/v1/products?*', route => route.fulfill({
      status: 503,
      contentType: 'application/problem+json',
      body: JSON.stringify({ title: 'Service temporarily unavailable', status: 503 }),
    }))
    await page.goto('/zh')
    await expect(page.getByRole('alert')).toContainText('内容暂时无法加载')
    await page.unroute('**/api/v1/products?*')
    await page.getByRole('button', { name: '重新加载' }).click()
    await expect(page.locator('main a[href^="/zh/products/"]')).toHaveCount(5)
    await expect(page.getByRole('alert')).toHaveCount(0)
  })
})
