import { useMedPrice } from '@/context/MedPriceProvider'
import { BenchmarkingModeSwitch } from '@/features/medprice/ui/BenchmarkingModeSwitch'
import { FilterDialog } from '@/features/medprice/ui/FilterDialog'
import { LoadingState } from '@/features/medprice/ui/LoadingState'
import { MaterialDetailPanel } from '@/features/medprice/ui/MaterialDetailPanel'
import { MaterialsTable } from '@/features/medprice/ui/MaterialsTable'
import { MaterialsToolbar } from '@/features/medprice/ui/MaterialsToolbar'
import { PageHeader } from '@/features/medprice/ui/PageHeader'
import { useDocumentTitle } from '@/hooks/use-document-title'

export function BenchmarkingPage() {
  useDocumentTitle('Benchmarking — MedPrice Pro')
  const { isLoading, selectedItem, setSelectedItem, filterHospitalTypes } = useMedPrice()

  if (isLoading) return <LoadingState />

  return (
    <div className="space-y-8">
      <FilterDialog />
      {!selectedItem ? (
        <>
          <PageHeader
            title="Benchmarking"
            description="Porównanie cen jednostkowych z medianą rynku i warunkami kontraktów."
          >
            <BenchmarkingModeSwitch />
          </PageHeader>
          <MaterialsToolbar />
          <MaterialsTable />
        </>
      ) : (
        <MaterialDetailPanel
          item={selectedItem}
          onBack={() => setSelectedItem(null)}
          selectedHospitalTypes={filterHospitalTypes}
        />
      )}
    </div>
  )
}
