import prisma from '@/lib/prisma';

export interface LocalizedString {
  zh: string;
  en: string;
}

export interface BlogPost {
  id: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  category: LocalizedString;
  date: string;
  content: string;
}

/**
 * 从数据库获取所有已发布的文章（按发布时间倒序）。
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const posts = await prisma.blog.findMany({
      where: { status: 1 },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return posts.map((post) => ({
      id: post.id,
      title: { zh: post.titleZh, en: post.titleEn },
      excerpt: { zh: post.excerptZh, en: post.excerptEn },
      category: { zh: post.categoryZh, en: post.categoryEn },
      date: post.updatedAt.toISOString().split('T')[0],
      content: post.contentZh,
    }));
  } catch (error) {
    console.error('[blog] getAllPosts failed:', error);
    return [];
  }
}

/**
 * 按 id 获取单篇文章。找不到返回 null，调用方需自行决定 notFound()。
 */
export async function getPostById(id: string): Promise<BlogPost | null> {
  try {
    const post = await prisma.blog.findUnique({
      where: { id },
    });

    if (!post) {
      return null;
    }

    return {
      id: post.id,
      title: { zh: post.titleZh, en: post.titleEn },
      excerpt: { zh: post.excerptZh, en: post.excerptEn },
      category: { zh: post.categoryZh, en: post.categoryEn },
      date: post.updatedAt.toISOString().split('T')[0],
      content: post.contentZh,
    };
  } catch (error) {
    console.error('[blog] getPostById failed for id:', id, error);
    return null;
  }
}

/**
 * 按 id 获取单篇文章的原始内容（用于 react-markdown 渲染）。
 */
export async function getPostContentById(id: string, locale: string): Promise<{
  title: string;
  excerpt: string;
  category: string;
  content: string;
  date: string;
} | null> {
  try {
    const post = await prisma.blog.findUnique({
      where: { id },
    });

    if (!post) {
      return null;
    }

    const isEnglish = locale === 'en';

    return {
      title: isEnglish ? post.titleEn : post.titleZh,
      excerpt: isEnglish ? post.excerptEn : post.excerptZh,
      category: isEnglish ? post.categoryEn : post.categoryZh,
      content: isEnglish ? post.contentEn : post.contentZh,
      date: post.updatedAt.toISOString().split('T')[0],
    };
  } catch (error) {
    console.error('[blog] getPostContentById failed for id:', id, error);
    return null;
  }
}

/**
 * 从 Markdown 内容中提取标题结构，用于生成目录。
 * 解析 h2 和 h3 标题，返回带 id、text、level 的数组。
 */
export function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: { id: string; text: string; level: number }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    headings.push({ id, text, level });
  }

  return headings;
}