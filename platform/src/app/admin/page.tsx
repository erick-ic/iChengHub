import Link from "next/link"
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

// Mock 数据
const recentPrompts = [
  {
    id: "1",
    title: "DeepSeek 学术写作助手",
    category: "学术写作",
    views: 1256,
    likes: 328,
    date: "2026-04-30",
  },
  {
    id: "2",
    title: "Kimi 代码审查专家",
    category: "编程开发",
    views: 892,
    likes: 215,
    date: "2026-04-29",
  },
  {
    id: "3",
    title: "GPT-4 营销文案生成器",
    category: "市场营销",
    views: 2341,
    likes: 567,
    date: "2026-04-28",
  },
  {
    id: "4",
    title: "Claude 思维导图设计师",
    category: "创意设计",
    views: 1567,
    likes: 423,
    date: "2026-04-27",
  },
]

export default function AdminDashboard() {
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
            <div className="text-3xl font-bold">6</div>
            <p className="text-xs text-slate-500 mt-1">较上月 +2</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">提示词总数</CardTitle>
            <Lightbulb className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-xs text-slate-500 mt-1">较上月 +8</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总浏览量</CardTitle>
            <Eye className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12.6k</div>
            <p className="text-xs text-slate-500 mt-1">较上月 +18.2%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">点赞数</CardTitle>
            <Heart className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1.8k</div>
            <p className="text-xs text-slate-500 mt-1">较上月 +12.5%</p>
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
                  <Link href="/admin/prompts">
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
                  {recentPrompts.map((prompt) => (
                    <TableRow key={prompt.id}>
                      <TableCell className="font-medium">{prompt.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{prompt.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{prompt.views}</TableCell>
                      <TableCell className="text-right">{prompt.likes}</TableCell>
                      <TableCell className="text-right text-slate-500">
                        {prompt.date}
                      </TableCell>
                    </TableRow>
                  ))}
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
                <Link href="/admin/tools/new">
                  <Plus className="mr-2 h-4 w-4" />
                  添加新工具
                </Link>
              </Button>
              <Button className="w-full justify-start" asChild variant="outline">
                <Link href="/admin/prompts/new">
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