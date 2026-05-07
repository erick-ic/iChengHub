import prisma from "@/lib/prisma"
import { LinkTable } from "@/components/admin/LinkTable"

export const dynamic = 'force-dynamic'

export default async function AdminLinksPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ''

  const links = await prisma.navLink.findMany({
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'desc' },
    ],
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { desc: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
          ],
        }
      : undefined,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">导航管理</h1>
        <p className="text-slate-500 mt-1">管理所有导航链接卡片</p>
      </div>
      <LinkTable links={links} />
    </div>
  )
}