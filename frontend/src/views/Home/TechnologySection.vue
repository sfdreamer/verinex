<script setup lang="ts">
/**
 * 首页 Technology & Innovation 区块（PRD 4.1-6）。
 * 设计稿右侧的 46% / 12ms / SOC 2 指标按 PRD 12.1 替换为能力表述（pillars）。
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { TechnologyItem } from '@/api/types'
import IconGlyph from '@/components/common/IconGlyph.vue'
import SectionHeader from '@/components/common/SectionHeader.vue'
import TextLink from '@/components/common/TextLink.vue'
import { CODE_ICONS } from '@/config/icons'
import { useLocalePath } from '@/composables/useLocalePath'

const props = defineProps<{ highlights: TechnologyItem[] }>()

const { t, tm } = useI18n()
const localePath = useLocalePath()
const pillars = computed(() => tm('home.technology.pillars') as string[])

/** PRD 4.1 首屏展示五个技术方向。 */
const items = computed(() => props.highlights.slice(0, 5))
</script>

<template>
  <section class="home-tech" aria-labelledby="home-tech-title">
    <div class="container">
      <div class="home-tech__head">
        <SectionHeader
          :eyebrow="t('home.technology.eyebrow')"
          :title="t('home.technology.title')"
          :lead="t('home.technology.lead')"
        >
          <TextLink :to="localePath('technology')">{{ t('actions.learnMore') }}</TextLink>
        </SectionHeader>

        <ul class="home-tech__pillars" aria-hidden="true">
          <li v-for="pillar in pillars" :key="pillar">{{ pillar }}</li>
        </ul>
      </div>

      <ul class="home-tech__grid">
        <li v-for="item in items" :key="item.code" class="home-tech__card">
          <span class="home-tech__icon" aria-hidden="true">
            <IconGlyph :name="CODE_ICONS[item.code] ?? 'grid'" :size="20" />
          </span>
          <h3 class="home-tech__name">{{ item.title }}</h3>
          <p class="home-tech__summary">{{ item.summary }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '../../styles/breakpoints' as *;

.home-tech {
  padding-block: var(--vn-space-24);
  background: var(--vn-section-soft);

  @include below-desktop {
    padding-block: var(--vn-space-16);
  }

  @include below-tablet {
    padding-block: var(--vn-space-12);
  }

  &__head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 2.5rem;

    > :first-child {
      flex: 1;
      margin-bottom: 0;
    }

    @include below-desktop {
      flex-direction: column;
      align-items: flex-start;
      gap: 1.5rem;
    }
  }

  &__pillars {
    display: flex;
    gap: 2.25rem;
    margin: 0 0 var(--vn-space-12);
    padding: 0;
    list-style: none;

    li {
      font-size: var(--vn-fs-h4);
      font-weight: var(--vn-fw-semibold);
      letter-spacing: -0.01em;
      color: var(--vn-text);
      white-space: nowrap;
    }

    @include below-desktop {
      margin-bottom: 0;
      flex-wrap: wrap;
      gap: 1rem;
    }

    @include below-tablet {
      li {
        font-size: var(--vn-fs-body);
      }
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: var(--vn-space-5);
    margin: var(--vn-space-10) 0 0;
    padding: 0;
    list-style: none;

    @include below-desktop {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @include below-tablet {
      grid-template-columns: minmax(0, 1fr);
      margin-top: var(--vn-space-8);
    }
  }

  &__card {
    padding: var(--vn-space-6);
    border: 1px solid var(--vn-border);
    border-radius: var(--vn-radius-lg);
    background: var(--vn-surface);
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    margin-bottom: 0.875rem;
    border-radius: var(--vn-radius-md);
    background: var(--vn-brand-soft);
    color: var(--vn-link);
  }

  &__name {
    font-size: var(--vn-fs-body);
    font-weight: var(--vn-fw-semibold);
    color: var(--vn-text);
  }

  &__summary {
    margin-top: 0.5rem;
    font-size: var(--vn-fs-sm);
    line-height: 1.7;
    color: var(--vn-text-secondary);
  }
}
</style>
