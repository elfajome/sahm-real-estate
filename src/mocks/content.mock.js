/**
 * TEMPORARY mock content endpoints — mirrors `contentService`
 * (src/services/content.service.js). Contact and newsletter submissions are
 * stored in the shared mock store so both forms stay fully testable.
 *
 * TODO(backend): replaced by `contentService` when the façade in
 * src/services/index.js is flipped to the real backend.
 */
import { readStore, writeStore } from './storage.mock.js'

export const mockContentService = {
  getAbout: () =>
    Promise.resolve({
      title: 'Sahm For Real Estate',
      description:
        'Temporary mock about content — the About page renders from static content until the backend is ready.',
    }),

  storeContact: (fields = {}) => {
    const list = readStore('contacts')
    list.push({ id: list.length + 1, ...fields, created_at: new Date().toISOString() })
    writeStore('contacts', list)
    return Promise.resolve({ success: true })
  },

  storeNewsletter: (email) => {
    const list = readStore('newsletter')
    if (!list.includes(email)) list.push(email)
    writeStore('newsletter', list)
    return Promise.resolve({ success: true })
  },
}
