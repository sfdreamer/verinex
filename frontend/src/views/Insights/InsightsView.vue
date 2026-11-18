<script setup lang="ts">
/**
 * 行业洞察（PRD 4.6）。
 * 数据：GET /api/v1/insights（分类筛选、分页）；分类边界为 PRD 4.6 的五项，
 * 不出现「客户案例」（PRD 12.3）。
 */
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { fetchInsights, type ArticleSummary } from '@/api'
import ArticleCard from '@/components/common/ArticleCard.vue'
import AsyncState from '@/components/common/AsyncState.vue'
import EditorialImage from '@/views/Home/EditorialImage.vue'
import { articleCover } from '@/config/editorialArt'
import TextLink from '@/components/common/TextLink.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { useLocalePath } from '@/composables/useLocalePath'
import { useLocaleStore } from '@/stores/locale'
import { formatDate } from '@/utils/format'

const { t } = useI18n()
const localePath = useLocalePath()
const localeStore = useLocaleStore()

const CATEGORIES = [
  'ai-technology',
  'enterprise-ai',
  'data-intelligence',
  'brand-intelligence',
  'industry-research',
] as const
const PAGE_SIZE = 4

const activeCategory = ref<string>('')
const extraArticles = ref<ArticleSummary[]>([])
const extraPending = ref(false)
const extraError = ref(false)
let listVersion = 0
const extraPage = ref(1)
const extraTotalPages = ref(1)

const state = useAsyncData(
  () =>
    fetchInsights({
      category: activeCategory.value || undefined,
      pageSize: PAGE_SIZE,
    }),
  [() => activeCategory.value],
)

// 切换分类时清空「加载更多」追加的数据
watch([activeCategory, () => localeStore.contentLocale], () => {
  listVersion += 1
  extraPending.value = false
  extraError.value = false
  extraArticles.value = []
  extraPage.value = 1
  extraTotalPages.value = state.data.value?.meta?.totalPages ?? 1
})

watch(
  () => state.data.value,
  (value) => {
    if (value) {
      extraTotalPages.value = value.meta?.totalPages ?? 1
      extraPage.value = value.meta?.page ?? 1
    }
  },
)

const articles = computed(() => state.data.value?.articles ?? [])
const featured = computed(() => articles.value.find((item) => item.isFeatured) ?? null)
const gridArticles = computed(() => {
  const base = featured.value
    ? articles.value.filter((item) => item.slug !== featured.value!.slug)
    : articles.value
  return [...base, ...extraArticles.value]
})
const canLoadMore = computed(() => extraPage.value < extraTotalPages.value)

async function loadMore(): Promise<void> {
  if (!canLoadMore.value || extraPending.value) return
  extraPending.value = true
  extraError.value = false
  const version = listVersion
  try {
    const next = await fetchInsights({
      category: activeCategory.value || undefined,
      pageSize: PAGE_SIZE,
      page: extraPage.value + 1,
    })
    if (version !== listVersion) return
    extraArticles.value = [...extraArticles.value, ...next.articles]
    extraPage.value = next.meta?.page ?? extraPage.value + 1
    extraTotalPages.value = next.meta?.totalPages ?? extraTotalPages.value
  } catch {
    if (version === listVersion) extraError.value = true
  } finally {
    if (version === listVersion) extraPending.value = false
  }
}

function categoryLabel(code: string): string {
  return t(`articleCategories.${code}`)
}

const featuredDate = computed(() =>
  featured.value ? formatDate(featured.value.publishedAt, localeStore.contentLocale) : '',
)
</script>

