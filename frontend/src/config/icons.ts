/**
 * 业务 code → IconGlyph 图标名映射。未登记的 code 由 IconGlyph 回退到网格图标。
 */
export const CODE_ICONS: Record<string, string> = {
  // 解决方案
  'data-intelligence': 'database',
  'enterprise-ai': 'cpu',
  'brand-intelligence': 'spark',
  'ai-content': 'doc',
  'research-insights': 'chart',
  // 产品
  vericorpus: 'database',
  verimind: 'agent',
  veristudio: 'doc',
  veriinsight: 'chart',
  veribrand: 'spark',
  // 技术能力
  llm: 'cpu',
  rag: 'link',
  'ai-agents': 'agent',
  'knowledge-graph': 'network',
  'data-engineering': 'database',
  'multimodal-ai': 'layers',
  'intelligent-automation': 'agent',
  'enterprise-ai-integration': 'link',
  // 行业
  manufacturing: 'factory',
  'technology-internet': 'globe',
  'consumer-retail': 'cart',
  'professional-services': 'briefcase',
  'enterprise-groups': 'building',
}
