import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Pie, PieChart, Cell } from 'recharts'

const PALETTE = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#6366f1',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#64748b',
]

function fmt(v) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)
}

export default function CategoryBreakdown({ summary }) {
  const raw = summary?.byCategory
    ? Object.entries(summary.byCategory).sort(([, a], [, b]) => b - a)
    : []

  const total = raw.reduce((s, [, v]) => s + v, 0)

  const data = raw.map(([name, value], i) => ({
    name,
    value: parseFloat(value.toFixed(2)),
    fill: PALETTE[i % PALETTE.length],
  }))

  const chartConfig = Object.fromEntries(
    data.map((d) => [d.name, { label: d.name, color: d.fill }])
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>By Category</CardTitle>
        <CardDescription>Breakdown of all-time spending</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-[260px] text-muted-foreground text-sm">
            No data yet
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} stroke="transparent" />
                  ))}
                </Pie>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => [fmt(value), '']}
                      nameKey="name"
                    />
                  }
                />
              </PieChart>
            </ChartContainer>

            {/* Legend */}
            <div className="space-y-1.5">
              {data.map((entry) => (
                <div key={entry.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-sm"
                      style={{ backgroundColor: entry.fill }}
                    />
                    <span className="truncate text-muted-foreground">{entry.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="font-medium tabular-nums">{fmt(entry.value)}</span>
                    <span className="text-muted-foreground w-10 text-right">
                      {total > 0 ? `${((entry.value / total) * 100).toFixed(0)}%` : '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
