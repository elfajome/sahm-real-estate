<p align="center">
  <img width="1774" height="887" alt="Banner" src="https://github.com/user-attachments/assets/3f12eeff-f24c-4f58-85c0-92f995c68f35" />
</p>

---

<div align="center">

# 🏡 Sahm Real Estate Platform

### Modern Real Estate Marketplace for the Saudi Market

A production-ready real estate marketplace built with React, Vite, and Tailwind CSS, providing a seamless bilingual experience (Arabic RTL & English LTR) for browsing, searching, comparing, purchasing, and managing real estate properties.

<p align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&labelColor=20232a)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white&labelColor=20232a)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white&labelColor=20232a)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux&logoColor=white&labelColor=20232a)
![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=reactrouter&logoColor=white&labelColor=20232a)
![i18next](https://img.shields.io/badge/i18next-ar%20%7C%20en-26A69A?logo=i18next&logoColor=white&labelColor=20232a)
![RTL Ready](https://img.shields.io/badge/RTL-Ready-success?labelColor=20232a)
![Status](https://img.shields.io/badge/Status-Frontend%20Complete-success)
![License](https://img.shields.io/badge/License-MIT-green)

</p>

**Production Ready • Responsive • RTL/LTR • Mock Backend • API Ready • Layer-Based Architecture**

<br>

### 🌐 Live Demo

> **Coming Soon**

```
[View Live Demo](https://your-vercel-link.vercel.app)

```

</div>

---

# 📸 Project Preview

> Screenshots will be added after the production deployment.

## Home

<p align="center">
<img width="1672" height="941" alt="home" src="https://github.com/user-attachments/assets/e5867a37-eb5c-4e87-b624-41a7e8f4cd3c" />

</p>

---

## Property Listings

<p align="center">
<img width="1536" height="1024" alt="real-estate" src="https://github.com/user-attachments/assets/15265e3e-a184-413c-aa9d-4d91d4d51641" />
</p>

---

## Property Details

<p align="center">
<img width="1536" height="1024" alt="details-real-estate" src="https://github.com/user-attachments/assets/f37576bd-92a7-44d5-90c2-12805a530496" />
</p>

---

## Dashboard

<p align="center">
<img width="1536" height="1024" alt="dashboard" src="https://github.com/user-attachments/assets/9ee8bc8b-6e90-4acb-ba43-24327325e088" />
</p>

---

## Add Property

<p align="center">
<img width="1536" height="1024" alt="create-real-estates" src="https://github.com/user-attachments/assets/f17d0ca3-7e1a-4719-b0cb-6e7bddef07a8" />
</p>

---

## Add Construction Request

<p align="center">
<img width="1535" height="1024" alt="add-construction" src="https://github.com/user-attachments/assets/03339495-c282-4837-8550-f0b43d7c8345" />
</p>

---

# 📑 Table of Contents

- Overview
- Features
- Technology Stack
- Architecture
- Project Structure
- Quick Start
- Environment Variables
- Backend Integration
- Documentation
- Roadmap
- Author
- License

---

# 📖 Overview

Sahm is a modern real estate platform built specifically for the Saudi market.

The application provides a complete property marketplace experience, allowing users to browse listings, search using advanced filters, compare properties, manage favorites, submit construction requests, purchase real estate, and manage their profile through a unified dashboard.

The project was designed with scalability and maintainability in mind. Every layer is isolated, services are centralized, UI components are reusable, and the application can switch from the built-in mock backend to the production API without changing the presentation layer.

---

# ✨ Core Features

## Property Marketplace

- Browse real estate listings
- Property details pages
- Smart property search
- Advanced filtering
- URL-based search parameters
- Grid & List layouts
- Featured properties
- Related properties

---

## Authentication

- Login
- Register
- JWT Authentication
- Protected Routes
- Session Persistence
- Automatic Authentication Hydration

---

## User Dashboard

- Personal Profile
- My Properties
- Purchased Properties
- Construction Requests
- Messages
- Notifications
- Invoices
- Settings

---

## Property Management

- Add Property
- Edit Property
- Delete Property
- Image Upload
- Image Preview
- Dynamic Property Forms
- Conditional Fields by Property Type

---

## Construction Requests

- Dedicated Request Flow
- Dynamic Forms
- Validation
- API Ready Structure

---

## User Experience

- Arabic (RTL)
- English (LTR)
- Responsive Design
- Accessible Components
- Reusable UI
- Loading States
- Empty States
- Error Handling
- Smooth Navigation

---

## Productivity Features

- Favorites
- Property Comparison
- Property Sharing
- Purchase Flow
- Invoice Viewer
- Notification Center
- Message Center

# 🧰 Technology Stack

| Category | Technology |
|-----------|------------|
| Framework | React 19 |
| Build Tool | Vite 8 + SWC |
| Styling | Tailwind CSS v4 |
| State Management | Redux Toolkit |
| Routing | React Router v7 |
| Forms | React Hook Form |
| Validation | Zod |
| Localization | i18next |
| HTTP Client | Native Fetch API |
| Icons | React Icons |
| Package Manager | npm |

---

# 🏗️ Architecture

The project follows a **Layer-Based Architecture**, where each layer has a single responsibility and dependencies flow in one direction.

```text
                    Pages
                      │
                      ▼
          Reusable Components
                      │
                      ▼
             Custom Hooks
                      │
                      ▼
            Redux Store / Context
                      │
                      ▼
             Service Layer
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
   Mock Backend               REST API
```

### Design Principles

- Separation of Concerns
- Reusable Components
- Single Responsibility
- Centralized API Layer
- Feature Isolation
- Clean Folder Structure
- Scalable Project Organization
- Responsive by Default
- Localization Ready

---

# 📂 Project Structure

```text
src/
│
├── assets/
├── components/
│   ├── common/
│   ├── forms/
│   ├── layout/
│   ├── property/
│   ├── profile/
│   └── ui/
│
├── constants/
├── content/
├── hooks/
├── layouts/
├── locales/
├── mocks/
├── pages/
├── providers/
├── router/
├── services/
├── store/
├── styles/
├── utils/
├── validation/
│
├── App.jsx
└── main.jsx
```

---

# 📊 Feature Status

| Module | Status |
|----------|:------:|
| Authentication | ✅ |
| Home Page | ✅ |
| Property Listings | ✅ |
| Property Details | ✅ |
| Search | ✅ |
| Advanced Filters | ✅ |
| Favorites | ✅ |
| Property Comparison | ✅ |
| User Dashboard | ✅ |
| Messages | ✅ |
| Notifications | ✅ |
| Purchases | ✅ |
| Invoices | ✅ |
| Add Property | ✅ |
| Construction Requests | ✅ |
| Localization | ✅ |
| Responsive Design | ✅ |
| Mock Backend | ✅ |
| Backend Integration | Ready |

---

# 🌍 Localization

The platform supports both Arabic and English with full layout adaptation.

| Language | Direction |
|----------|-----------|
| Arabic | RTL |
| English | LTR |

Layout direction changes automatically while preserving spacing, alignment, and overall user experience.

---

# 📱 Responsive Design

The interface has been optimized for all common screen sizes.

- Desktop
- Laptop
- Tablet
- Mobile

Layouts, navigation, forms, and data tables adapt automatically to different viewport sizes.

---

# 🚀 Quick Start

Clone the repository

```bash
git clone https://github.com/elfajome/sahm-real-estate.git
```

Navigate into the project

```bash
cd sahm-real-estate
```

Install dependencies

```bash
npm install
```

Create the environment file

```bash
cp .env.example .env
```

Start the development server

```bash
npm run dev
```

Open your browser

```
http://localhost:5173
```

---

# 📦 Available Scripts

| Command | Description |
|----------|-------------|
| npm run dev | Start development server |
| npm run build | Create production build |
| npm run preview | Preview production build |
| npm run lint | Run ESLint |
| npm run format | Format source code |
| npm run format:check | Verify formatting |

---

# ⚙️ Environment Variables

Create a `.env` file based on `.env.example`

```env
VITE_API_BASE_URL=
```

The project can run entirely with the built-in mock backend.

When the production backend becomes available, update the API base URL without changing the UI layer.

---

# 🔌 Backend Integration

The application uses a centralized service layer that abstracts all communication with the backend.

Current implementation includes:

- Mock backend
- Centralized API client
- Authentication services
- Property services
- Construction services
- User services
- Lookup services
- Content services

Switching from the mock backend to the production API requires updating the service layer only, with no changes to pages or UI components.

---

# 📚 Documentation

Comprehensive project documentation is available in the `/docs` directory.

| Document | Description |
|----------|-------------|
| Architecture Overview | Project architecture and design principles |
| Folder Structure | Complete source tree explanation |
| API Endpoint Map | Backend endpoints reference |
| Integration Guide | Backend integration workflow |
| Technical Decisions | Project conventions and implementation decisions |

---

# 🧩 Development Guidelines

To keep the project consistent and maintainable, the following conventions are followed throughout the codebase.

### Components

- Keep components focused on a single responsibility.
- Reuse existing UI components whenever possible.
- Avoid duplicated JSX.

### Services

- All backend communication goes through the service layer.
- UI components never perform direct HTTP requests.
- API logic is centralized.

### State Management

- Global state is managed with Redux Toolkit.
- Local component state remains inside components.
- Async operations are handled through centralized services.

### Styling

- Tailwind CSS v4
- Mobile-first approach
- Logical CSS properties for RTL/LTR compatibility
- Consistent spacing using design tokens

### Localization

- All user-facing text is translated through i18next.
- No hardcoded UI strings.
- Arabic and English are fully supported.

---

# ⚡ Performance

The application includes several optimizations to improve performance and scalability.

- Lazy-loaded routes
- Component-based code splitting
- Optimized image rendering
- Shared reusable components
- Efficient state updates
- URL-driven filters
- Centralized API layer
- Lightweight production build

---

# 🔒 Authentication

Authentication is based on JWT.

Features include:

- Login
- Registration
- Protected routes
- Session persistence
- Automatic authentication restoration
- Centralized unauthorized request handling

# 📄 Project Status

**Current Status**

- Frontend Development: Complete
- Responsive Design: Complete
- Localization: Complete
- Mock Backend: Complete
- Production Build: Ready
- Backend Integration: Ready

---

# 👨‍💻 Author

**Ibrahim Farouk**

Frontend Developer

- GitHub: https://github.com/elfajome
- LinkedIn: www.linkedin.com/in/ibrahim-farouk-4a2672364
- Email: ebrahimfarouk225@gmail.com

---

# 📜 License

All trademarks, company Smart Vision, and brand assets referenced in the project remain the property of their respective owners.

---

<div align="center">

### ⭐ If you found this project useful, consider giving it a star.

Built with React, Vite, Tailwind CSS, and Redux Toolkit.

</div>
