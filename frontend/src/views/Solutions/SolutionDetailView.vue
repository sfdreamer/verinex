<script setup lang="ts">
/**
 * 解决方案详情（PRD 4.3 / 12.2 统一详情模板）：
 * 业务介绍 → 核心能力 → 应用场景 → 联系入口 → 其他解决方案。
 * 数据：GET /api/v1/solutions/{slug}；核心能力与场景为 PRD 4.3 已确认内容。
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { ApiError, fetchSolution, fetchSolutions } from '@/api'
import AsyncState from '@/components/common/AsyncState.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import PageHero from '@/components/common/PageHero.vue'
import SectionHeader from '@/components/common/SectionHeader.vue'
import SolutionCard from '@/components/common/SolutionCard.vue'
import TextLink from '@/components/common/TextLink.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { useJsonLd } from '@/composables/useJsonLd'
import { useLocalePath } from '@/composables/useLocalePath'
import { useDetailSeo } from '@/composables/usePageSeo'
import { SITE_CONFIG } from '@/config/site'

const { t, tm } = useI18n()
const route = useRoute()
const localePath = useLocalePath()

const slug = computed(() => String(route.params.slug ?? ''))
const state = useAsyncData(() => fetchSolution(slug.value), [() => slug.value])
const related = useAsyncData(fetchSolutions)

const capabilities = computed(() => tm('solutionCapabilities') as Record<string, string[]>)
const scenarios = computed(() => tm('solutionScenarios') as Record<string, string[]>)

const notFound = computed(
  () => state.error.value instanceof ApiError && state.error.value.status === 404,
)

const otherSolutions = computed(() =>
  (related.data.value ?? []).filter((item) => item.slug !== slug.value).slice(0, 4),
)

useDetailSeo(() => {
  const solution = state.data.value
  if (!solution) return null
  return {
    title: solution.seoTitle ?? `${solution.title} — VERINEX`,
    description: solution.seoDescription ?? solution.summary,
  }
})

// 结构化数据：Service（提供方为 VERINEX，不含未确认的服务承诺）
useJsonLd('service', () => {
  const solution = state.data.value
  if (!solution) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: solution.title,
    description: solution.summary,
    url: `${SITE_CONFIG.siteUrl}${localePath('solutions')}/${solution.slug}`,
    serviceType: solution.code,
    provider: {
      '@type': 'Organization',
      name: SITE_CONFIG.companyName,
      url: SITE_CONFIG.siteUrl,
    },
  }
})
</script>

<template>
  <AsyncState
    :pending="state.pending.value"
    :error="state.error.value && !notFound ? state.error.value : null"
    :skeleton-rows="4"
    @retry="state.reload"
  >
    <template v-if="state.data.value">
      <PageHero
        :eyebrow="t('solutionDetail.eyebrow')"
        :title="state.data.value.title"
        :subtitle="state.data.value.subtitle ?? ''"
        :lead="state.data.value.summary"
      >
        <TextLink :to="localePath('solutions')" on-dark>
          {{ t('solutionDetail.backToList') }}
        </TextLink>
      </PageHero>

      <section class="solution-detail" aria-labelledby="solution-detail-title">
        <div class="container solution-detail__grid">
          <div class="solution-detail__intro">
            <p class="solution-detail__body">{{ state.data.value.body }}</p>
          </div>

          <div class="solution-detail__panel">
            <h2 id="solution-detail-title" class="solution-detail__panel-title">
              {{ t('solutionDetail.capabilitiesTitle') }}
            </h2>
            <ul class="solution-detail__chips">
              <li v-for="cap in capabilities[state.data.value.code] ?? []" :key="cap">
                {{ cap }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section class="solution-scenarios" aria-labelledby="solution-scenarios-title">
        <div class="container">
          <SectionHeader
            :eyebrow="t('solutionDetail.scenariosEyebrow')"
            :title="t('solutionDetail.scenariosTitle')"
            :lead="t('solutionDetail.scenariosNote')"
          />
          <ul class="solution-scenarios__list">
            <li
              v-for="(scenario, index) in scenarios[state.data.value.code] ?? []"
              :key="scenario"
              class="solution-scenarios__item"
            >
              <span aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
              <p>{{ scenario }}</p>
            </li>
          </ul>
        </div>
      </section>

      <section class="solution-contact" aria-labelledby="solution-contact-title">
        <div class="container solution-contact__inner">
          <div>
            <h2 id="solution-contact-title" class="solution-contact__title">
              {{ t('solutionDetail.contactTitle') }}
            </h2>
            <p class="solution-contact__body">{{ t('solutionDetail.contactBody') }}</p>
          </div>
          <BaseButton :to="localePath('contact')" size="lg">
            {{ t('solutionDetail.contactCta') }}
          </BaseButton>
        </div>
      </section>

      <section v-if="otherSolutions.length" class="solution-related" aria-labelledby="related-title">
        <div class="container">
          <SectionHeader
            :eyebrow="t('solutionDetail.relatedEyebrow')"
            :title="t('solutionDetail.relatedTitle')"
          />
          <div class="solution-related__grid">
            <SolutionCard
              v-for="item in otherSolutions"
              :key="item.code"
              :code="item.code"
              :title="item.title"
              :summary="item.summary"
              :to="`${localePath('solutions')}/${item.slug}`"
              :link-label="t('solutionsPage.detailCta')"
            />
          </div>
        </div>
      </section>
    </template>

    <div v-if="notFound" class="solution-notfound">
      <p>{{ t('state.empty') }}</p>
      <BaseButton :to="localePath('solutions')" variant="secondary">
        {{ t('solutionDetail.backToList') }}
      </BaseButton>
    </div>
  </AsyncState>
</template>

<style scoped lang="scss">
@use '../../styles/breakpoints' as *;

.solution-detail {
  padding-block: var(--vn-space-20);
  background: var(--vn-section-soft);

  @include below-tablet {
    padding-block: var(--vn-space-12);
  }

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    gap: var(--vn-space-16);
    align-items: start;

    @include below-desktop {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--vn-space-8);
    }
  }

  &__body {
    font-size: var(--vn-fs-lead);
    line-height: 1.85;
    color: var(--vn-text-secondary);
  }

  &__panel {
    padding: var(--vn-space-8);
    border: 1px solid var(--vn-border);
    border-radius: var(--vn-radius-lg);
    background: var(--vn-surface);
  }

  &__panel-title {
    font-size: var(--vn-fs-h4);
    color: var(--vn-text);
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: var(--vn-space-5) 0 0;
    padding: 0;
    list-style: none;

    li {
      padding: 0.375rem 0.875rem;
      border: 1px solid var(--vn-border-strong);
      border-radius: var(--vn-radius-pill);
      background: var(--vn-card);
      font-size: var(--vn-fs-sm);
      color: var(--vn-text-secondary);
    }
  }
}

.solution-scenarios {
  padding-block: var(--vn-space-20);
  background: var(--vn-section-soft);

  @include below-tablet {
    padding-block: var(--vn-space-12);
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--vn-space-5);
    margin: 0;
    padding: 0;
    list-style: none;

    @include below-desktop {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__item {
    padding: var(--vn-space-6);
    border: 1px solid var(--vn-border);
    border-radius: var(--vn-radius-lg);
    background: var(--vn-card);

    span {
      font-size: var(--vn-fs-xs);
      font-weight: var(--vn-fw-semibold);
      letter-spacing: 0.08em;
      color: var(--vn-link);
    }

    p {
      margin-top: 0.625rem;
      font-size: var(--vn-fs-body);
      line-height: 1.7;
      color: var(--vn-text);
    }
  }
}

.solution-contact {
  padding-block: var(--vn-space-12);
  background: var(--vn-section-soft);

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;

    @include below-tablet {
      flex-direction: column;
      align-items: flex-start;
      gap: 1.5rem;
    }
  }

  &__title {
    font-size: var(--vn-fs-h3);
    color: var(--vn-text-inverse);
  }

  &__body {
    margin-top: 0.5rem;
    font-size: var(--vn-fs-sm);
    color: var(--vn-text-inverse-secondary);
  }
}

.solution-related {
  padding-block: var(--vn-space-20);
  background: var(--vn-section-soft);

  @include below-tablet {
    padding-block: var(--vn-space-12);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--vn-space-5);

    @include below-tablet {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--vn-space-4);
    }
  }
}

.solution-notfound {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: var(--vn-space-24) var(--vn-space-4);
  text-align: center;
  color: var(--vn-text-secondary);
}
</style>
