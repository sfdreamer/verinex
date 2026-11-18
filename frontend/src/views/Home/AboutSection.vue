<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { CompanyProfile } from '@/api/types'
import { useLocalePath } from '@/composables/useLocalePath'
defineProps<{ company: CompanyProfile }>()
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <section id="home-about" class="home-about" aria-labelledby="home-about-title">
    <div class="container home-about__inner">
      <h2 id="home-about-title" class="editorial-kicker">{{ t('home.about.eyebrow') }}</h2>
      <div class="home-about__copy">
        <p>{{ company.overview }}</p>
        <RouterLink :to="localePath('about')" class="editorial-link">{{ t('home.about.link') }}<span aria-hidden="true">↗</span></RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.home-about { border-block: 1px solid var(--vn-border); background: var(--vn-secondary); scroll-margin-top: 100px; }
.home-about__inner { display: grid; grid-template-columns: 1fr 3fr; gap: 56px; padding-block: 64px; }
.home-about__inner h2 { padding-top: 8px; }
.home-about__copy p { font-size: clamp(21px, 1.85vw, 28px); line-height: 1.85; font-weight: 400; letter-spacing: -.02em; max-width: 1000px; }
.home-about__copy a { margin-top: 26px; }
@media (max-width: 767px) {
  .home-about__inner { grid-template-columns: 1fr; gap: 22px; padding-block: 40px; }
  .home-about__copy p { font-size: 21px; line-height: 1.8; }
}
</style>
