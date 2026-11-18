<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchCompany } from '@/api'
import AsyncState from '@/components/common/AsyncState.vue'
import { useAsyncData } from '@/composables/useAsyncData'
const { t, tm } = useI18n()
const state = useAsyncData(fetchCompany)
const descriptions = computed(() => tm('about.values.items') as Record<string, string>)
</script>

<template>
  <div class="editorial-page about-editorial">
    <section class="about-statement container">
      <p class="editorial-kicker">{{ t('nav.about') }}</p>
      <h1 class="page-title">{{ t('editorial.aboutTitle') }}</h1>
      <div class="about-statement__rule"><span>VERINEX TECHNOLOGIES</span><span aria-hidden="true">↘</span></div>
      <AsyncState :pending="state.pending.value" :error="state.error.value" :empty="state.isEmpty.value" @retry="state.reload">
        <p class="about-overview">{{ state.data.value?.overview }}</p>
      </AsyncState>
    </section>
    <template v-if="state.data.value">
      <section class="about-purpose editorial-section">
        <div class="container purpose-grid">
          <div><p class="editorial-kicker">{{ t('editorial.purpose') }}</p><h2 class="editorial-title">{{ t('about.mission.title') }}</h2></div>
          <dl><div><dt>{{ t('about.mission.missionLabel') }}</dt><dd>{{ state.data.value.mission }}</dd></div><div><dt>{{ t('about.mission.visionLabel') }}</dt><dd>{{ state.data.value.vision }}</dd></div></dl>
        </div>
      </section>
      <section class="editorial-section container">
        <p class="editorial-kicker">{{ t('about.facts.values') }}</p>
        <h2 class="editorial-title">{{ t('about.values.title') }}</h2>
        <ol class="value-ledger" role="list">
          <li v-for="(value, i) in state.data.value.values" :key="value"><span class="ledger-number">0{{ i + 1 }}</span><h3>{{ value }}</h3><p>{{ descriptions[value] ?? '' }}</p></li>
        </ol>
      </section>
    </template>
  </div>
</template>

<style scoped lang="scss">
.about-statement { padding-block: 88px 72px; }
.about-statement h1 { max-width: 1080px; font-size: clamp(42px, 6vw, 88px); margin-top: 32px; }
.about-statement__rule { display: flex; justify-content: space-between; align-items: center; margin-top: 56px; padding-top: 24px; border-top: 1px solid var(--vn-border-strong); color: var(--vn-text-secondary); font-size: 13px; letter-spacing: .1em; }
.about-statement__rule span:last-child { font-size: 40px; }
.about-overview { max-width: 840px; margin: 26px 0 0 auto; font-size: clamp(21px, 2.2vw, 30px); line-height: 1.8; }
.about-purpose { background: var(--vn-secondary); border-block: 1px solid var(--vn-border); }
.purpose-grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 100px; }
.purpose-grid h2 { margin-top: 24px; max-width: 440px; }
.purpose-grid dl > div + div { border-top: 1px solid var(--vn-border); margin-top: 32px; padding-top: 32px; }
.purpose-grid dt { color: var(--vn-link); font-size: 14px; margin-bottom: 14px; }
.purpose-grid dd { font-size: 25px; line-height: 1.7; }
.editorial-section > h2 { margin-top: 20px; }
.value-ledger { margin-top: 40px !important; border-top: 1px solid var(--vn-border-strong); }
.value-ledger li { display: grid; grid-template-columns: 70px 1fr 1.6fr; gap: 32px; padding-block: 32px; border-bottom: 1px solid var(--vn-border); align-items: baseline; }
.value-ledger h3 { font-size: 28px; font-weight: 500; }
.value-ledger p { color: var(--vn-text-secondary); font-size: 16px; max-width: 600px; }
@media(max-width: 900px) { .purpose-grid { gap: 44px; } .value-ledger li { grid-template-columns: 36px 1fr 1.5fr; gap: 20px; } }
@media(max-width: 767px) { .about-statement { padding-block: 48px; } .about-statement h1 { font-size: 42px; } .about-statement__rule { margin-top: 32px; } .purpose-grid { grid-template-columns: 1fr; gap: 32px; } .value-ledger li { grid-template-columns: 28px 1fr; } .value-ledger p { grid-column: 2; } .value-ledger h3 { font-size: 24px; } }
</style>
