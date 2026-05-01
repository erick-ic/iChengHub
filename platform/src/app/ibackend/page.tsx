import Link from "next/link"
import prisma from "@/lib/prisma"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Wrench,
  Lightbulb,
  Eye,
  Heart,
  Plus,
  ArrowUpRight
} from "lucide-react"

export default async function AdminDashboard() {
  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

  // 从数据库获取真实数据
  const [
    toolCount,
    promptCount,
    totalViews,
    totalLikes,
    recentPrompts,
    toolCountLastMonth,
    promptCountLastMonth,
    viewsLastMonth,
    likesLastMonth,
  ] = await Promise.all([
    prisma.toolCard.count(),
    prisma.prompt.count(),
    prisma.prompt.aggregate({ _sum: { views: true } }),
    prisma.prompt.aggregate({ _sum: { likes: true } }),
    prisma.prompt.findMany({
      orderBy: { createdAt: 'desc' },
      take: 4,
      select: {
        id: true,
        title: true,
        category: true,
        views: true,
        likes: true,
        createdAt: true,
      },
    }),
    prisma.toolCard.count({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    }),
    prisma.prompt.count({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    }),
    prisma.prompt.aggregate({
      _sum: { views: true },
      where: {
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    }),
    prisma.prompt.aggregate({
      _sum: { likes: true },
      where: {
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    }),
  ])

  const views = totalViews._sum.views || 0
  const likes = totalLikes._sum.likes || 0
  const viewsLast = viewsLastMonth._sum.views || 0
  const likesLast = likesLastMonth._sum.likes || 0

  // 计算环比变化
  const toolChange = toolCount - toolCountLastMonth
  const promptChange = promptCount - promptCountLastMonth
  const viewsChangePercent = viewsLast > 0 ? ((views - viewsLast) / viewsLast * 100).toFixed(1) : 0
  const likesChangePercent = likesLast > 0 ? ((likes - likesLast) / likesLast * 100).toFixed(1) : 0

  // 格式化数字显示
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

  // 格式化日期
  const formatDate = (date: Date): string => {
    const d = new Date(date)
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  }

  // 格式化变化值显示
  const formatChange = (value: number | string, isPercent: boolean = false): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value
    const sign = num > 0 ? '+' : ''
    return `较上月 ${sign}${isPercent ? num + '%' : num}`
  }

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">控制面板</h1>
        <p className="text-slate-500 mt-1">欢迎回来，查看最新的项目统计和操作</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总工具数</CardTitle>
            <Wrench className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{toolCount}</div>
            <p className={`text-xs mt-1 ${toolChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatChange(toolChange)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">提示词总数</CardTitle>
            <Lightbulb className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{promptCount}</div>
            <p className={`text-xs mt-1 ${promptChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatChange(promptChange)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总浏览量</CardTitle>
            <Eye className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(views)}</div>
            <p className={`text-xs mt-1 ${parseFloat(viewsChangePercent) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatChange(viewsChangePercent, true)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">点赞数</CardTitle>
            <Heart className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(likes)}</div>
            <p className={`text-xs mt-1 ${parseFloat(likesChangePercent) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatChange(likesChangePercent, true)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 内容区域 */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* 左侧：最近提示词 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>最近添加的提示词</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/ibackend/prompts">
                    查看全部
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <CardDescription>最近 7 天新增的提示词</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>提示词名称</TableHead>
                    <TableHead>分类</TableHead>
                    <TableHead className="text-right">浏览量</TableHead>
                    <TableHead className="text-right">点赞</TableHead>
                    <TableHead className="text-right">日期</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPrompts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-slate-500">
                        暂无提示词数据
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentPrompts.map((prompt) => (
                      <TableRow key={prompt.id}>
                        <TableCell className="font-medium">{prompt.title}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{prompt.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{prompt.views}</TableCell>
                        <TableCell className="text-right">{prompt.likes}</TableCell>
                        <TableCell className="text-right text-slate-500">
                          {formatDate(prompt.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：快捷操作 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>快捷操作</CardTitle>
              <CardDescription>快速执行常用操作</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" asChild>
                <Link href="/ibackend/tools">
                  <Plus className="mr-2 h-4 w-4" />
                  添加新工具
                </Link>
              </Button>
              <Button className="w-full justify-start" asChild variant="outline">
                <Link href="/ibackend/prompts">
                  <Plus className="mr-2 h-4 w-4" />
                  发布提示词
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>系统状态</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">数据库</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  正常
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API 服务</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  正常
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">缓存</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  正常
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}