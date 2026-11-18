import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'

// Vite 配置：静态资源构建 + 本地开发代理。
// 生产环境由 Nginx 同源提供静态文件并将 /api 反向代理到 ASP.NET Core（见根目录 docker/nginx.conf）。
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = env.VITE_API_BASE_URL ?? 'http://localhost:8080'

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // Design Tokens 以 CSS 自定义属性形式在 styles/global.scss 中全局注册；
    // SCSS 变量（断点等）由组件按需 @use "@/styles/breakpoints" 引入。
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
        },
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        // 开发阶段代理到 docker compose 暴露在本地的 api 服务。
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
        },
      },
    },
    preview: {
      // Playwright 自查用：preview 托管构建产物时同样代理 /api 到本地 API。
      proxy: {
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
        },
      },
    },
    build: {
      target: 'es2022',
      emptyOutDir: false,
      cssCodeSplit: true,
      sourcemap: false,
      chunkSizeWarningLimit: 900,
    },
  }
})
