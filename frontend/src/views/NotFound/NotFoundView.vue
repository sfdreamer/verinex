<script setup lang="ts">
/** 404 页：独立于 DefaultLayout，保证任何非法地址都有明确出口。 */
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import BaseButton from '@/components/common/BaseButton.vue'
import BrandLogo from '@/components/common/BrandLogo.vue'
import SectionEyebrow from '@/components/common/SectionEyebrow.vue'
import { DEFAULT_URL_LOCALE } from '@/config/site'

const { t } = useI18n()
</script>

<template>
  <div class="nf">
    <div class="nf__head container">
      <RouterLink :to="`/${DEFAULT_URL_LOCALE}`" class="nf__logo" :aria-label="t('nav.home')">
        <BrandLogo />
      </RouterLink>
    </div>
    <div class="nf__body container">
      <SectionEyebrow on-dark>{{ t('notFound.eyebrow') }}</SectionEyebrow>
      <h1 class="nf__title">{{ t('notFound.title') }}</h1>
      <p class="nf__text">{{ t('notFound.body') }}</p>
      <BaseButton :to="`/${DEFAULT_URL_LOCALE}`" size="lg">{{ t('notFound.back') }}</BaseButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/breakpoints' as *;

.nf {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--vn-section-soft);
  color: var(--vn-text-inverse);
}

.nf__head {
  display: flex;
  align-items: center;
  height: var(--vn-header-height);
}

.nf__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 1.25rem;
  padding-block: 4rem 8rem;
}

.nf__title {
  font-size: var(--vn-fs-h1);
}

.nf__text {
  max-width: 34rem;
  color: var(--vn-text-inverse-secondary);
}
</style>
