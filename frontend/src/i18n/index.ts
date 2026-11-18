import { createI18n } from 'vue-i18n'

import { DEFAULT_URL_LOCALE, findLocale } from '@/config/site'
import en from './messages/en'
import zhCN from './messages/zh-CN'

/**
 * 固定 UI 文案国际化实例。
 * legacy: false 启用 Composition API 模式；fallbackLocale 仅用于开发兜底，
 * 生产文案必须两种语言齐备（en.ts 已通过类型约束与 zh-CN 对齐）。
 */
export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: findLocale(DEFAULT_URL_LOCALE).code,
  fallbackLocale: findLocale(DEFAULT_URL_LOCALE).code,
  messages: {
    'zh-CN': zhCN,
    en,
  },
  // 缺少文案时在开发环境显式提示，避免静默显示空字符串。
  missingWarn: import.meta.env.DEV,
  fallbackWarn: import.meta.env.DEV,
})

export default i18n
