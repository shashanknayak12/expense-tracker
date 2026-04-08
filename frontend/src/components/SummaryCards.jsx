import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Calendar, Tag, LayoutGrid } from 'lucide-react'

function fmt(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0)
}

export default function SummaryCards({ summary, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-24" />
            </CardHeader>
            <CardContent>
              <div className="h-7 bg-muted rounded w-28 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const topCategory = summary?.byCategory
    ? Object.entries(summary.byCategory).sort(([, a], [, b]) => b - a)[0]
    : null

  const categoryCount = summary?.byCategory ? Object.keys(summary.byCategory).length : 0

  const cards = [
    {
      title: 'Total Spent',
      value: fmt(summary?.total),
      icon: DollarSign,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'This Month',
      value: fmt(summary?.thisMonthTotal),
      icon: Calendar,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Top Category',
      value: topCategory ? topCategory[0] : '—',
      sub: topCategory ? fmt(topCategory[1]) : '',
      icon: Tag,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Categories Used',
      value: categoryCount,
      icon: LayoutGrid,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.iconBg}`}>
              <card.icon className={`w-4 h-4 ${card.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{card.value}</div>
            {card.sub && <p className="text-xs text-muted-foreground mt-0.5">{card.sub}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
