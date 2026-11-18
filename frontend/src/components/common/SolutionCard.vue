<script setup lang="ts">
/**
 * 解决方案/行业卡片：图标 + 标题 + 摘要 + 底部链接。
 * Home 的 Core Solutions 与 Industries We Serve、Solutions 列表页共用（PRD 4.1 / 12.2）。
 */
import { computed } from 'vue'

import IconGlyph from './IconGlyph.vue'
import TextLink from './TextLink.vue'
import { CODE_ICONS } from '@/config/icons'

const props = withDefaults(
  defineProps<{
    code: string
    title: string
    summary: string
    /** 底部链接地址；为空则不显示链接（行业卡片等纯展示场景） */
    to?: string
    linkLabel?: string
    /** 序号（Solutions 列表页的 01–05） */
    index?: string
  }>(),
  { to: '', linkLabel: '', index: '' },
)

const iconName = computed(() => CODE_ICONS[props.code] ?? 'grid')
</script>

<template>
  <article class="solution-card">
    <div class="solution-card__top">
      <span class="solution-card__icon" aria-hidden="true">
        <IconGlyph :name="iconName" :size="22" />
      </span>
      <span v-if="props.index" class="solution-card__index" aria-hidden="true">{{
        props.index
      }}</span>
    </div>
    <h3 class="solution-card__title">{{ props.title }}</h3>
    <p class="solution-card__summary">{{ props.summary }}</p>
    <TextLink v-if="props.to && props.linkLabel" :to="props.to" class="solution-card__link">
      {{ props.linkLabel }}
    </TextLink>
  </article>
</template>

<style scoped lang="scss">
.solution-card {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: var(--vn-space-8);
  border: 1px solid var(--vn-border);
  border-radius: var(--vn-radius-lg);
  background: var(--vn-panel);
  transition:
    border-color var(--vn-duration) var(--vn-ease-out),
    box-shadow var(--vn-duration) var(--vn-ease-out),
    transform var(--vn-duration) var(--vn-ease-out);

  &:hover {
    border-color: var(--vn-border-strong);
    box-shadow: var(--vn-shadow-md);
    transform: translateY(-2px);
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: var(--vn-radius-md);
    background: var(--vn-brand-soft);
    color: var(--vn-link);
  }

  &__index {
    font-size: var(--vn-fs-sm);
    font-weight: var(--vn-fw-semibold);
    letter-spacing: 0.08em;
    color: var(--vn-text-muted);
    opacity: 0.6;
  }

  &__title {
    font-size: var(--vn-fs-h3);
    color: var(--vn-text);
  }

  &__summary {
    flex: 1;
    font-size: var(--vn-fs-sm);
    line-height: 1.75;
    color: var(--vn-text-secondary);
  }

  &__link {
    margin-top: 0.25rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .solution-card {
    transition: none;

    &:hover {
      transform: none;
    }
  }
}
</style>
