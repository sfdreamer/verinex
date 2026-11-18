/**
 * 页面级 SEO：title / description / canonical / hreflang / Open Graph。
 * - 一级页面：由 route.meta.seoKey 取 i18n 文案（App.vue 统一调用）。
 * - 详情页：内容来自 API，通过 useDetailSeo 提供运行时覆盖值（canonical/hreflang 仍按实际路由生成）。
 */
import { onBeforeUnmount, shallowRef, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { DEFAULT_URL_LOCALE, LOCALES, SITE_CONFIG, findLocale } from '@/config/site'
import type { UrlLocale } from '@/types/locale'

export interface SeoOverride {
  title: string
  description: string
  /** og:type，列表页 website，详情页 article */
  ogType?: string
  /** 详情页封面等，可为空 */
  image?: string | null
}

function upsertMeta(selector: string, attrs: Record<string, string>): void {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([key, value]) => el!.setAttribute(key, value))
}

function removeMeta(selector: string): void {
  document.head.querySelector(selector)?.remove()
}

function upsertLink(rel: string, href: string, hreflang?: string): HTMLLinkElement {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`
  let el = document.head.querySelector<HTMLLinkElement>(selector)
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    if (hreflang) el.hreflang = hreflang
    document.head.appendChild(el)
  }
  el.href = href
  return el
}

/** 生成同一页面在指定语言下的绝对地址。 */
export function localizedPath(path: string, locale: UrlLocale): string {
  const segments = path.split('/')
  segments[1] = locale
  const joined = segments.join('/')
  return joined === '' ? `/${locale}` : joined
}

/** 当前详情页提供的 SEO 覆盖值；为空时回退到 i18n 静态文案。 */
const seoOverride = shallowRef<SeoOverride | null>(null)

/** 详情页调用：数据到达后写入 title/description，并在离开页面时清除。 */
export function useDetailSeo(getter: () => SeoOverride | null): void {
  watchEffect(() => {
    const value = getter()
    if (value) seoOverride.value = value
  })
  onBeforeUnmount(() => {
    seoOverride.value = null
  })
}

export function usePageSeo(): void {
  const route = useRoute()
  const { t, locale } = useI18n()

  const apply = (): void => {
    const seoKey = (route.meta.seoKey as string | undefined) ?? 'home'
    const current = findLocale(route.params.locale as UrlLocale)
    const override = seoOverride.value
    const title = override?.title ?? t(`seo.${seoKey}.title`)
    const description = override?.description ?? t(`seo.${seoKey}.description`)
    const path = localizedPath(route.path, current.url)
    const canonical = `${SITE_CONFIG.siteUrl}${path === '/' ? '' : path}`

    document.title = title
    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: description,
    })
    upsertMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: override?.ogType ?? 'website',
    })
    upsertMeta('meta[property="og:site_name"]', {
      property: 'og:site_name',
      content: SITE_CONFIG.companyName,
    })
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: current.ogLocale })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })

    if (override?.image) {
      upsertMeta('meta[property="og:image"]', { property: 'og:image', content: override.image })
      upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: override.image })
    } else {
      removeMeta('meta[property="og:image"]')
      removeMeta('meta[name="twitter:image"]')
    }

    upsertLink('canonical', canonical)

    // hreflang：每种语言一条，x-default 与站点默认入口一致。
    LOCALES.forEach((item) => {
      upsertLink(
        'alternate',
        `${SITE_CONFIG.siteUrl}${localizedPath(route.path, item.url)}`,
        item.htmlLang,
      )
    })
    upsertLink('alternate', `${SITE_CONFIG.siteUrl}${localizedPath(route.path, DEFAULT_URL_LOCALE)}`, 'x-default')
  }

  watch([() => route.fullPath, locale, seoOverride], apply, { immediate: true })
}
