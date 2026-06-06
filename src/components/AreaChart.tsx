/* Tremor AreaChart [v1.0.0] — legend scroll uses @heroicons/react */
import {
  AvailableChartColors,
  constructCategoryColors,
  getColorClassName,
  getYAxisDomain,
  hasOnlyOneValueForKey,
  type AvailableChartColorsKeys,
} from '@/lib/chartUtils'
import { useOnWindowResize } from '@/lib/useOnWindowResize'
import { cx } from '@/lib/utils'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import React from 'react'
import {
  Area,
  CartesianGrid,
  Label,
  Line,
  AreaChart as RechartsAreaChart,
  Legend as RechartsLegend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { AxisDomain } from 'recharts/types/util/types'

interface LegendItemProps {
  name: string
  color: AvailableChartColorsKeys
  onClick?: (name: string, color: AvailableChartColorsKeys) => void
  activeLegend?: string
  compact?: boolean
}

function LegendItem({ name, color, onClick, activeLegend, compact }: LegendItemProps) {
  const hasOnValueChange = !!onClick
  return (
    <li
      className={cx(
        'group inline-flex flex-nowrap items-center whitespace-nowrap transition',
        compact ? 'gap-1 rounded-sm px-1 py-0.5' : 'gap-1.5 rounded-sm px-2 py-1',
        hasOnValueChange
          ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800'
          : 'cursor-default',
      )}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(name, color)
      }}
    >
      <span
        className={cx(
          'h-[3px] w-3.5 shrink-0 rounded-full',
          getColorClassName(color, 'bg'),
          activeLegend && activeLegend !== name ? 'opacity-40' : 'opacity-100',
        )}
        aria-hidden
      />
      <p
        className={cx(
          'truncate whitespace-nowrap text-gray-700 dark:text-gray-300',
          compact ? 'text-[10px]' : 'text-xs',
          hasOnValueChange && 'group-hover:text-gray-900 dark:group-hover:text-gray-50',
          activeLegend && activeLegend !== name ? 'opacity-40' : 'opacity-100',
        )}
      >
        {name}
      </p>
    </li>
  )
}

function ScrollButton({
  icon: Icon,
  onClick,
  disabled,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  onClick?: () => void
  disabled?: boolean
}) {
  const [isPressed, setIsPressed] = React.useState(false)
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  React.useEffect(() => {
    if (isPressed) {
      intervalRef.current = setInterval(() => onClick?.(), 300)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPressed, onClick])

  React.useEffect(() => {
    if (disabled) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setIsPressed(false)
    }
  }, [disabled])

  return (
    <button
      type="button"
      className={cx(
        'group inline-flex size-5 items-center truncate rounded-sm transition',
        disabled
          ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
          : 'cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50',
      )}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
        setIsPressed(true)
      }}
      onMouseUp={(e) => {
        e.stopPropagation()
        setIsPressed(false)
      }}
    >
      <Icon className="size-full" aria-hidden />
    </button>
  )
}

interface LegendProps extends React.OlHTMLAttributes<HTMLOListElement> {
  categories: string[]
  colors?: AvailableChartColorsKeys[]
  onClickLegendItem?: (category: string, color: string) => void
  activeLegend?: string
  enableLegendSlider?: boolean
  compact?: boolean
}

