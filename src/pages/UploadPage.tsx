import { useMedPrice } from '@/context/MedPriceProvider'
import { LoadingState } from '@/features/medprice/ui/LoadingState'
import { PageHeader } from '@/features/medprice/ui/PageHeader'
import { UploadPanel } from '@/features/medprice/ui/UploadPanel'
import { useDocumentTitle } from '@/hooks/use-document-title'

export function UploadPage() {
  useDocumentTitle('Import danych — MedPrice Pro')
  const { isLoading, handleDataExtracted } = useMedPrice()

  if (isLoading) return <LoadingState />

  return (
    <div className="space-y-8">
      <PageHeader
        title="Import danych"
        description="Dodaj pozycje z przetargu lub zestawienia — dane trafiają do mockowej bazy w pamięci."
      />
      <UploadPanel onDataExtracted={handleDataExtracted} />
    </div>
  )
}
