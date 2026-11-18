<script setup lang="ts">
/**
 * 解决方案列表（PRD 4.3）。
 * 数据：GET /api/v1/solutions；核心能力取 PRD 4.3 已确认内容。
 * PRD 12.3：设计稿的行业筛选按钮无数据支撑，改为卡片锚点跳转。
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { fetchSolutions } from '@/api'
import AsyncState from '@/components/common/AsyncState.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { useJsonLd } from '@/composables/useJsonLd'
import { useLocalePath } from '@/composables/useLocalePath'
import { SITE_CONFIG } from '@/config/site'

const { t, tm } = useI18n()
const localePath = useLocalePath()
const state = useAsyncData(fetchSolutions)

const capabilities = computed(() => tm('solutionCapabilities') as Record<string, string[]>)
const steps = computed(
  () => tm('solutionsPage.process.steps') as { step: string; title: string; body: string }[],
)

function anchorId(code: string): string {
  return `solution-${code}`
}

// 结构化数据：业务线列表（schema.org ItemList of Service）
useJsonLd('solutions', () => {
  const items = state.data.value
  if (!items?.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('solutionsPage.lines.title'),
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: item.title,
        description: item.summary,
        url: `${SITE_CONFIG.siteUrl}${localePath('solutions')}/${item.slug}`,
      },
    })),
  }
})
const names = computed(() => tm('editorial.solutionSecondaryNames') as Record<string, string>)
</script>

<template>
  <div class="editorial-page">
    <section class="solutions-opening container">
      <p class="editorial-kicker">{{ t('nav.solutions') }}</p>
      <div class="solutions-opening__copy"><h1 class="page-title">{{ t('editorial.solutionsTitle') }}</h1><p class="page-deck">{{ t('home.solutions.lead') }}</p></div>
      <div class="connection-map" aria-hidden="true">
        <svg viewBox="0 0 1200 180" fill="none" preserveAspectRatio="none">
          <g stroke="#39516e" stroke-width="1"><path v-for="i in 9" :key="i" :d="`M 0 ${i*18} C 300 ${i*18}, 320 90, 600 90 S 900 ${i*18}, 1200 ${i*18}`" /></g>
          <path d="M0 90H1200" stroke="#45c5dc"/><circle cx="600" cy="90" r="24" fill="#101f32" stroke="#7193b7"/><circle cx="600" cy="90" r="5" fill="#45c5dc"/>
        </svg>
        <div class="connection-map__labels"><span v-for="label in (tm('editorial.flow') as string[])" :key="label">{{ label }}</span></div>
      </div>
    </section>
    <section class="solution-directory editorial-section">
      <div class="container">
        <nav v-if="state.data.value" class="solution-jumps" :aria-label="t('solutionsPage.lines.title')"><a v-for="item in state.data.value" :key="item.code" :href="`#${anchorId(item.code)}`">{{ item.title }}</a></nav>
        <AsyncState :pending="state.pending.value" :error="state.error.value" :empty="state.isEmpty.value" @retry="state.reload">
          <ol role="list" class="solution-ledger">
            <li v-for="(item,i) in state.data.value ?? []" :id="anchorId(item.code)" :key="item.code">
              <span class="ledger-number">0{{ i+1 }}</span>
              <div class="solution-ledger__name"><h2>{{ item.title }}</h2><p>{{ names[item.code] }}</p></div>
              <div class="solution-ledger__body"><p>{{ item.summary }}</p><ul role="list"><li v-for="cap in (capabilities[item.code] ?? []).slice(0,3)" :key="cap">{{ cap }}</li></ul><RouterLink class="editorial-link" :to="`${localePath('solutions')}/${item.slug}`">{{ t('solutionsPage.detailCta') }}<span aria-hidden="true">↗</span></RouterLink></div>
            </li>
          </ol>
        </AsyncState>
      </div>
    </section>
    <section class="editorial-section container">
      <p class="editorial-kicker">{{ t('solutionsPage.process.eyebrow') }}</p><h2 class="editorial-title process-title">{{ t('solutionsPage.process.title') }}</h2>
      <ol class="process-line" role="list"><li v-for="(step,i) in steps" :key="step.step"><span class="ledger-number">0{{ i+1 }}</span><h3>{{ step.title }}</h3><p>{{ step.body }}</p></li></ol>
    </section>
  </div>
</template>
<style scoped lang="scss">
.solutions-opening { padding-block: 72px 48px; }
.solutions-opening__copy { display:grid; grid-template-columns:1.5fr 1fr; gap:80px; align-items:end; margin-top:28px; }
.connection-map { margin-top:40px; } .connection-map svg { width:100%; height:160px; } .connection-map__labels { display:flex; justify-content:space-between; color:var(--vn-text-secondary); font-size:14px; }
.solution-directory { background:var(--vn-secondary); border-block:1px solid var(--vn-border); }
.solution-jumps { display:flex; flex-wrap:wrap; gap:12px 28px; margin-bottom:40px; font-size:14px; color:var(--vn-text-secondary); } .solution-jumps a { padding-block:8px; border-bottom:1px solid var(--vn-border-strong); }
.solution-ledger > li { display:grid; grid-template-columns:60px 1fr 1.15fr; gap:32px; padding-block:38px; border-top:1px solid var(--vn-border-strong); scroll-margin-top:100px; }
.solution-ledger h2 { font-size:28px; font-weight:500; line-height:1.4; }.solution-ledger__name p { margin-top:12px; font-size:14px; color:var(--vn-text-muted); }.solution-ledger__body > p { font-size:17px; color:var(--vn-text-secondary); }
.solution-ledger__body ul { display:flex; flex-wrap:wrap; gap:8px 20px; color:var(--vn-text-muted); font-size:14px; margin-top:20px !important; } .solution-ledger__body a { margin-top:18px; }
.process-title { margin-top:20px; }.process-line { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:32px; margin-top:40px !important; }.process-line li { border-top:1px solid var(--vn-border-strong); padding-top:22px; position:relative; }.process-line li::before { content:''; position:absolute; top:-4px; width:7px; height:7px; border:1px solid var(--vn-accent); background:var(--vn-page); border-radius:50%; }.process-line h3 { font-size:22px; margin-top:20px; }.process-line p { margin-top:12px; font-size:15px; color:var(--vn-text-secondary); }
@media(max-width:1000px) { .solutions-opening__copy { gap:36px; grid-template-columns:1.5fr 1fr; }.solution-ledger > li { grid-template-columns:32px 1fr 1.1fr; gap:20px; }.solution-ledger h2 { font-size:24px; }.process-line { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media(max-width:767px) { .solutions-opening { padding-top:48px; }.solutions-opening__copy { grid-template-columns:1fr; gap:24px; }.connection-map svg { height:110px; }.solution-ledger > li { grid-template-columns:26px 1fr; }.solution-ledger__body { grid-column:2; }.solution-jumps { gap:8px 20px; }.process-line { grid-template-columns:1fr; gap:28px; } }
</style>
