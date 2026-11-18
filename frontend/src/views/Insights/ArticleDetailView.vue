<script setup lang="ts">
/**
 * 文章详情（PRD 4.6 / 12.2 统一详情模板）：
 * 分类与日期 → 标题与摘要 → 正文（安全分块渲染）→ 相关文章（同分类优先，API 计算）。
 * 数据：GET /api/v1/insights/{slug}。
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { ApiError, fetchInsight } from '@/api'
import ArticleCard from '@/components/common/ArticleCard.vue'
import AsyncState from '@/components/common/AsyncState.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import EditorialImage from '@/views/Home/EditorialImage.vue'
import { articleCover } from '@/config/editorialArt'
import SectionHeader from '@/components/common/SectionHeader.vue'
import TextLink from '@/components/common/TextLink.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { useJsonLd } from '@/composables/useJsonLd'
import { useLocalePath } from '@/composables/useLocalePath'
import { useDetailSeo } from '@/composables/usePageSeo'
import { useLocaleStore } from '@/stores/locale'
import { SITE_CONFIG } from '@/config/site'
import { formatDate } from '@/utils/format'
import { parseContent } from '@/utils/markdown'

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const localeStore = useLocaleStore()

const slug = computed(() => String(route.params.slug ?? ''))
const state = useAsyncData(() => fetchInsight(slug.value), [() => slug.value])

const notFound = computed(
  () => state.error.value instanceof ApiError && state.error.value.status === 404,
)

const blocks = computed(() => (state.data.value ? parseContent(state.data.value.content) : []))
const dateLabel = computed(() =>
  state.data.value ? formatDate(state.data.value.publishedAt, localeStore.contentLocale) : '',
)

useDetailSeo(() => {
  const article = state.data.value
  if (!article) return null
  return {
    title: article.seoTitle ?? `${article.title} — VERINEX`,
    description: article.seoDescription ?? article.excerpt,
    ogType: 'article',
    image: article.coverImage,
  }
})

/** 结构化数据：Article + 可见的面包屑导航（BreadcrumbList）。 */
useJsonLd('article', () => {
  const article = state.data.value
  if (!article) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    articleSection: article.categoryCode,
    datePublished: article.publishedAt,
    inLanguage: localeStore.contentLocale === 'zh-CN' ? 'zh-CN' : 'en',
    mainEntityOfPage: `${SITE_CONFIG.siteUrl}${localePath('insights')}/${article.slug}`,
    image: article.coverImage ?? undefined,
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.companyName,
      url: SITE_CONFIG.siteUrl,
    },
  }
})

