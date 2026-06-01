import { Text } from '@/components/text'

export function LoadingState() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
      <div className="size-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-950 dark:border-zinc-600 dark:border-t-white" />
      <Text>Ładowanie danych MedPrice…</Text>
    </div>
  )
}
