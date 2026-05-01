import PromptCard, { PromptData } from '@/components/PromptCard';
import prisma from '@/lib/prisma';

interface PageProps {
  params: Promise<{ locale: string; toolId: string }>;
}

export default async function PromptsPage({ params }: PageProps) {
  const { toolId } = await params;

  // 获取工具信息
  const tool = await prisma.toolCard.findUnique({
    where: { id: toolId },
    select: { name: true, logoUrl: true },
  });

  // 获取启用的提示词，按排序排序
  const prompts = await prisma.prompt.findMany({
    where: { status: 1 },
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'desc' },
    ],
  });

  // 转换为 PromptData 格式
  const promptData: PromptData[] = prompts.map(prompt => ({
    id: prompt.id,
    imageUrl: prompt.imageUrl,
    title: prompt.title,
    category: prompt.category,
    promptText: prompt.promptText,
    views: prompt.views,
    likes: prompt.likes,
    comments: prompt.comments,
  }));

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-4">
          {tool?.name || '精选'}提示词库
        </h1>
        <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
          探索精心策划的提示词，帮助你充分发挥 AI 工具的强大能力
        </p>
      </div>

      {promptData.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-6xl mb-6">📭</div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-3">暂无提示词</h2>
          <p className="text-zinc-500">该工具的提示词内容正在筹备中，请稍后再来</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promptData.map((prompt) => (
            <PromptCard key={prompt.id} data={prompt} />
          ))}
        </div>
      )}
    </section>
  );
}