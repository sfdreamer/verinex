/**
 * JSON-LD 结构化数据：把 schema.org 对象写入 <head>，随数据/语言变化更新，离开页面时移除。
 * 仅用于公开可用的品牌与内容信息，不写入未确认的评分、客户数等事实数据。
 */
import { onBeforeUnmount, watchEffect } from 'vue'

export function useJsonLd(id: string, build: () => Record<string, unknown> | null): void {
  const elementId = `vn-jsonld-${id}`

  const apply = (): void => {
    const data = build()
    const existing = document.getElementById(elementId)
    if (!data) {
      existing?.remove()
      return
    }
    const script =
      (existing as HTMLScriptElement | null) ?? document.createElement('script')
    script.id = elementId
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(data)
    if (!existing) document.head.appendChild(script)
  }

  watchEffect(apply)

  onBeforeUnmount(() => {
    document.getElementById(elementId)?.remove()
  })
}
