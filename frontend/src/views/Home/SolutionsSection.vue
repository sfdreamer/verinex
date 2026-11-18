<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { IndustryItem, SolutionSummary } from '@/api/types'
import { useLocalePath } from '@/composables/useLocalePath'
defineProps<{ solutions: SolutionSummary[]; industries: IndustryItem[] }>()
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <section class="home-solutions editorial-section" aria-labelledby="home-solutions-title">
    <div class="container">
      <div class="home-solutions__layout">
        <div class="home-solutions__intro">
          <p class="editorial-kicker">{{ t('home.solutions.eyebrow') }}</p>
          <h2 id="home-solutions-title" class="editorial-title">{{ t('home.solutions.title') }}</h2>
          <p class="home-solutions__lead">{{ t('home.solutions.lead') }}</p>
          <RouterLink :to="localePath('solutions')" class="editorial-link">{{ t('home.solutions.viewAll') }}<span aria-hidden="true">↗</span></RouterLink>
        </div>
        <ol v-if="solutions.length" class="solution-index" role="list">
          <li v-for="(solution, index) in solutions" :key="solution.code">
            <RouterLink :to="`${localePath('solutions')}/${solution.slug}`" class="solution-index__link">
              <span class="solution-index__number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
              <div class="solution-index__copy"><h3>{{ solution.title }}</h3><p>{{ solution.summary }}</p></div>
              <span class="solution-index__arrow" aria-hidden="true">↗</span>
            </RouterLink>
          </li>
        </ol>
        <p v-else class="home-empty">{{ t('state.empty') }}</p>
      </div>
      <div v-if="industries.length" class="industry-strip">
        <p>{{ t('home.industries.eyebrow') }}</p>
        <ul role="list"><li v-for="industry in industries" :key="industry.code">{{ industry.title }}</li></ul>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.home-solutions { background: var(--vn-page); }
.home-solutions__layout { display: grid; grid-template-columns: .95fr 2fr; gap: clamp(40px, 6vw, 100px); }
.home-solutions__intro .editorial-title { margin-top: 22px; }
.home-solutions__lead { margin-top: 24px; max-width: 300px; color: var(--vn-text-secondary); font-size: 16px; }
.home-solutions__intro a { margin-top: 30px; }
.solution-index { border-top: 1px solid var(--vn-border-strong); }
.solution-index__link { display: grid; grid-template-columns: 34px 1fr 28px; gap: 20px; align-items: start; padding: 25px 4px; border-bottom: 1px solid var(--vn-border); transition: background-color .2s; }
.solution-index__number { padding-top: 6px; color: var(--vn-text-muted); font-family: var(--vn-font-mono); font-size: 13px; }
.solution-index__copy h3 { font-size: 23px; font-weight: 500; line-height: 1.4; transition: color .2s; }
.solution-index__copy p { margin-top: 9px; font-size: 15px; line-height: 1.7; color: var(--vn-text-secondary); }
.solution-index__arrow { font-size: 24px; color: var(--vn-text-muted); transition: color .2s, transform .2s; }
.solution-index__link:hover h3, .solution-index__link:hover .solution-index__arrow { color: var(--vn-link); }
.solution-index__link:hover .solution-index__arrow { transform: translate(2px, -2px); }
.industry-strip { display: grid; grid-template-columns: .95fr 2fr; gap: clamp(40px, 6vw, 100px); margin-top: 48px; padding-top: 30px; border-top: 1px solid var(--vn-border); font-size: 14px; color: var(--vn-text-secondary); }
.industry-strip > p { color: var(--vn-text-muted); }
.industry-strip ul { display: flex; flex-wrap: wrap; gap: 12px 24px; }
@media (max-width: 1000px) {
  .home-solutions__layout { grid-template-columns: 1fr 1.6fr; gap: 36px; }
  .industry-strip { grid-template-columns: 1fr; gap: 16px; }
}
@media (max-width: 767px) {
  .home-solutions__layout { grid-template-columns: 1fr; gap: 32px; }
  .home-solutions__lead { max-width: 100%; margin-top: 18px; }
  .home-solutions__intro a { margin-top: 20px; }
  .solution-index__link { grid-template-columns: 25px 1fr 22px; gap: 12px; padding-block: 22px; }
  .solution-index__copy h3 { font-size: 21px; }
  .industry-strip { margin-top: 28px; padding-top: 24px; }
}
</style>
