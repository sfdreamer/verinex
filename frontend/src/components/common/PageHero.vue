<script setup lang="ts">
/** Quiet typographic header for detail pages. Primary pages have their own compositions. */
withDefaults(defineProps<{ eyebrow:string; title:string; subtitle?:string; lead?:string }>(), { subtitle:'', lead:'' })
</script>
<template><section class="page-hero"><div class="container"><p class="editorial-kicker">{{ eyebrow }}</p><h1>{{ title }}</h1><p v-if="subtitle" class="page-hero__subtitle">{{ subtitle }}</p><p v-if="lead" class="page-deck">{{ lead }}</p><div v-if="$slots.default" class="page-hero__extra"><slot /></div></div></section></template>
<style scoped lang="scss">
.page-hero { background:var(--vn-secondary); border-bottom:1px solid var(--vn-border); padding-block:64px; }.page-hero h1 { font-size:clamp(36px,4.5vw,64px); font-weight:500; line-height:1.2; max-width:1050px; margin-top:28px; }.page-hero__subtitle { color:var(--vn-text-secondary); font-size:21px; margin-top:22px; }.page-hero .page-deck { margin-top:24px; max-width:800px; }.page-hero__extra { margin-top:28px; }@media(max-width:767px) { .page-hero { padding-block:44px; }.page-hero__subtitle { font-size:18px; } }
</style>
