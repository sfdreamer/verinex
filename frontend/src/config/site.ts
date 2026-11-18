import type { LocaleMeta, NavItem, UrlLocale } from '@/types/locale'

/** 支持的语言。数组顺序即语言切换控件的展示顺序。 */
export const LOCALES: readonly LocaleMeta[] = [
  {
    url: 'zh',
    code: 'zh-CN',
    htmlLang: 'zh-CN',
    isDefault: false,
    ogLocale: 'zh_CN',
    label: '中文',
    ariaLabel: '切换到中文',
  },
  {
    url: 'en',
    code: 'en',
    htmlLang: 'en',
    isDefault: true,
    ogLocale: 'en_US',
    label: 'EN',
    ariaLabel: 'Switch to English',
  },
]

export const DEFAULT_URL_LOCALE: UrlLocale = 'en'

export const URL_LOCALES: readonly UrlLocale[] = LOCALES.map((locale) => locale.url)

export function isUrlLocale(value: unknown): value is UrlLocale {
  return typeof value === 'string' && (URL_LOCALES as readonly string[]).includes(value)
}

export function findLocale(url: UrlLocale): LocaleMeta {
  return LOCALES.find((locale) => locale.url === url) ?? LOCALES.find((locale) => locale.isDefault)!
}

export function toContentLocale(url: UrlLocale): LocaleMeta['code'] {
  return findLocale(url).code
}

/**
 * 七项一级导航。顺序与设计稿 Header 一致：
 * 首页 / 关于我们 / 解决方案 / 产品 / 技术 / 洞察 / 联系我们
 */
export const PRIMARY_NAV: readonly NavItem[] = [
  { key: 'home', routeName: 'home', i18nKey: 'nav.home' },
  { key: 'about', routeName: 'about', i18nKey: 'nav.about' },
  { key: 'solutions', routeName: 'solutions', i18nKey: 'nav.solutions' },
  { key: 'products', routeName: 'products', i18nKey: 'nav.products' },
  { key: 'technology', routeName: 'technology', i18nKey: 'nav.technology' },
  { key: 'insights', routeName: 'insights', i18nKey: 'nav.insights' },
  { key: 'contact', routeName: 'contact', i18nKey: 'nav.contact' },
]

/** 站点级静态配置。业务数据（邮箱等）后续由 /api/v1/site/settings 提供。 */
export const SITE_CONFIG = {
  brandName: 'VERINEX',
  companyName: 'VERINEX TECHNOLOGIES',
  // TODO: 接入 /api/v1/site/settings 后改为接口返回值（DATABASE.md 4.14 contact_email）。
  contactEmail: 'business@verinex.ai',
  // 站点域名用于生成 canonical / hreflang 绝对地址，上线前替换为正式域名。
  siteUrl: 'https://www.verinex.ai',
} as const
