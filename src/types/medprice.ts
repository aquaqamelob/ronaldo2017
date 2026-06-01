export type AppView =
  | 'dashboard'
  | 'benchmarking'
  | 'upload'
  | 'recommendations'
  | 'optimization'

export interface MaterialPriceRecord {
  id: string
  name: string
  genericName: string
  category: string
  manufacturer: string
  unitPrice: number
  quantity: number
  totalValue: number
  benchmarkPrice: number
  benchmarkMedianVolume: number
  benchmarkMedianContractMonths: number
  period: string
  priceSource?: string
  updatedAt?: string
  hospitalName?: string
  hospitalType?: string
  isAnonymous?: boolean
}

export interface HospitalStats {
  totalSpent: number
  potentialSavingsTotal: number
  priceIndexVsMarket: number
  topOverpricedItemsCount: number
}

export interface Recommendation {
  id: string
  title: string
  description: string
  potentialSavings: number
  priority: 'low' | 'medium' | 'high'
}

export interface HospitalBenchmark {
  hospitalType: string
  price: number
  volume: number
  date: string
  isAnonymous?: boolean
  isUserHospital?: boolean
}

export type SortKey = keyof MaterialPriceRecord | 'diff' | 'saving'

export type SortConfig = {
  key: SortKey
  direction: 'asc' | 'desc'
} | null
