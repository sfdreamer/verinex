<script setup lang="ts">
/** 首页 Insights 区块：最新三篇文章卡片（设计稿第 6 屏）。 */
import { useI18n } from 'vue-i18n'

import type { ArticleSummary } from '@/api/types'
import ArticleCard from '@/components/common/ArticleCard.vue'
import SectionHeader from '@/components/common/SectionHeader.vue'
import TextLink from '@/components/common/TextLink.vue'
import { useLocalePath } from '@/composables/useLocalePath'

defineProps<{ articles: ArticleSummary[] }>()

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <section class="home-insights" aria-labelledby="home-insights-title">
    <div class="container">
      <SectionHeader :eyebrow="t('home.insights.eyebrow')" :title="t('home.insights.title')">
        <TextLink :to="localePath('insights')">{{ t('home.insights.viewAll') }}</TextLink>
      </SectionHeader>

      <div class="home-insights__grid">
        <ArticleCard
          v-for="article in articles"
          :key="article.slug"
          :article="article"
          :to="`${localePath('insights')}/${article.slug}`"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '../../styles/breakpoints' as *;

.home-insights {
  padding-block: var(--vn-space-24);
  background: var(--vn-section-soft);

  @include below-desktop {
    padding-block: var(--vn-space-16);
  }

  @include below-tablet {
    padding-block: var(--vn-space-12);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--vn-space-6);

    @include below-desktop {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @include below-tablet {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--vn-space-4);
    }
  }
}
</style>
