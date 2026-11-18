/**
 * 构建期预渲染（PRD 第 8 章 SEO：七个一级页面与语言首页输出独立 HTML）。
 *
 * 设计取舍：
 * - 不引入预渲染插件，避免与 Vite 7 / Vue 3.5 版本约束冲突（AGENTS.md 第 15 章）。
 * - 使用项目已有的 Playwright 在构建产物上抓取路由快照，输出
 *   dist/zh/index.html、dist/zh/about/index.html…… 每个地址一个独立 HTML。
 * - Nginx 使用 try_files $uri $uri/index.html 直接命中这些文件（见 docker/nginx.conf）。
 * - 若运行环境没有浏览器（例如 Docker 构建阶段）或 API 不可达，则降级为
 *   「应用外壳 + 该路由的 title/description/canonical/hreflang」，构建不中断。
 */
import { createServer, request as httpRequest } from 'node:http'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const PORT = Number(process.env.PRERENDER_PORT ?? 4180)
const API_TARGET = new URL(process.env.PRERENDER_API_BASE ?? 'http://127.0.0.1:8080')
const SITE_URL = process.env.PRERENDER_SITE_URL ?? 'https://www.verinex.ai'

const PAGES = [
  { path: '', key: 'home', title: { zh: 'VERINEX TECHNOLOGIES — 以可信为基，以智能致远。', en: 'VERINEX TECHNOLOGIES — Intelligence Built on Trust.' } },
  { path: 'about', key: 'about', title: { zh: '关于我们 — VERINEX TECHNOLOGIES', en: 'About Us — VERINEX TECHNOLOGIES' } },
  { path: 'solutions', key: 'solutions', title: { zh: '解决方案 — VERINEX TECHNOLOGIES', en: 'Solutions — VERINEX TECHNOLOGIES' } },
  { path: 'products', key: 'products', title: { zh: '产品中心 — VERINEX TECHNOLOGIES', en: 'Products — VERINEX TECHNOLOGIES' } },
  { path: 'technology', key: 'technology', title: { zh: '技术能力 — VERINEX TECHNOLOGIES', en: 'Technology — VERINEX TECHNOLOGIES' } },
  { path: 'insights', key: 'insights', title: { zh: '行业洞察 — VERINEX TECHNOLOGIES', en: 'Insights — VERINEX TECHNOLOGIES' } },
  { path: 'contact', key: 'contact', title: { zh: '联系我们 — VERINEX TECHNOLOGIES', en: 'Contact — VERINEX TECHNOLOGIES' } },
]
const LOCALES = ['zh', 'en']

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
}

function startStaticServer() {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', `http://127.0.0.1:${PORT}`)

    // /api 与 /health 反向代理到本地 API，保证预渲染时区块能取到真实数据
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/health/')) {
      const proxyReq = httpRequest(
        {
          hostname: API_TARGET.hostname,
          port: API_TARGET.port || 80,
          path: url.pathname + url.search,
          method: req.method,
          headers: { ...req.headers, host: API_TARGET.host },
        },
        (proxyRes) => {
          res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers)
          proxyRes.pipe(res)
        },
      )
      proxyReq.on('error', () => {
        res.writeHead(502).end('bad gateway')
      })
      req.pipe(proxyReq)
      return
    }

    let filePath = path.join(DIST, decodeURIComponent(url.pathname))
    if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
      filePath = path.join(DIST, 'index.html')
    }
    try {
      const body = await readFile(filePath)
      res.writeHead(200, { 'content-type': MIME[path.extname(filePath)] ?? 'application/octet-stream' })
      res.end(body)
    } catch {
      res.writeHead(404).end('not found')
    }
  })

  return new Promise((resolve) => server.listen(PORT, '127.0.0.1', () => resolve(server)))
}

function routeFile(locale, pagePath) {
  return pagePath
    ? path.join(DIST, locale, pagePath, 'index.html')
    : path.join(DIST, locale, 'index.html')
}

function routeUrl(locale, pagePath) {
  return `${SITE_URL}/${locale}${pagePath ? `/${pagePath}` : ''}`
}

/** 降级方案：外壳 HTML + 该路由的 title / description / canonical / hreflang / OG。 */
async function writeShellFallback(shell, locale, page) {
  let html = shell
  const canonical = routeUrl(locale, page.path)
  const title = page.title[locale]
  const htmlLang = locale === 'zh' ? 'zh-CN' : 'en'

  html = html.replace(/<html lang="[^"]*"/, `<html lang="${htmlLang}"`)
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)

  const head = [
    `<link rel="canonical" href="${canonical}" />`,
    `<link rel="alternate" hreflang="zh-CN" href="${routeUrl('zh', page.path)}" />`,
    `<link rel="alternate" hreflang="en" href="${routeUrl('en', page.path)}" />`,
    `<link rel="alternate" hreflang="x-default" href="${routeUrl('en', page.path)}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${canonical}" />`,
  ].join('\n    ')
  html = html.replace('</head>', `  ${head}\n  </head>`)

  const target = routeFile(locale, page.path)
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, html, 'utf8')
}

async function main() {
  if (!existsSync(path.join(DIST, 'index.html'))) {
    console.error('[prerender] dist/index.html 不存在，请先执行 vite build')
    process.exitCode = 1
    return
  }

  const shell = await readFile(path.join(DIST, 'index.html'), 'utf8')
  const server = await startStaticServer()
  let browser = null
  const result = { prerendered: 0, fallback: 0 }

  try {
    try {
      const { chromium } = await import('@playwright/test')
      browser = await chromium.launch()
    } catch (error) {
      console.warn(`[prerender] 浏览器不可用，全部路由降级为外壳输出：${error.message}`)
    }

    for (const locale of LOCALES) {
      for (const page of PAGES) {
        const url = `http://127.0.0.1:${PORT}/${locale}${page.path ? `/${page.path}` : ''}`
        const target = routeFile(locale, page.path)

        if (!browser) {
          await writeShellFallback(shell, locale, page)
          result.fallback += 1
          continue
        }

        const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
        const tab = await context.newPage()
        try {
          await tab.goto(url, { waitUntil: 'networkidle', timeout: 25_000 })
          await tab.waitForSelector('main h1', { timeout: 10_000 })
          // 等异步区块渲染完成（loading 状态消失）
          await tab.waitForFunction(
            () => !document.querySelector('.async-state__skeleton'),
            undefined,
            { timeout: 10_000 },
          )
          // API 不可达时页面会进入 error 状态，这种快照不能写入构建产物
          const hasErrorState = await tab.evaluate(
            () => document.querySelector('.async-state--error') !== null,
          )
          if (hasErrorState) throw new Error('页面出现数据加载错误状态，改用外壳降级')
          const html = await tab.content()
          await mkdir(path.dirname(target), { recursive: true })
          await writeFile(target, html, 'utf8')
          result.prerendered += 1
          console.log(`[prerender] ${locale}/${page.path || '(home)'} → ${path.relative(ROOT, target)}`)
        } catch (error) {
          console.warn(
            `[prerender] ${locale}/${page.path || '(home)'} 抓取失败，降级为外壳输出：${error.message}`,
          )
          await writeShellFallback(shell, locale, page)
          result.fallback += 1
        } finally {
          await context.close()
        }
      }
    }
  } finally {
    await browser?.close()
    server.close()
  }

  console.log(
    `[prerender] 完成：${result.prerendered} 个路由写入 HTML 快照，${result.fallback} 个路由降级为外壳。`,
  )
}

main().catch((error) => {
  console.error('[prerender] 未预期错误：', error)
  process.exitCode = 1
})
