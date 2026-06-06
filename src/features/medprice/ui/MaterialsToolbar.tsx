import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Input, InputGroup } from '@/components/input'
import { useMedPrice } from '@/context/MedPriceProvider'
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { ArrowDownTrayIcon } from '@heroicons/react/16/solid'

export function MaterialsToolbar() {
  const {
    searchTerm,
    setSearchTerm,
    setIsFilterOpen,
    hasActiveFilters,
    handleExport,
    filterCategory,
    setFilterCategory,
    filterManufacturer,
    setFilterManufacturer,
    filterHospitalTypes,
    setFilterHospitalTypes,
    filterPriceSources,
    setFilterPriceSources,
    filterMinSaving,
    setFilterMinSaving,
    filterDateRange,
    setFilterDateRange,
    setFilterCustomDateStart,
    setFilterCustomDateEnd,
    resetFilters,
  } = useMedPrice()

  const activeCount = [
    filterCategory !== 'All',
    filterManufacturer !== 'All',
    filterMinSaving > 0,
    filterHospitalTypes.length > 0,
    filterPriceSources.length > 0,
    filterDateRange !== 'all',
  ].filter(Boolean).length

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <InputGroup>
            <MagnifyingGlassIcon data-slot="icon" />
            <Input
              placeholder="Szukaj materiału, synonimu lub producenta…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button outline onClick={() => setIsFilterOpen(true)}>
            <FunnelIcon data-slot="icon" />
            Filtry
            {hasActiveFilters ? ` (${activeCount})` : ''}
          </Button>
          <Button plain onClick={handleExport}>
            <ArrowDownTrayIcon data-slot="icon" />
            Eksport CSV
          </Button>
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="flex flex-wrap items-center gap-2">
          {filterCategory !== 'All' && (
            <Badge color="blue">
              Kategoria: {filterCategory}
              <button type="button" className="ml-1 underline" onClick={() => setFilterCategory('All')}>
                ×
              </button>
            </Badge>
          )}
          {filterManufacturer !== 'All' && (
            <Badge color="blue">
              Producent: {filterManufacturer}
              <button type="button" className="ml-1 underline" onClick={() => setFilterManufacturer('All')}>
                ×
              </button>
            </Badge>
          )}
          {filterHospitalTypes.map((t) => (
            <Badge key={t} color="zinc">
              {t}
              <button
                type="button"
                className="ml-1 underline"
                onClick={() => setFilterHospitalTypes(filterHospitalTypes.filter((x) => x !== t))}
              >
                ×
              </button>
            </Badge>
          ))}
          {filterPriceSources.map((s) => (
            <Badge key={s} color="zinc">
              {s}
              <button
                type="button"
                className="ml-1 underline"
                onClick={() => setFilterPriceSources(filterPriceSources.filter((x) => x !== s))}
              >
                ×
              </button>
            </Badge>
          ))}
          {filterMinSaving > 0 && (
            <Badge color="green">
              Min. oszczędność: {filterMinSaving.toLocaleString('pl-PL')} zł
              <button type="button" className="ml-1 underline" onClick={() => setFilterMinSaving(0)}>
                ×
              </button>
            </Badge>
          )}
          {filterDateRange !== 'all' && (
            <Badge color="blue">
              Zakres dat
              <button
                type="button"
                className="ml-1 underline"
                onClick={() => {
                  setFilterDateRange('all')
                  setFilterCustomDateStart('')
                  setFilterCustomDateEnd('')
                }}
              >
                ×
              </button>
            </Badge>
          )}
          <Button plain onClick={resetFilters}>
            Wyczyść
          </Button>
        </div>
      ) : null}
    </div>
  )
}
