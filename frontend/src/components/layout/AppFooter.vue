<script setup lang="ts">
/**
 * 全站 Footer（按 design/reference/contact.png 实现，设计稿中重复出现两次 → 只保留一份）。
 * 结构：品牌简介 + 四栏链接（解决方案 / 产品 / 公司 / 联系）+ 版权行。
 * 设计稿的「资源」栏（开发者文档 / API 参考 / 状态面板 / 媒体资料）在 V1 无对应页面，
 * 按 PRD 12.3 精神不保留无效入口；社交媒体图标待资料确认后展示（PRD 4.1）。
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import BrandLogo from '@/components/common/BrandLogo.vue'
import { PRODUCTS, SOLUTIONS } from '@/config/catalog'
import { SITE_CONFIG } from '@/config/site'
import { useLocalePath } from '@/composables/useLocalePath'

const { t } = useI18n()
const localePath = useLocalePath()

const year = new Date().getFullYear()

const companyLinks = computed(() => [
  { label: t('footer.company.about'), to: localePath('about') },
  { label: t('footer.company.technology'), to: localePath('technology') },
  { label: t('footer.company.insights'), to: localePath('insights') },
  { label: t('footer.company.contact'), to: localePath('contact') },
])
</script>

<template>
  <footer class="footer">
    <div class="footer__inner container">
      <div class="footer__brand">
        <BrandLogo :size="32" />
        <p class="footer__desc">{{ t('footer.description') }}</p>
      </div>

      <nav class="footer__columns" :aria-label="t('a11y.footerNav')">
        <div class="footer__col">
          <h2 class="footer__title">{{ t('footer.columns.solutions') }}</h2>
          <ul class="footer__list" role="list">
            <li v-for="item in SOLUTIONS" :key="item.code">
              <RouterLink class="footer__link" :to="localePath('solutions')">{{ t(item.i18nKey) }}</RouterLink>
            </li>
          </ul>
        </div>

        <div class="footer__col">
          <h2 class="footer__title">{{ t('footer.columns.products') }}</h2>
          <ul class="footer__list" role="list">
            <li v-for="item in PRODUCTS" :key="item.code">
              <RouterLink class="footer__link" :to="localePath('products')">{{ item.name }}</RouterLink>
            </li>
          </ul>
        </div>

        <div class="footer__col">
          <h2 class="footer__title">{{ t('footer.columns.company') }}</h2>
          <ul class="footer__list" role="list">
            <li v-for="item in companyLinks" :key="item.to">
              <RouterLink class="footer__link" :to="item.to">{{ item.label }}</RouterLink>
            </li>
          </ul>
        </div>

        <div class="footer__col">
          <h2 class="footer__title">{{ t('footer.columns.contact') }}</h2>
          <ul class="footer__list" role="list">
            <li class="footer__contact-label">{{ t('footer.contact.emailLabel') }}</li>
            <li>
              <a class="footer__link footer__link--strong" :href="`mailto:${SITE_CONFIG.contactEmail}`">
                {{ SITE_CONFIG.contactEmail }}
              </a>
            </li>
            <li>
              <RouterLink class="footer__link" :to="localePath('contact')">
                {{ t('footer.contact.cta') }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>

    <div class="footer__bottom">
      <div class="footer__bottom-inner container">
        <p class="footer__rights">{{ t('footer.rights', { year }) }}</p>
        <div class="footer__legal">
          <RouterLink class="footer__link" :to="localePath('privacy')">
            {{ t('footer.legal.privacy') }}
          </RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
@use '../../styles/breakpoints' as *;

.footer {
  background: var(--vn-page);
  color: var(--vn-text-inverse-secondary);
}

.footer__inner {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr .8fr 1.1fr;
  gap: 2rem;
  padding-block: 3.5rem 3rem;

  @include below-desktop {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 2.5rem 2rem;
    padding-block: 3.5rem 2.5rem;
  }

  @include below-tablet {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2rem 1.5rem;
    padding-block: 2.5rem 2rem;
  }
}

.footer__brand {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 20rem;

  @include below-desktop {
    grid-column: 1 / -1;
    max-width: 30rem;
  }
}

.footer__desc {
  font-size: var(--vn-fs-sm);
  line-height: 1.75;
  color: var(--vn-text-inverse-muted);
}

.footer__slogan {
  font-size: var(--vn-fs-xs);
  letter-spacing: 0.06em;
  color: var(--vn-text-inverse-muted);
  opacity: 0.8;
}

.footer__columns {
  display: contents;
}

.footer__col {
  min-width: 0;
}

.footer__title {
  font-size: var(--vn-fs-sm);
  font-weight: var(--vn-fw-semibold);
  color: var(--vn-text-inverse);
  letter-spacing: 0.02em;
  margin-bottom: 1rem;
}

.footer__list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.footer__link {
  font-size: var(--vn-fs-sm);
  overflow-wrap: anywhere;
  color: var(--vn-text-inverse-muted);
  transition: color var(--vn-duration) var(--vn-ease-out);

  &:hover {
    color: var(--vn-text-inverse);
  }

  &:focus-visible {
    outline: 2px solid var(--vn-accent);
    outline-offset: 3px;
    border-radius: 2px;
  }

  &--strong {
    color: var(--vn-text-inverse-secondary);
  }
}

.footer__contact-label {
  font-size: var(--vn-fs-xs);
  letter-spacing: 0.04em;
  color: var(--vn-text-inverse-muted);
}

.footer__bottom {
  border-top: 1px solid var(--vn-dark-border);
}

.footer__bottom-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 1.5rem;

  @include below-tablet {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}

.footer__rights {
  font-size: var(--vn-fs-xs);
  color: var(--vn-text-inverse-muted);
}

.footer__legal {
  display: flex;
  gap: 1.5rem;
}
</style>
