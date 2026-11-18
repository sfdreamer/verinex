import axios, { type AxiosInstance } from 'axios'

import { useLocaleStore } from '@/stores/locale'
import type { ProblemDetails } from './types'

/**
 * 全站统一的 HTTP 客户端（Axios，禁止混用 fetch）。
 * - baseURL 走同源 /api，由 Nginx（生产）或 Vite 代理（开发）转发到 ASP.NET Core。
 * - 自动附加当前语言 lang 参数，除非调用方显式指定。
 * - 统一把 ProblemDetails 转换为 ApiError，保留 status 与字段错误，
 *   供界面区分 400 验证失败、429 限流等情况；不向界面暴露堆栈。
 */
export class ApiError extends Error {
  readonly status: number | null
  readonly problem: ProblemDetails | null

  constructor(message: string, status: number | null, problem: ProblemDetails | null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.problem = problem
  }

  /** 服务端返回的字段级验证错误（400 时存在）。 */
  get fieldErrors(): Record<string, string[]> {
    return this.problem?.errors ?? {}
  }

  get isRateLimited(): boolean {
    return this.status === 429
  }
}

const http: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 15000,
  headers: { Accept: 'application/json' },
})

http.interceptors.request.use((config) => {
  const locale = useLocaleStore()
  config.params = { lang: locale.contentLocale, ...(config.params ?? {}) }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const problem = (error.response?.data ?? null) as ProblemDetails | null
      const message =
        problem?.detail ?? problem?.title ?? error.message ?? 'Request failed'
      return Promise.reject(new ApiError(message, error.response?.status ?? null, problem))
    }
    return Promise.reject(error instanceof Error ? error : new Error('Unknown request error'))
  },
)

export default http
