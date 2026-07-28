import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout, DashboardLayout } from '@/layouts/index.js'
import { ProtectedRoute } from './ProtectedRoute.jsx'
import { ROUTES } from '@/constants/routes.js'

const HomePage = lazy(() => import('@/pages/home/HomePage.jsx'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage.jsx'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage.jsx'))
const ListingsPage = lazy(() => import('@/pages/listings/ListingsPage.jsx'))
const PropertyDetailPage = lazy(() => import('@/pages/listings/PropertyDetailPage.jsx'))
const CreatePropertyPage = lazy(() => import('@/pages/listings/CreatePropertyPage.jsx'))
const EditPropertyPage = lazy(() => import('@/pages/listings/EditPropertyPage.jsx'))
const ServicesPage = lazy(() => import('@/pages/services/ServicesPage.jsx'))
const HelpPage = lazy(() => import('@/pages/help/HelpPage.jsx'))
const FaqPage = lazy(() => import('@/pages/faq/FaqPage.jsx'))
const AboutPage = lazy(() => import('@/pages/about/AboutPage.jsx'))
const ContactPage = lazy(() => import('@/pages/contact/ContactPage.jsx'))
const PrivacyPage = lazy(() => import('@/pages/legal/PrivacyPage.jsx'))
const TermsPage = lazy(() => import('@/pages/legal/TermsPage.jsx'))
const BlacklistPage = lazy(() => import('@/pages/legal/BlacklistPage.jsx'))
const CreateConstructionPage = lazy(() => import('@/pages/constructions/CreateConstructionPage.jsx'))
const ProfileInfoPage = lazy(() => import('@/pages/profile/ProfileInfoPage.jsx'))
const FavoritesPage = lazy(() => import('@/pages/profile/FavoritesPage.jsx'))
const ComparePage = lazy(() => import('@/pages/profile/ComparePage.jsx'))
const MyListingsPage = lazy(() => import('@/pages/profile/MyListingsPage.jsx'))
const RequestsPage = lazy(() => import('@/pages/profile/RequestsPage.jsx'))
const PurchasesPage = lazy(() => import('@/pages/profile/PurchasesPage.jsx'))
const InvoicesPage = lazy(() => import('@/pages/profile/InvoicesPage.jsx'))
const NotificationsPage = lazy(() => import('@/pages/profile/NotificationsPage.jsx'))
const MessagesPage = lazy(() => import('@/pages/profile/MessagesPage.jsx'))
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage.jsx').then((m) => ({ default: m.NotFoundPage })),
)

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'real-estates', element: <ListingsPage /> },
      { path: 'real-estates/:id', element: <PropertyDetailPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'help', element: <HelpPage /> },
      { path: 'faq', element: <FaqPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'blacklist-reasons', element: <BlacklistPage /> },
      { path: 'auth/login', element: <LoginPage /> },
      { path: 'auth/register', element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'real-estates/create', element: <CreatePropertyPage /> },
          { path: 'real-estates/:id/edit', element: <EditPropertyPage /> },
          { path: 'constructions/create', element: <CreateConstructionPage /> },
          {
            path: 'profile',
            element: <DashboardLayout />,
            children: [
              { index: true, element: <Navigate to="info" replace /> },
              { path: 'info', element: <ProfileInfoPage /> },
              { path: 'favorites', element: <FavoritesPage /> },
              { path: 'compare', element: <ComparePage /> },
              { path: 'listings', element: <MyListingsPage /> },
              { path: 'requests', element: <RequestsPage /> },
              { path: 'purchases', element: <PurchasesPage /> },
              { path: 'invoices', element: <InvoicesPage /> },
              { path: 'notifications', element: <NotificationsPage /> },
              { path: 'messages', element: <MessagesPage /> },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
