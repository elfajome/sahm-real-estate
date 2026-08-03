# API Endpoint Map

Backend API → service module mapping.  
Source: the backend API collection (maintained privately by the team — not committed to the repository).

**Base URL:** `VITE_API_BASE_URL`

**Auth:** `Authorization: Bearer <token>` — token from login response, stored in `localStorage` (`sahm_token`).

---

## Auth — `src/services/auth.service.js`

| Endpoint | Method | Body | Used in |
|----------|--------|------|---------|
| `register` | POST | formdata — `name`, `email`, `type`, `area_id`, `password`, `password_confirmation`, `construction_type[0]` (conditional) | RegisterPage |
| `login` | POST | `email`, `password` | LoginPage → returns JWT |
| `logout` | POST | — | AuthenticatedTopBar |
| `profile` | GET | — | ProfileInfoPage |
| `update/profile` | POST | formdata — `name`, `email`, `area_id`, `photo_profile` (file) + `_method=put` (Laravel method-spoofing) | ProfileInfoPage |
| `change/password` | PUT | query string — `current_password`, `password`, `password_confirmation` | ProfileInfoPage (current-password field) |
| `is_notify` | POST | `is_notify` (0/1) | Service available (`authService.setNotify`) — no toggle UI yet |
| `user_types` | GET | — | RegisterForm |
| `construction_types` | GET | — | RegisterForm, ConstructionForm |

> **Register `phone` field:** collected in the UI (L-15) but never forwarded to
> `register` — enforced by an explicit field allowlist in `auth.service.js`
> (`REGISTER_FIELDS`), not just by convention, so a future caller mistake can't
> leak it to the real backend.
>
> **`update/profile` never carries password fields.** `ProfileInfoPage` calls
> `authService.changePassword()` separately when the user fills in a new
> password; `updateProfile()` is allowlisted to `name`/`email`/`area_id`/`photo_profile`
> only, matching the Postman `update_profile` sample exactly.

---

## Main info

| Endpoint | Method | Used in | Notes |
|----------|--------|---------|-------|
| `areas` | GET | Register, filters, forms | |
| `area/:id` | GET | Service available (`lookupsService.getAreaChildren`) | **No hierarchy UI** — the 2-area demo dataset has no parent/child relation |
| `about` | GET | Home, AboutPage | |
| `common_question` | GET | Service available (`contentService.getFaq`) — **FAQ stays static**, see OPEN-01 (still open) | |
| `store-contact` | POST | ContactPage | |
| `store-newsletter` | POST | Footer | |
| `setting` | GET | Service available (`contentService.getSetting`) | **Not used for page content in v1** (D-03, unchanged) |
| `boarding` | GET | Service available (`contentService.getBoarding`) | No onboarding screens in this web app |

---

## Static pages (no API for body content)

| Page | Content source |
|------|----------------|
| `/help` | `src/content/pages.js` → `helpContent` |
| `/privacy` | `src/content/pages.js` → `privacyContent` |
| `/terms` | `src/content/pages.js` → `termsContent` |
| `/blacklist-reasons` | `src/content/pages.js` → `blacklistContent` |

---

## Aqars — `src/services/listings.service.js`

### List & detail

| Endpoint | Method | Query | Used in |
|----------|--------|-------|---------|
| `aqars` | GET | `search`, `aqar_type`, `area_id`, `aqar_status`, `from_price`, `to_price`, `pin` | Listings, Home |
| `aqar/:id` | GET | — | PropertyDetailPage |
| `aqar_status` | GET | — | Services, FilterTabs |
| `aqar_types` | GET | — | Filters, create form |
| `owner/:id` | GET | Service available (`listingsService.getOwner`) — not called; the `aqar`/`aqars` payload already embeds the owner (`user`) object | |

### User aqars

| Endpoint | Method | Used in |
|----------|--------|---------|
| `user/aqars` | GET | MyListingsPage |
| `store/aqar` | POST | CreatePropertyPage |
| `update/aqar` | POST | EditPropertyPage |
| `update/aqar` (images) | — | EditPropertyPage shows the listing's existing images and removes one via `delete_image` immediately on click; new files upload with the rest of `update/aqar` on submit |
| `delete/aqar` | **DELETE** — `post_id` in the **query string** (verified against `resources/sahm.postman_collection.json`; previously mis-documented here as POST+body, code has been corrected to match) | MyListingsPage |
| `delete_image` | **DELETE** — `post_id` + `image_id` in the query string | EditPropertyPage (remove existing image) |

