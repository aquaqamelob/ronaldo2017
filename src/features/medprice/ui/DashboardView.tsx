import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Divider } from '@/components/divider'
import { Subheading } from '@/components/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { Text } from '@/components/text'
import { ChartPlaceholder } from '@/features/medprice/ui/ChartPlaceholder'
import { KpiStats } from '@/features/medprice/ui/KpiStats'
import { Link } from '@/components/link'
import type { HospitalStats, MaterialPriceRecord } from '@/types/medprice'
import { useMemo, useState } from 'react'

type DashboardViewProps = {
  data: MaterialPriceRecord[]
  stats: HospitalStats
  onSelectMaterial?: (item: MaterialPriceRecord) => void
}

export function DashboardView({ data, stats, onSelectMaterial }: DashboardViewProps) {
  const [activeKPIDrillDown, setActiveKPIDrillDown] = useState<'savings' | 'critical' | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {}
    data.forEach((item) => {
      categories[item.category] = (categories[item.category] || 0) + item.totalValue
    })
    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [data])

  const sortedDeviations = useMemo(() => {
    let items = [...data]
    if (activeKPIDrillDown === 'critical') {
      items = items.filter((item) => (item.unitPrice - item.benchmarkPrice) / item.benchmarkPrice > 0.15)
    }
    return items
      .map((item) => ({
        ...item,
        potential: (item.unitPrice - item.benchmarkPrice) * item.quantity,
      }))
      .sort((a, b) => b.potential - a.potential)
      .slice(0, 8)
  }, [data, activeKPIDrillDown])

  const categoryItems = useMemo(() => {
    if (!selectedCategory) return []
    return data
      .filter((item) => item.category === selectedCategory)
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5)
  }, [data, selectedCategory])

  const categoryStats = useMemo(() => {
    if (!selectedCategory) return null
    const catItems = data.filter((item) => item.category === selectedCategory)
    const spent = catItems.reduce((acc, curr) => acc + curr.totalValue, 0)
    const savings = catItems.reduce((acc, curr) => {
      const diff = curr.unitPrice - curr.benchmarkPrice
      return diff > 0 ? acc + diff * curr.quantity : acc
    }, 0)
    return { spent, savings }
  }, [data, selectedCategory])

  return (
    <div className="space-y-10">
      <KpiStats stats={stats} activeDrillDown={activeKPIDrillDown} onDrillDown={setActiveKPIDrillDown} />

      {activeKPIDrillDown === 'savings' && (
        <div className="rounded-lg p-6 ring-1 ring-zinc-950/10 dark:ring-white/10">
          <Subheading>Breakdown potencjału oszczędności</Subheading>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div>
              <Text className="font-medium">Top producenci</Text>
              <ul className="mt-3 space-y-2">
                {Array.from(new Set(data.map((i) => i.manufacturer)))
                  .slice(0, 4)
                  .map((m) => {
                    const saving = data
                      .filter((i) => i.manufacturer === m)
                      .reduce((acc, curr) => {
                        const diff = curr.unitPrice - curr.benchmarkPrice
                        return diff > 0 ? acc + diff * curr.quantity : acc
                      }, 0)
                    return (
                      <li key={m} className="flex justify-between text-sm">
                        <span>{m}</span>
                        <span className="font-medium">{saving.toLocaleString('pl-PL')} zł</span>
                      </li>
                    )
                  })}
              </ul>
            </div>
            <div>
              <Text className="font-medium">Top kategorie</Text>
              <ul className="mt-3 space-y-2">
                {categoryData.slice(0, 4).map((c) => {
                  const saving = data
                    .filter((i) => i.category === c.name)
                    .reduce((acc, curr) => {
                      const diff = curr.unitPrice - curr.benchmarkPrice
                      return diff > 0 ? acc + diff * curr.quantity : acc
                    }, 0)
                  return (
                    <li key={c.name} className="flex justify-between text-sm">
                      <span>{c.name}</span>
                      <span className="font-medium">{saving.toLocaleString('pl-PL')} zł</span>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="flex flex-col justify-center">
              <Text>Szczegółowe strategie negocjacyjne w sekcji rekomendacji.</Text>
              <Button href="/recommendations" className="mt-4">
                Otwórz rekomendacje
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg p-6 ring-1 ring-zinc-950/10 dark:ring-white/10">
          <Subheading className="mb-4">Trend indeksu cenowego</Subheading>
          <ChartPlaceholder title="Trend indeksu cenowego" />
        </div>

        <div className="rounded-lg p-6 ring-1 ring-zinc-950/10 dark:ring-white/10">
          {!selectedCategory ? (
            <>
              <Subheading>Struktura wydatków wg kategorii</Subheading>
              <Text className="mt-1 mb-4">Wybierz kategorię, aby zobaczyć pozycje.</Text>
              <ul className="max-h-72 space-y-2 overflow-y-auto">
                {categoryData.map((entry) => (
                  <li key={entry.name}>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(entry.name)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ring-1 ring-zinc-950/5 hover:bg-zinc-950/5 dark:ring-white/10 dark:hover:bg-white/5"
                    >
                      <span className="font-medium">{entry.name}</span>
                      <span>{entry.value.toLocaleString('pl-PL')} zł</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-4">
                <Button plain onClick={() => setSelectedCategory(null)}>
                  ← Kategorie
                </Button>
                <Badge color="zinc">{selectedCategory}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-lg p-4 ring-1 ring-zinc-950/5 dark:ring-white/10">
                  <Text>Wydatki</Text>
                  <p className="mt-1 text-lg font-semibold">{categoryStats?.spent.toLocaleString('pl-PL')} zł</p>
                </div>
                <div className="rounded-lg p-4 ring-1 ring-zinc-950/5 dark:ring-white/10">
                  <Text>Potencjał</Text>
                  <p className="mt-1 text-lg font-semibold">{categoryStats?.savings.toLocaleString('pl-PL')} zł</p>
                </div>
              </div>
              <Table dense className="mt-6">
                <TableBody>
                  {categoryItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <button
                          type="button"
                          className="text-left font-medium hover:underline"
                          onClick={() => onSelectMaterial?.(item)}
                        >
                          {item.name}
                        </button>
                      </TableCell>
                      <TableCell className="text-right">{item.totalValue.toLocaleString('pl-PL')} zł</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-4">
          <Subheading>Największe odchylenia od benchmarku</Subheading>
          <Button plain href="/benchmarking">
            Pełna analiza
          </Button>
        </div>
        <Divider className="mt-4" />
        <Table striped className="mt-4">
          <TableHead>
            <TableRow>
              <TableHeader>Materiał</TableHeader>
              <TableHeader className="text-right">Twoja cena</TableHeader>
              <TableHeader className="text-right">Benchmark</TableHeader>
              <TableHeader className="text-right">Potencjał</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedDeviations.map((item) => (
              <TableRow
                key={item.id}
                className={onSelectMaterial ? 'cursor-pointer' : undefined}
                onClick={onSelectMaterial ? () => onSelectMaterial(item) : undefined}
              >
                <TableCell>
                  {onSelectMaterial ? (
                    <span className="font-medium">{item.name}</span>
                  ) : (
                    <Link href="/benchmarking">{item.name}</Link>
                  )}
                  <Text>{item.manufacturer}</Text>
                </TableCell>
                <TableCell className="text-right">{item.unitPrice.toFixed(2)} zł</TableCell>
                <TableCell className="text-right">{item.benchmarkPrice.toFixed(2)} zł</TableCell>
                <TableCell className="text-right font-medium">
                  {item.potential > 0 ? '+' : ''}
                  {item.potential.toLocaleString('pl-PL')} zł
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
