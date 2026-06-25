import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from '@/navigation';
import PageViewTracker from '@/components/PageViewTracker';
import BlogContent from '@/components/blog/BlogContent';
import TableOfContents from '@/components/blog/TableOfContents';
import { getAllPosts, getPostContentById, extractHeadings } from '@/data/blogs';

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

  return (
    <>
      <PageViewTracker path={`/${locale}/blog/${id}`} />
      <main className="bg-background min-h-[calc(100vh-4rem)]">
        <article className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* 左侧正文区：占 lg:col-span-3 */}
          <div className="lg:col-span-3">
            {/* 面包屑 */}
            <nav className="flex items-center gap-2 mb-10 text-xs text-gray-400 dark:text-gray-500">
              <Link href="/" className="hover:text-foreground transition-colors">
                {isEnglish ? 'Home' : '首页'}
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-foreground transition-colors">
                {isEnglish ? 'Blog' : '博客'}
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium truncate max-w-[60vw]">{post.title}</span>
            </nav>

            {/* 标题 + 元数据 */}
            <header className="mb-10">
              <p className="text-[#e52129] text-xs font-semibold tracking-[0.2em] uppercase">
                {post.category}
              </p>
              <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
                {post.title}
              </h1>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                <time dateTime={post.date} className="tabular-nums">
                  {post.date}
                </time>
              </div>
            </header>

            {/* 正文：react-markdown 渲染 */}
            <div className="prose prose-slate dark:prose-invert max-w-3xl mx-auto">
              <BlogContent content={post.content} />
            </div>

            {/* 返回链接 */}
            <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800">
              <Link
                href="/blog"
                className="text-sm font-medium text-[#e52129] hover:underline"
              >
                {isEnglish ? '← Back to all posts' : '← 返回文章列表'}
              </Link>
            </div>
          </div>

          {/* 右侧侧边栏：占 lg:col-span-1，sticky top-24 */}
          <TableOfContents items={headings} isEnglish={isEnglish} />
        </article>
      </main>
    </>
  );
}