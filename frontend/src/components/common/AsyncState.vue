<script setup lang="ts">
/**
 * 通用异步状态容器：loading（骨架屏）/ error（提示 + 重试）/ empty / 成功内容。
 * 用法：
 *   <AsyncState :pending="s.pending" :error="s.error" :empty="s.isEmpty" @retry="s.reload">
 *     ...成功内容...
 *   </AsyncState>
 */
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    pending: boolean
    error: Error | null
    empty?: boolean
    /** 骨架屏行数 */
    skeletonRows?: number
    /** 空数据提示；不传则用默认文案 */
    emptyText?: string
  }>(),
  { empty: false, skeletonRows: 3, emptyText: '' },
)

const emit = defineEmits<{ retry: [] }>()
const { t } = useI18n()
</script>

<template>
  <div v-if="props.pending" class="async-state" role="status" :aria-label="t('state.loading')">
    <div
      v-for="row in props.skeletonRows"
      :key="row"
      class="async-state__skeleton"
      :style="{ width: `${100 - (row - 1) * 12}%` }"
    />
    <span class="sr-only">{{ t('state.loading') }}</span>
  </div>

  <div v-else-if="props.error" class="async-state async-state--error" role="alert">
    <p class="async-state__title">{{ t('state.errorTitle') }}</p>
    <p class="async-state__body">{{ t('state.errorBody') }}</p>
    <button type="button" class="async-state__retry" @click="emit('retry')">
      {{ t('state.retry') }}
    </button>
  </div>

  <div v-else-if="props.empty" class="async-state">
    <p class="async-state__body">{{ props.emptyText || t('state.empty') }}</p>
  </div>

  <slot v-else />
</template>

<style scoped lang="scss">
.async-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 10rem;
  padding: var(--vn-space-8) var(--vn-space-4);
  text-align: center;

  &__skeleton {
    height: 1rem;
    border-radius: var(--vn-radius-xs);
    background: linear-gradient(
      90deg,
      var(--vn-surface-tint) 25%,
      var(--vn-border) 50%,
      var(--vn-surface-tint) 75%
    );
    background-size: 200% 100%;
    animation: async-shimmer 1.4s ease-in-out infinite;

    &:first-child {
      height: 1.5rem;
    }
  }

  &__title {
    font-weight: var(--vn-fw-semibold);
    color: var(--vn-text);
  }

  &__body {
    max-width: 32rem;
    font-size: var(--vn-fs-sm);
    color: var(--vn-text-muted);
  }

  &__retry {
    padding: var(--vn-space-2) var(--vn-space-5);
    border: 1px solid var(--vn-border-strong);
    border-radius: var(--vn-radius-sm);
    background: var(--vn-card);
    color: var(--vn-link);
    font-size: var(--vn-fs-sm);
    font-weight: var(--vn-fw-medium);
    cursor: pointer;
    transition:
      border-color var(--vn-duration) var(--vn-ease-out),
      background var(--vn-duration) var(--vn-ease-out);

    &:hover {
      border-color: var(--vn-link);
      background: var(--vn-brand-soft);
    }
  }
}

@keyframes async-shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .async-state__skeleton {
    animation: none;
  }
}
</style>
