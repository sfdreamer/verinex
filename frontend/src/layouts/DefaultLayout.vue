<script setup lang="ts">
/**
 * 全站布局：跳转链接 → Header → 主内容（含通用 CTA）→ Footer → 移动端抽屉。
 * CTA 通过路由 meta.hideCta 控制（联系页、隐私页不重复展示转化条）。
 */
import { useI18n } from 'vue-i18n'
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

import CtaSection from '@/components/common/CtaSection.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import MobileNavDrawer from '@/components/layout/MobileNavDrawer.vue'
import { useSiteJsonLd } from '@/composables/useSiteJsonLd'

const { t } = useI18n()
const route = useRoute()
const showCta = computed(() => route.meta.hideCta !== true)

// 站点级 Organization / WebSite 结构化数据
useSiteJsonLd()
</script>

<template>
  <div class="layout">
    <a class="skip-link" href="#main">{{ t('a11y.skipToContent') }}</a>

    <AppHeader />

    <main id="main" class="layout__main" tabindex="-1">
      <RouterView />
      <CtaSection v-if="showCta" />
    </main>

    <AppFooter />

    <MobileNavDrawer />
  </div>
</template>

<style scoped lang="scss">
.layout {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background: var(--vn-page);
}

.layout__main {
  flex: 1;
  // 让锚点跳转目标与吸顶 Header 之间留出间距。
  scroll-margin-top: var(--vn-header-total);

  &:focus {
    outline: none;
  }
}
</style>
