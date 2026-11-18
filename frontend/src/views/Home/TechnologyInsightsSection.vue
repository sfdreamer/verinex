<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ArticleSummary, TechnologyItem } from '@/api/types'
import { useLocalePath } from '@/composables/useLocalePath'
import { useLocaleStore } from '@/stores/locale'
import { formatDate } from '@/utils/format'
import EditorialImage from './EditorialImage.vue'

const props = defineProps<{ highlights: TechnologyItem[]; articles: ArticleSummary[] }>()
const { t } = useI18n()
const localePath = useLocalePath()
const localeStore = useLocaleStore()
const codes = ['data-engineering', 'llm', 'rag', 'ai-agents', 'multimodal-ai']
const directions = computed(() => codes.flatMap(code => props.highlights.filter(item => item.code === code)))
const featured = computed(() => props.articles.find(article => article.isFeatured) ?? props.articles[0])
const otherArticles = computed(() => props.articles.filter(article => article.slug !== featured.value?.slug).slice(0, 2))
const featuredCover = computed(() => featured.value?.coverImage || (featured.value?.slug === 'sample-enterprise-ai-readiness' ? '/media/editorial-v2/article-1280.webp' : null))
function date(value: string) { return formatDate(value, localeStore.contentLocale) }
</script>

<template>
  <section class="home-perspectives editorial-section" aria-labelledby="home-perspectives-title">
    <div class="container">
      <div class="home-perspectives__heading"><p class="editorial-kicker">{{ t('home.perspectives.eyebrow') }}</p><h2 id="home-perspectives-title" class="editorial-title">{{ t('home.perspectives.title') }}</h2></div>
      <div class="home-perspectives__grid">
        <div class="technology-brief">
          <h3>{{ t('home.technology.title') }}</h3>
          <p class="technology-brief__lead">{{ t('home.technology.lead') }}</p>
          <ul v-if="directions.length" class="technology-brief__directions" role="list">
            <li v-for="direction in directions" :key="direction.code"><span aria-hidden="true" /><span>{{ direction.title }}</span></li>
          </ul>
          <p v-else class="home-empty">{{ t('state.empty') }}</p>
          <RouterLink :to="localePath('technology')" class="editorial-link">{{ t('home.technology.viewAll') }}<span aria-hidden="true">↗</span></RouterLink>
        </div>
        <div class="insights-edit">
          <article v-if="featured" class="insights-edit__featured">
            <RouterLink :to="`${localePath('insights')}/${featured.slug}`">
              <EditorialImage class="insights-edit__cover" :src="featuredCover"
                :srcset="featuredCover === '/media/editorial-v2/article-1280.webp' ? '/media/editorial-v2/article-640.webp 640w, /media/editorial-v2/article-1280.webp 1280w' : undefined"
                sizes="(max-width: 767px) 100vw, 700px" :width="1536" :height="1024" />
              <p class="insights-edit__meta"><span>{{ t(`articleCategories.${featured.categoryCode}`) }}</span><time :datetime="featured.publishedAt">{{ date(featured.publishedAt) }}</time></p>
              <h3>{{ featured.title }}<span aria-hidden="true">↗</span></h3>
            </RouterLink>
            <p class="insights-edit__excerpt">{{ featured.excerpt }}</p>
          </article>
          <p v-else class="home-empty">{{ t('state.empty') }}</p>
          <ul class="insights-edit__list" role="list">
            <li v-for="article in otherArticles" :key="article.slug">
              <RouterLink :to="`${localePath('insights')}/${article.slug}`"><h3>{{ article.title }}</h3><span aria-hidden="true">↗</span></RouterLink>
            </li>
          </ul>
          <RouterLink :to="localePath('insights')" class="editorial-link insights-edit__all">{{ t('home.insights.viewAll') }}<span aria-hidden="true">↗</span></RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.home-perspectives { background: var(--vn-page); }
.home-perspectives__heading h2 { margin-top: 20px; }
.home-perspectives__grid { display: grid; grid-template-columns: .9fr 1.3fr; gap: clamp(48px, 8vw, 128px); margin-top: 48px; }
.technology-brief { padding-top: 26px; border-top: 1px solid var(--vn-border-strong); }
.technology-brief h3 { font-size: 28px; font-weight: 500; }
.technology-brief__lead { margin-top: 22px; color: var(--vn-text-secondary); max-width: 380px; font-size: 16px; line-height: 1.8; }
.technology-brief__directions { position: relative; padding-block: 34px !important; }
.technology-brief__directions::before { content: ''; position: absolute; top: 59px; bottom: 60px; left: 5px; width: 1px; background: var(--vn-border-strong); }
.technology-brief__directions li { display: flex; align-items: center; gap: 24px; padding-block: 15px; font-size: 17px; }
.technology-brief__directions li span:first-child { position: relative; width: 11px; height: 11px; background: var(--vn-page); border: 1px solid #63819e; border-radius: 50%; }
.technology-brief__directions li:nth-child(3) span:first-child { background: var(--vn-accent); border-color: var(--vn-accent); }
.insights-edit__cover { width: 100%; height: auto; aspect-ratio: 2.15; object-fit: cover; border-radius: 4px; }
.insights-edit__meta { display: flex; align-items: center; gap: 20px; margin-top: 20px; font-size: 13px; color: var(--vn-text-secondary); }
.insights-edit__meta span { color: var(--vn-link); }
.insights-edit__featured h3 { display: flex; justify-content: space-between; align-items: start; gap: 24px; margin-top: 12px; font-size: 24px; line-height: 1.5; font-weight: 500; }
.insights-edit__featured h3 span { flex-shrink: 0; color: var(--vn-text-muted); }
.insights-edit__excerpt { margin-top: 12px; font-size: 15px; color: var(--vn-text-secondary); }
.insights-edit__list { margin-top: 24px !important; border-top: 1px solid var(--vn-border); }
.insights-edit__list a { display: flex; justify-content: space-between; align-items: center; gap: 24px; padding-block: 21px; border-bottom: 1px solid var(--vn-border); }
.insights-edit__list h3 { font-size: 17px; line-height: 1.65; font-weight: 400; }
.insights-edit__list span { color: var(--vn-text-muted); }
.insights-edit a:hover h3 { color: var(--vn-link); }
.insights-edit__all { margin-top: 25px; }
@media (max-width: 1000px) {
  .home-perspectives__grid { grid-template-columns: .85fr 1fr; gap: 36px; }
  .technology-brief h3 { font-size: 24px; }
  .insights-edit__featured h3 { font-size: 21px; }
}
@media (max-width: 767px) {
  .home-perspectives__grid { grid-template-columns: 1fr; gap: 44px; margin-top: 30px; }
  .technology-brief__directions { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; padding-block: 20px !important; }
  .technology-brief__directions::before { display: none; }
  .technology-brief__directions li { gap: 12px; font-size: 15px; }
  .technology-brief__directions li span:first-child { width: 7px; height: 7px; flex-shrink: 0; }
  .insights-edit__cover { aspect-ratio: 1.75; }
}
</style>
