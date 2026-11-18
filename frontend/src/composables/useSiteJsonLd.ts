/**
 * 站点级结构化数据（Organization + WebSite），在布局层注入一次。
 * 不包含未确认的地址、电话、社媒账号或评分。
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { SITE_CONFIG, findLocale } from '@/config/site'
import { useJsonLd } from '@/composables/useJsonLd'
import type { UrlLocale } from '@/types/locale'

export function useSiteJsonLd(): void {
  const route = useRoute()
  const { t } = useI18n()

  const lang = computed(() => findLocale(route.params.locale as UrlLocale).htmlLang)

  useJsonLd('organization', () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.companyName,
    alternateName: 'VERINEX 维真科技',
    url: SITE_CONFIG.siteUrl,
    logo: `${SITE_CONFIG.siteUrl}/favicon.svg`,
    email: SITE_CONFIG.contactEmail,
    description: t('seo.home.description'),
  }))

  useJsonLd('website', () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.brandName,
    url: SITE_CONFIG.siteUrl,
    inLanguage: lang.value,
  }))
}
