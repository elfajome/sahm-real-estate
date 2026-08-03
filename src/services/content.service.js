import { apiClient } from './apiClient.js'
import { buildFormData } from '@/utils/buildFormData.js'

export const contentService = {
  getAbout: () => apiClient.get('about'),

  storeContact: (fields) => apiClient.postForm('store-contact', buildFormData(fields)),

  storeNewsletter: (email) =>
    apiClient.postForm('store-newsletter', buildFormData({ email })),

  // Not wired to any page yet (ADR decisions.md D-03: not used for page
  // content in v1) — available so the façade covers the full Postman contract.
  getSetting: () => apiClient.get('setting'),

  // FAQ source is still an open product decision (ADR decisions.md OPEN-01:
  // static vs API-driven) — FaqPage stays on static content until answered.
  getFaq: () => apiClient.get('common_question'),

  // No onboarding/boarding screens in this web app — available for parity
  // with the Postman collection only.
  getBoarding: () => apiClient.get('boarding'),
}
