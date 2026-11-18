/**
 * 极简 Markdown 分块渲染器（安全优先）。
 * API 允许正文使用 Markdown，但禁止未经净化输出任意 HTML；
 * 这里只把纯文本解析为标题 / 段落 / 列表块，模板用文本插值渲染，
 * 完全不产生 v-html，从根本上避免脚本注入。
 */
export type ContentBlock =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }

export function parseContent(raw: string): ContentBlock[] {
  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  const blocks: ContentBlock[] = []
  let paragraph: string[] = []
  let list: string[] = []

  const flushParagraph = (): void => {
    if (paragraph.length) {
      blocks.push({ type: 'paragraph', text: paragraph.join(' ').trim() })
      paragraph = []
    }
  }
  const flushList = (): void => {
    if (list.length) {
      blocks.push({ type: 'list', items: [...list] })
      list = []
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      flushParagraph()
      flushList()
      continue
    }

    const heading = /^(#{1,3})\s+(.*)$/.exec(trimmed)
    if (heading) {
      flushParagraph()
      flushList()
      const level = heading[1].length >= 3 ? 3 : 2
      blocks.push({ type: 'heading', level, text: heading[2].trim() })
      continue
    }

    const bullet = /^[-*]\s+(.*)$/.exec(trimmed)
    if (bullet) {
      flushParagraph()
      list.push(bullet[1].trim())
      continue
    }

    flushList()
    paragraph.push(trimmed)
  }

  flushParagraph()
  flushList()
  return blocks
}
