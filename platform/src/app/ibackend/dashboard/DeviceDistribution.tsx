'use client'

import { Smartphone, Monitor } from 'lucide-react'

interface DeviceData {
  name: string
  value: number
  percent: number
  type: 'mobile' | 'desktop'
}

interface DeviceDistributionProps {
  data: DeviceData[]
}

export function DeviceDistribution({ data }: DeviceDistributionProps) {
  const mobileData = data.find(d => d.type === 'mobile')
  const desktopData = data.find(d => d.type === 'desktop')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Smartphone className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <span className="text-sm text-slate-700">移动端</span>
            <p className="text-xs text-slate-400">{mobileData?.value || 0} 次访问</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-700"
              style={{ width: `${mobileData?.percent || 0}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-800 w-10 text-right">{mobileData?.percent || 0}%</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
            <Monitor className="w-4 h-4 text-green-500" />
          </div>
          <div>
            <span className="text-sm text-slate-700">PC 端</span>
            <p className="text-xs text-slate-400">{desktopData?.value || 0} 次访问</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-700"
              style={{ width: `${desktopData?.percent || 0}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-800 w-10 text-right">{desktopData?.percent || 0}%</span>
        </div>
      </div>
    </div>
  )
}