<script setup lang="ts">
/** 「— SOLUTIONS」式栏目标签：短横线 + 大写 + 宽字距，颜色由 onDark 切换。 */
withDefaults(defineProps<{ onDark?: boolean }>(), { onDark: false })
</script>

<template>
  <span class="eyebrow" :class="{ 'eyebrow--on-dark': onDark }">
    <span class="eyebrow__rule" aria-hidden="true" />
    <slot />
  </span>
</template>

<style scoped lang="scss">
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  font-size: var(--vn-fs-overline);
  font-weight: var(--vn-fw-semibold);
  letter-spacing: var(--vn-ls-overline);
  text-transform: uppercase;
  color: var(--vn-link);

  &__rule {
    display: block;
    width: 1.5rem;
    height: 1px;
    background: currentColor;
    opacity: 0.7;
  }

  &--on-dark {
    color: var(--vn-accent);
  }
}
</style>
