import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts'
import { format, parseISO } from 'date-fns'

const chartConfig = {
  amount: {
    label: 'Spending',
    color: 'hsl(var(--chart-1))',
  },
}

export default function MonthlyTrends({ summary }) {
  const data = summary?.monthly
    ? Object.entries(summary.monthly)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6)
        .map(([month, amount]) => ({
          month: format(parseISO(`${month}-01`), 'MMM yy'),
          amount: parseFloat(amount.toFixed(2)),
        }))
    : []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spending</CardTitle>
        <CardDescription>Last 6 months of expenses</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-[260px] text-muted-foreground text-sm">
            No data yet
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                width={48}
              />
              <ChartTooltip
                cursor={{ fill: 'hsl(var(--muted))', radius: 4 }}
                content={
                  <ChartTooltipContent
                    formatter={(value) => [
                      `$${Number(value).toFixed(2)}`,
                      'Spending',
                    ]}
                  />
                }
              />
              <Bar
                dataKey="amount"
                fill="var(--color-amount)"
                radius={[4, 4, 0, 0]}
                maxBarSize={56}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
