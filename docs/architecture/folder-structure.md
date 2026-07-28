# Folder Structure — `src/`

Current tree of the implemented **Layer-Based** application.

```
src/
├── main.jsx                          # ReactDOM.createRoot, imports index.css
├── index.css                         # Tailwind @import, @theme design tokens
│
├── router/
│   ├── router.jsx                    # createBrowserRouter, lazy page imports
│   ├── ProtectedRoute.jsx            # auth guard + returnUrl
│   └── routeConfig.js                # route metadata (layout, auth, breadcrumb)
│
├── providers/
│   ├── AppProviders.jsx              # Redux, Router, i18n, Suspense, ErrorBoundary
│   ├── AuthProvider.jsx              # bridges Redux auth state into AuthContext
│   └── ErrorBoundary.jsx
│
├── layouts/
│   ├── MainLayout.jsx                # TopBar + Navbar + Breadcrumb + Outlet + Footer
│   ├── DashboardLayout.jsx           # ProfileSidebar + Outlet (profile pages)
│   └── index.js
│
├── pages/                            # one folder per page group — pages only, no HTTP
│   ├── NotFoundPage.jsx
│   ├── home/HomePage.jsx
│   ├── auth/                          # LoginPage, RegisterPage
│   ├── listings/                      # ListingsPage, PropertyDetailPage, CreatePropertyPage, EditPropertyPage
│   ├── constructions/CreateConstructionPage.jsx
│   ├── profile/                       # ProfileInfo, Favorites, Compare, MyListings, Requests, Purchases, Invoices, Notifications, Messages
│   ├── services/ServicesPage.jsx
│   ├── help/HelpPage.jsx
│   ├── faq/FaqPage.jsx
│   ├── about/AboutPage.jsx
│   ├── contact/ContactPage.jsx
│   └── legal/                         # PrivacyPage, TermsPage, BlacklistPage
│
├── components/                       # reusable components, grouped by kind
│   ├── ui/                            # Badge, Button, Carousel, FaqAccordion, Input, PageLoader,
│   │                                  # Pagination, SectionMessage, SectionTitle, Select, Skeleton,
│   │                                  # StarRating, Toast, UserAvatar
│   ├── layout/                        # GuestTopBar, AuthenticatedTopBar, Navbar, Footer,
│   │                                  # Breadcrumb, ProfileSidebar
│   ├── property/                      # PropertyCard, ImageGallery, MapEmbed, ComparisonTable,
│   │                                  # BuyNowButton, ContactOwnerButton, PropertyDetailActions,
│   │                                  # PropertyFeaturesGrid, PropertyRibbon, ListingsFilterSidebar,
│   │                                  # ListingsToolbar
│   ├── marketing/                     # HeroSection, HomeSearchBar, MobileSearchDrawer, FilterTabs,
│   │                                  # ServiceCard, StatsCounter, CTABanner, TestimonialCard,
│   │                                  # AboutSection, VisionMissionGoals
│   ├── forms/                         # LoginForm, RegisterForm, ConstructionTypeField, PropertyForm,
│   │                                  # RealEstateConditionalFields, ConstructionForm, ContactForm,
│   │                                  # ReviewForm, NewsletterInput, ContactInfoCard, FormSection,
│   │                                  # ImageUploadField, MapPicker, InteractiveMap
│   ├── profile/                       # ProfilePageHeader, ProfileEmptyState, InvoiceTable
│   ├── content/                       # StaticPageLayout, CompanyLocationMap, aboutContent.js
│   └── icons/index.jsx                # single source of truth — react-icons re-exports + Icon* wrappers
│
├── services/                         # the ONLY layer that talks to the backend
│   ├── apiClient.js                  # fetch wrapper: Bearer token, Lang header, 401 handling
│   ├── ApiError.js                   # normalized error
│   ├── index.js                      # service façade — currently exports src/mocks/* (flip to real services when backend is ready)
│   ├── auth.service.js               # login, register, logout, profile
│   ├── listings.service.js           # aqars, aqar/:id, store/update/delete aqar, buy_now, comments, fav/compare
│   ├── lookups.service.js            # areas, aqar types, aqar statuses, construction types, user types
│   ├── user.service.js               # favourites, compares, purchases, user aqars/constructions
│   ├── constructions.service.js      # store/construction
│   ├── content.service.js            # about, store-contact, store-newsletter
│   ├── inbox.service.js              # notifications + chat (messages)
│   └── utils/withQuery.js
│
├── store/
│   ├── index.js                      # configureStore
│   ├── rootReducer.js
│   └── slices/authSlice.js           # token, user, login/logout/hydrate thunks
│
├── hooks/                            # useAuth, useLocale, useMediaQuery, useDocumentTitle, useLookupLabel, usePropertyActions
├── context/AuthContext.jsx
├── validation/registerSchema.js      # Zod schemas
├── constants/                        # routes.js (+ path builders), profileNav.js, homeImages.js, realEstateTypes.js
├── content/pages.js                  # static copy (help, privacy, terms, blacklist, faq, contact info, social links)
├── mocks/                            # TEMPORARY mock backend (auth, properties, lookups, user, content,
│                                     # constructions, inbox, storage) — consumed only via services/index.js façade
├── locales/                          # i18n init + ar/en translation.json
└── utils/                            # cn, formatPrice, formatDate, buildFormData, normalizeList, lookupLabel, share, loadGoogleMaps
```

---

## Layer responsibilities

| Layer | Responsibility | May import from |
|-------|----------------|-----------------|
| `pages/` | Compose the screen from components + hooks | components, hooks, store, services, constants, utils |
| `components/` | Reusable presentational UI | components, hooks, services, utils, constants |
| `hooks/` | Reusable stateful logic | store, services, context, utils |
| `store/` | Global Redux state + thunks | services, utils |
| `services/` | All HTTP (apiClient + one service per domain) | utils, constants |
| `utils/` / `constants/` / `locales/` / `content/` | Pure helpers & data | nothing above them |

**Golden rule:** dependencies flow top-down only. `components/` never import `pages/`; `services/` never import React.

---

## Naming conventions

| Item | Convention | Example |
|------|------------|---------|
| Pages | `PascalCase` + `Page` suffix | `ListingsPage.jsx` |
| Components | `PascalCase` | `PropertyCard.jsx` |
| Hooks | `camelCase` + `use` prefix | `useLocale.js` |
| Service modules | `camelCase` + `.service.js` suffix | `listings.service.js` |
| Redux slices | `camelCase` + `Slice` suffix | `authSlice.js` |
| Constants | `SCREAMING_SNAKE` in objects | `ROUTES.HOME` |

---

## Path alias

Configured in `vite.config.js` and `jsconfig.json`:

| Alias | Resolves to |
|-------|-------------|
| `@/` | `src/` |

One alias is enough — e.g. `@/components/ui/Button.jsx`, `@/services/apiClient.js`, `@/hooks/useLocale.js`. Prefer it over relative `../../../` paths.

---

## Related

- [overview.md](./overview.md)
- [decisions.md](./decisions.md)
