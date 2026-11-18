<script setup lang="ts">
/**
 * 隐私政策占位页：Footer 底部保留该入口（PRD 4.1），
 * 正式文本待项目负责人确认后发布，当前不收集任何信息。
 */
import { useI18n } from 'vue-i18n'

import BaseButton from '@/components/common/BaseButton.vue'
import SectionEyebrow from '@/components/common/SectionEyebrow.vue'
import { useLocalePath } from '@/composables/useLocalePath'

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <section class="legal">
    <div class="legal__inner container">
      <SectionEyebrow on-dark>{{ t('privacy.eyebrow') }}</SectionEyebrow>
      <h1 class="legal__title">{{ t('privacy.title') }}</h1>
      <p class="legal__body">{{ t('privacy.body') }}</p>
      <BaseButton :to="localePath('home')" variant="secondary" size="lg">
        {{ t('privacy.back') }}
      </BaseButton>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '../../styles/breakpoints' as *;

.legal {
  background: var(--vn-section-soft);
  min-height: 22rem;
}

.legal__inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
  padding-block: 5rem 5.5rem;

  @include below-tablet {
    padding-block: 3.5rem;
  }
}

.legal__title {
  font-size: var(--vn-fs-h1);
  color: var(--vn-text-inverse);
}

.legal__body {
  max-width: 44rem;
  font-size: var(--vn-fs-body);
  line-height: 1.8;
  color: var(--vn-text-inverse-secondary);
}
</style>
