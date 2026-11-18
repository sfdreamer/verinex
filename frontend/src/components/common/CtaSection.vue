<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '@/composables/useLocalePath'
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <section class="cta" aria-labelledby="cta-title">
    <div class="container cta__inner">
      <div class="cta__copy">
        <p class="editorial-kicker">{{ t('cta.eyebrow') }}</p>
        <h2 id="cta-title">{{ t('cta.title') }}</h2>
        <p class="cta__subtitle">{{ t('cta.subtitle') }}</p>
      </div>
      <RouterLink :to="localePath('contact')" class="cta__link"><span>{{ t('cta.primary') }}</span><span class="cta__arrow" aria-hidden="true">↗</span></RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cta { background: var(--vn-secondary); border-block: 1px solid var(--vn-border); }
.cta__inner { display: flex; align-items: center; justify-content: space-between; gap: 56px; padding-block: 72px; }
.cta__copy { max-width: 860px; }
.cta h2 { margin-top: 22px; font-size: clamp(30px, 3.4vw, 48px); line-height: 1.4; font-weight: 500; letter-spacing: -.035em; white-space: pre-line; }
.cta__subtitle { margin-top: 22px; color: var(--vn-text-secondary); font-size: 16px; }
.cta__link { display: flex; align-items: center; gap: 24px; flex-shrink: 0; font-size: 16px; }
.cta__arrow { display: grid; place-items: center; width: 68px; height: 68px; border: 1px solid var(--vn-border-strong); border-radius: 50%; font-size: 30px; transition: background-color .2s, color .2s; }
.cta__link:hover .cta__arrow { background: var(--vn-text); color: var(--vn-page); }
@media (max-width: 1000px) { .cta__inner { gap: 30px; } .cta__arrow { width: 56px; height: 56px; } }
@media (max-width: 767px) { .cta__inner { align-items: flex-start; flex-direction: column; padding-block: 48px; } .cta__copy { width: 100%; } .cta h2 { font-size: 30px; } .cta__subtitle { max-width: 320px; } }
</style>
