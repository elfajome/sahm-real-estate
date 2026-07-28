# Architecture Decision Record (ADR)

Locked product and technical choices for Sahm Real Estate Frontend.  
**Change a locked item only after updating this file and affected guides.**

---

## Status legend

| Tag | Meaning |
|-----|---------|
| **LOCKED** | Confirmed by product owner |
| **DEFAULT** | Assumed until overridden |
| **OPEN** | Needs answer before implementation |

---

## LOCKED — Product & UI

| ID | Topic | Decision |
|----|-------|----------|
| L-01 | Buy CTA on property detail | Label **"اشتري الآن"** — `POST /buy_now` with `post_id` |
| L-02 | Buy CTA after login | Text **does not change** after authentication |
| L-03 | Register `construction_type` | **Conditional** — shown when selected `user_type.construction_type_required` |
| L-04 | Service cards / Filter tabs (بيع/إيجار/أرض) | Navigate to `/real-estates?aqar_status={id}` |
| L-05 | Filter tab / card **مقاولات** | Navigate to **`/constructions/create`** (protected — login redirect if guest) |
| L-06 | Filter tab active state | Full **teal background**, white text/icon |
| L-07 | PropertyCard hover | Fav + Compare + Share overlay with green Toast |
| L-08 | FAQ vs Help | **Help** = static content (flat list UI). **FAQ** = see OPEN-01 |
| L-09 | Privacy + Terms | **Static content** in frontend — not from `GET /setting` |
| L-10 | About page | Dynamic from **`GET /about`** |
| L-11 | Contact form | **`POST /store-contact`** |
| L-12 | Invoice detail | **Inline expand** on `/profile/invoices` — no modal/route |
| L-13 | Mobile search drawer | **Tablet + Mobile only** — hidden on desktop |
| L-14 | Forgot password | **Deferred** — link is placeholder, no page/API |
| L-15 | Register phone field | UI shown — **not sent to API** until backend adds field |
| L-16 | Areas dropdown | Dynamic from `GET /areas` — never hardcoded |
| L-17 | Listings filter sidebar RTL | Filters on **right** in RTL, **left** in LTR |
| L-18 | Profile sidebar | 7 items + logout; active = gray bg + blue end border |
| L-19 | Auth pages shell | Login & Register use **full MainLayout** (GuestTopBar + Navbar + Footer) |
| L-20 | Blacklist page | **Static content** in frontend |
| L-21 | Query params for listings | `search`, `aqar_type`, `area_id`, `aqar_status`, `from_price`, `to_price`, `pin` |
| L-22 | Top bar on all public pages | **Same shell everywhere** — `GuestTopBar` + Navbar. **No** separate Home social bar |
| L-23 | طلبات vs مشترياتي | **طلبات** = `GET /user/constructions` only. **مشترياتي** = purchases endpoints — separate features |
| L-24 | Public constructions listing | **Postponed** — no `/constructions` route in v1 |
| L-25 | Add property form scope | **UI design fields only** + backend-required hidden defaults where necessary |
| L-26 | Currency | **`$`** — same as mockups |
| L-27 | Google Maps | **No key yet** — `VITE_GOOGLE_MAPS_API_KEY` in `.env`; enable picker/embed when provided |

---

## LOCKED — Auth & security

| ID | Topic | Decision |
|----|-------|----------|
| A-01 | Auth mechanism | **JWT Bearer** — `Authorization: Bearer <token>` on authenticated requests |
| A-02 | Token storage | **`localStorage`** after login (key: `sahm_token`) — product owner choice |
| A-03 | Token on app init | Read `localStorage` → hydrate Redux + `apiClient.setToken()` |
| A-04 | 401 handling | Clear token from memory + localStorage → redirect login with `returnUrl` |
| A-05 | Auth header | Never send Bearer on public endpoints unless token exists |

> **Note:** Storing JWT in `localStorage` increases XSS risk. Acceptable per product decision; still avoid `dangerouslySetInnerHTML` and sanitize rich HTML.

---

## DEFAULT — Implementation assumptions

| ID | Topic | Default |
|----|-------|---------|
| D-01 | ContactInfoCard | **Static** in i18n/content files (matches mockup) — not from `GET /setting` |
| D-02 | Newsletter footer | Wire to `POST /store-newsletter` |
| D-03 | `GET /setting` | **Not used** in v1 for page content |
| D-04 | Purchases card click | Navigates to `/real-estates/:id` |
| D-05 | Favorites card click | Navigates to `/real-estates/:id` |
| D-06 | Buy now as guest | Redirect to `/auth/login?returnUrl=…` |
| D-07 | Review form | Requires login; guest → redirect login |
| D-08 | Share button | `navigator.share` when available, else copy link + Toast |
| D-09 | List/Grid toggle | **Hidden** until list design exists |
| D-10 | Compare max items | **4** properties |
| D-11 | `/profile/listings` | Grid of `PropertyCard` + Edit + Delete |
| D-12 | Edit property | `/real-estates/:id/edit` reuses create form |
| D-13 | `/profile/requests` | Card list from `GET /user/constructions` |
| D-14 | Maps without API key | Address text field only; skip lat/lng or send `0` defaults |
| D-15 | Default locale | **`ar`** |
| D-16 | `Lang` header | On every API request from active locale |
| D-17 | Notifications + Chat | Disabled UI until wired |
| D-18 | Navbar "إضافة عقار" | Guest → login → `/real-estates/create` |
| D-19 | Login token field | Assume response field `token` or `access_token` — verify on first integration (OPEN-02) |

---

## OPEN — Remaining clarifications

| # | Question | Impact |
|---|----------|--------|
| **OPEN-01** | **FAQ** (`/faq`): static like Help, or **`GET /common_question`** with Accordion? | faq feature |
| **OPEN-02** | Login JSON: exact token field name (`token`, `access_token`, `data.token`)? | authApi parsing |
| **OPEN-03** | **ContactInfoCard** (email, phones, address): static in code or from another API? | contact page |

---

## Rejected / out of scope

| Topic | Decision |
|-------|----------|
| RTK Query | **Not used** |
| httpOnly cookie auth (v1) | **Not used** — Bearer + localStorage |
| `SocialTopBar` / `HomeLayout` | **Removed** — unified `MainLayout` |
| Public `/constructions` listing | **Postponed** |
| Forgot password page | **Not in v1** |
| Extra create-form fields beyond design | **Not added** |
| Feature-Driven Monolith (`src/features/`) | **Replaced** by Layer-Based structure (2026-07-15) |
| `components → pages` imports | **Forbidden** |
| Raw `fetch` in components | **Forbidden** |

---

## Change log

| Date | Change |
|------|--------|
| 2026-07-14 | Initial ADR |
| 2026-07-14 | Product owner locked O-01–O-08; unified top bar; static legal/help; localStorage JWT; postponed public constructions |
| 2026-07-15 | **Architecture changed:** Feature-Driven Monolith → **Layer-Based** (`pages / components / services / store / hooks / utils`). See [overview.md](./overview.md) and [folder-structure.md](./folder-structure.md) |
