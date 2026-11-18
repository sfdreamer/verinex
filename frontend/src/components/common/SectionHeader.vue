<script setup lang="ts">
/** 区块标题：eyebrow + 标题 + 可选导语，右侧 slot 放「查看全部」等链接。 */
import SectionEyebrow from './SectionEyebrow.vue'

withDefaults(
  defineProps<{
    eyebrow: string
    title: string
    lead?: string
    onDark?: boolean
  }>(),
  { lead: '', onDark: false },
)
</script>

<template>
  <div class="section-head" :class="{ 'section-head--dark': onDark }">
    <div class="section-head__copy">
      <SectionEyebrow :on-dark="onDark">{{ eyebrow }}</SectionEyebrow>
      <h2 class="section-head__title">{{ title }}</h2>
      <p v-if="lead" class="section-head__lead">{{ lead }}</p>
    </div>
    <div v-if="$slots.default" class="section-head__aside">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/breakpoints' as *;

.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: var(--vn-space-12);

  @include below-desktop {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: var(--vn-space-8);
  }

  &__copy {
    max-width: 44rem;
  }

  &__title {
    margin-top: 1rem;
    font-size: var(--vn-fs-h2);
    color: var(--vn-text);
  }

  &__lead {
    margin-top: 0.875rem;
    font-size: var(--vn-fs-lead);
    line-height: 1.65;
    color: var(--vn-text-secondary);
  }

  &__aside {
    flex: none;
    padding-bottom: 0.25rem;
  }

  &--dark {
    .section-head__title {
      color: var(--vn-text-inverse);
    }

    .section-head__lead {
      color: var(--vn-text-inverse-secondary);
    }
  }
}
</style>
