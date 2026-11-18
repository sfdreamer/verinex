<script setup lang="ts">
/** Phase 2: six content regions; API contracts and detail routes stay unchanged. */
import { fetchInsights, fetchProducts, fetchSiteOverview, fetchSolutions } from '@/api'
import AsyncState from '@/components/common/AsyncState.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import AboutSection from './AboutSection.vue'
import HeroSection from './HeroSection.vue'
import ProductsSection from './ProductsSection.vue'
import SolutionsSection from './SolutionsSection.vue'
import TechnologyInsightsSection from './TechnologyInsightsSection.vue'

const state = useAsyncData(async () => {
  const [overview, solutions, products, insights] = await Promise.all([
    fetchSiteOverview(), fetchSolutions(), fetchProducts(), fetchInsights({ pageSize: 3 }),
  ])
  return { overview, solutions, products, articles: insights.articles }
})
</script>

<template>
  <div class="editorial-home">
    <HeroSection />
    <AsyncState :pending="state.pending.value" :error="state.error.value" :empty="state.isEmpty.value" :skeleton-rows="5" @retry="state.reload">
      <template v-if="state.data.value">
        <AboutSection :company="state.data.value.overview.company" />
        <SolutionsSection :solutions="state.data.value.solutions" :industries="state.data.value.overview.featuredIndustries" />
        <ProductsSection :products="state.data.value.products" />
        <TechnologyInsightsSection :highlights="state.data.value.overview.technologyHighlights" :articles="state.data.value.articles" />
      </template>
    </AsyncState>
  </div>
</template>
