'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Wrench,
  Lightbulb,
  Users,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import './../globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap'
});

const navItems = [
  {
    title: "控制面板",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "工具管理",
    href: "/admin/tools",
    icon: Wrench,
  },
  {
    title: "提示词管理",
    href: "/admin/prompts",
    icon: Lightbulb,
  },
  {
    title: "用户管理",
    href: "/admin/users",
    icon: Users,
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  useEffect(() => {
    // 检查是否已退出（通过 localStorage 标记）
    const isLoggedOut = localStorage.getItem('admin_logged_out')
    if (isLoggedOut) {
      localStorage.removeItem('admin_logged_out')
      router.replace('/')
      return
    }

    // 监听浏览器返回按钮
    const handlePopState = () => {
      // 如果返回尝试访问后台，强制重定向到首页
      router.replace('/')
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [router])

  const handleLogout = () => {
    // 先关闭弹窗
    setIsConfirmOpen(false)
    // 设置退出标记
    localStorage.setItem('admin_logged_out', 'true')
    // 在新标签页打开首页
    window.open('/', '_blank')
    // 清空历史记录并替换为首页（防止通过返回按钮回到后台）
    window.history.pushState(null, '', '/')
    window.history.replaceState(null, '', '/')
    // 当前页面也重定向到首页
    setTimeout(() => {
      router.replace('/')
    }, 100)
  }

  return (
    <html lang="zh">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          {/* 侧边栏 */}
          <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r bg-slate-900 text-slate-200">
            <div className="flex h-16 items-center px-6">
              <div 
                className="flex items-baseline font-extrabold italic tracking-tighter" 
                style={{ fontFamily: "'Exo 2', sans-serif" }}
              >
                <span className="text-2xl text-white">iCheng</span>
                <span className="text-2xl text-[#e52129]">Hub</span>
              </div>
            </div>

            <nav className="flex-1 overflow-auto p-4">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-800 transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                ))}
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

          {/* 主内容区 */}
          <div className="flex-1 ml-56">
            {/* 内容 */}
            <main className="min-h-screen bg-slate-50/50 p-8">
              {children}
            </main>
          </div>
        </div>

        {/* 退出确认弹窗 */}
        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">确认退出</DialogTitle>
              <DialogDescription className="text-slate-500">
                确定要退出后台管理系统吗？退出后将返回网站首页。
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsConfirmOpen(false)}
              >
                取消
              </Button>
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600"
                onClick={handleLogout}
              >
                确认退出
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </body>
    </html>
  )
}