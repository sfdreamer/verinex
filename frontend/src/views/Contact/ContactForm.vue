<script setup lang="ts">
/**
 * 联系表单（PRD 4.7，九字段）：
 * 姓名 / 公司名称 / 工作邮箱 / 联系电话 / 所属行业 / 合作方向 / 意向产品 / 需求描述 / 隐私政策同意。
 * - 行业、意向产品选项来自 /api/v1/industries、/api/v1/products
 * - 隐私政策版本取自 /api/v1/site/settings（服务端以数据库当前值为准）
 * - 前端校验 + POST /api/v1/contact；完整呈现成功、400 字段错误、429 限流与网络错误
 */
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  ApiError,
  fetchIndustries,
  fetchProducts,
  fetchSiteSettings,
  fetchSolutions,
  postContact,
} from '@/api'
import AsyncState from '@/components/common/AsyncState.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { useLocalePath } from '@/composables/useLocalePath'
import { useLocaleStore } from '@/stores/locale'

type FieldName =
  | 'name'
  | 'companyName'
  | 'email'
  | 'phone'
  | 'industry'
  | 'cooperationType'
  | 'targetProduct'
  | 'message'
  | 'privacyConsent'

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'rateLimited' | 'error'

const { t } = useI18n()
const localePath = useLocalePath()
const localeStore = useLocaleStore()

const optionsState = useAsyncData(async () => {
  const [industries, products, solutions, settings] = await Promise.all([
    fetchIndustries(),
    fetchProducts(),
    fetchSolutions(),
    fetchSiteSettings(),
  ])
  return { industries, products, solutions, settings }
})

const form = reactive({
  name: '',
  companyName: '',
  email: '',
  phone: '',
  industry: '',
  cooperationType: '',
  targetProduct: '',
  message: '',
  privacyConsent: false,
})

const errors = reactive<Partial<Record<FieldName, string>>>({})
const status = ref<SubmitStatus>('idle')
const submitMessage = ref('')
const submittedRef = ref<HTMLDivElement | null>(null)

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(): boolean {
  const next: Partial<Record<FieldName, string>> = {}
  const name = form.name.trim()
  const companyName = form.companyName.trim()
  const email = form.email.trim()
  const message = form.message.trim()

  if (name.length < 1 || name.length > 100) next.name = t('contactPage.form.errors.name')
  if (companyName.length < 1 || companyName.length > 160)
    next.companyName = t('contactPage.form.errors.companyName')
  if (email.length > 254 || !EMAIL_PATTERN.test(email))
    next.email = t('contactPage.form.errors.email')
  if (form.phone.trim().length > 40) next.phone = t('contactPage.form.errors.phone')
  if (!form.cooperationType) next.cooperationType = t('contactPage.form.errors.cooperationType')
  if (message.length < 1 || message.length > 5000)
    next.message = t('contactPage.form.errors.message')
  if (!form.privacyConsent) next.privacyConsent = t('contactPage.form.errors.privacyConsent')

  Object.keys(errors).forEach((key) => delete errors[key as FieldName])
  Object.assign(errors, next)

  if (Object.keys(next).length) {
    const first = document.getElementById(`contact-${Object.keys(next)[0]}`)
    first?.focus()
    return false
  }
  return true
}

const policyVersion = computed(
  () => optionsState.data.value?.settings.privacyPolicyVersion ?? '',
)

async function submit(): Promise<void> {
  if (status.value === 'submitting') return
  submitMessage.value = ''
  if (!validate()) return

  const version = policyVersion.value
  if (!version) {
    status.value = 'error'
    submitMessage.value = t('contactPage.form.error.body')
    return
  }

  status.value = 'submitting'
  try {
    await postContact({
      name: form.name.trim(),
      companyName: form.companyName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      industry: form.industry || undefined,
      cooperationType: form.cooperationType,
      targetProduct: form.targetProduct || undefined,
      message: form.message.trim(),
      locale: localeStore.contentLocale,
      privacyConsent: true,
      privacyPolicyVersion: version,
    })
    status.value = 'success'
    resetForm()
  } catch (error) {
    if (error instanceof ApiError && error.isRateLimited) {
      status.value = 'rateLimited'
      return
    }
    if (error instanceof ApiError && error.status === 400) {
      const fieldErrors = error.fieldErrors
      Object.entries(fieldErrors).forEach(([key, messages]) => {
        if (key in form && key !== 'privacyConsent') {
          errors[key as FieldName] = messages[0] ?? ''
        }
      })
      if (fieldErrors.privacyConsent) errors.privacyConsent = fieldErrors.privacyConsent[0]
      if (fieldErrors.privacyPolicyVersion) {
        submitMessage.value = fieldErrors.privacyPolicyVersion[0] ?? ''
      }
      status.value = 'error'
      return
    }
    status.value = 'error'
  }
}

