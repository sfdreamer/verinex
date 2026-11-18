// 临时脚本：对本地部署站点截全页面长图（用后可删除）
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const BASE = process.env.BASE_URL || 'http://localhost:8081';
const OUT = fileURLToPath(new URL('../output/fullpage-20261118/', import.meta.url));
mkdirSync(OUT, { recursive: true });

const pages = [
  ['home', '/zh'],
  ['products', '/zh/products'],
  ['solutions', '/zh/solutions'],
  ['technology', '/zh/technology'],
  ['insights', '/zh/insights'],
  ['about', '/zh/about'],
  ['contact', '/zh/contact'],
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

for (const [name, path] of pages) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  // 触发懒加载图片：先滚到底再回顶
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => {
        y += 800;
        window.scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(step, 80);
        else { window.scrollTo(0, 0); setTimeout(resolve, 300); }
      };
      step();
    });
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}${name}.png`, fullPage: true });
  console.log(`saved ${name}.png`);
}

await browser.close();
console.log('done ->', OUT);
