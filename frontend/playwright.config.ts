import { defineConfig } from '@playwright/test'

/**
 * 布局骨架自查：三个验收视口（1440 / 768 / 390）。
 * 使用 `npm run preview` 托管构建产物，确保测的是真实生产构建而非 dev server。
 */
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    browserName: 'chromium',
    screenshot: 'only-on-failure',
    trace: 'off',
  },
  projects: [
    { name: 'desktop-1920', use: { viewport: { width: 1920, height: 1080 } } },
    {
      name: 'desktop-1440',
      use: { viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'tablet-768',
      use: { viewport: { width: 768, height: 1024 } },
    },
    {
      name: 'mobile-390',
      use: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: false },
    },
  ],
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173/zh',
    reuseExistingServer: true,
    timeout: 90_000,
  },
})