function resetForm(): void {
  form.name = ''
  form.companyName = ''
  form.email = ''
  form.phone = ''
  form.industry = ''
  form.cooperationType = ''
  form.targetProduct = ''
  form.message = ''
  form.privacyConsent = false
  Object.keys(errors).forEach((key) => delete errors[key as FieldName])
}

function submitAnother(): void {
  status.value = 'idle'
  submitMessage.value = ''
  submittedRef.value?.focus()
}
</script>

<template>
  <div class="contact-card">
    <AsyncState
      :pending="optionsState.pending.value"
      :error="optionsState.error.value"
      :skeleton-rows="4"
      @retry="optionsState.reload"
    >
      <div v-if="optionsState.data.value" class="contact-card__inner">
        <div v-if="status === 'success'" ref="submittedRef" class="contact-success" tabindex="-1">
          <p class="contact-success__title">{{ t('contactPage.form.success.title') }}</p>
          <p class="contact-success__body">{{ t('contactPage.form.success.body') }}</p>
          <button type="button" class="contact-success__again" @click="submitAnother">
            {{ t('contactPage.form.success.again') }}
          </button>
        </div>

        <form v-else class="contact-form" novalidate @submit.prevent="submit">
          <div class="contact-form__head">
            <h2 class="contact-form__title">{{ t('contactPage.form.title') }}</h2>
            <p class="contact-form__hint">{{ t('contactPage.form.subtitle') }}</p>
          </div>

          <div class="contact-form__grid">
            <div class="field">
              <label class="field__label" for="contact-name">
                {{ t('contactPage.form.fields.name.label') }} <span aria-hidden="true">*</span>
              </label>
              <input
                id="contact-name"
                v-model="form.name"
                class="field__control"
                type="text"
                maxlength="100"
                autocomplete="name"
                :placeholder="t('contactPage.form.fields.name.placeholder')"
                :aria-invalid="!!errors.name"
                :aria-describedby="errors.name ? 'contact-name-error' : undefined"
              />
              <p v-if="errors.name" id="contact-name-error" class="field__error">{{ errors.name }}</p>
            </div>

            <div class="field">
              <label class="field__label" for="contact-company">
                {{ t('contactPage.form.fields.companyName.label') }}
                <span aria-hidden="true">*</span>
              </label>
              <input
                id="contact-company"
                v-model="form.companyName"
                class="field__control"
                type="text"
                maxlength="160"
                autocomplete="organization"
                :placeholder="t('contactPage.form.fields.companyName.placeholder')"
                :aria-invalid="!!errors.companyName"
                :aria-describedby="errors.companyName ? 'contact-company-error' : undefined"
              />
              <p v-if="errors.companyName" id="contact-company-error" class="field__error">
                {{ errors.companyName }}
              </p>
            </div>

            <div class="field">
              <label class="field__label" for="contact-email">
                {{ t('contactPage.form.fields.email.label') }} <span aria-hidden="true">*</span>
              </label>
              <input
                id="contact-email"
                v-model="form.email"
                class="field__control"
                type="email"
                maxlength="254"
                autocomplete="email"
                :placeholder="t('contactPage.form.fields.email.placeholder')"
                :aria-invalid="!!errors.email"
                :aria-describedby="errors.email ? 'contact-email-error' : undefined"
              />
              <p v-if="errors.email" id="contact-email-error" class="field__error">
                {{ errors.email }}
              </p>
            </div>

            <div class="field">
              <label class="field__label" for="contact-phone">
                {{ t('contactPage.form.fields.phone.label') }}
                <span class="field__optional">{{ t('contactPage.form.optional') }}</span>
              </label>
              <input
                id="contact-phone"
                v-model="form.phone"
                class="field__control"
                type="tel"
                maxlength="40"
                autocomplete="tel"
                :placeholder="t('contactPage.form.fields.phone.placeholder')"
                :aria-invalid="!!errors.phone"
                :aria-describedby="errors.phone ? 'contact-phone-error' : undefined"
              />
              <p v-if="errors.phone" id="contact-phone-error" class="field__error">
                {{ errors.phone }}
              </p>
            </div>

            <div class="field">
              <label class="field__label" for="contact-industry">
                {{ t('contactPage.form.fields.industry.label') }}
                <span class="field__optional">{{ t('contactPage.form.optional') }}</span>
              </label>
              <select id="contact-industry" v-model="form.industry" class="field__control">
                <option value="">{{ t('contactPage.form.fields.industry.placeholder') }}</option>
                <option
                  v-for="industry in optionsState.data.value.industries"
                  :key="industry.code"
                  :value="industry.code"
                >
                  {{ industry.title }}
                </option>
              </select>
            </div>

            <div class="field">
              <label class="field__label" for="contact-cooperation">
                {{ t('contactPage.form.fields.cooperationType.label') }}
                <span aria-hidden="true">*</span>
              </label>
              <select
                id="contact-cooperation"
                v-model="form.cooperationType"
                class="field__control"
                :aria-invalid="!!errors.cooperationType"
                :aria-describedby="errors.cooperationType ? 'contact-cooperation-error' : undefined"
              >
                <option value="">{{ t('contactPage.form.fields.cooperationType.placeholder') }}</option>
                <option
                  v-for="solution in optionsState.data.value.solutions"
                  :key="solution.code"
                  :value="solution.code"
                >
                  {{ solution.title }}
                </option>
              </select>
              <p v-if="errors.cooperationType" id="contact-cooperation-error" class="field__error">
                {{ errors.cooperationType }}
              </p>
            </div>

            <div class="field field--wide">
              <label class="field__label" for="contact-product">
                {{ t('contactPage.form.fields.targetProduct.label') }}
                <span class="field__optional">{{ t('contactPage.form.optional') }}</span>
              </label>
              <select id="contact-product" v-model="form.targetProduct" class="field__control">
                <option value="">{{ t('contactPage.form.fields.targetProduct.placeholder') }}</option>
                <option value="unsure">{{ t('contactPage.form.unsure') }}</option>
                <option
                  v-for="product in optionsState.data.value.products"
                  :key="product.code"
                  :value="product.code"
                >
                  {{ product.name }}
                </option>
              </select>
            </div>

            <div class="field field--wide">
              <label class="field__label" for="contact-message">
                {{ t('contactPage.form.fields.message.label') }} <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="contact-message"
                v-model="form.message"
                class="field__control field__control--textarea"
                rows="5"
                maxlength="5000"
                :placeholder="t('contactPage.form.fields.message.placeholder')"
                :aria-invalid="!!errors.message"
                :aria-describedby="errors.message ? 'contact-message-error' : undefined"
              />
              <p v-if="errors.message" id="contact-message-error" class="field__error">
                {{ errors.message }}
              </p>
            </div>
          </div>

          <div class="contact-form__consent">
            <label class="checkbox" for="contact-consent">
              <input
                id="contact-consent"
                v-model="form.privacyConsent"
                type="checkbox"
                :aria-invalid="!!errors.privacyConsent"
                :aria-describedby="errors.privacyConsent ? 'contact-consent-error' : undefined"
              />
              <span>
                {{ t('contactPage.form.privacy.prefix') }}
                <RouterLink :to="localePath('privacy')" class="checkbox__link">
                  {{ t('contactPage.form.privacy.link') }}
                </RouterLink>
                {{ t('contactPage.form.privacy.suffix') }}
              </span>
            </label>
            <p v-if="errors.privacyConsent" id="contact-consent-error" class="field__error">
              {{ errors.privacyConsent }}
            </p>
          </div>

          <p v-if="status === 'rateLimited'" class="contact-form__notice" role="alert">
            <strong>{{ t('contactPage.form.rateLimited.title') }}</strong>
            {{ t('contactPage.form.rateLimited.body') }}
          </p>
          <p v-else-if="status === 'error'" class="contact-form__notice" role="alert">
            <strong>{{ t('contactPage.form.error.title') }}</strong>
            {{ submitMessage || t('contactPage.form.error.body') }}
          </p>

          <BaseButton type="submit" size="lg" :disabled="status === 'submitting'">
            {{ status === 'submitting' ? t('contactPage.form.submitting') : t('contactPage.form.submit') }}
          </BaseButton>

          <p class="contact-form__fallback">
            {{ t('contactPage.hero.emailLabel') }}:
            <a :href="`mailto:${optionsState.data.value.settings.contactEmail ?? 'business@verinex.ai'}`">
              {{ optionsState.data.value.settings.contactEmail ?? 'business@verinex.ai' }}
            </a>
          </p>
        </form>
      </div>
    </AsyncState>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/breakpoints' as *;

