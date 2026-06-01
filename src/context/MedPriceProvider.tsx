import { addMaterials, getMaterials, initMaterials, MOCK_MARKET_DATA } from '@/data/medprice'
import { generateSmartRecommendations } from '@/services/mockMedpriceService'
import type {
  HospitalStats,
  MaterialPriceRecord,
  Recommendation,
  SortConfig,
} from '@/types/medprice'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

type MedPriceContextValue = {
  data: MaterialPriceRecord[]
  recommendations: Recommendation[]
  isLoading: boolean
  searchTerm: string
  setSearchTerm: (v: string) => void
  selectedItem: MaterialPriceRecord | null
  setSelectedItem: (item: MaterialPriceRecord | null) => void
  benchmarkingMode: 'trade' | 'generic'
  setBenchmarkingMode: (m: 'trade' | 'generic') => void
  isFilterOpen: boolean
  setIsFilterOpen: (v: boolean) => void
  filterCategory: string
  setFilterCategory: (v: string) => void
  filterMinSaving: number
  setFilterMinSaving: (v: number) => void
  filterManufacturer: string
  setFilterManufacturer: (v: string) => void
  filterHospitalTypes: string[]
  setFilterHospitalTypes: (v: string[]) => void
  filterDateRange: 'all' | 'last7days' | 'last30days' | 'thisQuarter' | 'custom'
  setFilterDateRange: (v: 'all' | 'last7days' | 'last30days' | 'thisQuarter' | 'custom') => void
  filterCustomDateStart: string
  setFilterCustomDateStart: (v: string) => void
  filterCustomDateEnd: string
  setFilterCustomDateEnd: (v: string) => void
  filterPriceSources: string[]
  setFilterPriceSources: (v: string[]) => void
  sortConfig: SortConfig
  requestSort: (key: NonNullable<SortConfig>['key']) => void
  manufacturers: string[]
  filteredAndSortedData: MaterialPriceRecord[]
  stats: HospitalStats
  resetFilters: () => void
  hasActiveFilters: boolean
  handleDataExtracted: (newData: Partial<MaterialPriceRecord>[]) => Promise<void>
  handleExport: () => void
  navigateToBenchmarking: (item: MaterialPriceRecord) => void
}

const MedPriceContext = createContext<MedPriceContextValue | null>(null)

