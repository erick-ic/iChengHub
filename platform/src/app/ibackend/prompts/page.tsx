import { PrismaClient } from '@prisma/client'
import { PromptTable } from '@/components/admin/PromptTable'

const prisma = new PrismaClient()

export default async function PromptsPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams?.q || ''
  
  const prompts = await prisma.prompt.findMany({
    where: query
      ? {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { titleEn: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
            { categoryEn: { contains: query, mode: 'insensitive' } },
            { promptText: { contains: query, mode: 'insensitive' } },
          ],
        }
      : {},
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">提示词管理</h1>
        <p className="text-slate-500 mt-1">管理所有提示词</p>
      </div>
      <PromptTable prompts={prompts} />
    </div>
  )
}