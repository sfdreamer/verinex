<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/common/BaseButton.vue'
import { useLocalePath } from '@/composables/useLocalePath'

const { t } = useI18n()
const localePath = useLocalePath()
const imageFailed = ref(false)
</script>

<template>
  <section class="hero" aria-labelledby="home-hero-title">
    <div class="hero__inner container">
      <div class="hero__copy">
        <p class="editorial-kicker">{{ t('home.hero.eyebrow') }}</p>
        <h1 id="home-hero-title" class="hero__title"><span>{{ t('home.hero.lineOne') }}</span><span>{{ t('home.hero.lineTwo') }}</span></h1>
        <p class="hero__subtitle">{{ t('home.hero.subtitle') }}</p>
        <div class="hero__actions">
          <BaseButton :to="localePath('solutions')" size="lg" class="hero__primary">
            {{ t('actions.exploreSolutions') }}<template #icon><span>↗</span></template>
          </BaseButton>
          <RouterLink :to="localePath('products')" class="editorial-link">
            {{ t('actions.discoverProducts') }}<span aria-hidden="true">→</span>
          </RouterLink>
        </div>
      </div>
      <div v-if="!imageFailed" class="hero__art" aria-hidden="true">
        <img src="/media/editorial-v2/hero-1536.webp"
          srcset="/media/editorial-v2/hero-768.webp 768w, /media/editorial-v2/hero-1536.webp 1536w"
          sizes="(max-width: 767px) 100vw, (max-width: 1199px) 75vw, 900px"
          width="1536" height="1024" alt="" fetchpriority="high" @error="imageFailed = true" />
      </div>
      <a class="hero__scroll" href="#home-about"><span aria-hidden="true">↓</span>{{ t('home.hero.scroll') }}</a>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero { background: var(--vn-page); overflow: clip; }
.hero__inner { position: relative; min-height: 680px; display: flex; align-items: center; padding-block: 88px 112px; isolation: isolate; }
.hero__copy { position: relative; z-index: 2; width: 56%; }
.hero__title { margin-top: 28px; font-size: clamp(56px, 5.2vw, 80px); font-weight: 500; line-height: 1.22; letter-spacing: -.045em; }
.hero__title span { display: block; }
.hero__title span:last-child { color: #c0cedf; }
.hero__subtitle { margin-top: 28px; max-width: 420px; color: var(--vn-text-secondary); font-size: 18px; line-height: 1.8; }
.hero__actions { display: flex; align-items: center; gap: 32px; margin-top: 40px; }
.hero__primary { background: var(--vn-text); color: var(--vn-page); border-radius: 5px; box-shadow: none; }
.hero__primary:hover { background: #dce8f7; box-shadow: none; }
.hero__art { position: absolute; z-index: 0; width: 72%; max-width: 1040px; right: -5%; top: 50%; transform: translateY(-50%); pointer-events: none; }
.hero__art img { width: 100%; height: auto; mask-image: linear-gradient(90deg, transparent, black 15%, black 88%, transparent); }
.hero__scroll { position: absolute; left: var(--vn-gutter); bottom: 36px; display: inline-flex; align-items: center; gap: 16px; color: var(--vn-text-secondary); font-size: 13px; }
.hero__scroll span { font-size: 22px; color: var(--vn-text); }
.hero__scroll:hover { color: var(--vn-text); }
@media (min-width: 1600px) { .hero__inner { min-height: 750px; } }
@media (max-width: 1199px) {
  .hero__inner { min-height: 660px; }
  .hero__copy { width: 72%; }
  .hero__title { font-size: 60px; }
  .hero__art { width: 84%; right: -24%; opacity: .68; }
  .hero__subtitle { max-width: 370px; }
}
@media (max-width: 767px) {
  .hero__inner { min-height: 0; padding-top: 56px; padding-bottom: 56px; display: block; }
  .hero__copy { width: 100%; }
  .hero__title { font-size: clamp(36px, 10vw, 52px); margin-top: 22px; line-height: 1.25; }
  .hero__subtitle { font-size: 16px; margin-top: 22px; max-width: 330px; }
  .hero__actions { gap: 24px; margin-top: 28px; flex-wrap: wrap; }
  .hero__primary { font-size: 14px; padding-inline: 18px; }
  .hero__art { position: relative; top: auto; right: auto; width: calc(100% + 40px); max-width: none; margin: 10px -20px 0; transform: none; opacity: 1; }
  .hero__scroll { bottom: 20px; font-size: 12px; }
}
</style>
