'use server';

import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function toggleLike(promptId: string) {
  if (!promptId) return { success: false, message: '缺少参数' };

  const cookieStore = await cookies();
  const cookieName = `liked_${promptId}`;

  const hasLock = cookieStore.has(cookieName);

  try {
    const result = await prisma.prompt.update({
      where: { id: promptId },
      data: {
        likes: hasLock ? { decrement: 1 } : { increment: 1 }
      },
      select: { likes: true }
    });

    if (hasLock) {
      cookieStore.delete(cookieName);
    } else {
      cookieStore.set(cookieName, '1', {
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    }

    return {
      success: true,
      likesCount: result.likes,
      isLiked: !hasLock
    };
  } catch (error) {
    console.error('点赞更新失败:', error);
    return { success: false, message: '操作失败' };
  }
}

export async function incrementViews(promptId: string) {
  if (!promptId) return;

  const cookieStore = await cookies();
  const cookieName = `pv_lock_${promptId}`;

  const hasLock = cookieStore.has(cookieName);

  if (hasLock) {
    return { success: true, skipped: true };
  }

  try {
    await prisma.prompt.update({
      where: { id: promptId },
      data: { views: { increment: 1 } }
    });

    cookieStore.set(cookieName, '1', {
      maxAge: 60 * 60 * 24,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return { success: true };
  } catch (error) {
    console.error('统计更新失败:', error);
    return { success: false };
  }
}
