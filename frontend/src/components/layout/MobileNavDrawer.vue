<script setup lang="ts">
/**
 * 移动端 / 平板导航抽屉。<1200px 时由 Header 汉堡按钮触发。
 * 无障碍：role=dialog + aria-modal，Esc 关闭，打开时锁定滚动并把焦点移入抽屉。
 */
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute } from 'vue-router'

import BaseButton from '@/components/common/BaseButton.vue'
import BrandLogo from '@/components/common/BrandLogo.vue'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher.vue'
import { PRIMARY_NAV, SITE_CONFIG } from '@/config/site'
import { useLocalePath } from '@/composables/useLocalePath'
import { useUiStore } from '@/stores/ui'

const { t } = useI18n()
const ui = useUiStore()
const route = useRoute()
const localePath = useLocalePath()

const closeButton = ref<HTMLButtonElement | null>(null)
const panel = ref<HTMLElement | null>(null)

watch(
  () => ui.mobileNavOpen,
  async (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) {
      await nextTick()
      closeButton.value?.focus()
    }
  },
)

// 路由切换后自动关闭抽屉（点击导航项或语言切换后）。
watch(
  () => route.fullPath,
  () => ui.closeMobileNav(),
)

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    ui.closeMobileNav()
    return
  }

  // 焦点约束：Tab 只在抽屉内循环，避免键盘用户进入被遮挡的页面内容。
  if (event.key !== 'Tab' || !panel.value) return

  const focusables = Array.from(
    panel.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
  )
  if (focusables.length === 0) return

  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  const active = document.activeElement

  if (event.shiftKey && active === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="ui.mobileNavOpen"
        id="mobile-nav"
        class="drawer"
        role="dialog"
        aria-modal="true"
        :aria-label="t('a11y.primaryNav')"
        @keydown="onKeydown"
      >
        <div class="drawer__backdrop" aria-hidden="true" @click="ui.closeMobileNav()" />

        <div ref="panel" class="drawer__panel">
          <div class="drawer__head">
            <BrandLogo :size="30" />
            <button
              ref="closeButton"
              type="button"
              class="drawer__close"
              :aria-label="t('header.closeMenu')"
              @click="ui.closeMobileNav()"
            >
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
                <path
                  d="m4 4 8 8M12 4l-8 8"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>

          <nav class="drawer__nav" :aria-label="t('a11y.primaryNav')">
            <RouterLink
              v-for="(item, index) in PRIMARY_NAV"
              :key="item.key"
              :to="localePath(item.routeName)"
              class="drawer__link"
              :class="{ 'is-active': route.meta.navKey === item.key }"
              :aria-current="route.meta.navKey === item.key ? 'page' : undefined"
            >
              <span class="drawer__index" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
              <span>{{ t(item.i18nKey) }}</span>
            </RouterLink>
          </nav>

          <div class="drawer__foot">
            <LanguageSwitcher variant="inline" />
            <BaseButton :to="localePath('contact')" size="lg" block>
              {{ t('actions.contactUs') }}
            </BaseButton>
            <a class="drawer__mail" :href="`mailto:${SITE_CONFIG.contactEmail}`">{{ SITE_CONFIG.contactEmail }}</a>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@use '../../styles/breakpoints' as *;

.drawer {
  position: fixed;
  inset: 0;
  z-index: 150;
  display: flex;
  justify-content: flex-end;

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(4, 10, 18, 0.62);
    backdrop-filter: blur(2px);
  }

  &__panel {
    position: relative;
    display: flex;
    flex-direction: column;
    width: min(88vw, 24rem);
    height: 100%;
    padding: 1.25rem 1.5rem 2rem;
    background: var(--vn-dark);
    border-left: 1px solid var(--vn-dark-border);
    overflow-y: auto;
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid var(--vn-dark-border);
  }

  &__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: var(--vn-radius-sm);
    color: var(--vn-text-inverse);

    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }
  }

  &__nav {
    display: flex;
    flex-direction: column;
    padding-block: 1rem;
  }

  &__link {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    padding: 0.875rem 0;
    font-size: 1.0625rem; // 17px，移动端可点区域更清晰
    font-weight: var(--vn-fw-medium);
    color: var(--vn-text-inverse-secondary);
    border-bottom: 1px solid rgba(143, 168, 196, 0.1);

    &.is-active {
      color: var(--vn-text-inverse);
      font-weight: var(--vn-fw-semibold);
    }

    &:focus-visible {
      outline: 2px solid var(--vn-accent);
      outline-offset: 2px;
    }
  }

  &__index {
    font-size: var(--vn-fs-xs);
    font-family: var(--vn-font-mono);
    color: var(--vn-text-inverse-muted);
  }

  &__foot {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-top: 1.5rem;
  }

  &__mail {
    font-size: var(--vn-fs-sm);
    color: var(--vn-text-inverse-muted);

    &:hover {
      color: var(--vn-text-inverse);
    }
  }
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity var(--vn-duration) var(--vn-ease-out);

  .drawer__panel {
    transition: transform var(--vn-duration-slow) var(--vn-ease-out);
  }
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;

  .drawer__panel {
    transform: translateX(100%);
  }
}

@include reduced-motion {
  .drawer-enter-active,
  .drawer-leave-active,
  .drawer-enter-active .drawer__panel,
  .drawer-leave-active .drawer__panel {
    transition: none;
  }
}
</style>