const Legend = React.forwardRef<HTMLOListElement, LegendProps>((props, ref) => {
  const {
    categories,
    colors = AvailableChartColors,
    className,
    onClickLegendItem,
    activeLegend,
    enableLegendSlider = false,
    compact,
    ...other
  } = props
  const scrollableRef = React.useRef<HTMLDivElement>(null)
  const [hasScroll, setHasScroll] = React.useState<{ left: boolean; right: boolean } | null>(null)

  const checkScroll = React.useCallback(() => {
    const scrollable = scrollableRef.current
    if (!scrollable) return
    setHasScroll({
      left: scrollable.scrollLeft > 0,
      right: scrollable.scrollWidth - scrollable.clientWidth > scrollable.scrollLeft,
    })
  }, [])

  useOnWindowResize(checkScroll)

  React.useEffect(() => {
    checkScroll()
  }, [checkScroll, categories])

  const scrollTo = (direction: 'left' | 'right') => {
    const element = scrollableRef.current
    if (!element || !enableLegendSlider) return
    const width = element.clientWidth
    element.scrollTo({
      left: direction === 'left' ? element.scrollLeft - width : element.scrollLeft + width,
      behavior: 'smooth',
    })
    setTimeout(checkScroll, 400)
  }

  return (
    <ol ref={ref} className={cx('relative overflow-hidden', className)} {...other}>
      <div
        ref={scrollableRef}
        className={cx(
          'flex h-full',
          enableLegendSlider && (hasScroll?.left || hasScroll?.right)
            ? 'snap-mandatory items-center overflow-auto pr-12 pl-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
            : 'flex-wrap',
        )}
      >
        {categories.map((category, index) => (
          <LegendItem
            key={category}
            name={category}
            color={colors[index] as AvailableChartColorsKeys}
            onClick={onClickLegendItem}
            activeLegend={activeLegend}
            compact={compact}
          />
        ))}
      </div>
      {enableLegendSlider && (hasScroll?.left || hasScroll?.right) ? (
        <div className="absolute top-0 right-0 bottom-0 flex h-full items-center justify-center bg-white pr-1 dark:bg-gray-950">
          <ScrollButton icon={ChevronLeftIcon} onClick={() => scrollTo('left')} disabled={!hasScroll?.left} />
          <ScrollButton icon={ChevronRightIcon} onClick={() => scrollTo('right')} disabled={!hasScroll?.right} />
        </div>
      ) : null}
    </ol>
  )
})
Legend.displayName = 'Legend'

type PayloadItem = {
  category: string
  value: number
  index: string
  color: AvailableChartColorsKeys
  type?: string
  payload: Record<string, unknown>
}

export type TooltipProps = {
  active: boolean | undefined
  payload: PayloadItem[]
  label: string
}