useJsonLd('breadcrumb', () => {
  const article = state.data.value
  if (!article) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('nav.home'), item: SITE_CONFIG.siteUrl + localePath('home') },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('nav.insights'),
        item: `${SITE_CONFIG.siteUrl}${localePath('insights')}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `${SITE_CONFIG.siteUrl}${localePath('insights')}/${article.slug}`,
      },
    ],
  }
})
</script>

<template>
  <AsyncState
    :pending="state.pending.value"
    :error="state.error.value && !notFound ? state.error.value : null"
    :skeleton-rows="5"
    @retry="state.reload"
  >
    <template v-if="state.data.value">
      <article class="article">
        <header class="article__header">
          <div class="container article__header-inner">
            <nav class="article__breadcrumb" :aria-label="t('articleDetail.backToList')">
              <RouterLink :to="localePath('insights')">{{ t('nav.insights') }}</RouterLink>
              <span aria-hidden="true">/</span>
              <span>{{ t(`articleCategories.${state.data.value.categoryCode}`) }}</span>
            </nav>

            <p class="article__meta">
              <span class="article__category">
                {{ t(`articleCategories.${state.data.value.categoryCode}`) }}
              </span>
              <span>{{ t('articleDetail.publishedAt') }}</span>
              <time :datetime="state.data.value.publishedAt">{{ dateLabel }}</time>
            </p>

            <h1 class="article__title">{{ state.data.value.title }}</h1>
            <p class="article__excerpt">{{ state.data.value.excerpt }}</p>
          </div>
        </header>

        <div v-if="articleCover(state.data.value,1280)" class="container article__cover">
          <EditorialImage :src="articleCover(state.data.value,1280)" :width="1536" :height="1024" />
        </div>

        <div class="container article__body">
          <template v-for="(block, index) in blocks" :key="index">
            <h2 v-if="block.type === 'heading' && block.level === 2" class="article__h2">
              {{ block.text }}
            </h2>
            <h3 v-else-if="block.type === 'heading'" class="article__h3">{{ block.text }}</h3>
            <ul v-else-if="block.type === 'list'" class="article__list">
              <li v-for="item in block.items" :key="item">{{ item }}</li>
            </ul>
            <p v-else-if="block.type === 'paragraph'" class="article__paragraph">
              {{ block.text }}
            </p>
          </template>

          <TextLink :to="localePath('insights')" class="article__back">
            {{ t('articleDetail.backToList') }}
          </TextLink>
        </div>
      </article>

      <section
        v-if="state.data.value.relatedArticles.length"
        class="article-related"
        aria-labelledby="article-related-title"
      >
        <div class="container">
          <SectionHeader
            :eyebrow="t('articleDetail.relatedEyebrow')"
            :title="t('articleDetail.relatedTitle')"
          />
          <div class="article-related__grid">
            <ArticleCard
              v-for="item in state.data.value.relatedArticles"
              :key="item.slug"
              :article="item"
              :to="`${localePath('insights')}/${item.slug}`"
            />
          </div>
        </div>
      </section>
    </template>

    <div v-if="notFound" class="article-notfound">
      <p>{{ t('state.empty') }}</p>
      <BaseButton :to="localePath('insights')" variant="secondary">
        {{ t('articleDetail.backToList') }}
      </BaseButton>
    </div>
  </AsyncState>
</template>

<style scoped lang="scss">
@use '../../styles/breakpoints' as *;

.article {
  background: var(--vn-panel);

  &__header {
    padding-block: var(--vn-space-16) var(--vn-space-10);
    background: var(--vn-surface);

    @include below-tablet {
      padding-block: var(--vn-space-8) var(--vn-space-6);
    }
  }

  &__header-inner {
    max-width: 52rem;
  }

  &__breadcrumb {
    display: flex;
    gap: 0.5rem;
    font-size: var(--vn-fs-xs);
    color: var(--vn-text-muted);

    a {
      color: var(--vn-text-muted);
      text-decoration: none;

      &:hover {
        color: var(--vn-link);
      }
    }
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.625rem;
    margin-top: var(--vn-space-6);
    font-size: var(--vn-fs-xs);
    color: var(--vn-text-muted);
  }

  &__category {
    padding: 0.125rem 0.625rem;
    border-radius: var(--vn-radius-pill);
    background: var(--vn-brand-soft);
    color: var(--vn-link);
    font-weight: var(--vn-fw-medium);
  }

  &__title {
    margin-top: var(--vn-space-4);
    font-size: var(--vn-fs-h1);
    line-height: 1.2;
    color: var(--vn-text);
  }

  &__excerpt {
    margin-top: var(--vn-space-5);
    font-size: var(--vn-fs-lead);
    line-height: 1.75;
    color: var(--vn-text-secondary);
  }

  &__cover {
    margin-top: var(--vn-space-10);
    max-width: 52rem;

    img {
      width: 100%;
      height: auto;
      border-radius: 4px;
    }

    &--placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 21 / 9;
      border-radius: var(--vn-radius-lg);
      background:
        radial-gradient(120% 140% at 85% 10%, rgba(57, 198, 232, 0.26), transparent 55%),
        linear-gradient(155deg, var(--vn-dark-3), var(--vn-dark-2));
      color: rgba(57, 198, 232, 0.7);
    }
  }

  &__body {
    max-width: 52rem;
    padding-block: var(--vn-space-10) var(--vn-space-20);

    @include below-tablet {
      padding-block: var(--vn-space-8) var(--vn-space-12);
    }
  }

  &__h2 {
    margin-top: var(--vn-space-8);
    font-size: var(--vn-fs-h3);
    color: var(--vn-text);
  }

  &__h3 {
    margin-top: var(--vn-space-6);
    font-size: var(--vn-fs-h4);
    color: var(--vn-text);
  }

  &__paragraph {
    margin-top: var(--vn-space-5);
    font-size: var(--vn-fs-body);
    line-height: 1.9;
    color: var(--vn-text-secondary);
  }

  &__list {
    margin: var(--vn-space-5) 0 0;
    padding-left: 1.25rem;
    color: var(--vn-text-secondary);
    line-height: 1.9;

    li {
      margin-top: 0.375rem;
    }
  }

  &__back {
    margin-top: var(--vn-space-10);
  }
}

.article-related {
  padding-block: var(--vn-space-16);
  background: var(--vn-section-soft);

  @include below-tablet {
    padding-block: var(--vn-space-12);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--vn-space-6);

    @include below-desktop {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}

.article-notfound {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: var(--vn-space-24) var(--vn-space-4);
  text-align: center;
  color: var(--vn-text-secondary);
}
</style>
