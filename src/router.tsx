import { AuthLayoutRoute } from '@/layouts/AuthLayoutRoute'
import { AppLayoutRoute, appLayoutLoader } from '@/layouts/AppLayoutRoute'
import { RootLayout } from '@/layouts/RootLayout'
import { BenchmarkingPage } from '@/pages/BenchmarkingPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OptimizationPage } from '@/pages/OptimizationPage'
import { RecommendationsPage } from '@/pages/RecommendationsPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { UploadPage } from '@/pages/UploadPage'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <AuthLayoutRoute />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
          { path: '/forgot-password', element: <ForgotPasswordPage /> },
        ],
      },
      {
        loader: appLayoutLoader,
        element: <AppLayoutRoute />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'benchmarking', element: <BenchmarkingPage /> },
          { path: 'upload', element: <UploadPage /> },
          { path: 'recommendations', element: <RecommendationsPage /> },
          { path: 'optimization', element: <OptimizationPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
