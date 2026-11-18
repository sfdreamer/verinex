<script setup lang="ts">
/**
 * 产品卡片（深色版式，对应设计稿 Our Products 区块）：
 * 名称 + 英文副标题 + 摘要 + 成熟度标签 + 详情链接。
 */
import { computed } from 'vue'

import type { ProductSummary } from '@/api/types'
import { CODE_ICONS } from '@/config/icons'
import IconGlyph from './IconGlyph.vue'
import StageBadge from './StageBadge.vue'
import TextLink from './TextLink.vue'

const props = withDefaults(
  defineProps<{
    product: ProductSummary
    to: string
    linkLabel: string
    /** 深色（默认，首页/产品页矩阵）或浅色卡片 */
    tone?: 'dark' | 'light'
  }>(),
  { tone: 'dark' },
)

const iconName = computed(() => CODE_ICONS[props.product.code] ?? 'grid')
</script>

<template>
  <article class="product-card"  :data-product="props.product.code" :class="`product-card--${props.tone}`">
    <div class="product-card__top">
      <span class="product-card__icon" aria-hidden="true">
        <IconGlyph :name="iconName" :size="22" />
      </span>
      <StageBadge :stage="props.product.productStage" />
    </div>
    <h3 class="product-card__name">{{ props.product.name }}</h3>
    <p v-if="props.product.subtitle" class="product-card__subtitle">{{ props.product.subtitle }}</p>
    <p class="product-card__summary">{{ props.product.summary }}</p>
    <TextLink :to="props.to" on-dark class="product-card__link">{{ props.linkLabel }}</TextLink>
  </article>
</template>

<style scoped lang="scss">
.product-card {
  --product-accent: #79aaff;
  &[data-product="verimind"] { --product-accent: #85d2d7; }
  &[data-product="veristudio"] { --product-accent: #b6a4df; }
  &[data-product="veriinsight"] { --product-accent: #9fbfdb; }
  &[data-product="veribrand"] { --product-accent: #8fbcad; }
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: clamp(1.25rem, 2vw, 2rem);
  border-radius: var(--vn-radius-lg);
  transition:
    border-color var(--vn-duration) var(--vn-ease-out),
    transform var(--vn-duration) var(--vn-ease-out);

  &--dark {
    border: 1px solid var(--vn-dark-border);
    background: var(--vn-panel);

    &:hover {
      border-color: color-mix(in srgb, var(--product-accent) 35%, transparent);
      transform: translateY(-2px);
    }

    .product-card__icon {
      background: color-mix(in srgb, var(--product-accent) 10%, transparent);
      color: var(--product-accent);
    }

    .product-card__name {
      color: var(--vn-text-inverse);
    }

    .product-card__subtitle {
      color: var(--vn-text-inverse-muted);
    }

    .product-card__summary {
      color: var(--vn-text-inverse-secondary);
    }
  }

  &--light {
    border: 1px solid var(--vn-border);
    background: var(--vn-panel);

    &:hover {
      border-color: var(--vn-border-strong);
      transform: translateY(-2px);
    }

    .product-card__icon {
      background: var(--vn-brand-soft);
      color: var(--vn-link);
    }

    .product-card__name {
      color: var(--vn-text);
    }

    .product-card__subtitle {
      color: var(--vn-text-muted);
    }

    .product-card__summary {
      color: var(--vn-text-secondary);
    }

    :deep(.text-link) {
      color: var(--vn-link);
    }
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: .75rem;
    margin-bottom: 0.25rem;
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: var(--vn-radius-md);
  }

  &__name {
    font-size: clamp(1.125rem, 1.4vw, 1.375rem);
    letter-spacing: 0.015em;
  }

  &__subtitle {
    font-size: var(--vn-fs-xs);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  &__summary {
    flex: 1;
    font-size: var(--vn-fs-sm);
    line-height: 1.75;
  }

  &__link {
    margin-top: 0.25rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .product-card {
    transition: none;

    &:hover {
      transform: none;
    }
  }
}
</style>
