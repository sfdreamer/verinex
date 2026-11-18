import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { DEFAULT_URL_LOCALE, isUrlLocale } from '@/config/site'
import type { UrlLocale } from '@/types/locale'

const ROUTE_PATHS: Record<string, string> = {
  home: '',
  about: 'about',
  solutions: 'solutions',
  products: 'products',
  technology: 'technology',
  insights: 'insights',
  contact: 'contact',
  privacy: 'privacy',
}

/**
 * 生成带当前语言前缀的站内路径，避免每个组件重复拼接 /zh、/en。
 * 语言变化时返回值自动更新（依赖 route.params.locale）。
 */
export function useLocalePath() {
  const route = useRoute()
  const locale = computed<UrlLocale>(() =>
    isUrlLocale(route.params.locale) ? route.params.locale : DEFAULT_URL_LOCALE,
  )

  return (name: keyof typeof ROUTE_PATHS): string => {
    const segment = ROUTE_PATHS[name] ?? ''
    return segment ? `/${locale.value}/${segment}` : `/${locale.value}`
  }
}
