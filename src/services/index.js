/**
 * Service façade — the ONLY switch between the temporary mock backend and
 * the real API. Every component imports its services from this file, so no
 * component ever knows whether data comes from mocks or the backend.
 *
 * TODO(backend): when the backend is available, restore the real exports:
 *
 *   export { authService } from './auth.service.js'
 *   export { listingsService } from './listings.service.js'
 *   export { userService } from './user.service.js'
 *   export { lookupsService } from './lookups.service.js'
 *   export { contentService } from './content.service.js'
 *   export { constructionsService } from './constructions.service.js'
 *
 * Interfaces and response shapes are identical — no component, UI, business
 * logic or routing changes are required.
 */
export { mockAuthService as authService } from '@/mocks/auth.mock.js'
export { mockListingsService as listingsService } from '@/mocks/properties.mock.js'
export { mockUserService as userService } from '@/mocks/user.mock.js'
export { mockLookupsService as lookupsService } from '@/mocks/lookups.mock.js'
export { mockContentService as contentService } from '@/mocks/content.mock.js'
export { mockConstructionsService as constructionsService } from '@/mocks/constructions.mock.js'
// Notifications & Messages — persisted mock chat backend following the
// Postman "chat" + `notifications` endpoints. TODO(backend): flip to
//   export { inboxService } from './inbox.service.js'
export { mockInboxService as inboxService } from '@/mocks/inbox.mock.js'
