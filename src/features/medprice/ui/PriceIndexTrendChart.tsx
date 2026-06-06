import { AreaChart } from '@/components/AreaChart'

const chartData = [
  { miesiac: 'Sty', Szpital: 103, Benchmark: 99 },
  { miesiac: 'Lut', Szpital: 104, Benchmark: 98 },
  { miesiac: 'Mar', Szpital: 103, Benchmark: 99 },
  { miesiac: 'Kwi', Szpital: 105, Benchmark: 98 },
  { miesiac: 'Maj', Szpital: 104, Benchmark: 99 },
  { miesiac: 'Cze', Szpital: 106, Benchmark: 98 },
  { miesiac: 'Lip', Szpital: 105, Benchmark: 99 },
  { miesiac: 'Sie', Szpital: 107, Benchmark: 98 },
  { miesiac: 'Wrz', Szpital: 106, Benchmark: 99 },
  { miesiac: 'Paź', Szpital: 107, Benchmark: 98 },
  { miesiac: 'Lis', Szpital: 106, Benchmark: 99 },
  { miesiac: 'Gru', Szpital: 107, Benchmark: 99 },
]

export function PriceIndexTrendChart() {
  return (
    <AreaChart
      className="h-56"
      compact
      data={chartData}
      index="miesiac"
      categories={['Szpital', 'Benchmark']}
      colors={['pink', 'emerald']}
      valueFormatter={(number: number) => `${number.toFixed(0)}%`}
      yAxisValueFormatter={(number: number) => `${number.toFixed(0)}%`}
      autoMinValue
      minValue={96}
      maxValue={110}
      yAxisWidth={40}
      allowDecimals={false}
      strokeWidth={2}
      legendPosition="center"
      tickGap={4}
    />
  )
}
