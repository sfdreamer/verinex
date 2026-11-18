<script setup lang="ts">
import { RouterView } from 'vue-router'

import { usePageSeo } from '@/composables/usePageSeo'

// 全站唯一的 SEO 副作用入口：路由或语言变化时同步 title / description / canonical / hreflang。
usePageSeo()
</script>

<template>
  <RouterView />
</template>
