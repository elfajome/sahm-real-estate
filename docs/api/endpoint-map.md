# API Endpoint Map

Backend API → service module mapping.  
Source: the backend API collection (maintained privately by the team — not committed to the repository).

**Base URL:** `VITE_API_BASE_URL`

**Auth:** `Authorization: Bearer <token>` — token from login response, stored in `localStorage` (`sahm_token`).

---

## Auth — `src/services/auth.service.js`

| Endpoint | Method | Body | Used in |
|----------|--------|------|---------|
| `register` | POST | formdata | RegisterPage |
| `login` | POST | `email`, `password` | LoginPage → returns JWT |
| `logout` | POST | — | AuthenticatedTopBar |
| `profile` | GET | — | ProfileInfoPage |
| `update/profile` | POST | formdata + optional `image` | ProfileInfoPage |
| `user_types` | GET | — | RegisterForm |
| `construction_types` | GET | — | RegisterForm, ConstructionForm |

---

## Main info

| Endpoint | Method | Used in | Notes |
|----------|--------|---------|-------|
| `areas` | GET | Register, filters, forms | |
| `about` | GET | Home, AboutPage | |
| `common_question` | GET | **FAQ only if not static** — see OPEN-01 | |
| `store-contact` | POST | ContactPage | |
| `store-newsletter` | POST | Footer | |
| `setting` | GET | — | **Not used for page content in v1** |

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

### User aqars

| Endpoint | Method | Used in |
|----------|--------|---------|
| `user/aqars` | GET | MyListingsPage |
| `store/aqar` | POST | CreatePropertyPage |
| `update/aqar` | POST | EditPropertyPage |
| `delete/aqar` | POST | MyListingsPage |

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

---

## Related

- [decisions.md](../architecture/decisions.md)
- [folder-structure.md](../architecture/folder-structure.md)
