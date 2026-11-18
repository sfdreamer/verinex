import { expect, test, type Page } from '@playwright/test'

/**
 * 技术能力（PRD 4.5 / 12.1）自查：
 * - 四层架构包含八项技术方向、四个领域、一段工程理念
 * - 不出现认证标识与未确认指标（SOC 2 / ISO 27001 / 99.98% / 12ms / 180+ / 46%）
 */

function viewportWidth(page: Page): number {
  return page.viewportSize()?.width ?? 1440
}

const FORBIDDEN = ['SOC 2', 'ISO 27001', '等保三级', '99.98%', '12ms', '180+', '46%']

test.describe('技术能力', () => {
  test('中文：四层架构与八项技术方向', async ({ page }, testInfo) => {
    const width = viewportWidth(page)
    await page.goto('/zh/technology')

    await expect(page.locator('h1')).toHaveText(/清晰的架构/)
    await expect(
      page.getByRole('heading', { name: '四层架构，一个可信的智能内核' }),
    ).toBeVisible()

    for (const layer of ['应用与智能体层', '模型与推理层', '知识与检索层', '数据与安全底座']) {
      await expect(page.getByRole('heading', { name: layer })).toBeVisible()
    }

    // 八项技术方向来自 API
    const main = page.locator('main')
    await expect(main.locator('.architecture-stack ul > li')).toHaveCount(8)
    await expect(main.getByText('大语言模型', { exact: true })).toBeVisible()
    await expect(main.getByText('企业 AI 集成', { exact: true })).toBeVisible()

    await expect(main.locator('.domain-matrix > li')).toHaveCount(4)
    const bodyText = await main.innerText()
    for (const item of FORBIDDEN) {
      expect(bodyText, `页面不应出现未确认内容：${item}`).not.toContain(item)
    }

    await page.screenshot({ path: testInfo.outputPath(`technology-zh-${width}.png`), fullPage: true })
  })

  test('英文：技术方向与分层同步切换', async ({ page }, testInfo) => {
    const width = viewportWidth(page)
    await page.goto('/en/technology')

    await expect(page.locator('h1')).toHaveText(/Clear architecture/)
    await expect(page.getByRole('heading', { name: 'Model & Inference Layer' })).toBeVisible()
    await expect(page.locator('.architecture-stack ul > li')).toHaveCount(8)

    await page.screenshot({ path: testInfo.outputPath(`technology-en-${width}.png`), fullPage: true })
  })
})
