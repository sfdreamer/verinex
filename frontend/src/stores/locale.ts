import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { DEFAULT_URL_LOCALE, findLocale } from '@/config/site'
import type { ContentLocale, UrlLocale } from '@/types/locale'

/**
 * 当前语言由 URL 前缀决定（/zh、/en），store 只保存解析后的结果，
 * 供 Header、Footer、SEO 与 API 请求读取（见 docs/ARCHITECTURE.md 6.2 / 6.3）。
 */
export const useLocaleStore = defineStore('locale', () => {
  const urlLocale = ref<UrlLocale>(DEFAULT_URL_LOCALE)

  const meta = computed(() => findLocale(urlLocale.value))
  /** 传给 API 的 lang 参数：zh-CN / en */
  const contentLocale = computed<ContentLocale>(() => meta.value.code)
  const htmlLang = computed(() => meta.value.htmlLang)

  function setLocale(locale: UrlLocale): void {
    urlLocale.value = locale
  }

  return { urlLocale, meta, contentLocale, htmlLang, setLocale }
})
