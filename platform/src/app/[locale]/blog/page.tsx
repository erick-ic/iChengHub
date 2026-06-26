import { Link } from '@/navigation';
import PageViewTracker from '@/components/PageViewTracker';
import { BlogPost, getAllPosts } from '@/data/blogs';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function BlogListPage({ params }: PageProps) {
  const { locale } = await params;
  const isEnglish = locale === 'en';

  // 防御性：未来切到 Prisma 时，单点失败不应击穿整页。
  let posts: BlogPost[] = [];
  try {
    posts = await getAllPosts();
  } catch (error) {
    console.error('[blog] failed to load posts:', error);
    posts = [];
  }

  return (
    <>
      <PageViewTracker path={`/${locale}/blog`} />
      {/* 外层背景沿用全站 HSL 苹果灰 bg-background (#f5f5f7) */}
      <main className="bg-background min-h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
          {/* 页面标题区：克制、不抢戏 */}
          <header className="mb-10 md:mb-14">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {isEnglish ? 'Tech Blog' : '技术博客'}
            </h1>
            <p className="mt-3 text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
              {isEnglish
                ? 'Notes on frontend architecture, design systems, and engineering productivity.'
                : '关于前端架构、设计系统与工程效能的一些沉淀。'}
            </p>
          </header>

          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
              <p className="text-2xl font-semibold text-foreground mb-2">
                {isEnglish ? 'No posts yet' : '还没有文章'}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {isEnglish ? 'Stay tuned.' : '敬请期待。'}
              </p>
            </div>
          ) : (
            // 单列垂直排列：放弃瀑布流，回到 List Layout
            <ul className="flex flex-col gap-0">
              {posts.map((post, index) => {
                const isLast = index === posts.length - 1;
                const title = isEnglish ? post.title.en : post.title.zh;
                const excerpt = isEnglish ? post.excerpt.en : post.excerpt.zh;
                const category = isEnglish ? post.category.en : post.category.zh;

                return (
                  <li
                    key={post.id}
                    className={[
                      isLast ? '' : 'border-b border-gray-100 dark:border-gray-800',
                    ].join(' ')}
                  >
                    <Link
                      href={`/blog/${post.id}`}
                      className="group block py-8 px-4 transition-all duration-300 hover:bg-white hover:shadow-md hover:-translate-y-0.5 -mx-4 rounded-lg"
                    >
                      {/* 第一层：标题（hover 时变品牌红） */}
                      <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground transition-all duration-300 group-hover:text-[#e52129]">
                        {title}
                      </h2>

                      {/* 第二层：摘要（严格 2 行截断） */}
                      <p className="mt-2 text-sm md:text-base leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2 transition-colors duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                        {excerpt}
                      </p>

                      {/* 第三层：元数据行（分类 + 日期） */}
                      <div className="flex flex-wrap items-center gap-x-3 text-xs mt-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#e52129]/10 text-[#e52129] font-semibold tracking-wider text-[10px] uppercase transition-all duration-300 group-hover:bg-[#e52129]/20">
                          {category}
                        </span>
                        <time
                          dateTime={post.date}
                          className="text-gray-400 dark:text-gray-500 font-normal tabular-nums"
                        >
                          {post.date}
                        </time>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
