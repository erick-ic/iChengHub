'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
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

    console.log('createPost received:', {
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

    const post = await prisma.blog.create({
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
        sortOrder: 0,
      },
    });

    revalidatePath('/blog');
    revalidatePath('/ibackend/blogs');

    return { success: true, post };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    console.error('Failed to create post:', errorMessage);
    return { success: false, error: `Failed to create post: ${errorMessage}` };
  }
}

export async function updatePost(formData: FormData) {
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

    if (!id || !titleZh || !titleEn || !contentZh || !contentEn) {
      return { success: false, error: 'Missing required fields' };
    }

    const post = await prisma.blog.update({
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
      },
    });

    revalidatePath('/blog');
    revalidatePath(`/blog/${id}`);
    revalidatePath('/ibackend/blogs');

    return { success: true, post };
  } catch (error) {
    console.error('Failed to update post:', error);
    return { success: false, error: 'Failed to update post' };
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.blog.delete({
      where: { id },
    });

    revalidatePath('/blog');
    revalidatePath('/ibackend/blogs');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete post:', error);
    return { success: false, error: 'Failed to delete post' };
  }
}

export async function getPosts(query?: string) {
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

    const posts = await prisma.blog.findMany({
      where,
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });
    return { success: true, posts };
  } catch (error) {
    console.error('Failed to get posts:', error);
    return { success: false, error: 'Failed to get posts', posts: [] };
  }
}