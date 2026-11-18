<script setup lang="ts">
/**
 * 产品详情（PRD 4.4 / 12.2 统一详情模板）：
 * 产品定位 → 核心能力 → 成熟度说明 → 联系入口 → 其他产品。
 * 数据：GET /api/v1/products/{slug}；成熟度按 API 的 productStage 展示（默认 PLANNED）。
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { ApiError, fetchProduct, fetchProducts } from '@/api'
import AsyncState from '@/components/common/AsyncState.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import IconGlyph from '@/components/common/IconGlyph.vue'
import PageHero from '@/components/common/PageHero.vue'
import ProductCard from '@/components/common/ProductCard.vue'
import SectionHeader from '@/components/common/SectionHeader.vue'
import StageBadge from '@/components/common/StageBadge.vue'
import TextLink from '@/components/common/TextLink.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { useJsonLd } from '@/composables/useJsonLd'
import { useLocalePath } from '@/composables/useLocalePath'
import { useDetailSeo } from '@/composables/usePageSeo'
import { CODE_ICONS } from '@/config/icons'
import { SITE_CONFIG } from '@/config/site'

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()

const slug = computed(() => String(route.params.slug ?? ''))
const state = useAsyncData(() => fetchProduct(slug.value), [() => slug.value])
const related = useAsyncData(fetchProducts)

const notFound = computed(
  () => state.error.value instanceof ApiError && state.error.value.status === 404,
)

const otherProducts = computed(() =>
  (related.data.value ?? []).filter((item) => item.slug !== slug.value).slice(0, 4),
)

/** 种子数据的产品描述本身已包含成熟度说明时，不再重复展示提示条。 */
const stageNote = computed(() => {
  const product = state.data.value
  if (!product) return ''
  return t(`productDetail.stageNotes.${product.productStage}`)
})
const showStageNote = computed(() => {
  const product = state.data.value
  if (!product) return false
  return !product.description.includes(stageNote.value)
})

useDetailSeo(() => {
  const product = state.data.value
  if (!product) return null
  return {
    title: product.seoTitle ?? `${product.name} — VERINEX`,
    description: product.seoDescription ?? product.summary,
    image: product.coverImage,
  }
})

// 结构化数据：Product（成熟度通过 additionalProperty 表达，不虚构价格与评分）
useJsonLd('product', () => {
  const product = state.data.value
  if (!product) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.summary,
    url: `${SITE_CONFIG.siteUrl}${localePath('products')}/${product.slug}`,
    brand: { '@type': 'Brand', name: 'VERINEX' },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'productStage',
        value: product.productStage,
      },
    ],
  }
})
</script>

<template>
  <AsyncState
    :pending="state.pending.value"
    :error="state.error.value && !notFound ? state.error.value : null"
    :skeleton-rows="4"
    @retry="state.reload"
  >
    <template v-if="state.data.value">
      <PageHero
        :eyebrow="t('productDetail.eyebrow')"
        :title="state.data.value.name"
        :subtitle="state.data.value.subtitle ?? ''"
        :lead="state.data.value.summary"
      >
        <div class="product-detail__hero-extra">
          <StageBadge :stage="state.data.value.productStage" />
          <TextLink :to="localePath('products')" on-dark>
            {{ t('productDetail.backToList') }}
          </TextLink>
        </div>
      </PageHero>

      <section class="product-overview" aria-labelledby="product-overview-title">
        <div class="container product-overview__grid">
          <div class="product-overview__intro">
            <h2 id="product-overview-title" class="product-overview__name">
              {{ state.data.value.name }}
            </h2>
            <p class="product-overview__description">{{ state.data.value.description }}</p>

            <p class="product-overview__stage">
              <span class="product-overview__stage-label">{{ t('productDetail.stageLabel') }}</span>
              <StageBadge :stage="state.data.value.productStage" />
            </p>
            <p v-if="showStageNote" class="product-overview__stage-note">
              {{ stageNote }}
            </p>
          </div>

          <div class="product-overview__features">
            <h3 class="product-overview__features-title">{{ t('productDetail.featuresTitle') }}</h3>
            <ul>
              <li v-for="feature in state.data.value.features" :key="feature">
                <span class="product-overview__feature-icon" aria-hidden="true">
                  <IconGlyph :name="CODE_ICONS[state.data.value.code] ?? 'grid'" :size="16" />
                </span>
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section class="product-contact" aria-labelledby="product-contact-title">
        <div class="container product-contact__inner">
          <div>
            <h2 id="product-contact-title" class="product-contact__title">
              {{ t('productDetail.contactTitle') }}
            </h2>
            <p class="product-contact__body">{{ t('productDetail.contactBody') }}</p>
          </div>
          <BaseButton :to="localePath('contact')" size="lg">
            {{ t('productDetail.contactCta') }}
          </BaseButton>
        </div>
      </section>

      <section v-if="otherProducts.length" class="product-related" aria-labelledby="related-title">
        <div class="container">
          <SectionHeader
            :eyebrow="t('productDetail.relatedEyebrow')"
            :title="t('productDetail.relatedTitle')"
          />
          <div class="product-related__grid">
            <ProductCard
              v-for="item in otherProducts"
              :key="item.code"
              :product="item"
              tone="light"
              :to="`${localePath('products')}/${item.slug}`"
              :link-label="t('productsPage.detailCta')"
            />
          </div>
        </div>
      </section>
    </template>

    <div v-if="notFound" class="product-notfound">
      <p>{{ t('state.empty') }}</p>
      <BaseButton :to="localePath('products')" variant="secondary">
        {{ t('productDetail.backToList') }}
      </BaseButton>
    </div>
  </AsyncState>
