<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import BrandLogo from '@/components/common/BrandLogo.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import { PRIMARY_NAV, SITE_CONFIG } from '@/config/site'
import { useLocalePath } from '@/composables/useLocalePath'
import { useUiStore } from '@/stores/ui'

const { t } = useI18n()
const route = useRoute()
const ui = useUiStore()
const localePath = useLocalePath()
const scrolled = ref(false)
const activeKey = computed(() => route.meta.navKey)
function onScroll() { scrolled.value = window.scrollY > 8 }
onMounted(() => { onScroll(); window.addEventListener('scroll', onScroll, { passive: true }) })
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="header" :class="{ 'is-scrolled': scrolled }">
    <div class="container header__inner">
      <RouterLink :to="localePath('home')" class="header__logo" :aria-label="`${SITE_CONFIG.companyName} — ${t('nav.home')}`"><BrandLogo /></RouterLink>
      <nav class="header__nav" :aria-label="t('a11y.primaryNav')">
        <RouterLink v-for="item in PRIMARY_NAV" :key="item.key" :to="localePath(item.routeName)" class="header__link"
          :class="{ 'is-active': activeKey === item.key }" :aria-current="activeKey === item.key ? 'page' : undefined">{{ t(item.i18nKey) }}</RouterLink>
      </nav>
      <div class="header__actions">
        <LanguageSwitcher class="header__lang" variant="inline" />
        <RouterLink :to="localePath('contact')" class="header__cta">{{ t('actions.contactUs') }}<span aria-hidden="true">↗</span></RouterLink>
        <button type="button" class="header__burger" :aria-label="ui.mobileNavOpen ? t('header.closeMenu') : t('header.openMenu')"
          :aria-expanded="ui.mobileNavOpen" aria-controls="mobile-nav" @click="ui.toggleMobileNav()"><span /><span /></button>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header { position: sticky; top: 0; z-index: 100; background: rgba(7, 12, 21, .94); backdrop-filter: blur(16px); border-bottom: 1px solid transparent; }
.header.is-scrolled { border-bottom-color: var(--vn-border); }
.header__inner { display: flex; height: var(--vn-header-height); align-items: center; justify-content: space-between; gap: 24px; }
.header__logo { display: inline-flex; flex-shrink: 0; }
.header__nav { display: flex; align-items: center; gap: clamp(18px, 1.7vw, 28px); margin-inline: auto; }
.header__link { position: relative; padding-block: 12px; font-size: 14px; font-weight: 400; white-space: nowrap; color: var(--vn-text-secondary); transition: color .2s; }
.header__link:hover, .header__link.is-active { color: var(--vn-text); }
.header__link.is-active::after { content: ''; position: absolute; bottom: 3px; left: 0; width: 14px; height: 1px; background: var(--vn-link); }
.header__actions { display: flex; align-items: center; gap: 22px; }
.header__cta { display: inline-flex; align-items: center; justify-content: center; gap: 20px; padding: 10px 17px; border: 1px solid var(--vn-border-strong); border-radius: 5px; font-size: 14px; white-space: nowrap; transition: background-color .2s; }
.header__cta:hover { background: var(--vn-surface); }
.header__burger { display: none; width: 44px; height: 44px; flex-direction: column; align-items: center; justify-content: center; gap: 6px; }
.header__burger span { width: 22px; height: 1px; background: var(--vn-text); }
@media (max-width: 1199px) { .header__nav { display: none; } .header__burger { display: inline-flex; } .header__actions { margin-left: auto; } }
@media (max-width: 767px) { .header__cta { display: none; } .header__inner { gap: 12px; } }
@media (max-width: 479px) { .header__lang { display: none; } }
</style>
