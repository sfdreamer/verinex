// 语言与路由相关的类型定义。
// URL 前缀使用 zh / en（见 docs/ARCHITECTURE.md 6.2），
// 而 i18n locale 与数据库 locale 使用 zh-CN / en（见 docs/DATABASE.md 3）。

export type UrlLocale = 'zh' | 'en'

export type ContentLocale = 'zh-CN' | 'en'

export interface LocaleMeta {
  /** URL 前缀，例如 /zh/ */
  readonly url: UrlLocale
  /** Vue I18n 与 API 使用的 locale 标识 */
  readonly code: ContentLocale
  /** <html lang> 与 hreflang 使用值 */
  readonly htmlLang: string
  /** hrflang="x-default" 指向的中立版本 */
  readonly isDefault: boolean
  /** Open Graph og:locale */
  readonly ogLocale: string
  /** 语言切换控件显示文案 */
  readonly label: string
  /** 语言切换控件的无障碍名称 */
  readonly ariaLabel: string
}

/** 一级导航项标识，与路由 name 一一对应。 */
export type NavKey =
  | 'home'
  | 'about'
  | 'solutions'
  | 'products'
  | 'technology'
  | 'insights'
  | 'contact'

export interface NavItem {
  readonly key: NavKey
  readonly routeName: NavKey
  /** Vue I18n 文案键 */
  readonly i18nKey: string
}
