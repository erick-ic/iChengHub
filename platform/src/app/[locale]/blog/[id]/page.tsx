import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from '@/navigation';
import PageViewTracker from '@/components/PageViewTracker';
import BlogContent from '@/components/blog/BlogContent';
import TableOfContents from '@/components/blog/TableOfContents';
import CodeCopyHandler from '@/components/blog/CodeCopyHandler';
import { getAllPosts, getPostContentById, extractHeadings, getPrevAndNextPosts } from '@/data/blogs';
import PostNavigation from '@/components/blog/PostNavigation';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    return posts.map((p) => ({ id: p.id }));
  } catch (error) {
    console.error('[blog] generateStaticParams failed:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id, locale } = await params;
  try {
    const post = await getPostContentById(id, locale);
    if (!post) {
      return { title: 'Post Not Found' };
    }

    return {
      title: `${post.title} | iChengHub Blog`,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
      },
    };
  } catch (error) {
    console.error('[blog] generateMetadata failed:', error);
    return { title: 'Post Not Found' };
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { id, locale } = await params;
  const isEnglish = locale === 'en';

  // Standalone 部署防崩：单点查找全部包在 try-catch 里。
  let post;
  try {
    post = await getPostContentById(id, locale);
  } catch (error) {
    console.error('[blog] getPostContentById failed for id:', id, error);
    notFound();
  }

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.content);
  const { prev: prevPost, next: nextPost } = await getPrevAndNextPosts(id);

  return (
    <>
      <CodeCopyHandler />
      <PageViewTracker path={`/${locale}/blog/${id}`} />
      <main className="bg-background min-h-[calc(100vh-4rem)]">
        <article className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* 左侧正文区：占 lg:col-span-3 */}
          <div className="lg:col-span-3">
            {/* 面包屑 */}
            <nav className="flex items-center gap-2 mb-12 text-sm text-zinc-500">
              <Link href="/" className="hover:text-zinc-800 transition-colors font-medium">
                {isEnglish ? 'Home' : '首页'}
              </Link>
              <span className="text-zinc-400">/</span>
              <Link href="/blog" className="hover:text-zinc-800 transition-colors font-medium">
                {isEnglish ? 'Blog' : '博客'}
              </Link>
              <span className="text-zinc-400">/</span>
              <span className="text-zinc-800 font-semibold">{post.title}</span>
            </nav>

            {/* 标题 + 元数据 */}
            <header className="mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-6">
                {post.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-3 text-xs">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#e52129]/10 text-[#e52129] font-semibold tracking-wider text-[10px] uppercase">
                  {post.category}
                </span>
                <time
                  dateTime={post.date}
                  className="text-gray-400 dark:text-gray-500 font-normal tabular-nums"
                >
                  {post.date}
                </time>
              </div>
            </header>

            {/* 正文：react-markdown 渲染 */}
            <div className="prose prose-slate dark:prose-invert max-w-3xl mx-auto prose-pre:bg-transparent prose-pre:p-0 prose-code:before:hidden prose-code:after:hidden mb-12">
              <BlogContent content={post.content} headings={headings} />
            </div>

            <div className="text-right text-sm text-gray-400 dark:text-gray-500 mb-3">
              <span>{isEnglish ? 'Last updated on' : '最后更新于'}</span>
              <span className="mx-2">·</span>
              <span>{post.updatedAt}</span>
            </div>

            <hr className="border-gray-200 dark:border-gray-700 mb-3" />

            <PostNavigation prevPost={prevPost} nextPost={nextPost} isEnglish={isEnglish} />

          </div>

          {/* 右侧侧边栏：占 lg:col-span-1，sticky top-24 */}
          <TableOfContents items={headings} isEnglish={isEnglish} />
        </article>
      </main>
    </>
  );
}