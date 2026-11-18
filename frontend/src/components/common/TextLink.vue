<script setup lang="ts">
/** 带箭头的文字链接（「了解详情 →」「查看全部 →」），支持路由与外链。 */
withDefaults(defineProps<{ to?: string; href?: string; onDark?: boolean }>(), {
  to: '',
  href: '',
  onDark: false,
})
</script>

<template>
  <RouterLink v-if="to" class="text-link" :class="{ 'text-link--dark': onDark }" :to="to">
    <slot />
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
      <path
        d="M3.2 8h9.1M8.6 4.3 12.3 8l-3.7 3.7"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </RouterLink>
  <a
    v-else
    class="text-link"
    :class="{ 'text-link--dark': onDark }"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
  >
    <slot />
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
      <path
        d="M3.2 8h9.1M8.6 4.3 12.3 8l-3.7 3.7"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </a>
</template>

<style scoped lang="scss">
.text-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: var(--vn-fs-sm);
  font-weight: var(--vn-fw-medium);
  color: var(--vn-link);
  text-decoration: none;
  transition: gap var(--vn-duration) var(--vn-ease-out);

  &:hover {
    gap: 0.625rem;
  }

  &--dark {
    color: var(--vn-accent);
  }
}
</style>
