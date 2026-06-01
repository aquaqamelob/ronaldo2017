import { MedPriceProvider } from '@/context/MedPriceProvider'
import { ApplicationLayout } from '@/layouts/application-layout'
import { getCategories, getMaterials } from '@/data/medprice'
import { Outlet, useLoaderData } from 'react-router-dom'

export async function appLayoutLoader() {
  const [categories, materials] = await Promise.all([getCategories(), getMaterials()])
  return { categories, materials }
}

export function AppLayoutRoute() {
  const { categories, materials } = useLoaderData() as Awaited<ReturnType<typeof appLayoutLoader>>

  return (
    <ApplicationLayout categories={categories}>
      <MedPriceProvider initialMaterials={materials}>
        <Outlet />
      </MedPriceProvider>
    </ApplicationLayout>
  )
}