</template>

<style scoped lang="scss">
@use '../../styles/breakpoints' as *;

.product-detail__hero-extra {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.product-overview {
  padding-block: var(--vn-space-20);
  background: var(--vn-section-soft);

  @include below-tablet {
    padding-block: var(--vn-space-12);
  }

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
    gap: var(--vn-space-16);
    align-items: start;

    @include below-desktop {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--vn-space-10);
    }
  }

  &__name {
    font-size: var(--vn-fs-h2);
    letter-spacing: 0.01em;
    color: var(--vn-text);
  }

  &__description {
    margin-top: var(--vn-space-5);
    font-size: var(--vn-fs-lead);
    line-height: 1.85;
    color: var(--vn-text-secondary);
  }

  &__stage {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: var(--vn-space-8);
  }

  &__stage-label {
    font-size: var(--vn-fs-xs);
    font-weight: var(--vn-fw-semibold);
    letter-spacing: var(--vn-ls-overline);
    text-transform: uppercase;
    color: var(--vn-text-muted);
  }

  &__stage-note {
    margin-top: 0.75rem;
    padding: var(--vn-space-4) var(--vn-space-5);
    border-left: 2px solid var(--vn-warning);
    border-radius: var(--vn-radius-xs);
    background: var(--vn-surface);
    font-size: var(--vn-fs-sm);
    line-height: 1.7;
    color: var(--vn-text-secondary);
  }

  &__features {
    padding: var(--vn-space-8);
    border: 1px solid var(--vn-border);
    border-radius: var(--vn-radius-lg);
    background: var(--vn-surface);

    ul {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin: var(--vn-space-5) 0 0;
      padding: 0;
      list-style: none;
    }

    li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: var(--vn-fs-body);
      color: var(--vn-text);
    }
  }

  &__features-title {
    font-size: var(--vn-fs-h4);
    color: var(--vn-text);
  }

  &__feature-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: var(--vn-radius-sm);
    background: var(--vn-brand-soft);
    color: var(--vn-link);
  }
}

.product-contact {
  padding-block: var(--vn-space-12);
  background: var(--vn-section-soft);

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;

    @include below-tablet {
      flex-direction: column;
      align-items: flex-start;
      gap: 1.5rem;
    }
  }

  &__title {
    font-size: var(--vn-fs-h3);
    color: var(--vn-text-inverse);
  }

  &__body {
    margin-top: 0.5rem;
    font-size: var(--vn-fs-sm);
    color: var(--vn-text-inverse-secondary);
  }
}

.product-related {
  padding-block: var(--vn-space-20);
  background: var(--vn-section-soft);

  @include below-tablet {
    padding-block: var(--vn-space-12);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--vn-space-5);

    @include below-tablet {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--vn-space-4);
    }
  }
}

.product-notfound {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: var(--vn-space-24) var(--vn-space-4);
  text-align: center;
  color: var(--vn-text-secondary);
}
</style>