.contact-card {
  position: relative;
  padding: var(--vn-space-6);
  border: 1px solid rgba(143, 168, 196, 0.16);
  border-radius: 6px;
  background: var(--vn-secondary);
  box-shadow: none;

  @include below-tablet {
    padding: var(--vn-space-4);
  }
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: var(--vn-space-5);
  padding: var(--vn-space-4);

  &__title {
    font-size: var(--vn-fs-h3);
    color: var(--vn-text-inverse);
  }

  &__hint {
    margin-top: 0.375rem;
    font-size: 13px;
    color: var(--vn-text-inverse-muted);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--vn-space-4);

    @include below-tablet {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__consent {
    font-size: 13px;
    color: var(--vn-text-inverse-secondary);
  }

  &__notice {
    padding: var(--vn-space-3) var(--vn-space-4);
    border: 1px solid rgba(229, 72, 77, 0.45);
    border-radius: var(--vn-radius-sm);
    background: rgba(229, 72, 77, 0.12);
    font-size: 13px;
    line-height: 1.7;
    color: #ffd7d7;

    strong {
      display: block;
      font-weight: var(--vn-fw-semibold);
      color: #fff;
    }
  }

  &__fallback {
    font-size: 13px;
    color: var(--vn-text-inverse-muted);

    a {
      color: var(--vn-accent);
    }
  }
}

.contact-success {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: var(--vn-space-10) var(--vn-space-6);
  text-align: center;

  &__title {
    font-size: var(--vn-fs-h3);
    color: var(--vn-text-inverse);
  }

  &__body {
    font-size: 15px;
    color: var(--vn-text-inverse-secondary);
  }

  &__again {
    align-self: center;
    margin-top: 0.75rem;
    padding: 0.5rem 1.25rem;
    border: 1px solid rgba(143, 168, 196, 0.35);
    border-radius: var(--vn-radius-sm);
    background: transparent;
    color: var(--vn-text-inverse);
    font-size: 15px;
    cursor: pointer;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  &--wide {
    grid-column: 1 / -1;
  }

  &__label {
    font-size: 13px;
    font-weight: var(--vn-fw-medium);
    color: var(--vn-text-inverse-secondary);
  }

  &__optional {
    margin-left: 0.375rem;
    color: var(--vn-text-inverse-muted);
    font-weight: var(--vn-fw-regular);
  }

  &__control {
    width: 100%;
    padding: 0.6875rem 0.875rem;
    border: 1px solid rgba(143, 168, 196, 0.24);
    border-radius: var(--vn-radius-sm);
    background: rgba(7, 20, 38, 0.6);
    font-family: inherit;
    font-size: 16px;
    color: var(--vn-text-inverse);
    transition:
      border-color var(--vn-duration) var(--vn-ease-out),
      background var(--vn-duration) var(--vn-ease-out);

    &::placeholder {
      color: var(--vn-text-inverse-muted);
      opacity: 1;
    }

    &:hover {
      border-color: rgba(143, 168, 196, 0.4);
    }

    &:focus-visible {
      outline: 2px solid var(--vn-accent);
      outline-offset: 1px;
      border-color: var(--vn-accent);
    }

    &[aria-invalid='true'] {
      border-color: rgba(229, 72, 77, 0.7);
    }

    &--textarea {
      resize: vertical;
      min-height: 8rem;
    }
  }

  &__error {
    font-size: 13px;
    color: #ffb4b6;
  }
}

.checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  line-height: 1.7;
  cursor: pointer;

  input {
    margin-top: 0.2rem;
    width: 1rem;
    height: 1rem;
    accent-color: var(--vn-link);
  }

  &__link {
    color: var(--vn-accent);
    text-decoration: underline;
  }
}
</style>
