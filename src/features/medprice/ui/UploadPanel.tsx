import { Alert, AlertActions, AlertDescription, AlertTitle } from '@/components/alert'
import { Button } from '@/components/button'
import { Field, FieldGroup, Label } from '@/components/fieldset'
import { Select } from '@/components/select'
import { Subheading } from '@/components/heading'
import { Text } from '@/components/text'
import { Textarea } from '@/components/textarea'
import { extractPricingDataFromText } from '@/services/mockMedpriceService'
import type { MaterialPriceRecord } from '@/types/medprice'
import { useState } from 'react'

export function UploadPanel({
  onDataExtracted,
}: {
  onDataExtracted: (data: Partial<MaterialPriceRecord>[]) => void
}) {
  const [activeTab, setActiveTab] = useState<'file' | 'link' | 'text'>('text')
  const [isUploading, setIsUploading] = useState(false)
  const [pastedText, setPastedText] = useState('')
  const [url, setUrl] = useState('')
  const [priceSource, setPriceSource] = useState('Przetarg')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  const handleProcess = async () => {
    setIsUploading(true)
    setStatus('idle')
    const sourceText =
      activeTab === 'text'
        ? pastedText
        : `Przykładowy wyciąg: rękawice nitrylowe, producent Mercator, kategoria Ochrona, cena 0.22 PLN, ilość 100000. Strzykawka BD, kategoria Iniekcja, cena 0.38 PLN, ilość 50000.`
    const result = await extractPricingDataFromText(sourceText || url)
    setIsUploading(false)
    if (result.length > 0) {
      const enriched = result.map((r) => ({ ...r, priceSource }))
      onDataExtracted(enriched)
      setStatus('success')
      setShowSuccessAlert(true)
    } else {
      setStatus('error')
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Subheading>Import danych cenowych</Subheading>
        <Text className="mt-2">
          Wklej dane z przetargu lub formularza. System używa lokalnego parsera (mock) — bez zewnętrznego AI.
        </Text>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['file', 'link', 'text'] as const).map((tab) =>
          activeTab === tab ? (
            <Button key={tab} color="dark/zinc" onClick={() => setActiveTab(tab)}>
              {tab === 'file' ? 'Plik' : tab === 'link' ? 'Link' : 'Tekst'}
            </Button>
          ) : (
            <Button key={tab} outline onClick={() => setActiveTab(tab)}>
              {tab === 'file' ? 'Plik' : tab === 'link' ? 'Link' : 'Tekst'}
            </Button>
          ),
        )}
      </div>

      <div className="rounded-lg p-6 ring-1 ring-zinc-950/10 dark:ring-white/10">
        <FieldGroup>
          <Field>
            <Label>Źródło cen</Label>
            <Select value={priceSource} onChange={(e) => setPriceSource(e.target.value)}>
              <option>Przetarg</option>
              <option>Badanie rynku</option>
              <option>Ceny katalogowe</option>
            </Select>
          </Field>

          {activeTab === 'text' && (
            <Field>
              <Label>Treść do analizy</Label>
              <Textarea
                rows={8}
                placeholder="Wklej pozycje z oferty lub zestawienia cen…"
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
              />
            </Field>
          )}

          {activeTab === 'link' && (
            <Field>
              <Label>URL dokumentu</Label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://…"
                className="block w-full rounded-lg border border-zinc-950/10 px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-900"
              />
              <Text className="mt-2">W trybie mock link symuluje przykładowe dane.</Text>
            </Field>
          )}

          {activeTab === 'file' && (
            <div className="rounded-lg border border-dashed border-zinc-950/15 p-12 text-center dark:border-white/15">
              <Text>Przeciągnij plik CSV lub Excel — wkrótce. Na razie użyj zakładki Tekst.</Text>
            </div>
          )}
        </FieldGroup>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleProcess} disabled={isUploading}>
            {isUploading ? 'Przetwarzanie…' : 'Importuj dane'}
          </Button>
        </div>

        {status === 'error' && (
          <Text className="mt-4 text-red-600">Nie udało się rozpoznać struktury danych. Spróbuj innego formatu.</Text>
        )}
      </div>

      <Alert open={showSuccessAlert} onClose={setShowSuccessAlert}>
        <AlertTitle>Import zakończony</AlertTitle>
        <AlertDescription>Dane zostały dodane do bazy mockowej. Przekierowano na przegląd.</AlertDescription>
        <AlertActions>
          <Button onClick={() => setShowSuccessAlert(false)}>OK</Button>
        </AlertActions>
      </Alert>
    </div>
  )
}
