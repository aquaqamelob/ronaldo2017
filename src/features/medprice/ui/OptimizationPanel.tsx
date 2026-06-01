import { Badge } from '@/components/badge'
import { Subheading } from '@/components/heading'
import { Text } from '@/components/text'
import { useOptimizationInsights } from '@/features/medprice/hooks/useOptimizationInsights'
import type { MaterialPriceRecord } from '@/types/medprice'

function impactColor(impact: string) {
  if (impact === 'High') return 'rose' as const
  if (impact === 'Medium') return 'amber' as const
  return 'zinc' as const
}

export function OptimizationPanel({ data }: { data: MaterialPriceRecord[] }) {
  const insights = useOptimizationInsights(data)
  const totalPotential = insights.reduce((acc, i) => acc + i.potentialSavings, 0)

  return (
    <div className="space-y-8">
      <div className="rounded-lg p-6 ring-1 ring-zinc-950/10 dark:ring-white/10">
        <Text>Łączny potencjał ze strategii</Text>
        <p className="mt-2 text-3xl font-semibold">{totalPotential.toLocaleString('pl-PL')} zł</p>
      </div>

      <ul className="space-y-6">
        {insights.map((insight) => (
          <li key={insight.id} className="rounded-lg p-6 ring-1 ring-zinc-950/10 dark:ring-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <Subheading level={3}>{insight.title}</Subheading>
              <Badge color={impactColor(insight.impact)}>Wpływ: {insight.impact}</Badge>
            </div>
            <Text className="mt-3">{insight.description}</Text>
            <p className="mt-4 text-lg font-semibold">
              {insight.potentialSavings.toLocaleString('pl-PL')} zł
            </p>
            <div className="mt-4">
              <Text className="font-medium">Kroki</Text>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
                {insight.actionItems.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
            {insight.affectedItems.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {insight.affectedItems.map((item) => (
                  <Badge key={item} color="zinc">
                    {item}
                  </Badge>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
