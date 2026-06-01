import { Button } from '@/components/button'
import { Checkbox, CheckboxField } from '@/components/checkbox'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/dialog'
import { Field, FieldGroup, Label } from '@/components/fieldset'
import { Select } from '@/components/select'
import { Subheading } from '@/components/heading'
import { CATEGORIES } from '@/data/medprice'
import { useMedPrice } from '@/context/MedPriceProvider'

export function FilterDialog() {
  const {
    isFilterOpen,
    setIsFilterOpen,
    filterCategory,
    setFilterCategory,
    filterManufacturer,
    setFilterManufacturer,
    filterMinSaving,
    setFilterMinSaving,
    filterDateRange,
    setFilterDateRange,
    filterCustomDateStart,
    setFilterCustomDateStart,
    filterCustomDateEnd,
    setFilterCustomDateEnd,
    filterHospitalTypes,
    setFilterHospitalTypes,
    filterPriceSources,
    setFilterPriceSources,
    manufacturers,
    filteredAndSortedData,
    resetFilters,
  } = useMedPrice()

  return (
    <Dialog open={isFilterOpen} onClose={setIsFilterOpen} size="2xl">
      <DialogTitle>Zaawansowane filtry</DialogTitle>
      <DialogDescription>
        Zawęź listę materiałów według kategorii, producenta, typu szpitala i źródła cen.
      </DialogDescription>
      <DialogBody>
        <FieldGroup>
          <Field>
            <Label>Kategoria</Label>
            <div className="mt-3 flex flex-wrap gap-2">
              {filterCategory === 'All' ? (
                <Button color="dark/zinc" onClick={() => setFilterCategory('All')}>
                  Wszystkie
                </Button>
              ) : (
                <Button outline onClick={() => setFilterCategory('All')}>
                  Wszystkie
                </Button>
              )}
              {CATEGORIES.map((cat) =>
                filterCategory === cat ? (
                  <Button key={cat} color="dark/zinc" onClick={() => setFilterCategory(cat)}>
                    {cat}
                  </Button>
                ) : (
                  <Button key={cat} outline onClick={() => setFilterCategory(cat)}>
                    {cat}
                  </Button>
                ),
              )}
            </div>
          </Field>

          <Field>
            <Label>Producent</Label>
            <Select value={filterManufacturer} onChange={(e) => setFilterManufacturer(e.target.value)}>
              {manufacturers.map((m) => (
                <option key={m} value={m}>
                  {m === 'All' ? 'Wszyscy producenci' : m}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            <Label>Minimalny potencjał oszczędności: {filterMinSaving.toLocaleString('pl-PL')} zł</Label>
            <input
              type="range"
              min={0}
              max={50000}
              step={1000}
              value={filterMinSaving}
              onChange={(e) => setFilterMinSaving(parseInt(e.target.value, 10))}
              className="mt-2 w-full accent-zinc-950 dark:accent-white"
            />
          </Field>

          <Field>
            <Label>Zakres dat (aktualizacja)</Label>
            <Select
              value={filterDateRange}
              onChange={(e) =>
                setFilterDateRange(
                  e.target.value as 'all' | 'last7days' | 'last30days' | 'thisQuarter' | 'custom',
                )
              }
            >
              <option value="all">Wszystkie daty</option>
              <option value="last7days">Ostatnie 7 dni</option>
              <option value="last30days">Ostatnie 30 dni</option>
              <option value="thisQuarter">Ten kwartał</option>
              <option value="custom">Zakres niestandardowy</option>
            </Select>
            {filterDateRange === 'custom' && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Field>
                  <Label>Od</Label>
                  <input
                    type="date"
                    value={filterCustomDateStart}
                    onChange={(e) => setFilterCustomDateStart(e.target.value)}
                    className="w-full rounded-lg border border-zinc-950/10 px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-900"
                  />
                </Field>
                <Field>
                  <Label>Do</Label>
                  <input
                    type="date"
                    value={filterCustomDateEnd}
                    onChange={(e) => setFilterCustomDateEnd(e.target.value)}
                    className="w-full rounded-lg border border-zinc-950/10 px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-900"
                  />
                </Field>
              </div>
            )}
          </Field>

          <div>
            <Subheading level={3} className="mb-3">
              Typ szpitala
            </Subheading>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {['Kliniczny', 'Wojewódzki', 'Powiatowy', 'Miejski'].map((type) => (
                <CheckboxField key={type}>
                  <Checkbox
                    checked={filterHospitalTypes.includes(type)}
                    onChange={(checked: boolean) => {
                      if (checked) setFilterHospitalTypes([...filterHospitalTypes, type])
                      else setFilterHospitalTypes(filterHospitalTypes.filter((t) => t !== type))
                    }}
                  />
                  <Label>{type}</Label>
                </CheckboxField>
              ))}
            </div>
          </div>

          <div>
            <Subheading level={3} className="mb-3">
              Źródło cen
            </Subheading>
            <div className="space-y-2">
              {['Przetarg', 'Badanie rynku', 'Ceny katalogowe'].map((source) => (
                <CheckboxField key={source}>
                  <Checkbox
                    checked={filterPriceSources.includes(source)}
                    onChange={(checked: boolean) => {
                      if (checked) setFilterPriceSources([...filterPriceSources, source])
                      else setFilterPriceSources(filterPriceSources.filter((s) => s !== source))
                    }}
                  />
                  <Label>{source}</Label>
                </CheckboxField>
              ))}
            </div>
          </div>
        </FieldGroup>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={resetFilters}>
          Resetuj
        </Button>
        <Button onClick={() => setIsFilterOpen(false)}>Pokaż {filteredAndSortedData.length} wyników</Button>
      </DialogActions>
    </Dialog>
  )
}
