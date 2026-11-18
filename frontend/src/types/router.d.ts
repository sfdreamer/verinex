import type { NavKey } from '@/types/locale'

declare module 'vue-router' {
  interface RouteMeta {
    /** 对应 i18n 中 seo.<key> 的文案键 */
    readonly seoKey?: NavKey | 'privacy'
    /** 对应一级导航项，用于 Header 当前项高亮 */
    readonly navKey?: NavKey
    /** 页面是否需要深色首屏（Header 透明/深色背景） */
    readonly theme?: 'dark' | 'light'
    /** 是否隐藏通用 CTA 区块（联系页已有表单、法律页无需转化条） */
    readonly hideCta?: boolean
  }
}
