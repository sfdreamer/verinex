import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'

import { expect, test } from '@playwright/test'

/**
 * SEO（PRD 第 8 章）自查：
 * - 七个一级页面 × zh/en 在构建期输出独立 HTML（含 title / canonical / hreflang / OG）
 * - robots.txt 随前端发布并指向 sitemap
 * - 后端 /sitemap.xml 返回 XML
 * - 结构化数据：Organization / Product / Service / Article / BreadcrumbList
 */

const DIST = path.resolve(process.cwd(), 'dist')
const PAGES = ['', 'about', 'solutions', 'products', 'technology', 'insights', 'contact']
const LOCALES = ['zh', 'en']

function distFile(locale: string, page: string): string {
  return page ? path.join(DIST, locale, page, 'index.html') : path.join(DIST, locale, 'index.html')
}

test.describe('SEO 与预渲染', () => {
  test('14 个一级页面输出独立 HTML，含 canonical 与 hreflang', () => {
    for (const locale of LOCALES) {
      for (const page of PAGES) {
        const file = distFile(locale, page)
        expect(existsSync(file), `缺少预渲染文件：${file}`).toBe(true)

        const html = readFileSync(file, 'utf8')
        const expectedPath = `/${locale}${page ? `/${page}` : ''}`

        expect(html).toContain(`<link rel="canonical" href="https://www.verinex.ai${expectedPath}"`)
        expect(html).toContain('hreflang="zh-CN"')
        expect(html).toContain('hreflang="en"')
        expect(html).toContain('hreflang="x-default"')
        expect(html).toContain('property="og:title"')
        expect(html).toMatch(/<html lang="(zh-CN|en)"/)
        // 预渲染应包含真实区块内容，而非空壳
        expect(html.length).toBeGreaterThan(8000)
      }
    }

    // 详情页保持客户端渲染，不输出独立 HTML
    expect(existsSync(path.join(DIST, 'zh', 'products', 'verimind', 'index.html'))).toBe(false)
    expect(existsSync(path.join(DIST, 'zh', 'insights', 'sample-rag-evaluation', 'index.html'))).toBe(false)
  })

  test('robots.txt 随前端发布并声明 sitemap', () => {
    const robots = readFileSync(path.join(DIST, 'robots.txt'), 'utf8')
    expect(robots).toContain('User-agent: *')
    expect(robots).toContain('Sitemap: https://www.verinex.ai/sitemap.xml')
  })

  test('后端 sitemap.xml 返回已发布内容地址', async ({ request }) => {
    const response = await request.get('http://127.0.0.1:8080/sitemap.xml')
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('application/xml')

    const xml = await response.text()
    expect(xml).toContain('/zh/about')
    expect(xml).toContain('/en/insights/')
  })

  test('结构化数据：Organization / Product / Article', async ({ page }) => {
    await page.goto('/zh')
    await expect(page.locator('script#vn-jsonld-organization')).toHaveCount(1)
    const organization = JSON.parse(
      (await page.locator('script#vn-jsonld-organization').textContent()) ?? '{}',
    )
    expect(organization['@type']).toBe('Organization')
    expect(organization.name).toBe('VERINEX TECHNOLOGIES')

    await page.goto('/zh/products/verimind')
    const product = JSON.parse(
      (await page.locator('script#vn-jsonld-product').textContent()) ?? '{}',
    )
    expect(product['@type']).toBe('Product')
    expect(product.name).toBe('VERIMIND')

    await page.goto('/zh/insights/sample-rag-evaluation')
    const article = JSON.parse(
      (await page.locator('script#vn-jsonld-article').textContent()) ?? '{}',
    )
    expect(article['@type']).toBe('Article')
    const breadcrumb = JSON.parse(
      (await page.locator('script#vn-jsonld-breadcrumb').textContent()) ?? '{}',
    )
    expect(breadcrumb['@type']).toBe('BreadcrumbList')
    expect(breadcrumb.itemListElement).toHaveLength(3)

    await page.goto('/zh/solutions/data-intelligence')
    const service = JSON.parse(
      (await page.locator('script#vn-jsonld-service').textContent()) ?? '{}',
    )
    expect(service['@type']).toBe('Service')
  })
})
