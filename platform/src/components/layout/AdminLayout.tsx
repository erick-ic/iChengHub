'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from "next/link"
import {
  LayoutDashboard,
  Wrench,
  Lightbulb,
  Users,
  Link2,
  LogOut,
  FileText,
  Loader2,
  BarChart3,
  BookOpen
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 客户端检查是否已登录
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        if (!response.ok) {
          router.replace('/ibackendlogin')
        }
      } catch (error) {
        router.replace('/ibackendlogin')
      }
    }
    checkAuth()
  }, [router])

  const navItems = [
    { title: "控制面板", href: "/ibackend", icon: LayoutDashboard },
    { title: "数据看板", href: "/ibackend/dashboard", icon: BarChart3 },
    { title: "工具管理", href: "/ibackend/tools", icon: Wrench },
    { title: "导航管理", href: "/ibackend/links", icon: Link2 },
    { title: "提示词管理", href: "/ibackend/prompts", icon: Lightbulb },
    { title: "博客管理", href: "/ibackend/blogs", icon: BookOpen },
    { title: "提交管理", href: "/ibackend/submissions", icon: FileText },
    { title: "用户管理", href: "/ibackend/users", icon: Users },
  ]

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        router.replace('/')
      } else {
        console.error('Logout failed')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Logout failed:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r bg-slate-900 text-slate-200">
        <div className="flex h-16 items-center px-6">
          <Link
            href="/ibackend"
            className="flex items-baseline font-extrabold italic tracking-tighter hover:opacity-80 transition-opacity"
            style={{ fontFamily: "'Exo 2', sans-serif" }}
          >
            <span className="text-2xl text-white">iCheng</span>
            <span className="text-2xl text-[#e52129]">Hub</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-auto p-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href === '/ibackend' && pathname.startsWith('/ibackend') && !navItems.some(n => pathname === n.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-slate-800 text-[#e52129] border-l-2 border-[#e52129] ml-[-2px]' 
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="p-4">
          <Separator className="mb-4 bg-slate-700" />
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            onClick={() => setIsConfirmOpen(true)}
          >
            <LogOut className="mr-2 h-4 w-4" />
            退出
          </Button>
        </div>
      </aside>

      <div className="flex-1 ml-56 overflow-x-hidden">
        <main className="min-h-screen bg-slate-50/50 p-8">
          {children}
        </main>
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">确认退出</DialogTitle>
            <DialogDescription className="text-slate-500">
              确定要退出后台管理系统吗？退出后将返回网站首页。
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isLoading}
              className="flex-1 px-6 py-2.5 text-sm font-medium border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              取消
            </Button>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  退出中...
                </>
              ) : (
                '确认'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}