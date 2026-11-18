<script setup lang="ts">
/**
 * 语言切换：分段控件「中文 / EN」。
 * 切换时保留当前路由 name 与其余参数，只替换语言前缀，
 * 因此始终映射到「同一页面的另一种语言」（docs/ARCHITECTURE.md 6.2）。
 */
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

import { LOCALES } from '@/config/site'
import { useUiStore } from '@/stores/ui'
import type { UrlLocale } from '@/types/locale'

const props = withDefaults(defineProps<{ variant?: 'pill' | 'inline' }>(), { variant: 'pill' })

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const ui = useUiStore()

function isActive(locale: UrlLocale): boolean {
  return route.params.locale === locale
}

function switchTo(locale: UrlLocale): void {
  if (isActive(locale)) return

  const name = typeof route.name === 'string' ? route.name : 'home'
  const params = { ...route.params, locale }

  void router.push({ name, params, query: route.query, hash: route.hash })
  ui.closeMobileNav()
}
</script>

<template>
  <div
    class="lang"
    :class="[`lang--${props.variant}`]"
    role="group"
    :aria-label="t('a11y.languageSwitch')"
  >
    <svg class="lang__globe" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" stroke-width="1.2" />
      <path d="M1.8 8h12.4M8 1.6c1.9 1.9 2.8 4.1 2.8 6.4S9.9 12.5 8 14.4C6.1 12.5 5.2 10.3 5.2 8S6.1 3.5 8 1.6Z" fill="none" stroke="currentColor" stroke-width="1.2" />
    </svg>
    <button
      v-for="locale in LOCALES"
      :key="locale.url"
      type="button"
      class="lang__option"
      :class="{ 'is-active': isActive(locale.url) }"
      :aria-pressed="isActive(locale.url)"
      :aria-label="locale.ariaLabel"
      @click="switchTo(locale.url)"
    >
      {{ locale.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.lang {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--vn-text-inverse-secondary);

  &__globe {
    width: 0.875rem;
    height: 0.875rem;
    margin-right: 0.125rem;
    flex: none;
    opacity: 0.8;
  }

  &__option {
    min-height: 44px;
    min-width: 36px;
    padding: 0.25rem 0.375rem;
    border-radius: var(--vn-radius-xs);
    font-size: var(--vn-fs-xs);
    font-weight: var(--vn-fw-medium);
    letter-spacing: 0.02em;
    color: inherit;
    transition: color var(--vn-duration) var(--vn-ease-out);

    &:hover {
      color: var(--vn-text-inverse);
    }

    &.is-active {
      color: var(--vn-text-inverse);
      font-weight: var(--vn-fw-semibold);
    }

    &:focus-visible {
      outline: 2px solid var(--vn-accent);
      outline-offset: 1px;
    }
  }

  // Header 中的胶囊样式：与设计稿右侧语言控件一致（描边 + 8px 圆角）
  &--pill {
    height: 2.125rem;
    padding-inline: 0.625rem;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: var(--vn-radius-sm);
    transition: border-color var(--vn-duration) var(--vn-ease-out);

    &:hover {
      border-color: rgba(255, 255, 255, 0.3);
    }
  }

  &--inline {
    gap: 0.125rem;
    color: var(--vn-text-inverse-secondary);

    .lang__option {
      font-size: var(--vn-fs-sm);
    }
  }
}
</style>
