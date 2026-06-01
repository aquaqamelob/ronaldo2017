import { AuthLayout } from '@/components/auth-layout'
import { Outlet } from 'react-router-dom'

export function AuthLayoutRoute() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  )
}
