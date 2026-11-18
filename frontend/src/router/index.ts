import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { DEFAULT_URL_LOCALE, findLocale, isUrlLocale } from '@/config/site'
import { i18n } from '@/i18n'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HomeView from '@/views/Home/HomeView.vue'
import { useLocaleStore } from '@/stores/locale'

/**
 * 语言前缀路由（docs/ARCHITECTURE.md 6.2）：
 * 七个一级页面共用一个带 :locale 参数的父路由，切换语言时只需要替换 params.locale，
 * 即可映射到同一页面的另一语言地址。
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: `/${DEFAULT_URL_LOCALE}`,
  },
  {
    path: '/:locale(zh|en)',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,
        meta: { seoKey: 'home', navKey: 'home', theme: 'dark' },
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/About/AboutView.vue'),
        meta: { seoKey: 'about', navKey: 'about', theme: 'dark' },
      },
      {
        path: 'solutions',
        name: 'solutions',
        component: () => import('@/views/Solutions/SolutionsView.vue'),
        meta: { seoKey: 'solutions', navKey: 'solutions', theme: 'dark' },
      },
      {
        path: 'solutions/:slug',
        name: 'solution-detail',
        component: () => import('@/views/Solutions/SolutionDetailView.vue'),
        meta: { seoKey: 'solutions', navKey: 'solutions', theme: 'dark' },
      },
      {
        path: 'products',
        name: 'products',
        component: () => import('@/views/Products/ProductsView.vue'),
        meta: { seoKey: 'products', navKey: 'products', theme: 'dark' },
      },
      {
        path: 'products/:slug',
        name: 'product-detail',
        component: () => import('@/views/Products/ProductDetailView.vue'),
        meta: { seoKey: 'products', navKey: 'products', theme: 'dark' },
      },
      {
        path: 'technology',
        name: 'technology',
        component: () => import('@/views/Technology/TechnologyView.vue'),
        meta: { seoKey: 'technology', navKey: 'technology', theme: 'dark' },
      },
      {
        path: 'insights',
        name: 'insights',
        component: () => import('@/views/Insights/InsightsView.vue'),
        meta: { seoKey: 'insights', navKey: 'insights', theme: 'dark' },
      },
      {
        path: 'insights/:slug',
        name: 'insight-detail',
        component: () => import('@/views/Insights/ArticleDetailView.vue'),
        meta: { seoKey: 'insights', navKey: 'insights', theme: 'dark' },
      },
      {
        path: 'contact',
        name: 'contact',
        component: () => import('@/views/Contact/ContactView.vue'),
        meta: { seoKey: 'contact', navKey: 'contact', theme: 'dark', hideCta: true },
      },
      {
        path: 'privacy',
        name: 'privacy',
        component: () => import('@/views/Legal/PrivacyView.vue'),
        meta: { seoKey: 'privacy', hideCta: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound/NotFoundView.vue'),
    meta: { seoKey: 'home' },
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
})

/**
 * 路由守卫：
 * 1. 缺少语言前缀的旧链接（如 /about）重定向到默认语言，保证 URL 规范统一。
 * 2. 每次进入路由时同步 Pinia 语言状态、Vue I18n locale 与 <html lang>。
 */
router.beforeEach((to) => {
  const firstSegment = to.path.split('/')[1] ?? ''

  if (to.path !== '/' && !isUrlLocale(firstSegment)) {
    return {
      path: `/${DEFAULT_URL_LOCALE}${to.path}`,
      query: to.query,
      hash: to.hash,
      replace: true,
    }
  }

  const locale = isUrlLocale(to.params.locale)
    ? to.params.locale
    : isUrlLocale(firstSegment) ? firstSegment : DEFAULT_URL_LOCALE
  const meta = findLocale(locale)

  useLocaleStore().setLocale(locale)
  i18n.global.locale.value = meta.code
  document.documentElement.lang = meta.htmlLang

  return true
})

export default router
