<script setup lang="ts">
import { ref, watch } from 'vue'
const props = withDefaults(defineProps<{ src: string | null; srcset?: string; sizes?: string; width: number; height: number; alt?: string }>(), { alt: '' })
const failed = ref(false)
watch(() => props.src, () => { failed.value = false })
</script>

<template>
  <img v-if="src && !failed" :src="src" :srcset="srcset" :sizes="sizes" :width="width" :height="height"
    :alt="alt" loading="lazy" decoding="async" @error="failed = true" />
</template>
