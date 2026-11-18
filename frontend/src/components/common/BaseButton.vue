<script setup lang="ts">
/**
 * 通用按钮 / 链接按钮。统一高度、圆角、焦点态与悬停动效，
 * 避免各页面重复定义按钮样式（设计稿按钮：圆角 8、品牌蓝、白色文字、尾部箭头）。
 */
import { computed, useSlots } from 'vue'
import { RouterLink } from 'vue-router'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    /** 站内路由跳转（优先于 href） */
    to?: string
    /** 外部链接 */
    href?: string
    type?: 'button' | 'submit'
    block?: boolean
    disabled?: boolean
  }>(),
  { variant: 'primary', size: 'md', type: 'button', block: false, disabled: false },
)

const slots = useSlots()

const tag = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'button'))

const bindings = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) return { href: props.href, rel: 'noopener noreferrer' }
  return { type: props.type, disabled: props.disabled }
})
</script>

<template>
  <component
    :is="tag"
    v-bind="bindings"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--block': block }]"
  >
    <span class="btn__label"><slot /></span>
    <span v-if="slots.icon" class="btn__icon" aria-hidden="true"><slot name="icon" /></span>
  </component>
</template>

<style scoped lang="scss">
@use '../../styles/breakpoints' as *;

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: var(--vn-radius-sm);
  font-weight: var(--vn-fw-semibold);
  font-size: var(--vn-fs-sm);
  line-height: 1;
  white-space: nowrap;
  transition:
    background-color var(--vn-duration) var(--vn-ease-out),
    border-color var(--vn-duration) var(--vn-ease-out),
    color var(--vn-duration) var(--vn-ease-out),
    box-shadow var(--vn-duration) var(--vn-ease-out),
    transform var(--vn-duration) var(--vn-ease-out);

  &:focus-visible {
    outline: 2px solid var(--vn-accent);
    outline-offset: 3px;
  }

  &--sm {
    height: 2.125rem; // 34px，语言切换同高
    padding-inline: 0.875rem;
  }

  &--md {
    height: 2.5rem; // 40px，Header CTA
    padding-inline: 1.25rem;
  }

  &--lg {
    height: 3rem; // 48px，首屏主按钮
    padding-inline: 1.5rem;
    font-size: var(--vn-fs-body);
  }

  &--block {
    width: 100%;
  }

  &--primary {
    background: var(--vn-brand);
    color: var(--vn-on-brand);

    &:hover {
      background: var(--vn-brand-hover);
      box-shadow: var(--vn-shadow-brand);
    }

    &:active {
      background: var(--vn-brand-active);
      transform: translateY(1px);
    }
  }

  &--secondary {
    background: rgba(130, 165, 205, 0.06);
    border: 1px solid var(--vn-border-strong);
    color: var(--vn-text-inverse);

    &:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.32);
    }

    &:active {
      transform: translateY(1px);
    }
  }

  &--outline {
    border: 1px solid var(--vn-border-strong);
    color: var(--vn-text);

    &:hover {
      border-color: var(--vn-link);
      color: var(--vn-link);
      background: var(--vn-brand-soft);
    }
  }

  &--ghost {
    color: var(--vn-link);
    padding-inline: 0;

    &:hover {
      color: var(--vn-brand-hover);
      text-decoration: underline;
      text-underline-offset: 4px;
    }
  }

  &__icon {
    display: inline-flex;
    transition: transform var(--vn-duration) var(--vn-ease-out);
  }

  &:hover &__icon {
    transform: translateX(2px);
  }

  @include reduced-motion {
    transition: none;

    &:hover,
    &:active {
      transform: none;
    }
  }
}
</style>
