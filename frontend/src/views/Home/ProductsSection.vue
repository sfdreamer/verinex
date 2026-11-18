<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ProductSummary } from '@/api/types'
import StageBadge from '@/components/common/StageBadge.vue'
import { useLocalePath } from '@/composables/useLocalePath'
import EditorialImage from './EditorialImage.vue'
defineProps<{ products: ProductSummary[] }>()
const { t } = useI18n()
const localePath = useLocalePath()
// Visual associations only. Product copy, status and URLs remain API-owned.
const artwork: Record<string, string> = { vericorpus: 'corpus', verimind: 'mind', veristudio: 'studio', veriinsight: 'insight', veribrand: 'brand' }
</script>

<template>
  <section class="home-products editorial-section" aria-labelledby="home-products-title">
    <div class="container">
      <div class="home-products__heading">
        <div><p class="editorial-kicker">{{ t('home.products.eyebrow') }}</p><h2 id="home-products-title" class="editorial-title">{{ t('home.products.title') }}</h2></div>
        <div class="home-products__intro"><p>{{ t('home.products.lead') }}</p><RouterLink :to="localePath('products')" class="editorial-link">{{ t('home.products.viewAll') }}<span aria-hidden="true">↗</span></RouterLink></div>
      </div>
      <ul v-if="products.length" class="product-gallery" role="list">
        <li v-for="product in products" :key="product.code" class="product-gallery__item">
          <RouterLink :to="`${localePath('products')}/${product.slug}`" class="product-gallery__link">
            <EditorialImage class="product-gallery__art"
              :src="product.coverImage || (artwork[product.code.toLowerCase()] ? `/media/editorial-v2/${artwork[product.code.toLowerCase()]}-640.webp` : null)"
              :srcset="!product.coverImage && artwork[product.code.toLowerCase()] ? `/media/editorial-v2/${artwork[product.code.toLowerCase()]}-320.webp 320w, /media/editorial-v2/${artwork[product.code.toLowerCase()]}-640.webp 640w` : undefined"
              sizes="(max-width: 767px) 130px, (max-width: 1199px) 30vw, 260px" :width="640" :height="640" />
            <div class="product-gallery__body">
              <StageBadge :stage="product.productStage" />
              <h3>{{ product.name }}<span aria-hidden="true">↗</span></h3>
              <p>{{ product.summary }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
      <p v-else class="home-empty">{{ t('state.empty') }}</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.home-products { background: var(--vn-secondary); border-block: 1px solid var(--vn-border); }
.home-products__heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 48px; }
.home-products__heading h2 { margin-top: 22px; }
.home-products__intro { max-width: 350px; color: var(--vn-text-secondary); font-size: 16px; }
.home-products__intro a { margin-top: 22px; }
.product-gallery { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 24px; margin-top: 44px !important; }
.product-gallery__item { min-width: 0; }
.product-gallery__link { display: block; height: 100%; }
.product-gallery__art { aspect-ratio: 1; width: 100%; height: auto; object-fit: contain; mix-blend-mode: lighten; transition: transform .3s; }
.product-gallery__body { padding-top: 20px; border-top: 1px solid var(--vn-border-strong); }
.product-gallery__body :deep(.stage-badge) { padding: 0; border: 0; background: transparent; color: var(--vn-text-secondary); font-size: 13px; }
.product-gallery__body :deep(.stage-badge)::before { content: ''; width: 5px; height: 5px; border: 1px solid currentColor; border-radius: 50%; margin-right: 8px; }
.product-gallery h3 { display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-top: 10px; font-size: clamp(16px, 1.35vw, 20px); font-weight: 500; letter-spacing: -.02em; }
.product-gallery h3 span { color: var(--vn-text-muted); font-size: 18px; }
.product-gallery p { font-size: 15px; line-height: 1.75; color: var(--vn-text-secondary); margin-top: 12px; }
.product-gallery__link:hover h3 { color: var(--vn-link); }
.product-gallery__link:hover .product-gallery__art { transform: translateY(-4px); }
@media (max-width: 1199px) {
  .product-gallery { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 32px 24px; }
  .product-gallery h3 { font-size: 18px; }
}
@media (max-width: 767px) {
  .home-products__heading { display: block; }
  .home-products__intro { margin-top: 22px; max-width: 100%; }
  .product-gallery { grid-template-columns: 1fr; gap: 0; margin-top: 28px !important; }
  .product-gallery__item { border-top: 1px solid var(--vn-border); }
  .product-gallery__link { display: grid; grid-template-columns: 116px 1fr; gap: 18px; padding-block: 20px; align-items: center; }
  .product-gallery__link:not(:has(.product-gallery__art)) { grid-template-columns: 1fr; }
  .product-gallery__body { padding-top: 0; border: 0; }
  .product-gallery h3 { font-size: 18px; margin-top: 7px; }
  .product-gallery p { margin-top: 8px; }
}
</style>
