import PromptCard, { PromptData } from '@/components/PromptCard';
import prisma from '@/lib/prisma';

const mockPrompts: PromptData[] = [
  {
    id: '1',
    imageUrl: 'http://cdn-hsyq-static.shanhutech.cn/bizhi/staticwp/202506/3ed08f02b5306ab9f8728e17251a3216--4192779278.jpg',
    title: 'DeepSeek 学术写作助手',
    category: '学术写作',
    promptText: '请帮我撰写一篇关于人工智能在教育领域应用的学术论文，要求包含摘要、引言、文献综述、研究方法、结果分析和结论部分，字数不少于5000字，使用APA格式引用参考文献。',
    views: 1256,
    likes: 328,
    comments: 56,
  },
  {
    id: '2',
    imageUrl: 'http://cdn-hsyq-static.shanhutech.cn/bizhi/staticwp/202505/a22807b9f97e6f643b1aed9f325bf919--2702915091.jpg',
    title: 'Kimi 代码审查专家',
    category: '编程开发',
    promptText: '作为资深代码审查专家，请检查以下代码的质量、安全性、性能和可维护性，提供详细的改进建议和优化方案。请特别关注潜在的bug、安全漏洞和性能瓶颈。',
    views: 892,
    likes: 215,
    comments: 34,
  },
  {
    id: '3',
    imageUrl: 'http://cdn-hsyq-static.shanhutech.cn/bizhi/staticwp/202503/66ed1c952cbd728a34f4dc060bc17065--4141980737.jpg',
    title: 'GPT-4 营销文案生成器',
    category: '市场营销',
    promptText: '你是一位资深的营销文案专家，请为以下产品生成5个不同风格的营销文案，包括：吸引眼球的标题、激发购买欲望的描述、紧迫感文案和行动号召按钮文字。每个文案控制在100字以内。',
    views: 2341,
    likes: 567,
    comments: 89,
  },
  {
    id: '4',
    imageUrl: 'http://cdn-hsyq-static.shanhutech.cn/bizhi/staticwp/202411/90008de0a0a2a09528daa77afa3c931a--3863040429.jpg',
    title: 'Claude 思维导图设计师',
    category: '创意设计',
    promptText: '请设计一个关于"2024年科技趋势"的思维导图，包含至少8个主要分支和每个分支的3个子主题。使用树状结构展示，确保层次清晰、逻辑严谨，适合用于商业演讲或教学演示。',
    views: 1567,
    likes: 423,
    comments: 67,
  },
  {
    id: '5',
    imageUrl: 'http://cdn-hsyq-static.shanhutech.cn/bizhi/staticwp/202410/2f6a7726d778a393bc1170baebe7761f--4183847649.jpg',
    title: 'Gemini 视频脚本创作助手',
    category: '视频创作',
    promptText: '作为专业的视频脚本创作者，请为以下主题创作一个3分钟的教育类视频脚本。要求包含：开场hook、知识点讲解、案例展示、总结回顾和结尾CTA。同时提供每个场景的分镜头建议。',
    views: 1089,
    likes: 289,
    comments: 45,
  },
  {
    id: '6',
    imageUrl: 'http://cdn-hsyq-static.shanhutech.cn/bizhi/staticwp/202408/aa5f5cb60290872203fcd14dfa10e9d5--2308701055.jpg',
    title: 'Stable Diffusion 提示词工程师',
    category: 'AI绘图',
    promptText: '请为以下描述创作5个高质量的Stable Diffusion提示词：一个未来城市的夜景，赛博朋克风格，包含霓虹灯、高楼大厦、飞行汽车等元素。每个提示词需要包含主体描述、风格修饰、光线处理和画质要求。',
    views: 3421,
    likes: 876,
    comments: 123,
  },
];

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPrompts.map((prompt) => (
          <PromptCard key={prompt.id} data={prompt} />
        ))}
      </div>
    </section>
  );
}