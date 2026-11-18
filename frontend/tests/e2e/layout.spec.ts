import { expect, test, type Page } from '@playwright/test'

/**
 * 布局骨架验收：
 * - 七个一级页面在 1920 / 1440 / 768 / 390 均可访问
 * - Header（Logo / 七项导航 / 语言切换 / Contact 按钮 / 汉堡菜单）与 Footer 正常
 * - 页面无横向溢出（临时放开 body 的 overflow-x 裁剪后测量真实内容宽度）
 * - 语言切换映射到同一页面的另一语言，并输出 hreflang
 */

const NAV_LABELS_ZH = ['首页', '关于我们', '解决方案', '产品', '技术', '洞察', '联系我们']
const PAGES = ['', '/about', '/solutions', '/products', '/technology', '/insights', '/contact']

function viewportWidth(page: Page): number {
  return page.viewportSize()?.width ?? 1440
}

/** 临时解除 overflow-x 裁剪后测量真实横向溢出量。 */
async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(() => {
    const body = document.body
    const previous = body.style.overflowX
    body.style.overflowX = 'visible'
    const scrollWidth = document.documentElement.scrollWidth
    const viewport = window.innerWidth
    body.style.overflowX = previous
    return scrollWidth - viewport
  })
}

async function openLanguageSwitchIfNeeded(page: Page): Promise<void> {
  if (viewportWidth(page) < 480) {
    await page.getByRole('button', { name: /打开导航菜单|Open navigation menu/ }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
  }
}

test.describe('布局骨架', () => {
  test('首页：Header / Hero / CTA / Footer 完整且无横向溢出', async ({ page }, testInfo) => {
    const width = viewportWidth(page)

    await page.goto('/zh')
    await expect(page).toHaveTitle(/VERINEX/)
    await expect(page.locator('h1')).toHaveText(/以可信为基，以智能致远。/)

    // Header
    const header = page.locator('header')
    await expect(header).toBeVisible()
    await expect(header.getByRole('link', { name: /VERINEX/ }).first()).toBeVisible()

    if (width >= 1200) {
      const links = page.locator('header nav a')
      await expect(links).toHaveCount(7)
      for (const label of NAV_LABELS_ZH) {
        await expect(page.locator('header nav').getByRole('link', { name: label, exact: true })).toBeVisible()
      }
      await expect(header.getByRole('button', { name: '切换到中文' })).toBeVisible()
      await expect(header.getByRole('button', { name: /Switch to English/ })).toBeVisible()
    } else {
      await expect(header.getByRole('button', { name: '打开导航菜单' })).toBeVisible()
    }

    // CTA
    await expect(page.getByRole('heading', { name: /让可信的智能/ })).toBeVisible()

    // Footer：只出现一次
    const footers = page.locator('footer')
    await expect(footers).toHaveCount(1)
    await expect(footers).toContainText('解决方案')
    await expect(footers).toContainText('VERICORPUS')
    await expect(footers).toContainText('隐私政策')
    await expect(footers.getByRole('link', { name: '隐私政策' })).toBeVisible()

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0)

    await page.screenshot({ path: testInfo.outputPath(`layout-home-${width}.png`), fullPage: true })
  })

  test('七个一级页面均可访问且无横向溢出', async ({ page }, testInfo) => {
    const width = viewportWidth(page)

    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    for (const locale of ['en', 'zh']) {
      for (const path of PAGES) {
        const response = await page.goto(`/${locale}${path}`)
        expect(response?.status(), `GET /${locale}${path}`).toBeLessThan(400)
        await expect(page.locator('main h1')).toBeVisible()
        await expect(page.locator('.async-state__skeleton')).toHaveCount(0)
        await expect(page.locator('main .async-state--error')).toHaveCount(0)
        for (const img of await page.locator('main img').all()) {
          await img.scrollIntoViewIfNeeded()
          await img.evaluate((el: HTMLImageElement) => el.decode())
        }
        const overflow = await horizontalOverflow(page)
        expect(overflow, `横向溢出：/${locale}${path} @ ${width}px`).toBeLessThanOrEqual(0)
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
        await page.screenshot({ path: testInfo.outputPath(`${path.slice(1) || 'home'}-${locale}-${width}.png`), fullPage: true })
      }
    }
    expect(errors).toEqual([])

  })

  test('语言切换映射到同一页面的另一语言并输出 hreflang', async ({ page }, testInfo) => {
    const width = viewportWidth(page)

    await page.goto('/zh/products')
    await openLanguageSwitchIfNeeded(page)
    await page.getByRole('button', { name: /Switch to English/ }).click()

    await expect(page).toHaveURL(/\/en\/products$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('h1')).toHaveText(/Distinct by purpose\./i)

    // hreflang：zh-CN / en / x-default 各一条
    await expect(page.locator('link[rel="alternate"][hreflang="zh-CN"]')).toHaveCount(1)
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1)
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', /\/en\/products$/)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/en\/products$/)

    // 切回中文仍停留在同一页面
    await openLanguageSwitchIfNeeded(page)
    await page.getByRole('button', { name: /切换到中文/ }).click()
    await expect(page).toHaveURL(/\/zh\/products$/)

    if (width >= 768) {
      await page.screenshot({ path: testInfo.outputPath(`i18n-${width}.png`) })
    }
  })

  test('缺少语言前缀的地址重定向到默认语言，未知路径落到 404', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/en$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')

    await page.goto('/about')
    await expect(page).toHaveURL(/\/en\/about$/)

    await page.goto('/zh/unknown-page')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/页面不存在/)
    await expect(page.getByRole('link', { name: /返回首页/ })).toBeVisible()
  })

  test('汉堡菜单（<1200px）可打开并包含七项导航', async ({ page }, testInfo) => {
    const width = viewportWidth(page)
    test.skip(width >= 1200, '桌面宽度使用完整导航')

    await page.goto('/zh')
    await page.getByRole('button', { name: '打开导航菜单' }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    for (const label of NAV_LABELS_ZH) {
      await expect(dialog.getByRole('link', { name: new RegExp(label) })).toBeVisible()
    }

    // 等滑入动画结束再截图，并确认面板完全落在视口内
    await page.waitForTimeout(420)
    const panelBox = await page.locator('.drawer__panel').boundingBox()
    expect(panelBox).not.toBeNull()
    expect(panelBox!.x).toBeGreaterThanOrEqual(0)
    expect(panelBox!.x + panelBox!.width).toBeLessThanOrEqual(width + 1)

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0)
    await page.screenshot({ path: testInfo.outputPath(`drawer-${width}.png`) })

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })
})
