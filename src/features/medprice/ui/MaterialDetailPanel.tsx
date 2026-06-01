import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from '@/components/description-list'
import { Subheading } from '@/components/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { Text } from '@/components/text'
import { ChartPlaceholder } from '@/features/medprice/ui/ChartPlaceholder'
import type { MaterialPriceRecord } from '@/types/medprice'
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { useMemo, useState } from 'react'

export function MaterialDetailPanel({
  item,
  onBack,
  selectedHospitalTypes,
}: {
  item: MaterialPriceRecord
  onBack: () => void
  selectedHospitalTypes: string[]
}) {
  const [isCurrencyNormalized, setIsCurrencyNormalized] = useState(false)
  const exchangeRate = 4.3412
  const currentRate = 4.285

  const marketRows = useMemo(() => {
    const rows = [
      { name: 'Szpital Uniwersytecki nr 1', type: 'Kliniczny', price: item.benchmarkPrice * 0.92, volume: item.quantity * 2.1, isUser: false },
      { name: 'Anonimowy szpital', type: 'Wojewódzki', price: item.benchmarkPrice * 0.95, volume: item.quantity * 0.8, isUser: false },
      { name: 'Twój szpital', type: 'Kliniczny', price: item.unitPrice, volume: item.quantity, isUser: true },
      { name: 'Szpital Kliniczny im. Jurasza', type: 'Kliniczny', price: item.benchmarkPrice * 1.05, volume: item.quantity * 1.5, isUser: false },
      { name: 'Szpital Powiatowy', type: 'Powiatowy', price: item.benchmarkPrice * 1.08, volume: item.quantity * 0.3, isUser: false },
    ]
    if (selectedHospitalTypes.length === 0) return rows
    return rows.filter((r) => r.isUser || selectedHospitalTypes.includes(r.type))
  }, [item, selectedHospitalTypes])

  const displayPrice = (p: number) =>
    isCurrencyNormalized ? p * (currentRate / exchangeRate) : p

  const bestPrice = Math.min(...marketRows.map((d) => d.price))
  const potentialSavings = (displayPrice(item.unitPrice) - displayPrice(bestPrice)) * item.quantity
  const diffPct = ((item.unitPrice - item.benchmarkPrice) / item.benchmarkPrice) * 100

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button plain onClick={onBack}>
          <ArrowLeftIcon data-slot="icon" />
          Powrót do listy
        </Button>
        <Button outline onClick={() => setIsCurrencyNormalized((v) => !v)}>
          {isCurrencyNormalized ? 'Ceny nominalne' : 'Ujednolic wg kursu EUR'}
        </Button>
      </div>

      <div>
        <Subheading>{item.name}</Subheading>
        <Text className="mt-1">{item.genericName}</Text>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge color="zinc">{item.category}</Badge>
          <Badge color={diffPct > 10 ? 'rose' : diffPct > 0 ? 'amber' : 'green'}>
            {diffPct > 0 ? '+' : ''}
            {diffPct.toFixed(1)}% vs benchmark
          </Badge>
        </div>
      </div>

      <DescriptionList>
        <DescriptionTerm>Producent</DescriptionTerm>
        <DescriptionDetails>{item.manufacturer}</DescriptionDetails>
        <DescriptionTerm>Twoja cena</DescriptionTerm>
        <DescriptionDetails>{item.unitPrice.toFixed(2)} zł</DescriptionDetails>
        <DescriptionTerm>Benchmark</DescriptionTerm>
        <DescriptionDetails>{item.benchmarkPrice.toFixed(2)} zł</DescriptionDetails>
        <DescriptionTerm>Wolumen</DescriptionTerm>
        <DescriptionDetails>{item.quantity.toLocaleString('pl-PL')} szt.</DescriptionDetails>
        <DescriptionTerm>Potencjał oszczędności</DescriptionTerm>
        <DescriptionDetails>{potentialSavings.toLocaleString('pl-PL')} zł</DescriptionDetails>
      </DescriptionList>

      <div className="rounded-lg p-6 ring-1 ring-zinc-950/10 dark:ring-white/10">
        <Subheading className="mb-4">Porównanie cen na rynku</Subheading>
        <ChartPlaceholder title="Mapa cen vs wolumen" />
        <Table dense className="mt-6">
          <TableHead>
            <TableRow>
              <TableHeader>Szpital</TableHeader>
              <TableHeader>Typ</TableHeader>
              <TableHeader className="text-right">Cena</TableHeader>
              <TableHeader className="text-right">Wolumen</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {marketRows.map((row) => (
              <TableRow key={row.name}>
                <TableCell className={row.isUser ? 'font-semibold' : undefined}>{row.name}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell className="text-right">{displayPrice(row.price).toFixed(2)} zł</TableCell>
                <TableCell className="text-right">{row.volume.toLocaleString('pl-PL')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