export function MedPriceProvider({
  children,
  initialMaterials,
}: {
  children: ReactNode
  initialMaterials?: MaterialPriceRecord[]
}) {
  const navigate = useNavigate()
  const location = useLocation()

  const [data, setData] = useState<MaterialPriceRecord[]>(initialMaterials ?? [])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(!initialMaterials?.length)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState<MaterialPriceRecord | null>(null)
  const [benchmarkingMode, setBenchmarkingMode] = useState<'trade' | 'generic'>('trade')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterMinSaving, setFilterMinSaving] = useState(0)
  const [filterManufacturer, setFilterManufacturer] = useState('All')
  const [filterHospitalTypes, setFilterHospitalTypes] = useState<string[]>([])
  const [filterDateRange, setFilterDateRange] = useState<
    'all' | 'last7days' | 'last30days' | 'thisQuarter' | 'custom'
  >('all')
  const [filterCustomDateStart, setFilterCustomDateStart] = useState('')
  const [filterCustomDateEnd, setFilterCustomDateEnd] = useState('')
  const [filterPriceSources, setFilterPriceSources] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'saving', direction: 'desc' })

  useEffect(() => {
    if (initialMaterials?.length) {
      initMaterials(initialMaterials)
      setData(initialMaterials)
      setIsLoading(false)
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        initMaterials(MOCK_MARKET_DATA)
        const json = await getMaterials()
        if (!cancelled) setData(json)
      } catch (error) {
        console.error('Failed to load materials:', error)
        if (!cancelled) {
          initMaterials(MOCK_MARKET_DATA)
          setData(MOCK_MARKET_DATA)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [initialMaterials])

  useEffect(() => {
    const state = location.state as { selectedItem?: MaterialPriceRecord } | null
    if (state?.selectedItem) {
      setSelectedItem(state.selectedItem)
    }
  }, [location.state])

  useEffect(() => {
    if (location.pathname !== '/benchmarking') {
      setSelectedItem(null)
    }
  }, [location.pathname])

  useEffect(() => {
    if (data.length === 0) return
    generateSmartRecommendations(data).then(setRecommendations)
  }, [data])

  const manufacturers = useMemo(() => {
    const set = new Set(data.map((item) => item.manufacturer))
    return ['All', ...Array.from(set)]
  }, [data])

  const handleDataExtracted = useCallback(
    async (newData: Partial<MaterialPriceRecord>[]) => {
      const records: MaterialPriceRecord[] = newData.map((item, idx) => ({
        id: `new-${idx}-${Date.now()}`,
        name: item.name || 'Nieznany materiał',
        genericName: item.genericName || item.name || 'Synonim nieokreślony',
        manufacturer: item.manufacturer || 'Nieznany',
        category: item.category || 'Inne',
        unitPrice: item.unitPrice || 0,
        quantity: item.quantity || 0,
        totalValue: item.totalValue || (item.unitPrice ?? 0) * (item.quantity ?? 0),
        benchmarkPrice: (item.unitPrice || 0) * (0.85 + Math.random() * 0.2),
        benchmarkMedianVolume: (item.quantity || 1000) * (2 + Math.random() * 4),
        benchmarkMedianContractMonths: [12, 24, 36][Math.floor(Math.random() * 3)],
        hospitalName: 'Twój Szpital',
        hospitalType: 'Kliniczny',
        isAnonymous: false,
        period: '2024-Q1',
        priceSource: item.priceSource || 'Przetarg',
        updatedAt: new Date().toISOString(),
      }))

      await addMaterials(records)
      setData((prev) => [...records, ...prev])
      navigate('/')
    },
    [navigate],
  )

  const requestSort = useCallback((key: NonNullable<SortConfig>['key']) => {
    setSortConfig((prev) => {
      let direction: 'asc' | 'desc' = 'asc'
      if (prev && prev.key === key && prev.direction === 'asc') direction = 'desc'
      return { key, direction }
    })
  }, [])

  const filteredAndSortedData = useMemo(() => {
    let baseFiltered = data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (filterCategory !== 'All') {
      baseFiltered = baseFiltered.filter((item) => item.category === filterCategory)
    }
    if (filterManufacturer !== 'All') {
      baseFiltered = baseFiltered.filter((item) => item.manufacturer === filterManufacturer)
    }
    if (filterHospitalTypes.length > 0) {
      baseFiltered = baseFiltered.filter(
        (item) => item.hospitalType && filterHospitalTypes.includes(item.hospitalType),
      )
    }
    if (filterPriceSources.length > 0) {
      baseFiltered = baseFiltered.filter(
        (item) => item.priceSource && filterPriceSources.includes(item.priceSource),
      )
    }
    if (filterMinSaving > 0) {
      baseFiltered = baseFiltered.filter((item) => {
        const saving = (item.unitPrice - item.benchmarkPrice) * item.quantity
        return saving >= filterMinSaving
      })
    }

    if (filterDateRange !== 'all') {
      const now = new Date()
      baseFiltered = baseFiltered.filter((item) => {
        if (!item.updatedAt) return true
        const itemDate = new Date(item.updatedAt)
        if (filterDateRange === 'last7days') {
          const sevenDaysAgo = new Date(now)
          sevenDaysAgo.setDate(now.getDate() - 7)
          return itemDate >= sevenDaysAgo
        }
        if (filterDateRange === 'last30days') {
          const thirtyDaysAgo = new Date(now)
          thirtyDaysAgo.setDate(now.getDate() - 30)
          return itemDate >= thirtyDaysAgo
        }
        if (filterDateRange === 'thisQuarter') {
          const currentQuarter = Math.floor(now.getMonth() / 3)
          const startOfQuarter = new Date(now.getFullYear(), currentQuarter * 3, 1)
          return itemDate >= startOfQuarter
        }
        if (filterDateRange === 'custom' && filterCustomDateStart && filterCustomDateEnd) {
          const start = new Date(filterCustomDateStart)
          const end = new Date(filterCustomDateEnd)
          end.setHours(23, 59, 59, 999)
          return itemDate >= start && itemDate <= end
        }
        return true
      })
    }

    let processed: MaterialPriceRecord[]

    if (benchmarkingMode === 'trade') {
      processed = [...baseFiltered]
    } else {
      const grouped: Record<string, MaterialPriceRecord> = {}
      baseFiltered.forEach((item) => {
        if (!grouped[item.genericName]) {
          grouped[item.genericName] = { ...item, id: `generic-${item.genericName}` }
        } else {
          const existing = grouped[item.genericName]
          const totalQty = existing.quantity + item.quantity
          const avgPrice =
            (existing.unitPrice * existing.quantity + item.unitPrice * item.quantity) / totalQty
          grouped[item.genericName] = {
            ...existing,
            unitPrice: avgPrice,
            quantity: totalQty,
            totalValue: existing.totalValue + item.totalValue,
            benchmarkPrice: (existing.benchmarkPrice + item.benchmarkPrice) / 2,
            benchmarkMedianVolume:
              (existing.benchmarkMedianVolume + item.benchmarkMedianVolume) / 2,
            benchmarkMedianContractMonths: Math.round(
              (existing.benchmarkMedianContractMonths + item.benchmarkMedianContractMonths) / 2,
            ),
          }
        }
      })
      processed = Object.values(grouped)
    }

    if (sortConfig !== null) {
      processed = [...processed].sort((a, b) => {
        let aValue: number | string
        let bValue: number | string

        if (sortConfig.key === 'diff') {
          aValue = (a.unitPrice - a.benchmarkPrice) / a.benchmarkPrice
          bValue = (b.unitPrice - b.benchmarkPrice) / b.benchmarkPrice
        } else if (sortConfig.key === 'saving') {
          aValue = (a.unitPrice - a.benchmarkPrice) * a.quantity
          bValue = (b.unitPrice - b.benchmarkPrice) * b.quantity
        } else {
          aValue = a[sortConfig.key as keyof MaterialPriceRecord] as number | string
          bValue = b[sortConfig.key as keyof MaterialPriceRecord] as number | string
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return processed
  }, [
    data,
    searchTerm,
    benchmarkingMode,
    filterCategory,
    filterManufacturer,
    filterMinSaving,
    filterHospitalTypes,
    filterDateRange,
    filterCustomDateStart,
    filterCustomDateEnd,
    filterPriceSources,
    sortConfig,
  ])

  const handleExport = useCallback(() => {
    const headers = [
      'ID',
      'Nazwa',
      'Synonim',
      'Kategoria',
      'Producent',
      'Twoja Cena',
      'Benchmark',
      'Potencjał Oszczędności',
    ]
    const csvRows = [
      headers.join(';'),
      ...filteredAndSortedData.map((item) => {
        const saving = (item.unitPrice - item.benchmarkPrice) * item.quantity
        return [
          item.id,
          item.name,
          item.genericName,
          item.category,
          item.manufacturer,
          item.unitPrice,
          item.benchmarkPrice,
          saving,
        ].join(';')
      }),
    ]
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'medprice_eksport.csv'
    a.click()
    URL.revokeObjectURL(url)
  }, [filteredAndSortedData])

  const stats = useMemo<HospitalStats>(() => {
    const totalSpent = filteredAndSortedData.reduce((acc, curr) => acc + curr.totalValue, 0)
    const potentialSavingsTotal = filteredAndSortedData.reduce((acc, curr) => {
      const diff = curr.unitPrice - curr.benchmarkPrice
      return diff > 0 ? acc + diff * curr.quantity : acc
    }, 0)

    const weightedIndex =
      filteredAndSortedData.length > 0 && totalSpent > 0
        ? filteredAndSortedData.reduce(
            (acc, curr) => acc + (curr.unitPrice / curr.benchmarkPrice) * curr.totalValue,
            0,
          ) / totalSpent
        : 1

    const topOverpricedItemsCount = filteredAndSortedData.filter(
      (item) => (item.unitPrice - item.benchmarkPrice) / item.benchmarkPrice > 0.15,
    ).length

    return {
      totalSpent,
      potentialSavingsTotal,
      priceIndexVsMarket: weightedIndex,
      topOverpricedItemsCount,
    }
  }, [filteredAndSortedData])

  const resetFilters = useCallback(() => {
    setFilterCategory('All')
    setFilterManufacturer('All')
    setFilterHospitalTypes([])
    setFilterPriceSources([])
    setFilterMinSaving(0)
    setSearchTerm('')
    setFilterDateRange('all')
    setFilterCustomDateStart('')
    setFilterCustomDateEnd('')
  }, [])

  const hasActiveFilters =
    filterCategory !== 'All' ||
    filterManufacturer !== 'All' ||
    filterHospitalTypes.length > 0 ||
    filterPriceSources.length > 0 ||
    filterMinSaving > 0 ||
    filterDateRange !== 'all'

  const navigateToBenchmarking = useCallback(
    (item: MaterialPriceRecord) => {
      navigate('/benchmarking', { state: { selectedItem: item } })
    },
    [navigate],
  )

  const value: MedPriceContextValue = {
    data,
    recommendations,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedItem,
    setSelectedItem,
    benchmarkingMode,
    setBenchmarkingMode,
    isFilterOpen,
    setIsFilterOpen,
    filterCategory,
    setFilterCategory,
    filterMinSaving,
    setFilterMinSaving,
    filterManufacturer,
    setFilterManufacturer,
    filterHospitalTypes,
    setFilterHospitalTypes,
    filterDateRange,
    setFilterDateRange,
    filterCustomDateStart,
    setFilterCustomDateStart,
    filterCustomDateEnd,
    setFilterCustomDateEnd,
    filterPriceSources,
    setFilterPriceSources,
    sortConfig,
    requestSort,
    manufacturers,
    filteredAndSortedData,
    stats,
    resetFilters,
    hasActiveFilters,
    handleDataExtracted,
    handleExport,
    navigateToBenchmarking,
  }

  return <MedPriceContext.Provider value={value}>{children}</MedPriceContext.Provider>
}

export function useMedPrice() {
  const ctx = useContext(MedPriceContext)
  if (!ctx) throw new Error('useMedPrice must be used within MedPriceProvider')
  return ctx
}
