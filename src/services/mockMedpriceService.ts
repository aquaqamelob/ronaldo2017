import type { MaterialPriceRecord, Recommendation } from '@/types/medprice'

export const isAiConfigured = false

export async function extractPricingDataFromText(
  rawText: string,
): Promise<Partial<MaterialPriceRecord>[]> {
  const results: Partial<MaterialPriceRecord>[] = []
  const regex =
    /([^,\n]+?),\s*(?:producent|manufacturer)\s*([^,\n]+?),\s*(?:kategoria|category)\s*([^,\n]+?),\s*cena\s*([0-9]+(?:[.,][0-9]+)?)\s*(?:PLN|zł)?[,\s]*ilo(?:s|ść)\s*([0-9,.]+)/gi
  let m: RegExpExecArray | null
  while ((m = regex.exec(rawText)) !== null) {
    const name = m[1].trim()
    const manufacturer = m[2].trim()
    const category = m[3].trim()
    const unitPrice = parseFloat(m[4].replace(',', '.')) || 0
    const quantity = parseInt(m[5].replace(/[,\.]/g, ''), 10) || 0
    results.push({
      name,
      manufacturer,
      category,
      unitPrice,
      quantity,
      totalValue: unitPrice * quantity,
    })
  }

  if (results.length === 0) {
    return [
      {
        name: 'Rękawice nitrylowe',
        manufacturer: 'Mercator',
        category: 'Ochrona',
        unitPrice: 0.22,
        quantity: 100000,
        totalValue: 0.22 * 100000,
      },
      {
        name: 'Strzykawka 2ml',
        manufacturer: 'BD',
        category: 'Iniekcja',
        unitPrice: 0.38,
        quantity: 50000,
        totalValue: 0.38 * 50000,
      },
    ]
  }

  return results
}

export async function generateSmartRecommendations(
  data: MaterialPriceRecord[],
): Promise<Recommendation[]> {
  if (!data || data.length === 0) {
    return [
      {
        id: 'hc-1',
        title: 'Przykładowa rekomendacja: Konsolidacja rękawic',
        description: 'Skonsoliduj zamówienia rękawic w jednym przetargu.',
        potentialSavings: 22000,
        priority: 'medium',
      },
      {
        id: 'hc-2',
        title: 'Przykładowa rekomendacja: Negocjacja strzykawek',
        description: 'Negocjacja cen u głównych dostawców strzykawek.',
        potentialSavings: 19000,
        priority: 'medium',
      },
    ]
  }

  const candidates = data
    .map((item) => ({
      ...item,
      potential: (item.unitPrice - item.benchmarkPrice) * item.quantity,
    }))
    .filter((i) => i.potential > 0)
    .sort((a, b) => b.potential - a.potential)
    .slice(0, 6)

  if (candidates.length === 0) return []

  return candidates.map((c, idx) => ({
    id: `hc-${idx + 1}`,
    title: `Przejrzyj pozycję: ${c.name}`,
    description: `Pozycja ${c.name} (${c.manufacturer}) wykazuje odchylenie od benchmarku. Rozważ renegocjację lub zamiennik.`,
    potentialSavings: Math.round(c.potential),
    priority: (c.potential > 50000 ? 'high' : c.potential > 15000 ? 'medium' : 'low') as Recommendation['priority'],
  }))
}
