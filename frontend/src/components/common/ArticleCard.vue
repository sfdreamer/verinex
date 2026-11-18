<script setup lang="ts">
/**
 * 文章卡片：主题封面（未知主题保留纯文字排版）+ 分类标签 + 日期 + 标题 + 摘要。
 * Home Insights 区块与 Insights 列表页共用。
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { articleCover } from '@/config/editorialArt'
import { useLocaleStore } from '@/stores/locale'
import { formatDate } from '@/utils/format'
import EditorialImage from '@/views/Home/EditorialImage.vue'

const props = defineProps<{
  /** relatedArticles 不返回 categoryCode，因此该字段可选。 */
  article: {
    slug: string
    title: string
    excerpt: string
    coverImage: string | null
    publishedAt: string
    categoryCode?: string
  }
  to: string
}>()

const { t } = useI18n()
const localeStore = useLocaleStore()

const categoryLabel = computed(() =>
  props.article.categoryCode ? t(`articleCategories.${props.article.categoryCode}`) : '',
)
const dateLabel = computed(() =>
  formatDate(props.article.publishedAt, localeStore.contentLocale),
)
</script>

<template>
  <article class="article-card">
    <RouterLink :to="props.to" class="article-card__cover" :aria-label="props.article.title">
      <EditorialImage :src="articleCover(props.article)" :width="640" :height="427" />
    </RouterLink>
    <div class="article-card__body">
      <p class="article-card__meta">
        <span v-if="categoryLabel" class="article-card__category">{{ categoryLabel }}</span>
        <time :datetime="props.article.publishedAt">{{ dateLabel }}</time>
      </p>
      <h3 class="article-card__title">
        <RouterLink :to="props.to">{{ props.article.title }}</RouterLink>
      </h3>
      <p class="article-card__excerpt">{{ props.article.excerpt }}</p>
    </div>
  </article>
</template>

<style scoped lang="scss">
.article-card { min-width:0; }.article-card__cover { display:block; overflow:hidden; }.article-card__cover:not(:has(img)) { display:none; }.article-card__cover img { width:100%; height:auto; aspect-ratio:1.65; object-fit:cover; transition:transform .3s; }.article-card__cover:hover img { transform:scale(1.025); }.article-card__body { padding-top:22px; }.article-card__meta { display:flex; flex-wrap:wrap; gap:12px; font-size:13px; color:var(--vn-text-muted); }.article-card__category { color:var(--vn-link); }.article-card__title { margin-top:14px; font-size:23px; font-weight:500; line-height:1.45; }.article-card__title a:hover { color:var(--vn-link); }.article-card__excerpt { margin-top:14px; font-size:15px; color:var(--vn-text-secondary); }
</style>
