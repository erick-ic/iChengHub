import PromptCard, { PromptData } from '@/components/PromptCard';
import prisma from '@/lib/prisma';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function PromptsPage({ params }: PageProps) {
  const { locale } = await params;
  const isEnglish = locale === 'en';

  const prompts = await prisma.prompt.findMany({
    where: { status: 1 },
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'desc' },
    ],
  });

  const promptData: PromptData[] = prompts.map(prompt => ({
    id: prompt.id,
    toolId: prompt.toolId,
    imageUrl: prompt.imageUrl,
    title: isEnglish ? (prompt.titleEn || prompt.title) : prompt.title,
    category: isEnglish ? (prompt.categoryEn || prompt.category) : prompt.category,
    promptText: prompt.promptText,
    views: prompt.views,
    likes: prompt.likes,
    comments: prompt.comments,
  }));

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-4">
          {isEnglish ? 'Sharing Tips for Viral Keywords Prompts Library' : '爆款提示词分享提示词词库'}
        </h1>
        <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
          {isEnglish ? 'Explore carefully curated prompts to help you unleash the full power of AI tools' : '探索精心策划的提示词，帮助你充分发挥 AI 工具的强大能力'}
        </p>
      </div>

      {promptData.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-6xl mb-6">📭</div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-3">{isEnglish ? 'No prompts yet' : '暂无提示词'}</h2>
          <p className="text-zinc-500">{isEnglish ? 'Please check back later' : '敬请期待更多精彩内容'}</p>
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
