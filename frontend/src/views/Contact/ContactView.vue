<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchSiteSettings } from '@/api'
import AsyncState from '@/components/common/AsyncState.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import ContactForm from './ContactForm.vue'
const { t } = useI18n()
const state = useAsyncData(fetchSiteSettings)
const email = computed(() => state.data.value?.contactEmail ?? 'business@verinex.ai')
</script>
<template>
  <section class="editorial-page contact-opening">
    <div class="container contact-layout">
      <div class="contact-copy"><p class="editorial-kicker">{{ t('nav.contact') }}</p><h1 class="page-title">{{ t('editorial.contactTitle') }}</h1><p class="page-deck">{{ t('contactPage.hero.lead') }}</p>
        <div class="contact-address"><p>{{ t('contactPage.hero.emailLabel') }}</p><AsyncState :pending="state.pending.value" :error="state.error.value" @retry="state.reload"><a :href="`mailto:${email}`">{{ email }} <span aria-hidden="true">↗</span></a></AsyncState></div>
      </div>
      <ContactForm />
    </div>
  </section>
</template>
<style scoped lang="scss">
.contact-opening { padding-block:72px 88px; }.contact-layout { display:grid; grid-template-columns:1fr 1.2fr; gap:clamp(40px,7vw,110px); align-items:start; }.contact-copy { padding-top:24px; }.contact-copy h1 { font-size:clamp(40px,4.1vw,60px); margin-top:32px; }.contact-copy .page-deck { margin-top:30px; max-width:450px; }.contact-address { padding-top:28px; margin-top:48px; border-top:1px solid var(--vn-border-strong); }.contact-address p { font-size:13px; color:var(--vn-text-muted); margin-bottom:12px; }.contact-address a { font-size:21px; overflow-wrap:anywhere; }.contact-address a span { padding-left:16px; color:var(--vn-link); }
@media(max-width:1000px) { .contact-layout { grid-template-columns:1fr; gap:40px; }.contact-copy { display:grid; grid-template-columns:1fr 1fr; gap:24px 40px; }.contact-copy > .editorial-kicker,.contact-copy h1 { grid-column:1/-1; }.contact-copy h1,.contact-copy .page-deck,.contact-address { margin-top:0; }.contact-address { padding-top:16px; } }
@media(max-width:767px) { .contact-opening { padding-block:32px 48px; }.contact-copy { display:block; padding-top:16px; }.contact-copy h1 { margin-top:24px; font-size:38px; white-space:normal; }.contact-copy .page-deck { margin-top:24px; }.contact-address { margin-top:28px; padding-top:22px; }.contact-address a { font-size:19px; } }
</style>
