'use client'

import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts'

interface HourlyData {
  hour: string
  count: number
}

interface HourlyChartProps {
  data: HourlyData[]
}

export function HourlyChart({ data }: HourlyChartProps) {
  const hasData = data.some(d => d.count > 0)
  
  if (!hasData) {
    return (
      <div className="h-24 flex items-center justify-center text-slate-400 text-sm">
        暂无时段数据
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={data} layout="horizontal" margin={{ left: 0, right: 0, top: 0, bottom: 2 }}>
        <XAxis 
          type="category" 
          dataKey="hour" 
          tick={{ fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value) => [`${value}次`]}
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '11px',
            padding: '4px 8px'
          }}
        />
        <Bar 
          dataKey="count" 
          fill="#e52129" 
          radius={[2, 2, 0, 0]}
          barSize={18}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}