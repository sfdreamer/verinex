/**
 * 产品与业务方向的稳定编码（与 docs/DATABASE.md 的 code 字段一致）。
 * V1 阶段这些名称与编码来自 PRD 确认内容，正文与状态后续由 API 提供；
 * 产品成熟度默认 PLANNED（PRD 12.4），不得在页面展示为已上线。
 */
export type ProductStage = 'PLANNED' | 'IN_DEVELOPMENT' | 'RELEASED'

export interface ProductRef {
  readonly code: string
  readonly name: string
  readonly stage: ProductStage
  /** i18n 文案键（定位描述） */
  readonly summaryKey: string
}

export interface SolutionRef {
  readonly code: string
  readonly i18nKey: string
}

export const PRODUCTS: readonly ProductRef[] = [
  { code: 'VERICORPUS', name: 'VERICORPUS', stage: 'PLANNED', summaryKey: 'products.vericorpus' },
  { code: 'VERIMIND', name: 'VERIMIND', stage: 'PLANNED', summaryKey: 'products.verimind' },
  { code: 'VERISTUDIO', name: 'VERISTUDIO', stage: 'PLANNED', summaryKey: 'products.veristudio' },
  { code: 'VERIINSIGHT', name: 'VERIINSIGHT', stage: 'PLANNED', summaryKey: 'products.veriinsight' },
  { code: 'VERIBRAND', name: 'VERIBRAND', stage: 'PLANNED', summaryKey: 'products.veribrand' },
]

export const SOLUTIONS: readonly SolutionRef[] = [
  { code: 'data-intelligence', i18nKey: 'footer.solutions.dataIntelligence' },
  { code: 'enterprise-ai', i18nKey: 'footer.solutions.enterpriseAi' },
  { code: 'brand-intelligence', i18nKey: 'footer.solutions.brandIntelligence' },
  { code: 'ai-content', i18nKey: 'footer.solutions.aiContent' },
  { code: 'data-research', i18nKey: 'footer.solutions.dataResearch' },
]
