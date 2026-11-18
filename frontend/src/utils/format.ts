/** 日期与文本展示工具。 */

import type { ContentLocale } from '@/types/locale'

/** ISO 日期 → 按语言本地化展示（zh-CN：2026年5月20日；en：May 20, 2026）。 */
export function formatDate(iso: string, locale: ContentLocale): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(locale === 'zh-CN' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
