import type { MaterialPriceRecord } from '@/types/medprice'
import { useMemo } from 'react'

export interface OptimizationInsight {
  id: string
  type: 'consolidation' | 'switching' | 'renegotiation' | 'rationalization'
  title: string
  description: string
  potentialSavings: number
  impact: 'High' | 'Medium' | 'Low'
  actionItems: string[]
  affectedItems: string[]
}

export function useOptimizationInsights(data: MaterialPriceRecord[]) {
  return useMemo(() => {
    const results: OptimizationInsight[] = []

    const genericGroups: Record<string, MaterialPriceRecord[]> = {}
    data.forEach((item) => {
      if (!genericGroups[item.genericName]) genericGroups[item.genericName] = []
      genericGroups[item.genericName].push(item)
    })

    let consolidationPotential = 0
    const consolidationItems: string[] = []

    Object.entries(genericGroups).forEach(([generic, items]) => {
      const uniqueManufacturers = new Set(items.map((i) => i.manufacturer))
      if (uniqueManufacturers.size > 1) {
        const bestPrice = Math.min(...items.map((i) => i.unitPrice))
        const currentTotal = items.reduce((acc, i) => acc + i.totalValue, 0)
        const totalQuantity = items.reduce((acc, i) => acc + i.quantity, 0)
        const saving = currentTotal - bestPrice * totalQuantity
        if (saving > 1000) {
          consolidationPotential += saving
          consolidationItems.push(generic)
        }
      }
    })

    if (consolidationPotential > 0) {
      results.push({
        id: 'opt-1',
        type: 'consolidation',
        title: 'Konsolidacja wolumenu generycznego',
        description: `Wykryto ${consolidationItems.length} grup produktów kupowanych od wielu dostawców. Standaryzacja pozwoli uzyskać lepsze warunki.`,
        potentialSavings: consolidationPotential,
        impact: consolidationPotential > 50000 ? 'High' : 'Medium',
        actionItems: [
          'Wybierz preferowanego dostawcę dla każdej grupy',
          'Przeprowadź zapytanie ofertowe na skonsolidowany wolumen',
          'Zaktualizuj receptariusz szpitalny',
        ],
        affectedItems: consolidationItems.slice(0, 5),
      })
    }

    const overpricedItems = data.filter((i) => i.unitPrice > i.benchmarkPrice * 1.15)
    const switchingPotential = overpricedItems.reduce(
      (acc, i) => acc + (i.unitPrice - i.benchmarkPrice) * i.quantity,
      0,
    )

    if (overpricedItems.length > 0) {
      results.push({
        id: 'opt-2',
        type: 'switching',
        title: 'Optymalizacja zamienników',
        description: `${overpricedItems.length} pozycji znacząco odbiega od benchmarku rynkowego.`,
        potentialSavings: switchingPotential,
        impact: 'High',
        actionItems: [
          'Zweryfikuj dostępność tańszych zamienników',
          'Skonsultuj z ordynatorami dopuszczenie zamienników',
          'Sprawdź przetargi centralne',
        ],
        affectedItems: overpricedItems.map((i) => i.name).slice(0, 5),
      })
    }

    const highValueItems = [...data].sort((a, b) => b.totalValue - a.totalValue).slice(0, 10)
    const renegotiationItems = highValueItems.filter((i) => i.unitPrice > i.benchmarkPrice)
    const renegotiationPotential = renegotiationItems.reduce(
      (acc, i) => acc + (i.unitPrice - i.benchmarkPrice) * i.quantity,
      0,
    )

    if (renegotiationItems.length > 0) {
      results.push({
        id: 'opt-3',
        type: 'renegotiation',
        title: 'Renegocjacja kluczowych kontraktów',
        description: 'Skup się na największych pozycjach powyżej benchmarku.',
        potentialSavings: renegotiationPotential,
        impact: 'High',
        actionItems: [
          'Przygotuj raport porównawczy dla dostawców',
          'Zaplanuj spotkania z TOP 3 dostawcami',
          'Wykorzystaj argument wolumenu rynkowego',
        ],
        affectedItems: renegotiationItems.map((i) => i.name).slice(0, 5),
      })
    }

    const categoryVendors: Record<string, Set<string>> = {}
    data.forEach((i) => {
      if (!categoryVendors[i.category]) categoryVendors[i.category] = new Set()
      categoryVendors[i.category].add(i.manufacturer)
    })

    const complexCategories = Object.entries(categoryVendors)
      .filter(([, vendors]) => vendors.size > 5)
      .map(([cat]) => cat)

    if (complexCategories.length > 0) {
      results.push({
        id: 'opt-4',
        type: 'rationalization',
        title: 'Racjonalizacja bazy dostawców',
        description: `W kategoriach ${complexCategories.join(', ')} jest ponad 5 producentów.`,
        potentialSavings: 15000,
        impact: 'Low',
        actionItems: [
          'Analiza ABC dostawców',
          'Umowy ramowe z kluczowymi partnerami',
          'Uproszczenie procesu zamówień',
        ],
        affectedItems: complexCategories,
      })
    }

    return results
  }, [data])
}
