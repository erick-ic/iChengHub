import { Users, Clock } from "lucide-react"

export default function UsersPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative inline-flex items-center justify-center w-24 h-24 bg-slate-100 rounded-full">
          <Users className="w-12 h-12 text-slate-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-800">用户管理</h1>
          <p className="text-slate-500">功能开发中，敬请期待</p>
        </div>
        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
          <Clock className="w-4 h-4" />
          <span>正在努力开发中...</span>
        </div>
      </div>
    </div>
  )
}