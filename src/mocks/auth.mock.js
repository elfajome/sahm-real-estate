/**
 * TEMPORARY mock authentication — mirrors `authService`
 * (src/services/auth.service.js) method-for-method and shape-for-shape:
 *
 *   login({ email, password })  → { user, token }
 *   register(fields)            → { user }
 *   logout()                    → resolves
 *   getProfile()                → user (resolved from the SAME stored token)
 *   updateProfile(fields)       → updated user
 *
 * The session is stored exactly as the real implementation expects: the
 * Redux auth slice saves the returned token through the shared `apiClient`
 * helpers (`sahm_token` in localStorage), and this mock resolves the current
 * user from that token — so hydration, Protected Routes and the whole
 * authentication state flow work completely unchanged.
 *
 * Failures are thrown as `ApiError` with status 401, exactly like the real
 * client, so `hydrateAuth`'s expired-session handling keeps working.
 *
 * Demo accounts:
 *   Admin        → admin@sahm.sa / admin123
 *   Regular user → user@sahm.sa  / user123
 *
 * TODO(backend): replaced by `authService` when the façade in
 * src/services/index.js is flipped to the real backend. Nothing else changes.
 */
import { ApiError } from '@/services/ApiError.js'
import { getToken } from '@/services/apiClient.js'
import { readStore, writeStore } from './storage.mock.js'
import { areas, userTypes } from './lookups.mock.js'

// ---------------------------------------------------------------------------
// Demo accounts — same user schema as the backend `profile` response.
// user_type always comes from the shared `userTypes` lookup collection.
// ---------------------------------------------------------------------------
const DEMO_ACCOUNTS = [
  {
    password: 'admin123',
    user: {
      id: 1,
      name: 'Sahm Admin',
      email: 'admin@sahm.sa',
      phone: '0500000001',
      type: 'admin',
      user_type: userTypes[1],
      area: areas[0],
      image: null,
    },
  },
  {
    password: 'user123',
    user: {
      id: 2,
      name: 'Demo User',
      email: 'user@sahm.sa',
      phone: '0500000002',
      type: 'user',
      user_type: userTypes[0],
      area: areas[1],
      image: null,
    },
  },
]

// Accounts created through register() — persisted in the shared mock store so
// the auto-login session created right after registration survives reloads.
const registeredAccounts = readStore('accounts', [])

const allAccounts = () => [...DEMO_ACCOUNTS, ...registeredAccounts]

// ---------------------------------------------------------------------------
// Token helpers — the token encodes the user id so getProfile() can resolve
// the current user from the stored session, like the backend does with a JWT.
// ---------------------------------------------------------------------------
const TOKEN_PREFIX = 'mock-token'

const makeToken = (userId) =>
  `${TOKEN_PREFIX}.${userId}.${Math.random().toString(36).slice(2)}`

const userIdFromToken = (token) => {
  if (typeof token !== 'string' || !token.startsWith(`${TOKEN_PREFIX}.`)) return null
  const id = Number(token.split('.')[1])
  return Number.isFinite(id) ? id : null
}

const currentAccount = () => {
  const id = userIdFromToken(getToken())
  return allAccounts().find((account) => account.user.id === id) ?? null
}

// ---------------------------------------------------------------------------
// Profile overrides — persisted in the shared mock store so updateProfile()
// changes survive page reloads without touching the demo account definitions.
// ---------------------------------------------------------------------------
const readOverrides = () => readStore('profiles', {})

const writeOverride = (userId, patch) => {
  const overrides = readOverrides()
  overrides[userId] = { ...overrides[userId], ...patch }
  writeStore('profiles', overrides)
  return overrides[userId]
}

const withOverrides = (user) => ({ ...user, ...readOverrides()[user.id] })

// A changed password lives in the same overrides store, keyed by user id —
// never mutates the DEMO_ACCOUNTS/registeredAccounts password directly.
const activePassword = (account) => readOverrides()[account.user.id]?.password ?? account.password

/**
 * Current logged-in mock user (with profile overrides) or null — shared with
 * the other mock services (comment author, created listings owner, …).
 */
export const getCurrentMockUser = () => {
  const account = currentAccount()
  return account ? withOverrides(account.user) : null
}

// ---------------------------------------------------------------------------
// Service — same method names / return shapes as `authService`.
// ---------------------------------------------------------------------------
export const mockAuthService = {
  login: ({ email, password }) => {
    const account = allAccounts().find(
      (a) =>
        a.user.email.toLowerCase() === String(email ?? '').toLowerCase().trim() &&
        activePassword(a) === password,
    )
    if (!account) return Promise.reject(new ApiError(401, 'Invalid email or password'))
    return Promise.resolve({
      user: withOverrides(account.user),
      token: makeToken(account.user.id),
    })
  },

  register: (fields = {}) => {
    const email = String(fields.email ?? '').toLowerCase().trim()
    if (allAccounts().some((a) => a.user.email.toLowerCase() === email)) {
      return Promise.reject(new ApiError(422, 'Email already taken'))
    }
    const user = {
      id: 1000 + registeredAccounts.length + 1,
      name: fields.name ?? 'New User',
      email,
      phone: fields.phone ?? '',
      type: 'user',
      user_type: userTypes.find((ut) => String(ut.id) === String(fields.type)) ?? userTypes[0],
      area: areas.find((a) => String(a.id) === String(fields.area_id)) ?? null,
      image: null,
    }
    registeredAccounts.push({ password: fields.password, user })
    writeStore('accounts', registeredAccounts)
    return Promise.resolve({ user })
  },

  logout: () => Promise.resolve(),

  getProfile: () => {
    const account = currentAccount()
    if (!account) return Promise.reject(new ApiError(401, 'Unauthenticated'))
    return Promise.resolve(withOverrides(account.user))
  },

  updateProfile: (fields = {}) => {
    const account = currentAccount()
    if (!account) return Promise.reject(new ApiError(401, 'Unauthenticated'))
    const patch = {}
    if (fields.name) patch.name = fields.name
    if (fields.email) patch.email = fields.email
    return Promise.resolve({ ...account.user, ...writeOverride(account.user.id, patch) })
  },

  // Mirrors the real `change/password` contract: verifies `current_password`
  // against the active (possibly already-overridden) password.
  changePassword: ({ current_password, password, password_confirmation } = {}) => {
    const account = currentAccount()
    if (!account) return Promise.reject(new ApiError(401, 'Unauthenticated'))
    if (current_password !== activePassword(account)) {
      return Promise.reject(
        new ApiError(422, 'Current password is incorrect', { current_password: ['invalid'] }),
      )
    }
    if (!password || password !== password_confirmation) {
      return Promise.reject(
        new ApiError(422, 'Password confirmation does not match', {
          password_confirmation: ['mismatch'],
        }),
      )
    }
    writeOverride(account.user.id, { password })
    return Promise.resolve({ success: true })
  },

  // No dedicated preference storage in the mock — resolves like the real
  // `is_notify` endpoint (fire-and-forget, no meaningful response body).
  setNotify: () => Promise.resolve({ success: true }),
}
