<script setup lang="ts">
/** 产品成熟度标签：PLANNED / IN_DEVELOPMENT / RELEASED（PRD 12.4）。 */
import { useI18n } from 'vue-i18n'

import type { ProductStage } from '@/api/types'

const props = defineProps<{ stage: ProductStage }>()
const { t } = useI18n()
</script>

<template>
  <span class="stage-badge" :class="`stage-badge--${props.stage.toLowerCase()}`">
    {{ t(`productStage.${props.stage}`) }}
  </span>
</template>

<style scoped lang="scss">
.stage-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.625rem;
  border-radius: var(--vn-radius-pill);
  font-size: var(--vn-fs-xs);
  font-weight: var(--vn-fw-medium);
  line-height: 1.6;
  letter-spacing: 0.02em;

  &--planned {
    background: rgba(217, 154, 30, 0.12);
    color: var(--vn-warning);
    border: 1px solid rgba(217, 154, 30, 0.3);
  }

  &--in_development {
    background: var(--vn-brand-soft);
    color: var(--vn-link);
    border: 1px solid rgba(52, 127, 229, 0.3);
  }

  &--released {
    background: rgba(47, 163, 107, 0.12);
    color: var(--vn-success);
    border: 1px solid rgba(47, 163, 107, 0.3);
  }
}
</style>
