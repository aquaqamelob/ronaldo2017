import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/components/dialog'
import { Subheading } from '@/components/heading'
import { Text } from '@/components/text'
import type { Recommendation } from '@/types/medprice'
import { useState } from 'react'

function priorityColor(p: Recommendation['priority']) {
  if (p === 'high') return 'rose' as const
  if (p === 'medium') return 'amber' as const
  return 'blue' as const
}

function priorityLabel(p: Recommendation['priority']) {
  if (p === 'high') return 'Wysoki'
  if (p === 'medium') return 'Średni'
  return 'Niski'
}

export function RecommendationsPanel({ recommendations }: { recommendations: Recommendation[] }) {
  const [selected, setSelected] = useState<Recommendation | null>(null)

  if (recommendations.length === 0) {
    return (
      <div className="rounded-lg p-12 text-center ring-1 ring-zinc-950/10 dark:ring-white/10">
        <Subheading>Brak rekomendacji</Subheading>
        <Text className="mt-2">Zaimportuj dane lub poczekaj na przeliczenie heurystyk.</Text>
      </div>
    )
  }

  return (
    <>
      <ul className="space-y-4">
        {recommendations.map((rec) => (
          <li
            key={rec.id}
            className="rounded-lg p-6 ring-1 ring-zinc-950/10 dark:ring-white/10"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Subheading level={3}>{rec.title}</Subheading>
                  <Badge color={priorityColor(rec.priority)}>Priorytet: {priorityLabel(rec.priority)}</Badge>
                </div>
                <Text className="mt-3">{rec.description}</Text>
              </div>
              <div className="text-right">
                <Text>Szacowana oszczędność</Text>
                <p className="text-xl font-semibold">{rec.potentialSavings.toLocaleString('pl-PL')} zł</p>
              </div>
            </div>
            <Button plain className="mt-4" onClick={() => setSelected(rec)}>
              Szczegóły
            </Button>
          </li>
        ))}
      </ul>

      <Dialog open={selected !== null} onClose={() => setSelected(null)}>
        {selected && (
          <>
            <DialogTitle>{selected.title}</DialogTitle>
            <DialogDescription>
              Priorytet: {priorityLabel(selected.priority)} ·{' '}
              {selected.potentialSavings.toLocaleString('pl-PL')} zł rocznie
            </DialogDescription>
            <DialogBody>
              <Text>{selected.description}</Text>
              <Text className="mt-4">
                Rekomendacja oparta na porównaniu cen jednostkowych z benchmarkiem rynkowym (dane mockowe).
              </Text>
            </DialogBody>
            <DialogActions>
              <Button plain onClick={() => setSelected(null)}>
                Zamknij
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  )
}
