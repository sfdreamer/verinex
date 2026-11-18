<script setup lang="ts">
/**
 * 首页 Industries We Serve 区块（PRD 4.1-7）：设计稿未单独提供，
 * 按 PRD 12.2 复用解决方案卡片的视觉语言。
 */
import { useI18n } from 'vue-i18n'

import type { IndustryItem } from '@/api/types'
import SectionHeader from '@/components/common/SectionHeader.vue'
import SolutionCard from '@/components/common/SolutionCard.vue'

defineProps<{ industries: IndustryItem[] }>()

const { t } = useI18n()
</script>

<template>
  <section class="home-industries" aria-labelledby="home-industries-title">
    <div class="container">
      <SectionHeader
        :eyebrow="t('home.industries.eyebrow')"
        :title="t('home.industries.title')"
        :lead="t('home.industries.lead')"
      />

      <div class="home-industries__grid">
        <SolutionCard
          v-for="industry in industries"
          :key="industry.code"
          :code="industry.code"
          :title="industry.title"
          :summary="industry.summary"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '../../styles/breakpoints' as *;

.home-industries {
  padding-block: var(--vn-space-24);
  background: var(--vn-section);

  @include below-desktop {
    padding-block: var(--vn-space-16);
  }

  @include below-tablet {
    padding-block: var(--vn-space-12);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: var(--vn-space-5);

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
