import prisma from '@/lib/prisma';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypePrism from 'rehype-prism-plus';
import rehypeStringify from 'rehype-stringify';

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

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function rehypeHeadingIds() {
  const idCount: Record<string, number> = {};
  
  function getTextContent(node: any): string {
    if (node.type === 'text') {
      return node.value || '';
    }
    if (node.type === 'element' && node.children) {
      return node.children.map((child: any) => getTextContent(child)).join('');
    }
    return '';
  }
  
  return function (tree: any) {
    function visit(node: any) {
      if (node.type === 'element' && ['h2', 'h3'].includes(node.tagName)) {
        const text = getTextContent(node);
        
        let slug = generateSlug(text);
        if (idCount[slug]) {
          idCount[slug]++;
          slug = `${slug}-${idCount[slug]}`;
        } else {
          idCount[slug] = 1;
        }
        
        node.properties = node.properties || {};
        node.properties.id = slug;
      }
      
      if (node.children) {
        node.children.forEach(visit);
      }
    }
    
    visit(tree);
  };
}

function rehypeCodeBlockDefaultLanguage() {
  return function (tree: any) {
    function visit(node: any) {
      if (node.type === 'element' && node.tagName === 'pre') {
        const codeChild = node.children.find((child: any) => child.type === 'element' && child.tagName === 'code');
        if (codeChild) {
          const className = codeChild.properties?.className || '';
          if (!className || !className.toString().includes('language-')) {
            codeChild.properties = codeChild.properties || {};
            codeChild.properties.className = 'language-text';
          }
        }
      }
      
      if (node.children) {
        node.children.forEach(visit);
      }
    }
    
    visit(tree);
  };
}

async function highlightMarkdown(content: string): Promise<string> {
  try {
    const result = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeHeadingIds)
      .use(rehypeCodeBlockDefaultLanguage)
      .use(rehypePrism, { ignoreMissing: true })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(content);
    
    return result.toString();
  } catch (error) {
    console.error('[blog] highlightMarkdown failed:', error);
    return content;
  }
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

import { extractHeadings as extractHeadingsUtil } from '@/lib/headingUtils';

/**
 * 按 id 获取单篇文章的原始内容（用于 react-markdown 渲染）。
 */
export async function getPostContentById(id: string, locale: string): Promise<{
  title: string;
  excerpt: string;
  category: string;
  content: string;
  date: string;
  updatedAt: string;
} | null> {
  try {
    const post = await prisma.blog.findUnique({
      where: { id },
    });

    if (!post) {
      return null;
    }

    const isEnglish = locale === 'en';
    const rawContent = isEnglish ? post.contentEn : post.contentZh;
    const highlightedContent = await highlightMarkdown(rawContent);

    return {
      title: isEnglish ? post.titleEn : post.titleZh,
      excerpt: isEnglish ? post.excerptEn : post.excerptZh,
      category: isEnglish ? post.categoryEn : post.categoryZh,
      content: highlightedContent,
      date: post.createdAt.toISOString().split('T')[0],
      updatedAt: post.updatedAt.toISOString().split('T')[0],
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
export { extractHeadingsUtil as extractHeadings };

export interface NavPost {
  id: string;
  titleZh: string;
  titleEn: string;
}

export async function getPrevAndNextPosts(id: string): Promise<{
  prev: NavPost | null;
  next: NavPost | null;
}> {
  try {
    const posts = await prisma.blog.findMany({
      where: { status: 1 },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        titleZh: true,
        titleEn: true,
      },
    });

    const currentIndex = posts.findIndex((post) => post.id === id);
    if (currentIndex === -1) {
      return { prev: null, next: null };
    }

    const prev = currentIndex > 0 ? posts[currentIndex - 1] : null;
    const next = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

    return { prev, next };
  } catch (error) {
    console.error('[blog] getPrevAndNextPosts failed:', error);
    return { prev: null, next: null };
  }
}