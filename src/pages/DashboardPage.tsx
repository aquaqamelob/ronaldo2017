import { useMedPrice } from '@/context/MedPriceProvider'
import { BenchmarkingModeSwitch } from '@/features/medprice/ui/BenchmarkingModeSwitch'
import { DashboardView } from '@/features/medprice/ui/DashboardView'
import { FilterDialog } from '@/features/medprice/ui/FilterDialog'
import { LoadingState } from '@/features/medprice/ui/LoadingState'
import { MaterialsToolbar } from '@/features/medprice/ui/MaterialsToolbar'
import { PageHeader } from '@/features/medprice/ui/PageHeader'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export function DashboardPage() {
  useDocumentTitle('Przegląd — MedPrice Pro')
  const [searchParams] = useSearchParams()
  const {
    isLoading,
    filteredAndSortedData,
    stats,
    navigateToBenchmarking,
    setFilterCategory,
  } = useMedPrice()

  useEffect(() => {
    const category = searchParams.get('category')
    if (category) setFilterCategory(category)
  }, [searchParams, setFilterCategory])

  if (isLoading) return <LoadingState />

  return (
    <div className="space-y-8">
      <FilterDialog />
      <PageHeader
        title="Przegląd"
        description="Podsumowanie zakupów i potencjału optymalizacji względem benchmarku rynkowego."
      >
        <BenchmarkingModeSwitch />
      </PageHeader>
      <MaterialsToolbar />
      <DashboardView
        data={filteredAndSortedData}
        stats={stats}
        onSelectMaterial={navigateToBenchmarking}
      />
    </div>
  )
}
