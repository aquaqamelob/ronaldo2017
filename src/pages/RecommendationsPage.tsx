import { useMedPrice } from '@/context/MedPriceProvider'
import { LoadingState } from '@/features/medprice/ui/LoadingState'
import { PageHeader } from '@/features/medprice/ui/PageHeader'
import { RecommendationsPanel } from '@/features/medprice/ui/RecommendationsPanel'
import { useDocumentTitle } from '@/hooks/use-document-title'

export function RecommendationsPage() {
  useDocumentTitle('Rekomendacje — MedPrice Pro')
  const { isLoading, recommendations } = useMedPrice()

  if (isLoading) return <LoadingState />

  return (
    <div className="space-y-8">
      <PageHeader
        title="Rekomendacje"
        description="Heurystyki na podstawie odchyleń od benchmarku — bez zewnętrznego AI."
      />
      <RecommendationsPanel recommendations={recommendations} />
    </div>
  )
}
