'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createBlog(formData: FormData) {
  try {
    const titleZh = formData.get('titleZh') as string;
    const titleEn = formData.get('titleEn') as string;
    const excerptZh = formData.get('excerptZh') as string;
    const excerptEn = formData.get('excerptEn') as string;
    const categoryZh = formData.get('categoryZh') as string;
    const categoryEn = formData.get('categoryEn') as string;
    const contentZh = formData.get('contentZh') as string;
    const contentEn = formData.get('contentEn') as string;
    const status = parseInt(formData.get('status') as string || '0');

    console.log('createBlog received:', {
      hasTitleZh: !!titleZh,
      hasTitleEn: !!titleEn,
      hasContentZh: !!contentZh,
      hasContentEn: !!contentEn,
      status,
    });

    if (!titleZh || !titleEn || !contentZh || !contentEn) {
      const missing = [];
      if (!titleZh) missing.push('titleZh');
      if (!titleEn) missing.push('titleEn');
      if (!contentZh) missing.push('contentZh');
      if (!contentEn) missing.push('contentEn');
      console.error('Missing required fields:', missing);
      return { success: false, error: `Missing required fields: ${missing.join(', ')}` };
    }

    const count = await prisma.blog.count();
    const nextOrder = count + 1;

    const blog = await prisma.blog.create({
      data: {
        titleZh,
        titleEn,
        excerptZh: excerptZh || '',
        excerptEn: excerptEn || '',
        categoryZh: categoryZh || '',
        categoryEn: categoryEn || '',
        contentZh,
        contentEn,
        status,
        sortOrder: nextOrder,
      },
    });

    revalidatePath('/blog');
    revalidatePath('/ibackend/blogs');

    return { success: true, blog };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    console.error('Failed to create blog:', errorMessage);
    return { success: false, error: `Failed to create blog: ${errorMessage}` };
  }
}

export async function updateBlog(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const titleZh = formData.get('titleZh') as string;
    const titleEn = formData.get('titleEn') as string;
    const excerptZh = formData.get('excerptZh') as string;
    const excerptEn = formData.get('excerptEn') as string;
    const categoryZh = formData.get('categoryZh') as string;
    const categoryEn = formData.get('categoryEn') as string;
    const contentZh = formData.get('contentZh') as string;
    const contentEn = formData.get('contentEn') as string;
    const status = parseInt(formData.get('status') as string || '0');
    const sortOrder = parseInt(formData.get('sortOrder') as string || '0');

    if (!id || !titleZh || !titleEn || !contentZh || !contentEn) {
      return { success: false, error: 'Missing required fields' };
    }

    if (sortOrder > 0) {
      const existing = await prisma.blog.findFirst({ where: { id } });
      if (existing && existing.sortOrder !== sortOrder) {
        if (existing.sortOrder === 0) {
          const target = await prisma.blog.findFirst({
            where: { sortOrder },
            select: { id: true },
          });
          if (target) {
            await prisma.$executeRawUnsafe(
              `UPDATE "Blog" SET "sortOrder" = "sortOrder" + 1 WHERE "sortOrder" >= ${sortOrder} AND "id" != '${id}'`
            );
          }
        } else {
          const direction = sortOrder < existing.sortOrder ? 1 : -1;
          await prisma.$executeRawUnsafe(
            `UPDATE "Blog" SET "sortOrder" = "sortOrder" + ${direction} WHERE "sortOrder" ${sortOrder < existing.sortOrder ? '>=' : '>'} ${Math.min(sortOrder, existing.sortOrder)} AND "sortOrder" ${sortOrder < existing.sortOrder ? '<' : '<='} ${Math.max(sortOrder, existing.sortOrder)} AND "id" != '${id}'`
          );
        }
      }
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        titleZh,
        titleEn,
        excerptZh: excerptZh || '',
        excerptEn: excerptEn || '',
        categoryZh: categoryZh || '',
        categoryEn: categoryEn || '',
        contentZh,
        contentEn,
        status,
        sortOrder: sortOrder > 0 ? sortOrder : 1,
      },
    });

    revalidatePath('/blog');
    revalidatePath(`/blog/${id}`);
    revalidatePath('/ibackend/blogs');

    return { success: true, blog };
  } catch (error) {
    console.error('Failed to update blog:', error);
    return { success: false, error: 'Failed to update blog' };
  }
}

export async function updateBlogsSortOrder(updates: { id: string; sortOrder: number }[]) {
  try {
    if (updates.length === 0) {
      return { success: true };
    }

    const caseClauses = updates
      .map(({ id, sortOrder }) => `WHEN "id" = '${id}' THEN ${sortOrder}`)
      .join(' ');

    const ids = updates.map(({ id }) => `'${id}'`).join(',');

    await prisma.$executeRawUnsafe(`
      UPDATE "Blog"
      SET "sortOrder" = CASE ${caseClauses} END
      WHERE "id" IN (${ids})
    `);

    revalidatePath('/blog');
    revalidatePath('/ibackend/blogs');

    return { success: true };
  } catch (error) {
    console.error('Failed to update blogs sort order:', error);
    return { success: false, error: 'Failed to update sort order' };
  }
}

export async function deleteBlog(id: string) {
  try {
    await prisma.blog.delete({
      where: { id },
    });

    revalidatePath('/blog');
    revalidatePath('/ibackend/blogs');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete blog:', error);
    return { success: false, error: 'Failed to delete blog' };
  }
}

export async function getBlogs(query?: string, page: number = 1, pageSize: number = 20) {
  try {
    const where = query
      ? {
          OR: [
            { titleZh: { contains: query, mode: 'insensitive' as const } },
            { titleEn: { contains: query, mode: 'insensitive' as const } },
            { categoryZh: { contains: query, mode: 'insensitive' as const } },
            { categoryEn: { contains: query, mode: 'insensitive' as const } },
            { excerptZh: { contains: query, mode: 'insensitive' as const } },
            { excerptEn: { contains: query, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' },
        ],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.blog.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return { success: true, blogs, total, totalPages, currentPage: page, pageSize };
  } catch (error) {
    console.error('Failed to get blogs:', error);
    return { success: false, error: 'Failed to get blogs', blogs: [] };
  }
}
