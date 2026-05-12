'use client'

import { FolderOpen } from 'lucide-react'

interface PathItem {
  path: string
  count: number
  percent: number
}

interface TopPathsProps {
  data: PathItem[]
}

const rankColors = ['#e52129', '#f97316', '#f59e0b', '#9ca3af', '#d1d5db']

export function TopPaths({ data }: TopPathsProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-4 text-slate-400">
        <FolderOpen className="w-8 h-8 mb-3 opacity-50" />
        <p className="text-sm">暂无路径数据</p>
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {data.map((item, index) => (
        <div 
          key={item.path} 
          className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50 px-1 -mx-1 transition-colors"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <span 
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" 
              style={{ backgroundColor: rankColors[index] }}
            >
              {index + 1}
            </span>
            <span className="truncate text-sm text-slate-700">{item.path}</span>
          </div>
          <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{item.count}次</span>
        </div>
      ))}
    </div>
  )
}