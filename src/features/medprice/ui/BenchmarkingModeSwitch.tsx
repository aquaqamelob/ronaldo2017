import { Button } from '@/components/button'
import { useMedPrice } from '@/context/MedPriceProvider'

export function BenchmarkingModeSwitch() {
  const { benchmarkingMode, setBenchmarkingMode } = useMedPrice()

  return (
    <div className="flex flex-wrap gap-2">
      {benchmarkingMode === 'trade' ? (
        <Button color="dark/zinc" onClick={() => setBenchmarkingMode('trade')}>
          Produkt handlowy
        </Button>
      ) : (
        <Button outline onClick={() => setBenchmarkingMode('trade')}>
          Produkt handlowy
        </Button>
      )}
      {benchmarkingMode === 'generic' ? (
        <Button color="dark/zinc" onClick={() => setBenchmarkingMode('generic')}>
          Synonim (generyk)
        </Button>
      ) : (
        <Button outline onClick={() => setBenchmarkingMode('generic')}>
          Synonim (generyk)
        </Button>
      )}
    </div>
  )
}
