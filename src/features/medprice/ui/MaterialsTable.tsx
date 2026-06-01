import { Badge } from '@/components/badge'
import { Subheading } from '@/components/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { Text } from '@/components/text'
import { useMedPrice } from '@/context/MedPriceProvider'
import type { SortKey } from '@/types/medprice'

function deviationBadge(diff: number) {
  if (diff > 10) return { color: 'rose' as const, label: `+${diff.toFixed(1)}%` }
  if (diff > 0) return { color: 'amber' as const, label: `+${diff.toFixed(1)}%` }
  return { color: 'green' as const, label: `${diff.toFixed(1)}%` }
}

export function MaterialsTable() {
  const { benchmarkingMode, filteredAndSortedData, requestSort, setSelectedItem } = useMedPrice()
  const nameKey: SortKey = benchmarkingMode === 'trade' ? 'name' : 'genericName'

  if (filteredAndSortedData.length === 0) {
    return (
      <div className="rounded-lg p-12 text-center ring-1 ring-zinc-950/10 dark:ring-white/10">
        <Subheading>Brak wyników</Subheading>
        <Text className="mt-2">Zmień filtry lub wyszukiwanie.</Text>
      </div>
    )
  }

  return (
    <Table striped>
      <TableHead>
        <TableRow>
          <TableHeader>
            <button type="button" className="font-medium" onClick={() => requestSort(nameKey)}>
              {benchmarkingMode === 'trade' ? 'Produkt' : 'Synonim'}
            </button>
          </TableHeader>
          <TableHeader>
            <button type="button" className="font-medium" onClick={() => requestSort('category')}>
              Kategoria
            </button>
          </TableHeader>
          <TableHeader className="text-right">
            <button type="button" className="font-medium" onClick={() => requestSort('unitPrice')}>
              Twoja cena
            </button>
          </TableHeader>
          <TableHeader className="text-right">
            <button type="button" className="font-medium" onClick={() => requestSort('benchmarkPrice')}>
              Benchmark
            </button>
          </TableHeader>
          <TableHeader className="text-center">
            <button type="button" className="font-medium" onClick={() => requestSort('diff')}>
              Odchylenie
            </button>
          </TableHeader>
          <TableHeader className="text-right">
            <button type="button" className="font-medium" onClick={() => requestSort('saving')}>
              Potencjał
            </button>
          </TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredAndSortedData.map((item) => {
          const diff = ((item.unitPrice - item.benchmarkPrice) / item.benchmarkPrice) * 100
          const saving = (item.unitPrice - item.benchmarkPrice) * item.quantity
          const badge = deviationBadge(diff)

          return (
            <TableRow
              key={item.id}
              className="cursor-pointer"
              onClick={() => setSelectedItem(item)}
              title="Zobacz szczegóły"
            >
              <TableCell>
                <span className="font-medium">
                  {benchmarkingMode === 'trade' ? item.name : item.genericName}
                </span>
                <Text>
                  {benchmarkingMode === 'trade' ? item.manufacturer : `Grupa: ${item.category}`}
                </Text>
              </TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell className="text-right">
                <span className="font-medium">{item.unitPrice.toFixed(2)} zł</span>
                <Text>{item.quantity.toLocaleString('pl-PL')} szt.</Text>
              </TableCell>
              <TableCell className="text-right">
                <span className="font-medium">{item.benchmarkPrice.toFixed(2)} zł</span>
                <Text>
                  med. {item.benchmarkMedianVolume?.toLocaleString('pl-PL')} · {item.benchmarkMedianContractMonths}{' '}
                  m-cy
                </Text>
              </TableCell>
              <TableCell className="text-center">
                <Badge color={badge.color}>{badge.label}</Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                {saving > 0 ? '+' : ''}
                {saving.toLocaleString('pl-PL')} zł
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
