import PromptDetailCard, { PromptDetailData } from '@/components/PromptDetailCard';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Eye, Heart, MessageCircle } from 'lucide-react';
import { Link } from '@/navigation';
import ViewsTracker from '@/components/ViewsTracker';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ locale: string; promptId: string }>;
}

export default async function PromptDetailPage({ params }: PageProps) {
  const { locale, promptId } = await params;
  const isEnglish = locale === 'en';

  const prompt = await prisma.prompt.findUnique({
    where: { id: promptId },
  });

  if (!prompt || prompt.status !== 1) {
    notFound();
  }

  const tool = await prisma.toolCard.findUnique({
    where: { id: prompt.toolId },
  });

  const toolName = isEnglish ? (tool?.nameEn || tool?.name) : (tool?.name || '');
  const promptTitle = isEnglish ? (prompt.titleEn || prompt.title) : prompt.title;
  const category = isEnglish ? (prompt.categoryEn || prompt.category) : prompt.category;

  const promptData: PromptDetailData = {
    id: prompt.id,
    title: prompt.title,
    titleEn: prompt.titleEn,
    promptText: prompt.promptText,
  };

  const isPortrait = prompt.imageHeight && prompt.imageWidth 
    ? prompt.imageHeight > prompt.imageWidth 
    : false;

  if (isPortrait) {
    return (
      <>
        <ViewsTracker promptId={promptId} />
        <div className="min-h-screen relative overflow-hidden bg-black">
          <Image
            src={prompt.imageUrl}
            alt={promptTitle}
            fill
            className="absolute inset-0 w-full h-full object-cover"
            unoptimized={prompt.imageUrl?.startsWith('http')}
          />
          <div className="absolute inset-0 bg-black/60" />

          <div className="absolute top-8 left-8 right-8 z-10">
            <nav className="flex items-center gap-2 mb-6 text-sm text-white/70">
              <Link href="/" className="hover:text-white transition-colors font-medium">
                {isEnglish ? 'Home' : '首页'}
              </Link>
              <span className="text-white/40">/</span>
              <Link href="/prompts" className="hover:text-white transition-colors font-medium">
                {isEnglish ? 'Prompt List' : '提示词列表'}
              </Link>
              <span className="text-white/40">/</span>
              <span className="text-white font-semibold">{promptTitle}</span>
            </nav>

            <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium rounded-full mb-3">
              {category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {promptTitle}
            </h1>
          </div>

          <div className="absolute bottom-16 right-8 z-10 space-y-3">
            <div className="bg-zinc-900/30 backdrop-blur-2xl border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" />
                <span className="text-zinc-400 text-xs">{isEnglish ? 'Views' : '浏览'}</span>
              </div>
              <div className="text-xl font-bold text-white mt-1">
                {prompt.views.toLocaleString()}
              </div>
            </div>

            <div className="bg-zinc-900/30 backdrop-blur-2xl border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400" />
                <span className="text-zinc-400 text-xs">{isEnglish ? 'Likes' : '点赞'}</span>
              </div>
              <div className="text-xl font-bold text-white mt-1">
                {prompt.likes.toLocaleString()}
              </div>
            </div>

            <div className="bg-zinc-900/30 backdrop-blur-2xl border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-purple-400" />
                <span className="text-zinc-400 text-xs">{isEnglish ? 'Comments' : '评论'}</span>
              </div>
              <div className="text-xl font-bold text-white mt-1">
                {prompt.comments.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-8 right-8 z-10">
            <PromptDetailCard data={promptData} isEnglish={isEnglish} isPortrait />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ViewsTracker promptId={promptId} />
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50">
        <section className="container mx-auto px-4 py-16 max-w-6xl">
          <nav className="flex items-center gap-2 mb-12 text-sm text-zinc-600">
            <Link href="/" className="hover:text-zinc-900 transition-colors font-medium">
              {isEnglish ? 'Home' : '首页'}
            </Link>
            <span className="text-zinc-400">/</span>
            <Link href="/prompts" className="hover:text-zinc-900 transition-colors font-medium">
              {isEnglish ? 'Prompt List' : '提示词列表'}
            </Link>
            <span className="text-zinc-400">/</span>
            <span className="text-zinc-800 font-semibold">{promptTitle}</span>
          </nav>

          <div className="mb-8">
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold rounded-full mb-4 shadow-lg">
              {category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">
              {promptTitle}
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden mb-8 shadow-2xl">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-xl border border-white/60 -m-1 rounded-3xl" />
                <Image
                  src={prompt.imageUrl}
                  alt={promptTitle}
                  fill
                  className="object-contain"
                  unoptimized={prompt.imageUrl?.startsWith('http')}
                />
              </div>
              <PromptDetailCard data={promptData} isEnglish={isEnglish} />
            </div>

            <div className="lg:w-72 space-y-4">
              <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100/80 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-zinc-500 text-sm font-medium">{isEnglish ? 'Views' : '浏览'}</span>
                </div>
                <div className="text-3xl font-bold text-zinc-900">
                  {prompt.views.toLocaleString()}
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-pink-100/80 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-pink-600" />
                  </div>
                  <span className="text-zinc-500 text-sm font-medium">{isEnglish ? 'Likes' : '点赞'}</span>
                </div>
                <div className="text-3xl font-bold text-zinc-900">
                  {prompt.likes.toLocaleString()}
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100/80 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-zinc-500 text-sm font-medium">{isEnglish ? 'Comments' : '评论'}</span>
                </div>
                <div className="text-3xl font-bold text-zinc-900">
                  {prompt.comments.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
