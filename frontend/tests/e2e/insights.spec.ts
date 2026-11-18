import { expect, test, type Page } from '@playwright/test'

/**
 * 行业洞察（PRD 4.6 / 12.3）自查：
 * - 列表页：精选文章、五个分类筛选、加载更多
 * - 不出现「客户案例」分类
 * - 详情页：正文安全渲染（无 HTML 注入）、相关文章、SEO
 */

function viewportWidth(page: Page): number {
  return page.viewportSize()?.width ?? 1440
}

test.describe('行业洞察', () => {
  test('列表页：精选 + 分类筛选 + 加载更多', async ({ page }, testInfo) => {
    const width = viewportWidth(page)
    await page.goto('/zh/insights')

    await expect(page.locator('h1')).toHaveText(/观察。研究。/)

    // 分类按钮：全部 + 五项，且不含客户案例
    const filters = page.locator('.insights-toolbar__filter')
    await expect(filters).toHaveCount(6)
    await expect(filters.filter({ hasText: '客户案例' })).toHaveCount(0)

    // 精选文章
    await expect(page.locator('.insight-featured__title')).toBeVisible()

    // 分页：5 篇示例、pageSize=4 → 有「加载更多」
    const loadMore = page.getByRole('button', { name: '加载更多内容' })
    await expect(loadMore).toBeVisible()
    const before = await page.locator('.insights-grid .article-card').count()
    await loadMore.click()
    await expect(page.locator('.insights-grid .article-card')).toHaveCount(before + 1)

    // 切换语言后追加页必须清空，不能把上一语言文章留在新列表中。
    if (width < 480) await page.getByRole('button', { name: '打开导航菜单' }).click()
    await page.getByRole('button', { name: 'Switch to English' }).click()
    await expect(page).toHaveURL(/\/en\/insights$/)
    await expect(page.locator('.insights-grid .article-card')).toHaveCount(3)
    expect(await page.locator('main').innerText()).not.toMatch(/[\u3400-\u9fff]/)
    if (width < 480) await page.getByRole('button', { name: 'Open navigation menu' }).click()
    await page.getByRole('button', { name: '切换到中文' }).click()
    await expect(page).toHaveURL(/\/zh\/insights$/)

    // 分类筛选：切换到企业 AI，仅显示该分类
    await page.getByRole('tab', { name: '企业 AI' }).click()
    await expect(page.locator('.insights-grid .article-card')).toHaveCount(1)

    await page.screenshot({ path: testInfo.outputPath(`insights-zh-${width}.png`), fullPage: true })
  })

  test('详情页：正文、相关文章与 SEO', async ({ page }, testInfo) => {
    const width = viewportWidth(page)
    await page.goto('/zh/insights/sample-rag-evaluation')

    await expect(page.locator('h1')).toHaveText('示例：RAG 评估应关注什么')
    await expect(page.getByRole('heading', { name: '示例说明' })).toBeVisible()
    await expect(page.locator('.article__paragraph').first()).toBeVisible()

    // 相关文章最多三条
    await expect(page.locator('.article-related .article-card')).toHaveCount(3)

    await expect(page).toHaveTitle(/RAG 评估/)
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article')
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /\/zh\/insights\/sample-rag-evaluation$/,
    )

    await page.screenshot({
      path: testInfo.outputPath(`article-detail-zh-${width}.png`),
      fullPage: true,
    })
  })

  test('英文详情页：语言一致', async ({ page }, testInfo) => {
    const width = viewportWidth(page)
    await page.goto('/en/insights/sample-enterprise-ai-readiness')

    await expect(page.locator('h1')).toContainText(/Sample/)
    await expect(page.getByRole('heading', { name: 'Related articles' })).toBeVisible()

    await page.screenshot({
      path: testInfo.outputPath(`article-detail-en-${width}.png`),
      fullPage: true,
    })
  })
})
