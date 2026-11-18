<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchTechnologies } from '@/api'
import AsyncState from '@/components/common/AsyncState.vue'
import { useAsyncData } from '@/composables/useAsyncData'
interface Layer { name:string; en:string; body:string; items:string[] }
const { t, tm } = useI18n()
const state = useAsyncData(fetchTechnologies)
const layers = computed(() => tm('technologyPage.architecture.layers') as Layer[])
const byCode = computed(() => Object.fromEntries((state.data.value ?? []).map(item => [item.code,item])))
const domains = computed(() => tm('editorial.domains') as string[])
const descriptions = computed(() => tm('editorial.domainDescriptions') as string[])
</script>
<template>
  <div class="editorial-page">
    <section class="technology-opening container">
      <div class="technology-opening__head"><div><p class="editorial-kicker">{{ t('nav.technology') }}</p><h1 class="page-title">{{ t('editorial.technologyTitle') }}</h1></div><p class="page-deck">{{ t('home.technology.lead') }}</p></div>
      <figure class="architecture-map">
        <figcaption><h2>{{ t('technologyPage.architecture.title') }}</h2><span aria-hidden="true">↓ ↑</span></figcaption>
        <AsyncState :pending="state.pending.value" :error="state.error.value" :empty="state.isEmpty.value" @retry="state.reload">
          <ol class="architecture-stack" role="list">
            <li v-for="(layer,i) in layers" :key="layer.en" :style="{ '--layer': i }"><span class="ledger-number">0{{ 4-i }}</span><h3>{{ layer.name }}</h3><ul role="list"><template v-for="code in layer.items" :key="code"><li v-if="byCode[code]">{{ byCode[code]?.title }}</li></template></ul></li>
          </ol>
        </AsyncState>
      </figure>
    </section>
    <section class="tech-domains editorial-section"><div class="container"><p class="editorial-kicker">{{ t('technologyPage.directions.eyebrow') }}</p><h2 class="editorial-title">{{ t('editorial.capabilitiesTitle') }}</h2><ol class="domain-matrix" role="list"><li v-for="(domain,i) in domains" :key="domain"><span class="ledger-number">0{{ i+1 }}</span><div><h3>{{ domain }}</h3><p>{{ descriptions[i] }}</p></div></li></ol></div></section>
    <section class="engineering-note editorial-section container"><h2>{{ t('editorial.engineering') }}</h2><p>{{ t('editorial.engineeringBody') }}</p></section>
  </div>
</template>
<style scoped lang="scss">
.technology-opening { padding-block:72px; }.technology-opening__head { display:grid; grid-template-columns:1.5fr 1fr; gap:64px; align-items:end; }.technology-opening h1 { margin-top:28px; }
.architecture-map { margin-top:56px; padding:36px 48px 44px; border:1px solid var(--vn-border-strong); background:linear-gradient(120deg,#142740,#0b1524 65%); }.architecture-map figcaption { display:flex; justify-content:space-between; align-items:center; gap:24px; padding-bottom:28px; }.architecture-map h2 { font-size:19px; font-weight:400; color:var(--vn-text-secondary); }.architecture-map figcaption > span { font-family:var(--vn-font-mono); color:var(--vn-accent); font-size:23px; }
.architecture-stack { position:relative; padding-left:28px !important; border-left:1px solid #5c7998; }.architecture-stack > li { position:relative; display:grid; grid-template-columns:28px 1fr 1.4fr; align-items:center; gap:24px; margin-left:calc((3 - var(--layer)) * 14px); padding:24px; border:1px solid #36506b; border-top-color:#7190ae; background:linear-gradient(170deg,#182c43,#0c1829); box-shadow:0 12px 20px #070c1540; }.architecture-stack > li + li { margin-top:18px; }.architecture-stack > li::before { content:''; position:absolute; width:7px; height:7px; left:-4px; top:50%; border-radius:50%; background:var(--vn-accent); }.architecture-stack > li::after { content: ""; position:absolute; left:calc(-29px - (3 - var(--layer)) * 14px); width:calc(28px + (3 - var(--layer)) * 14px); top:50%; height:1px; background:#5c7998; }.architecture-stack h3 { font-size:21px; line-height:1.5; font-weight:500; }.architecture-stack ul { display:flex; flex-wrap:wrap; gap:8px 20px; font-size:14px; color:var(--vn-text-secondary); }
.tech-domains { background:var(--vn-secondary); border-block:1px solid var(--vn-border); }.tech-domains h2 { margin-top:20px; }.domain-matrix { display:grid; grid-template-columns:1fr 1fr; gap:0 80px; margin-top:40px !important; }.domain-matrix > li { display:flex; align-items:baseline; gap:28px; border-top:1px solid var(--vn-border-strong); padding-block:30px; }.domain-matrix h3 { font-size:25px; font-weight:500; line-height:1.4; }.domain-matrix p { margin-top:16px; color:var(--vn-text-secondary); font-size:16px; max-width:470px; }
.engineering-note { display:grid; grid-template-columns:1fr 2fr; gap:80px; }.engineering-note h2 { font-size:24px; font-weight:500; }.engineering-note p { font-size:21px; color:var(--vn-text-secondary); line-height:1.85; }
@media(max-width:1000px) { .technology-opening__head { gap:36px; }.architecture-map { padding:28px; }.architecture-stack > li { grid-template-columns:24px 1fr; padding:20px; gap:12px; }.architecture-stack ul { grid-column:2; }.domain-matrix { gap:0 32px; }.engineering-note { gap:36px; } }
@media(max-width:767px) { .technology-opening { padding-block:48px; }.technology-opening__head,.engineering-note { grid-template-columns:1fr; gap:24px; }.architecture-map { padding:20px 16px; margin-top:32px; }.architecture-map h2 { font-size:17px; }.architecture-stack { padding-left:12px !important; }.architecture-stack > li { margin-left:0; padding:18px 12px; }.architecture-stack > li::after { content: ""; position:absolute; left:calc(-29px - (3 - var(--layer)) * 14px); width:calc(28px + (3 - var(--layer)) * 14px); top:50%; height:1px; background:#5c7998; }.architecture-stack > li::after { left:-13px; width:12px; }.architecture-stack h3 { font-size:19px; }.architecture-stack ul { font-size:14px; gap:6px 12px; }.domain-matrix { grid-template-columns:1fr; }.domain-matrix > li { gap:18px; }.engineering-note p { font-size:18px; } }
</style>
