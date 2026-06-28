import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from '@/navigation';
import PageViewTracker from '@/components/PageViewTracker';
import BlogContent from '@/components/blog/BlogContent';
import TableOfContents from '@/components/blog/TableOfContents';
import CodeCopyHandler from '@/components/blog/CodeCopyHandler';
import { getAllBlogs, getBlogContentById, extractHeadings, getPrevAndNextBlogs } from '@/data/blogs';
import BlogNavigation from '@/components/blog/BlogNavigation';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateStaticParams() {
  try {
    const blogs = await getAllBlogs();
    return blogs.map((b) => ({ id: b.id }));
  } catch (error) {
    console.error('[blog] generateStaticParams failed:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id, locale } = await params;
  try {
    const blog = await getBlogContentById(id, locale);
    if (!blog) {
      return { title: 'Blog Not Found' };
    }

    return {
      title: `${blog.title} | iChengHub Blog`,
      description: blog.excerpt,
      openGraph: {
        title: blog.title,
        description: blog.excerpt,
        type: 'article',
      },
    };
  } catch (error) {
    console.error('[blog] generateMetadata failed:', error);
    return { title: 'Blog Not Found' };
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { id, locale } = await params;
  const isEnglish = locale === 'en';

  let blogPost;
  try {
    blogPost = await getBlogContentById(id, locale);
  } catch (error) {
    console.error('[blog] getBlogContentById failed for id:', id, error);
    notFound();
  }

  if (!blogPost) {
    notFound();
  }

  const headings = extractHeadings(blogPost.content);
  const { prev: prevBlog, next: nextBlog } = await getPrevAndNextBlogs(id);

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
              <span className="text-zinc-800 font-semibold">{blogPost.title}</span>
            </nav>

            {/* 标题 + 元数据 */}
            <header className="mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-6">
                {blogPost.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-3 text-xs">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#e52129]/10 text-[#e52129] font-semibold tracking-wider text-[10px] uppercase">
                  {blogPost.category}
                </span>
                <time
                  dateTime={blogPost.date}
                  className="text-gray-400 dark:text-gray-500 font-normal tabular-nums"
                >
                  {blogPost.date}
                </time>
              </div>
            </header>

            {/* 正文：react-markdown 渲染 */}
            <div className="prose prose-slate dark:prose-invert max-w-3xl mx-auto prose-pre:bg-transparent prose-pre:p-0 prose-code:before:hidden prose-code:after:hidden mb-12">
              <BlogContent content={blogPost.content} headings={headings} />
            </div>

            <div className="text-right text-sm text-gray-400 dark:text-gray-500 mb-3">
              <span>{isEnglish ? 'Last updated on' : '最后更新于'}</span>
              <span className="mx-2">·</span>
              <span>{blogPost.updatedAt}</span>
            </div>

            <hr className="border-gray-200 dark:border-gray-700 mb-3" />

            <BlogNavigation prevBlog={prevBlog} nextBlog={nextBlog} isEnglish={isEnglish} />

          </div>

          {/* 右侧侧边栏：占 lg:col-span-1，sticky top-24 */}
          <TableOfContents items={headings} isEnglish={isEnglish} />
        </article>
      </main>
    </>
  );
}