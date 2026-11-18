<script setup lang="ts">
/**
 * 品牌 Logo：34px 渐变方块 + 白色折角标记 + VERINEX / TECHNOLOGIES 字标。
 * 图形直接复用设计稿的 34×34、圆角 9、渐变 rgb(52,127,229)→rgb(57,198,232)。
 */
withDefaults(
  defineProps<{
    /** 仅图标（移动端紧凑场景） */
    markOnly?: boolean
    /** 尺寸：header 默认 34px，footer 32px */
    size?: number
  }>(),
  { markOnly: false, size: 34 },
)
</script>

<template>
  <span class="brand" :style="{ '--brand-size': `${size}px` }">
    <span class="brand__mark" aria-hidden="true">
      <svg viewBox="0 0 34 34" focusable="false">
        <defs>
          <linearGradient id="vn-brand-gradient" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
            <stop stop-color="#347FE5" />
            <stop offset="1" stop-color="#39C6E8" />
          </linearGradient>
        </defs>
        <rect width="34" height="34" rx="9" fill="url(#vn-brand-gradient)" />
        <path d="M9 12h4.4l3.6 8.2L20.6 12H25l-6.1 12h-3.8L9 12Z" fill="#fff" opacity=".95" />
        <path d="M8 22.6h5.2" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".55" />
      </svg>
    </span>
    <span v-if="!markOnly" class="brand__text">
      <span class="brand__name">VERINEX</span>
      <span class="brand__sub">TECHNOLOGIES</span>
    </span>
  </span>
</template>

<style scoped lang="scss">
.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--vn-text-inverse);

  &__mark {
    display: block;
    width: var(--brand-size);
    height: var(--brand-size);
    flex: none;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__name {
    font-size: 1rem;
    font-weight: var(--vn-fw-bold);
    letter-spacing: 0.04em;
    line-height: 1.1;
  }

  &__sub {
    font-size: 0.5rem;
    font-weight: var(--vn-fw-medium);
    letter-spacing: 0.24em;
    line-height: 1;
    color: var(--vn-text-inverse-muted);
  }
}
</style>
