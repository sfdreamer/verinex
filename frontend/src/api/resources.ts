/**
 * 各资源的 API 访问函数。路径与 docs/API.md V1.1 对应；
 * lang 参数由 http 拦截器统一附加，这里只传业务参数。
 */
import http from './http'
import type {
  ApiEnvelope,
  ApiListEnvelope,
  ArticleDetail,
  ArticleSummary,
  CompanyProfile,
  ContactRequest,
  ContactResponse,
  IndustryItem,
  ProductDetail,
  ProductSummary,
  ProductStage,
  SiteOverview,
  SiteSettings,
  SolutionDetail,
  SolutionSummary,
  TechnologyItem,
} from './types'

export async function fetchSiteOverview(): Promise<SiteOverview> {
  const { data } = await http.get<ApiEnvelope<SiteOverview>>('/site/overview')
  return data.data
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const { data } = await http.get<ApiEnvelope<SiteSettings>>('/site/settings')
  return data.data
}

export async function fetchCompany(): Promise<CompanyProfile> {
  const { data } = await http.get<ApiEnvelope<CompanyProfile>>('/company')
  return data.data
}

export async function fetchSolutions(featured?: boolean): Promise<SolutionSummary[]> {
  const { data } = await http.get<ApiListEnvelope<SolutionSummary>>('/solutions', {
    params: featured === undefined ? {} : { featured },
  })
  return data.data
}

export async function fetchSolution(slug: string): Promise<SolutionDetail> {
  const { data } = await http.get<ApiEnvelope<SolutionDetail>>(`/solutions/${slug}`)
  return data.data
}

export async function fetchProducts(options?: {
  featured?: boolean
  stage?: ProductStage
}): Promise<ProductSummary[]> {
  const { data } = await http.get<ApiListEnvelope<ProductSummary>>('/products', {
    params: { ...(options?.featured !== undefined ? { featured: options.featured } : {}), ...(options?.stage ? { stage: options.stage } : {}) },
  })
  return data.data
}

export async function fetchProduct(slug: string): Promise<ProductDetail> {
  const { data } = await http.get<ApiEnvelope<ProductDetail>>(`/products/${slug}`)
  return data.data
}

export async function fetchTechnologies(): Promise<TechnologyItem[]> {
  const { data } = await http.get<ApiListEnvelope<TechnologyItem>>('/technologies')
  return data.data
}

export async function fetchIndustries(): Promise<IndustryItem[]> {
  const { data } = await http.get<ApiListEnvelope<IndustryItem>>('/industries')
  return data.data
}

export interface InsightsQuery {
  category?: string
  featured?: boolean
  page?: number
  pageSize?: number
}

export async function fetchInsights(query: InsightsQuery = {}) {
  const { data } = await http.get<ApiListEnvelope<ArticleSummary>>('/insights', {
    params: {
      ...(query.category ? { category: query.category } : {}),
      ...(query.featured !== undefined ? { featured: query.featured } : {}),
      ...(query.page ? { page: query.page } : {}),
      ...(query.pageSize ? { pageSize: query.pageSize } : {}),
    },
  })
  return { articles: data.data, meta: data.meta ?? null }
}

export async function fetchInsight(slug: string): Promise<ArticleDetail> {
  const { data } = await http.get<ApiEnvelope<ArticleDetail>>(`/insights/${slug}`)
  return data.data
}

export async function postContact(payload: ContactRequest): Promise<ContactResponse> {
  const { data } = await http.post<ApiEnvelope<ContactResponse>>('/contact', payload)
  return data.data
}
