<script setup lang="ts">
/**
 * 产品中心（PRD 4.4）。
 * 数据：GET /api/v1/products；卡片与详情均展示成熟度标签（默认 PLANNED）。
 * PRD 12.3：不实现「下载白皮书 / 查看产品文档」入口。
 * PRD 12.1：设计稿每行的 PB 级 / 98.7% / 40+ 等指标替换为能力方向表述。
 */
import { useI18n } from 'vue-i18n'

import { fetchProducts } from '@/api'
import AsyncState from '@/components/common/AsyncState.vue'
import StageBadge from '@/components/common/StageBadge.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { useJsonLd } from '@/composables/useJsonLd'
import { useLocalePath } from '@/composables/useLocalePath'
import { SITE_CONFIG } from '@/config/site'

const { t } = useI18n()
const localePath = useLocalePath()
const state = useAsyncData(fetchProducts)

// 结构化数据：产品矩阵（schema.org ItemList of Product）
useJsonLd('products', () => {
  const items = state.data.value
  if (!items?.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('productsPage.matrix.title'),
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: item.name,
        description: item.summary,
        url: `${SITE_CONFIG.siteUrl}${localePath('products')}/${item.slug}`,
        brand: { '@type': 'Brand', name: 'VERINEX' },
      },
    })),
  }
})
import EditorialImage from '@/views/Home/EditorialImage.vue'
const art: Record<string, string> = { vericorpus:'corpus', verimind:'mind', veristudio:'studio', veriinsight:'insight', veribrand:'brand' }
</script>

<template>
  <div class="editorial-page">
    <section class="product-opening container"><p class="editorial-kicker">{{ t('nav.products') }}</p><h1 class="page-title">{{ t('editorial.productsTitle') }}</h1><p class="page-deck">{{ t('home.products.lead') }}</p></section>
    <section class="product-exhibition container" :aria-label="t('productsPage.matrix.title')">
      <p class="product-exhibition__note">{{ t('productsPage.matrix.note') }}</p>
      <AsyncState :pending="state.pending.value" :error="state.error.value" :empty="state.isEmpty.value" @retry="state.reload">
        <ul class="product-collection" role="list">
          <li v-for="(product,i) in state.data.value ?? []" :key="product.code" :class="{ 'product-collection__large':i<2 }">
            <RouterLink class="product-object" :to="`${localePath('products')}/${product.slug}`">
              <div class="product-object__visual"><span class="ledger-number">0{{ i+1 }}</span><EditorialImage :src="product.coverImage || (art[product.code.toLowerCase()] ? `/media/editorial-v2/${art[product.code.toLowerCase()]}-640.webp` : null)" :width="640" :height="640" /></div>
              <div class="product-object__copy"><StageBadge :stage="product.productStage" /><h2>{{ product.name }}</h2><p>{{ product.summary }}</p><span class="editorial-link">{{ t('productsPage.detailCta') }}<span aria-hidden="true">↗</span></span></div>
            </RouterLink>
          </li>
        </ul>
      </AsyncState>
    </section>
  </div>
</template>
<style scoped lang="scss">
.product-opening { padding-block:80px 48px; text-align:center; }.product-opening h1 { margin:28px auto; max-width:1000px; }.product-opening .page-deck { margin-inline:auto; max-width:640px; }
.product-exhibition { padding-bottom:80px; }.product-exhibition__note { text-align:center; color:var(--vn-text-secondary); font-size:14px; margin-bottom:40px; }
.product-collection { display:grid; grid-template-columns:repeat(6,minmax(0,1fr)); gap:32px; }.product-collection > li { grid-column:span 2; min-width:0; border-top:1px solid var(--vn-border-strong); }.product-collection > .product-collection__large { grid-column:span 3; }
.product-object { display:block; height:100%; background:var(--vn-secondary); }.product-object__visual { position:relative; overflow:hidden; }.product-object__visual > span { position:absolute; left:24px; top:24px; }.product-object__visual img { width:100%; height:300px; object-fit:contain; mix-blend-mode:lighten; transition:transform .3s; }.product-collection__large img { height:360px; }
.product-object__copy { padding:24px 32px 28px; }.product-object__copy h2 { font-size:26px; font-weight:500; margin-top:16px; }.product-object__copy p { font-size:16px; color:var(--vn-text-secondary); margin-top:12px; }.product-object__copy .editorial-link { margin-top:20px; }.product-object:hover img { transform:translateY(-5px); }.product-object:hover h2 { color:var(--vn-link); }.product-object :deep(.stage-badge) { border-color:var(--vn-border-strong); background:transparent; color:var(--vn-text-secondary); font-size:13px; }
@media(max-width:1000px) { .product-collection { gap:24px; grid-template-columns:repeat(2,minmax(0,1fr)); }.product-collection > li,.product-collection > .product-collection__large { grid-column:span 1; }.product-object__visual img,.product-collection__large img { height:260px; }.product-object__copy { padding:20px 24px; } }
@media(max-width:767px) { .product-opening { text-align:left; padding-top:48px; }.product-exhibition__note { text-align:left; }.product-collection { grid-template-columns:1fr; }.product-object__visual img { height:270px; }.product-object__copy h2 { font-size:25px; } }
</style>
