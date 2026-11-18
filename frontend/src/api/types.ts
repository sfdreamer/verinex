/**
 * API DTO 类型定义，字段与 docs/API.md V1.1 逐一对应。
 * 所有响应均为 { data: T } 包装；分页列表额外提供 meta。
 */

export interface ApiEnvelope<T> {
  data: T
}

export interface ApiListMeta {
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface ApiListEnvelope<T> {
  data: T[]
  meta?: ApiListMeta
}

/** 服务端 ProblemDetails（错误响应）。 */
export interface ProblemDetails {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
  errors?: Record<string, string[]>
}

// ---------- 企业 ----------

export interface CompanyProfile {
  brandName: string
  companyName: string
  tagline: string
  overview: string
  mission: string
  vision: string
  values: string[]
  seoTitle: string | null
  seoDescription: string | null
}

// ---------- 解决方案 ----------

export interface SolutionSummary {
  id: number
  code: string
  slug: string
  title: string
  subtitle: string | null
  summary: string
  sortOrder: number
}

export interface SolutionDetail extends SolutionSummary {
  body: string
  seoTitle: string | null
  seoDescription: string | null
}

// ---------- 产品 ----------

export type ProductStage = 'PLANNED' | 'IN_DEVELOPMENT' | 'RELEASED'

export interface ProductSummary {
  id: number
  code: string
  slug: string
  name: string
  subtitle: string | null
  summary: string
  productStage: ProductStage
  coverImage: string | null
  sortOrder: number
}

export interface ProductDetail extends ProductSummary {
  description: string
  features: string[]
  seoTitle: string | null
  seoDescription: string | null
}

// ---------- 技术能力 ----------

export interface TechnologyItem {
  id: number
  code: string
  title: string
  summary: string
  description: string
  sortOrder: number
}

// ---------- 行业 ----------

export interface IndustryItem {
  id: number
  code: string
  title: string
  summary: string
  description: string
  sortOrder: number
}

// ---------- 文章 ----------

export interface ArticleSummary {
  id: number
  slug: string
  title: string
  excerpt: string
  categoryCode: string
  coverImage: string | null
  publishedAt: string
  isFeatured: boolean
}

export interface RelatedArticle {
  slug: string
  title: string
  excerpt: string
  coverImage: string | null
  publishedAt: string
}

export interface ArticleDetail extends ArticleSummary {
  content: string
  seoTitle: string | null
  seoDescription: string | null
  relatedArticles: RelatedArticle[]
}

// ---------- 站点 ----------

export interface SiteOverview {
  company: CompanyProfile
  featuredSolutions: SolutionSummary[]
  featuredProducts: ProductSummary[]
  technologyHighlights: TechnologyItem[]
  featuredIndustries: IndustryItem[]
  featuredInsights: ArticleSummary[]
}

export interface SiteSettings {
  contactEmail: string | null
  socialLinks: { label: string; url: string }[]
  icpNumber: string | null
  privacyPolicyVersion: string | null
}

// ---------- 联系表单 ----------

export interface ContactRequest {
  name: string
  companyName: string
  email: string
  phone?: string
  industry?: string
  cooperationType: string
  targetProduct?: string
  message: string
  locale: 'zh-CN' | 'en'
  privacyConsent: boolean
  privacyPolicyVersion: string
}

export interface ContactResponse {
  message: string
}
