'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface LanguageData {
  name: string
  value: number
  percent: number
}

interface LanguagePieChartProps {
  data: LanguageData[]
}

const COLORS = ['#e52129', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']

export function LanguagePieChart({ data }: LanguagePieChartProps) {
  const hasData = data.length > 0 && data.some(item => item.value > 0)
  
  if (!hasData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-sm text-slate-400">暂无语种数据</span>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={28}
          outerRadius={40}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value}次`, name]}
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}