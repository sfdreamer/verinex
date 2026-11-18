/** Topic-specific editorial art, never a replacement for article or product facts. */
const covers: Record<string, string> = {
  'sample-enterprise-ai-readiness': 'article',
  'sample-governable-knowledge': 'knowledge',
  'sample-rag-evaluation': 'evaluation',
  'sample-human-oversight': 'oversight',
}
export function articleCover(article: { slug: string; coverImage: string | null }, width = 640): string | null {
  return article.coverImage || (covers[article.slug] ? `/media/editorial-v2/${covers[article.slug]}-${width}.webp` : null)
}
