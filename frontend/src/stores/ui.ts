import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 全站 UI 状态：移动端/平板导航抽屉。
 * 只在确有跨组件共享需求时使用 Pinia（Header 触发、抽屉渲染、路由切换关闭）。
 */
export const useUiStore = defineStore('ui', () => {
  const mobileNavOpen = ref(false)

  function openMobileNav(): void {
    mobileNavOpen.value = true
  }

  function closeMobileNav(): void {
    mobileNavOpen.value = false
  }

  function toggleMobileNav(): void {
    mobileNavOpen.value = !mobileNavOpen.value
  }

  return { mobileNavOpen, openMobileNav, closeMobileNav, toggleMobileNav }
})