function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
  compact,
}: {
  active: boolean | undefined
  payload: PayloadItem[]
  label: string
  valueFormatter: (value: number) => string
  compact?: boolean
}) {
  if (!active || !payload?.length) return null
  return (
    <div
      className={cx(
        'rounded-md border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-950',
        compact ? 'text-[10px]' : 'text-sm',
      )}
    >
      <div className={cx('border-b border-inherit', compact ? 'px-2.5 py-1.5' : 'px-4 py-2')}>
        <p className="font-medium text-gray-900 dark:text-gray-50">{label}</p>
      </div>
      <div className={cx('space-y-1', compact ? 'px-2.5 py-1.5' : 'px-4 py-2')}>
        {payload.map(({ value, category, color }, index) => (
          <div key={index} className="flex items-center justify-between space-x-8">
            <div className="flex items-center space-x-2">
              <span
                aria-hidden
                className={cx('h-[3px] w-3.5 shrink-0 rounded-full', getColorClassName(color, 'bg'))}
              />
              <p className="text-right whitespace-nowrap text-gray-700 dark:text-gray-300">{category}</p>
            </div>
            <p className="text-right font-medium whitespace-nowrap text-gray-900 tabular-nums dark:text-gray-50">
              {valueFormatter(value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

type ActiveDot = { index?: number; dataKey?: string }

type BaseEventProps = {
  eventType: 'dot' | 'category'
  categoryClicked: string
  [key: string]: number | string
}

export type AreaChartEventProps = BaseEventProps | null | undefined

export interface AreaChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Record<string, string | number>[]
  index: string
  categories: string[]
  colors?: AvailableChartColorsKeys[]
  valueFormatter?: (value: number) => string
  yAxisValueFormatter?: (value: number) => string
  startEndOnly?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showGridLines?: boolean
  yAxisWidth?: number
  showTooltip?: boolean
  showLegend?: boolean
  autoMinValue?: boolean
  minValue?: number
  maxValue?: number
  allowDecimals?: boolean
  onValueChange?: (value: AreaChartEventProps) => void
  enableLegendSlider?: boolean
  tickGap?: number
  xAxisLabel?: string
  yAxisLabel?: string
  legendPosition?: 'left' | 'center' | 'right'
  fill?: 'gradient' | 'solid' | 'none'
  compact?: boolean
  strokeWidth?: number
}

export const AreaChart = React.forwardRef<HTMLDivElement, AreaChartProps>((props, ref) => {
  const {
    data = [],
    categories = [],
    index,
    colors = AvailableChartColors,
    valueFormatter = (value: number) => value.toString(),
    yAxisValueFormatter,
    startEndOnly = false,
    showXAxis = true,
    showYAxis = true,
    showGridLines = true,
    yAxisWidth = 56,
    showTooltip = true,
    showLegend = true,
    autoMinValue = false,
    minValue,
    maxValue,
    allowDecimals = true,
    className,
    onValueChange,
    enableLegendSlider = false,
    tickGap = 5,
    xAxisLabel,
    yAxisLabel,
    legendPosition = 'right',
    fill = 'gradient',
    compact = false,
    strokeWidth = 2,
    ...other
  } = props

  const paddingValue =
    (!showXAxis && !showYAxis) || (startEndOnly && !showYAxis) ? 0 : compact ? 12 : 20
  const legendHeight = compact ? 28 : 60
  const tickFontSize = compact ? 8 : 12
  const tickClassName = compact
    ? 'fill-gray-500 dark:fill-gray-500'
    : 'fill-gray-500 text-xs dark:fill-gray-500'
  const formatYAxisTick = yAxisValueFormatter ?? valueFormatter
  const [activeDot, setActiveDot] = React.useState<ActiveDot | undefined>(undefined)
  const [activeLegend, setActiveLegend] = React.useState<string | undefined>(undefined)
  const categoryColors = constructCategoryColors(categories, colors)
  const yAxisDomain = getYAxisDomain(autoMinValue, minValue, maxValue)
  const hasOnValueChange = !!onValueChange
  const areaId = React.useId()

  const getFillContent = (
    fillType: AreaChartProps['fill'],
    category: string,
  ) => {
    const stopOpacity =
      activeDot || (activeLegend && activeLegend !== category) ? 0.12 : compact ? 0.55 : 0.3
    switch (fillType) {
      case 'none':
        return <stop stopColor="currentColor" stopOpacity={0} />
      case 'solid':
        return <stop stopColor="currentColor" stopOpacity={stopOpacity} />
      case 'gradient':
      default:
        return (
          <>
            <stop offset="5%" stopColor="currentColor" stopOpacity={stopOpacity} />
            <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
          </>
        )
    }
  }

  const onCategoryClick = (dataKey: string) => {
    if (!hasOnValueChange) return
    if (
      (dataKey === activeLegend && !activeDot) ||
      (hasOnlyOneValueForKey(data, dataKey) && activeDot?.dataKey === dataKey)
    ) {
      setActiveLegend(undefined)
      onValueChange?.(null)
    } else {
      setActiveLegend(dataKey)
      onValueChange?.({ eventType: 'category', categoryClicked: dataKey })
    }
    setActiveDot(undefined)
  }

  return (
    <div ref={ref} className={cx('h-80 w-full', className)} tremor-id="tremor-raw" {...other}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data}
          onClick={
            hasOnValueChange && (activeLegend || activeDot)
              ? () => {
                  setActiveDot(undefined)
                  setActiveLegend(undefined)
                  onValueChange?.(null)
                }
              : undefined
          }
          margin={{
            bottom: xAxisLabel ? 30 : undefined,
            left: yAxisLabel ? 20 : undefined,
            right: yAxisLabel ? 5 : undefined,
            top: 5,
          }}
        >
          {showGridLines ? (
            <CartesianGrid className="stroke-gray-200 stroke-1 dark:stroke-gray-800" horizontal vertical={false} />
          ) : null}
          <XAxis
            padding={{ left: paddingValue, right: paddingValue }}
            hide={!showXAxis}
            dataKey={index}
            interval={startEndOnly ? 'preserveStartEnd' : 'equidistantPreserveStart'}
            tick={{ transform: 'translate(0, 4)', fontSize: tickFontSize }}
            ticks={startEndOnly ? [data[0]?.[index], data[data.length - 1]?.[index]] : undefined}
            fill=""
            stroke=""
            className={tickClassName}
            tickLine={false}
            axisLine={false}
            minTickGap={tickGap}
          >
            {xAxisLabel ? (
              <Label position="insideBottom" offset={-20} className="fill-gray-800 text-sm font-medium dark:fill-gray-200">
                {xAxisLabel}
              </Label>
            ) : null}
          </XAxis>
          <YAxis
            width={yAxisWidth}
            hide={!showYAxis}
            axisLine={false}
            tickLine={false}
            type="number"
            domain={yAxisDomain as AxisDomain}
            tick={{ transform: 'translate(-2, 0)', fontSize: tickFontSize }}
            fill=""
            stroke=""
            className={tickClassName}
            tickFormatter={formatYAxisTick}
            tickMargin={compact ? 2 : 4}
            allowDecimals={allowDecimals}
          >
            {yAxisLabel ? (
              <Label
                position="insideLeft"
                style={{ textAnchor: 'middle' }}
                angle={-90}
                offset={-15}
                className="fill-gray-800 text-sm font-medium dark:fill-gray-200"
              >
                {yAxisLabel}
              </Label>
            ) : null}
          </YAxis>
          <Tooltip
            wrapperStyle={{ outline: 'none' }}
            isAnimationActive
            animationDuration={100}
            cursor={{ stroke: '#d1d5db', strokeWidth: 1 }}
            offset={20}
            content={({ active, payload, label }) => {
              if (!showTooltip || !active || !payload?.length) return null
              const cleanPayload: PayloadItem[] = payload.map((item) => ({
                category: String(item.dataKey),
                value: Number(item.value),
                index: String(label),
                color: categoryColors.get(String(item.dataKey)) as AvailableChartColorsKeys,
                type: item.type,
                payload: item.payload as Record<string, unknown>,
              }))
              return (
                <ChartTooltip
                  active={active}
                  payload={cleanPayload}
                  label={String(label)}
                  valueFormatter={valueFormatter}
                  compact={compact}
                />
              )
            }}
          />
          {showLegend ? (
            <RechartsLegend
              verticalAlign="top"
              height={legendHeight}
              content={({ payload }) => (
                <div
                  className={cx('flex items-center', {
                    'justify-center': legendPosition === 'center',
                    'justify-start': legendPosition === 'left',
                    'justify-end': legendPosition === 'right',
                  })}
                  style={{ paddingLeft: legendPosition === 'left' && yAxisWidth ? yAxisWidth - 8 : 0 }}
                >
                  <Legend
                    categories={(payload ?? [])
                      .filter((item) => item.type !== 'none')
                      .map((entry) => String(entry.value))}
                    colors={(payload ?? [])
                      .filter((item) => item.type !== 'none')
                      .map((entry) => categoryColors.get(String(entry.value)) as AvailableChartColorsKeys)}
                    onClickLegendItem={hasOnValueChange ? onCategoryClick : undefined}
                    activeLegend={activeLegend}
                    enableLegendSlider={enableLegendSlider}
                    compact={compact}
                  />
                </div>
              )}
            />
          ) : null}
          {categories.map((category) => {
            const categoryId = `${areaId}-${category.replace(/[^a-zA-Z0-9]/g, '')}`
            const color = categoryColors.get(category) as AvailableChartColorsKeys
            return (
              <React.Fragment key={category}>
                <defs>
                  <linearGradient className={getColorClassName(color, 'text')} id={categoryId} x1="0" y1="0" x2="0" y2="1">
                    {getFillContent(fill, category)}
                  </linearGradient>
                </defs>
                <Area
                  className={getColorClassName(color, 'stroke')}
                  strokeOpacity={activeDot || (activeLegend && activeLegend !== category) ? 0.3 : 1}
                  activeDot={hasOnValueChange}
                  dot={false}
                  name={category}
                  type="linear"
                  dataKey={category}
                  stroke=""
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  isAnimationActive={false}
                  fill={`url(#${categoryId})`}
                />
                {hasOnValueChange ? (
                  <Line
                    className="cursor-pointer"
                    strokeOpacity={0}
                    name={category}
                    type="linear"
                    dataKey={category}
                    stroke="transparent"
                    fill="transparent"
                    legendType="none"
                    tooltipType="none"
                    strokeWidth={12}
                    onClick={(lineProps: { name?: string }, event: React.MouseEvent) => {
                      event.stopPropagation()
                      if (lineProps.name) onCategoryClick(lineProps.name)
                    }}
                  />
                ) : null}
              </React.Fragment>
            )
          })}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  )
})
AreaChart.displayName = 'AreaChart'
