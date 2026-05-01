import PromptDetailCard, { PromptDetailData } from '@/components/PromptDetailCard';
import ColorExtractedImage from '@/components/ColorExtractedImage';
import LikeButton from '@/components/LikeButton';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Eye, MessageCircle, Tag } from 'lucide-react';
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
        <div className="min-h-screen relative overflow-hidden bg-[#F5F5F7]">
          <Image
            src={prompt.imageUrl}
            alt={promptTitle}
            fill
            className="absolute inset-0 w-full h-full object-cover"
            unoptimized={prompt.imageUrl?.startsWith('http')}
          />
          <div className="absolute inset-0 bg-white/40" />

          <div className="absolute top-8 left-8 right-8 z-10">
            <nav className="flex items-center gap-2 mb-6 text-sm text-zinc-500">
              <Link href="/" className="hover:text-zinc-800 transition-colors font-medium">
                {isEnglish ? 'Home' : '首页'}
              </Link>
              <span className="text-zinc-400">/</span>
              <Link href="/prompts" className="hover:text-zinc-800 transition-colors font-medium">
                {isEnglish ? 'Prompt List' : '提示词列表'}
              </Link>
              <span className="text-zinc-400">/</span>
              <span className="text-zinc-800 font-semibold">{promptTitle}</span>
            </nav>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold rounded-full mb-3 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
              <Tag className="w-3 h-3" />
              {category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900">
              {promptTitle}
            </h1>
          </div>

          <div className="absolute bottom-16 right-8 z-10 space-y-3">
            <div className="flex gap-3">
              <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-zinc-500 text-xs font-medium">{isEnglish ? 'Views' : '浏览'}</span>
                </div>
                <div className="text-xl font-bold text-zinc-900 mt-1">
                  {prompt.views.toLocaleString()}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center">
                    <span className="text-pink-500 text-xs font-bold">♥</span>
                  </div>
                  <span className="text-zinc-500 text-xs font-medium">{isEnglish ? 'Likes' : '点赞'}</span>
                </div>
                <div className="text-xl font-bold text-zinc-900 mt-1">
                  {prompt.likes.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-purple-500" />
                </div>
                <span className="text-zinc-500 text-xs font-medium">{isEnglish ? 'Comments' : '评论'}</span>
              </div>
              <div className="text-xl font-bold text-zinc-900 mt-1">
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
      <div className="min-h-screen bg-background">
        <section className="container mx-auto px-4 py-16 max-w-6xl">
          <nav className="flex items-center gap-2 mb-12 text-sm text-zinc-500">
            <Link href="/" className="hover:text-zinc-800 transition-colors font-medium">
              {isEnglish ? 'Home' : '首页'}
            </Link>
            <span className="text-zinc-400">/</span>
            <Link href="/prompts" className="hover:text-zinc-800 transition-colors font-medium">
              {isEnglish ? 'Prompt List' : '提示词列表'}
            </Link>
            <span className="text-zinc-400">/</span>
            <span className="text-zinc-800 font-semibold">{promptTitle}</span>
          </nav>

          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-300 to-purple-400 text-white text-xs font-semibold rounded-full mb-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              <Tag className="w-3.5 h-3.5" />
              {category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">
              {promptTitle}
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <ColorExtractedImage 
                src={prompt.imageUrl || ''} 
                alt={promptTitle}
                unoptimized={prompt.imageUrl?.startsWith('http')}
              />
              <PromptDetailCard data={promptData} isEnglish={isEnglish} />
            </div>

            <div className="lg:w-72 space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center eye-container">
                      <Eye className="w-5 h-5 text-blue-500 eye-icon" />
                    </div>
                    <span className="text-zinc-500 text-sm font-medium">{isEnglish ? 'Views' : '浏览'}</span>
                  </div>
                  <div className="text-3xl font-bold text-zinc-900">
                    {prompt.views.toLocaleString()}
                  </div>
                </div>

                <LikeButton initialLikes={prompt.likes} isEnglish={isEnglish} />
              </div>

              <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm flex flex-col max-h-[600px]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-purple-500" />
                    </div>
                    <span className="text-zinc-500 text-sm font-medium">{isEnglish ? 'Comments' : '评论'}</span>
                  </div>
                  <div className="text-2xl font-bold text-zinc-900">
                    {prompt.comments.toLocaleString()}
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 flex items-center justify-center flex-shrink-0">
                      <span className="text-zinc-600 text-xs font-medium">U</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <textarea
                        placeholder={isEnglish ? 'Write a comment...' : '发表评论...'}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm resize-none focus:outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-300 transition-all"
                        rows={2}
                      />
                      <div className="flex justify-end mt-2">
                        <button className="px-4 py-2 bg-gradient-to-r from-purple-300 to-purple-400 text-white text-sm font-medium rounded-lg hover:shadow-md transition-all">
                          {isEnglish ? 'Send' : '发送'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <style>{`
        .eye-icon {
          transition: transform 0.3s ease;
          transform-origin: center;
        }
        .eye-container:hover .eye-icon {
          transform: scale(1.1);
          animation: eye-blink 0.6s ease-in-out;
        }
        @keyframes eye-blink {
          0%, 40%, 100% { 
            transform: scale(1.1); 
            clip-path: inset(0 0 0 0);
          }
          50% { 
            transform: scale(1.1);
            clip-path: inset(45% 0 45% 0);
          }
        }
      `}</style>
    </>
  );
}
