import { useMedPrice } from '@/context/MedPriceProvider'
import { LoadingState } from '@/features/medprice/ui/LoadingState'
import { OptimizationPanel } from '@/features/medprice/ui/OptimizationPanel'
import { PageHeader } from '@/features/medprice/ui/PageHeader'
import { useDocumentTitle } from '@/hooks/use-document-title'

export function OptimizationPage() {
  useDocumentTitle('Optymalizacja — MedPrice Pro')
  const { isLoading, data } = useMedPrice()

  if (isLoading) return <LoadingState />

  return (
    <div className="space-y-8">
      <PageHeader
        title="Optymalizacja kosztów"
        description="Strategie konsolidacji, zamienników i renegocjacji na podstawie bieżących danych."
      />
      <OptimizationPanel data={data} />
    </div>
  )
}