<template>
  <div class="editorial-page">
  <section class="journal-masthead container"><p class="editorial-kicker">{{ t('nav.insights') }}</p><div><h1 class="page-title">{{ t('editorial.insightsTitle') }}</h1><p class="page-deck">{{ t('insightsPage.hero.lead') }}</p></div></section>

  <section class="insights-list" aria-labelledby="insights-list-title">
    <div class="container">
      <AsyncState
        :pending="state.pending.value"
        :error="state.error.value"
        :empty="state.isEmpty.value && !activeCategory"
        :skeleton-rows="5"
        @retry="state.reload"
      >
        <!-- 精选文章（设计稿顶部大卡） -->
        <article v-if="featured" class="insight-featured">
          <RouterLink
            :to="`${localePath('insights')}/${featured.slug}`"
            class="insight-featured__cover"
            :aria-label="featured.title"
          >
            <EditorialImage :src="articleCover(featured, 1280)" :width="1536" :height="1024" />
          </RouterLink>
          <div class="insight-featured__body">
            <p class="insight-featured__label">{{ t('insightsPage.featuredLabel') }}</p>
            <p class="insight-featured__meta">
              <span>{{ categoryLabel(featured.categoryCode) }}</span>
              <time :datetime="featured.publishedAt">{{ featuredDate }}</time>
            </p>
            <h2 class="insight-featured__title">
              <RouterLink :to="`${localePath('insights')}/${featured.slug}`">
                {{ featured.title }}
              </RouterLink>
            </h2>
            <p class="insight-featured__excerpt">{{ featured.excerpt }}</p>
            <TextLink :to="`${localePath('insights')}/${featured.slug}`">
              {{ t('home.solutions.cardCta') }}
            </TextLink>
          </div>
        </article>

        <!-- 分类筛选 + 列表 -->
        <div class="insights-toolbar">
          <p class="insights-toolbar__label">{{ t('insightsPage.latestLabel') }}</p>
          <div class="insights-toolbar__filters" role="tablist" :aria-label="t('insightsPage.latestLabel')">
            <button
              type="button"
              role="tab"
              :aria-selected="activeCategory === ''"
              class="insights-toolbar__filter"
              :class="{ 'is-active': activeCategory === '' }"
              @click="activeCategory = ''"
            >
              {{ t('insightsPage.allCategories') }}
            </button>
            <button
              v-for="code in CATEGORIES"
              :key="code"
              type="button"
              role="tab"
              :aria-selected="activeCategory === code"
              class="insights-toolbar__filter"
              :class="{ 'is-active': activeCategory === code }"
              @click="activeCategory = code"
            >
              {{ categoryLabel(code) }}
            </button>
          </div>
        </div>

        <p v-if="!gridArticles.length" class="insights-empty">
          {{ activeCategory ? t('insightsPage.emptyCategory') : t('state.empty') }}
        </p>

        <div v-else class="insights-grid">
          <ArticleCard
            v-for="article in gridArticles"
            :key="article.slug"
            :article="article"
            :to="`${localePath('insights')}/${article.slug}`"
          />
        </div>

        <p v-if="extraError" role="alert" class="insights-empty">{{ t('state.errorBody') }}</p>
        <div v-if="canLoadMore" class="insights-more">
          <button type="button" class="insights-more__button" :disabled="extraPending" @click="loadMore">
            {{ extraPending ? t('state.loading') : t('insightsPage.loadMore') }}
          </button>
        </div>
      </AsyncState>
    </div>
  </section>
  </div>
</template>

<style scoped lang="scss">
.journal-masthead { padding-block:64px 48px; }.journal-masthead > div { display:grid; grid-template-columns:1.3fr 1fr; gap:80px; align-items:end; margin-top:28px; }.journal-masthead .page-deck { max-width:420px; margin-left:auto; }
.insights-list { padding-bottom:80px; }.insight-featured { display:grid; grid-template-columns:1.5fr 1fr; gap:48px; align-items:center; padding-block:32px 48px; border-block:1px solid var(--vn-border-strong); }.insight-featured__cover img { width:100%; height:auto; aspect-ratio:1.5; object-fit:cover; }.insight-featured__cover:not(:has(img)) { display:none; }.insight-featured:not(:has(img)) { grid-template-columns:1fr; }.insight-featured__body { min-width:0; }.insight-featured__label { color:var(--vn-link); font-size:13px; margin-bottom:24px; }.insight-featured__meta { display:flex; flex-wrap:wrap; gap:16px; font-size:13px; color:var(--vn-text-muted); }.insight-featured__title { font-size:clamp(26px,2.6vw,38px); line-height:1.3; font-weight:500; margin-top:20px; }.insight-featured__excerpt { color:var(--vn-text-secondary); font-size:16px; margin-block:20px 24px; }
.insights-toolbar { margin-block:40px 32px; }.insights-toolbar__label { font-size:13px; color:var(--vn-text-muted); margin-bottom:16px; }.insights-toolbar__filters { display:flex; gap:8px 28px; flex-wrap:wrap; border-bottom:1px solid var(--vn-border); }.insights-toolbar__filter { min-height:44px; padding-block:10px; font-size:14px; color:var(--vn-text-secondary); border-bottom:1px solid transparent; }.insights-toolbar__filter:hover,.insights-toolbar__filter.is-active { color:var(--vn-text); border-bottom-color:var(--vn-accent); }.insights-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:32px; }.insights-empty { padding-block:40px; color:var(--vn-text-secondary); }.insights-more { text-align:center; margin-top:36px; }.insights-more__button { min-height:44px; padding:10px 24px; border:1px solid var(--vn-border-strong); font-size:15px; }.insights-more__button:disabled { opacity:.5; }
@media(max-width:1000px) { .journal-masthead > div { gap:32px; }.insight-featured { gap:32px; grid-template-columns:1.1fr 1fr; }.insights-grid { gap:24px; grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media(max-width:767px) { .journal-masthead { padding-top:48px; }.journal-masthead > div,.insight-featured { grid-template-columns:1fr; gap:24px; }.journal-masthead .page-deck { margin-left:0; }.insight-featured { padding-top:24px; }.insights-grid { grid-template-columns:1fr; gap:36px; }.insight-featured__label { margin-bottom:14px; }.insights-toolbar__filters { gap:4px 20px; } }
</style>
