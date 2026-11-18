import { computed, ref, shallowRef, watch, type Ref } from 'vue'

import { useLocaleStore } from '@/stores/locale'

export type AsyncStatus = 'idle' | 'pending' | 'success' | 'error'

export interface AsyncDataState<T> {
  data: Ref<T | null>
  status: Ref<AsyncStatus>
  pending: Ref<boolean>
  error: Ref<Error | null>
  /** 数据为空（null 或空数组），用于展示 empty 状态。 */
  isEmpty: Ref<boolean>
  reload: () => Promise<void>
}

/**
 * 通用数据获取：跟踪 pending / success / error 状态并支持重试。
 * 语言切换（contentLocale 变化）时自动重新请求，保证页面内容与 URL 语言一致。
 * 详情页可传入 extraDeps（如 slug）在参数变化时重新加载。
 * 使用序号防止快速切换语言/参数时的响应竞态。
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  extraDeps: (() => unknown)[] = [],
): AsyncDataState<T> {
  const localeStore = useLocaleStore()

  const data = shallowRef<T | null>(null) as Ref<T | null>
  const status = ref<AsyncStatus>('idle')
  const error = ref<Error | null>(null)
  let requestId = 0

  async function load(): Promise<void> {
    const current = ++requestId
    status.value = 'pending'
    error.value = null
    try {
      const result = await fetcher()
      if (current !== requestId) return
      data.value = result
      status.value = 'success'
    } catch (err) {
      if (current !== requestId) return
      error.value = err instanceof Error ? err : new Error('Unknown error')
      status.value = 'error'
      data.value = null
    }
  }

  watch([() => localeStore.contentLocale, ...extraDeps], load, { immediate: true })

  const pending = computed(() => status.value === 'pending')
  const isEmpty = computed(
    () =>
      status.value === 'success' &&
      (data.value === null || (Array.isArray(data.value) && data.value.length === 0)),
  )

  return { data, status, pending, error, isEmpty, reload: load }
}
