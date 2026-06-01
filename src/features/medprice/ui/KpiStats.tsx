import { Badge } from '@/components/badge'
import { Subheading } from '@/components/heading'
import { Text } from '@/components/text'
import type { HospitalStats } from '@/types/medprice'
import clsx from 'clsx'

type KpiStatsProps = {
  stats: HospitalStats
  activeDrillDown: 'savings' | 'critical' | null
  onDrillDown: (mode: 'savings' | 'critical' | null) => void
}

export function KpiStats({ stats, activeDrillDown, onDrillDown }: KpiStatsProps) {
  const cards = [
    {
      key: 'spent',
      label: 'Całkowite wydatki',
      value: `${stats.totalSpent.toLocaleString('pl-PL')} zł`,
      hint: 'Wg aktywnych filtrów',
      badge: null as string | null,
      onClick: undefined,
      active: false,
    },
    {
      key: 'savings',
      label: 'Potencjał oszczędności',
      value: `${stats.potentialSavingsTotal.toLocaleString('pl-PL')} zł`,
      hint: activeDrillDown === 'savings' ? 'Kliknij, aby zamknąć' : 'Kliknij, aby zobaczyć breakdown',
      badge: 'Oszczędności',
      onClick: () => onDrillDown(activeDrillDown === 'savings' ? null : 'savings'),
      active: activeDrillDown === 'savings',
    },
    {
      key: 'index',
      label: 'Indeks cenowy',
      value: `${(stats.priceIndexVsMarket * 100).toFixed(1)}%`,
      hint: 'Twoje ceny względem benchmarku',
      badge: null,
      onClick: undefined,
      active: false,
    },
    {
      key: 'critical',
      label: 'Pozycje krytyczne',
      value: String(stats.topOverpricedItemsCount),
      hint: activeDrillDown === 'critical' ? 'Filtr aktywny w tabeli' : 'Kliknij, aby filtrować tabelę',
      badge: '>15% odchylenia',
      onClick: () => onDrillDown(activeDrillDown === 'critical' ? null : 'critical'),
      active: activeDrillDown === 'critical',
    },
  ] as const

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <button
          key={card.key}
          type="button"
          onClick={card.onClick}
          disabled={!card.onClick}
          className={clsx(
            'rounded-lg p-6 text-left ring-1 ring-zinc-950/10 dark:ring-white/10',
            card.onClick && 'cursor-pointer transition hover:ring-zinc-950/20 dark:hover:ring-white/20',
            card.active && 'bg-zinc-950 text-white ring-zinc-950 dark:bg-white dark:text-zinc-950',
            !card.active && 'bg-white dark:bg-zinc-900',
            !card.onClick && 'cursor-default',
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <Subheading level={3} className={clsx(card.active && 'text-inherit')}>
              {card.label}
            </Subheading>
            {card.badge ? (
              <Badge color={card.active ? 'zinc' : 'blue'}>{card.badge}</Badge>
            ) : null}
          </div>
          <p className="mt-3 text-2xl/8 font-semibold">{card.value}</p>
          <Text className={clsx('mt-2', card.active && 'text-zinc-300 dark:text-zinc-600')}>
            {card.hint}
          </Text>
        </button>
      ))}
    </div>
  )
}
