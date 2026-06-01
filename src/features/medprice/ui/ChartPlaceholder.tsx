import { Subheading } from '@/components/heading'
import { Text } from '@/components/text'

export function ChartPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-zinc-950/15 p-8 text-center dark:border-white/15">
      <div>
        <Subheading level={3}>{title}</Subheading>
        <Text className="mt-2">Wykres Tremor — podłączymy wspólnie później.</Text>
      </div>
    </div>
  )
}
