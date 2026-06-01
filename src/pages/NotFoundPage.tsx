import { Heading } from '@/components/heading'
import { Link } from '@/components/link'
import { Text } from '@/components/text'
import { useDocumentTitle } from '@/hooks/use-document-title'

export function NotFoundPage() {
  useDocumentTitle('Not Found')

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6">
      <Heading>Page not found</Heading>
      <Text>The page you’re looking for doesn’t exist.</Text>
      <Link href="/" className="text-sm font-medium text-zinc-950 dark:text-white">
        Go back home
      </Link>
    </div>
  )
}