### Actions

| Endpoint | Method | Used in |
|----------|--------|---------|
| `buy_now` | POST | BuyNowButton |
| `purchases` | GET | Purchases, Invoices |
| `toggle_fav` / `favourites` | POST / GET | PropertyCard, Favorites |
| `toggle_compare` / `compares` | POST / GET | PropertyCard, Compare |
| `store_comment` | POST | ReviewForm |

### Store aqar — conditional "More" fields (supersedes L-25)

**Approved Real Estate types** (the ONLY types offered anywhere in the app —
forms, filters, search): Villa — فيلا, Tower — برج, Palace — قصر,
Agricultural Land — أرض زراعية, Company — شركة, Apartment — شقة.

Centralized configuration: [`src/constants/realEstateTypes.js`](../../src/constants/realEstateTypes.js) —
single source for the approved types, the Postman field mapping and the
conditional matrix. The mock `aqar_types` lookup derives from it; at runtime
the conditional behavior is resolved by canonical lookup `name`, so real
backend ids are preserved when the service façade flips.

**Conditional field matrix** (UI visibility/required per selected type;
Content = `description`, Price = `price` are always required):

| Postman field | Villa | Tower | Palace | Agricultural Land | Company | Apartment |
|---|---|---|---|---|---|---|
| `space` (Area) | Hidden | Hidden | Required | Optional | Hidden | Hidden |
| `floor` | Hidden | Optional | Optional | Hidden | Hidden | Hidden |
| `room_no` | Required | Required | Required | Hidden | Hidden | Hidden |
| `hall_no` | Hidden | Hidden | Required | Hidden | Hidden | Hidden |
| `bathroom_no` | Hidden | Hidden | Required | Hidden | Hidden | Hidden |
| `garage_no` | Hidden | Hidden | Required | Hidden | Hidden | Hidden |
| `street_no` (Facades) | Hidden | Hidden | Required | Required | Hidden | Hidden |
| `nature_id` (Nature) | Hidden | Hidden | Required | Hidden | Hidden | Hidden |

Hidden fields are NOT rendered and are submitted with backend-safe defaults
(`0`) — never with stale values from a previously selected type. Validation
(Zod) is built from the same matrix, so indicators and rules never diverge.

`nature_id` values come from the `aqar_natures` lookup (GET, in Postman —
no sample values yet; the mock ships placeholder Residential/Commercial).

Remaining hidden defaults with no UI control: `fees` → `0`; `lat`/`lng` → `0`
unless the map provides them.

**Construction form note:** the conditional matrix applies to Add Real
Estate only. The Add Construction Request form keeps its original layout and
its own contract — `store/construction` accepts ONLY `title`, `description`,
`space`, `construction_type`, `area_id`, `images[]` (`space` always
required). The construction API has no Real Estate type / conditional
fields — revisit if the backend extends the contract.

---

## Constructions — `src/services/constructions.service.js`

| Endpoint | Method | Used in |
|----------|--------|---------|
| `user/constructions` | GET | **RequestsPage** (`/profile/requests`) |
| `store/construction` | POST | CreateConstructionPage |
| `constructions` | GET | **Deferred** — no public listing v1 |
| `construction/:id` | GET | future |

> **Company-side endpoints out of scope:** the Postman collection also
> defines `update/construction`, `delete/construction`, `update/offer/status`,
> `store/construction/offer` and `company/constructions`. This frontend has no
> "company" role or dashboard (no such pages exist), so these are **not**
> implemented — building them would be a separate, product-approved epic, not
> a gap in the current user-side app.

---

## Verification log

| Date | What was checked | Result |
|------|-------------------|--------|
| 2026-08-03 | Full diff of every real `*.service.js` against `resources/sahm.postman_collection.json` | Found and fixed: `delete/aqar` wrong method (POST+body → DELETE+query), `update/profile` missing `_method=put`, `register` sending an undocumented `phone` field (violated L-15). Added previously-missing endpoints: `change/password` (now wired into ProfileInfoPage), `delete_image` (now wired into EditPropertyPage's image manager), `is_notify`, `area/:id`, `owner/:id`, `setting`, `common_question`, `boarding` (added to the service façade; not wired to UI where no product decision authorizes it — see OPEN-01). Mocks were updated in lockstep so the demo experience is unaffected. |

---

## Related

- [decisions.md](../architecture/decisions.md)
- [folder-structure.md](../architecture/folder-structure.md)
