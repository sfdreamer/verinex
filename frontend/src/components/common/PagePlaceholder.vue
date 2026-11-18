<script setup lang="ts">
/**
 * 本阶段各一级页面的统一占位视图。
 * 后续阶段用真实页面替换，占位内容明确说明「未实现」，不伪装成已完成页面。
 */
import { useI18n } from 'vue-i18n'

import BaseButton from '@/components/common/BaseButton.vue'
import SectionEyebrow from '@/components/common/SectionEyebrow.vue'
import { useLocalePath } from '@/composables/useLocalePath'
import type { NavKey } from '@/types/locale'

const props = defineProps<{ pageKey: NavKey }>()

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <section class="placeholder">
    <div class="placeholder__glow" aria-hidden="true" />
    <div class="placeholder__inner container">
      <SectionEyebrow on-dark>{{ t('placeholder.eyebrow') }}</SectionEyebrow>
      <h1 class="placeholder__title">{{ t('placeholder.title', { page: t(`nav.${props.pageKey}`) }) }}</h1>
      <p class="placeholder__body">{{ t('placeholder.body') }}</p>
      <BaseButton :to="localePath('home')" variant="secondary" size="lg">
        {{ t('placeholder.back') }}
      </BaseButton>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '../../styles/breakpoints' as *;

.placeholder {
  position: relative;
  overflow: hidden;
  background: var(--vn-panel);
  min-height: 26rem;
  display: flex;
  align-items: center;

  @include below-tablet {
    min-height: 22rem;
  }
}

.placeholder__glow {
  position: absolute;
  inset: -30% -10% auto auto;
  width: 40rem;
  height: 26rem;
  background: radial-gradient(circle at 55% 45%, rgba(52, 127, 229, 0.22), transparent 65%);
  pointer-events: none;
}

.placeholder__inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
  padding-block: 5rem;

  @include below-tablet {
    padding-block: 3.5rem;
    gap: 1rem;
  }
}

.placeholder__title {
  font-size: var(--vn-fs-h1);
  color: var(--vn-text-inverse);
}

.placeholder__body {
  max-width: 42rem;
  font-size: var(--vn-fs-lead);
  line-height: 1.7;
  color: var(--vn-text-inverse-secondary);
}
</style>
