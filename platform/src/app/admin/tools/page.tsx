import prisma from "@/lib/prisma"
import { ToolTable } from "@/components/admin/ToolTable"

export const dynamic = 'force-dynamic'

export default async function AdminToolsPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ''

  const tools = await prisma.toolCard.findMany({
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'desc' },
    ],
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { desc: { contains: query, mode: 'insensitive' } },
          ],
        }
      : undefined,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">工具管理</h1>
        <p className="text-slate-500 mt-1">管理所有 AI 工具卡片</p>
      </div>
      <ToolTable tools={tools} />
    </div>
  )
}