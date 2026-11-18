// Resize and encode the approved artwork; keep every source PNG intact.
import { chromium } from '@playwright/test'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
const source = new URL('../../design/phase2/assets-source/', import.meta.url)
const destination = new URL('../public/media/editorial-v2/', import.meta.url)
await mkdir(destination, { recursive: true })
const browser = await chromium.launch()
try {
  const page = await browser.newPage()
  for (const key of ['hero', 'corpus', 'mind', 'studio', 'insight', 'brand', 'article', 'knowledge', 'evaluation', 'oversight']) {
    const journal = ['knowledge', 'evaluation', 'oversight'].includes(key)
    const input = await readFile(new URL(`${key}.png`, journal ? new URL('../../design/phase3/assets-source/', import.meta.url) : source))
    const sizes = key === 'hero' ? [768, 1536] : key === 'article' || journal ? [640, 1280] : [320, 640]
    for (const width of sizes) {
      const encoded = await page.evaluate(async ({ base64, width }) => {
        const img = new Image()
        img.src = `data:image/png;base64,${base64}`
        await img.decode()
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = Math.round(width * img.height / img.width)
        const ctx = canvas.getContext('2d')
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        return canvas.toDataURL('image/webp', .88).split(',')[1]
      }, { base64: input.toString('base64'), width })
      const target = new URL(`${key}-${width}.webp`, destination)
      const bytes = Buffer.from(encoded, 'base64')
      await writeFile(target, bytes)
      console.log(`${fileURLToPath(target)}: ${Math.round(bytes.length / 1024)} KB`)
    }
  }
} finally { await browser.close() }
