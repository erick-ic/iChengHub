'use client'

import { usePathname } from 'next/navigation'

const pageTitles: Record<string, string> = {
  '/admin': '仪表盘',
  '/admin/tools': '工具管理',
  '/admin/prompts': '提示词管理',
  '/admin/users': '用户管理',
}

export function Breadcrumb() {
  const pathname = usePathname()
  const title = pageTitles[pathname] || pathname.split('/').pop() || '页面'

  return (
    <nav className="flex items-center text-sm">
      <span className="text-slate-900 font-medium">{title}</span>
    </nav>
  )
}