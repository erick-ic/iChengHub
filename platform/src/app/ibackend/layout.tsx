'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { logout } from '@/app/actions/authActions'
import {
  LayoutDashboard,
  Wrench,
  Lightbulb,
  Users,
  Link2,
  LogOut
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

const navItems = [
  {
    title: "控制面板",
    href: "/ibackend",
    icon: LayoutDashboard,
  },
  {
    title: "工具管理",
    href: "/ibackend/tools",
    icon: Wrench,
  },
  {
    title: "导航管理",
    href: "/ibackend/links",
    icon: Link2,
  },
  {
    title: "提示词管理",
    href: "/ibackend/prompts",
    icon: Lightbulb,
  },
  {
    title: "用户管理",
    href: "/ibackend/users",
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
    const isLoggedOut = localStorage.getItem('admin_logged_out')
    if (isLoggedOut) {
      localStorage.removeItem('admin_logged_out')
      router.replace('/')
      return
    }

    const handlePopState = () => {
      router.replace('/')
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [router])

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
          <form action={logout}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              <LogOut className="mr-2 h-4 w-4" />
              退出
            </Button>
          </form>
        </div>
      </aside>

      <div className="flex-1 ml-56">
        <main className="min-h-screen bg-slate-50/50 p-8">
          <Suspense fallback={<div className="flex items-center justify-center h-32">Loading...</div>}>
            {children}
          </Suspense>
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
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsConfirmOpen(false)}
            >
              取消
            </Button>
            <Button
              type="submit"
              form="logout-form"
              className="flex-1 bg-red-500 hover:bg-red-600"
            >
              确认退出
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}