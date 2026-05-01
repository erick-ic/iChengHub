'use server';

import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function incrementViews(promptId: string) {
  if (!promptId) return;

  const cookieStore = await cookies();
  const cookieName = `pv_lock_${promptId}`;

  const hasLock = cookieStore.has(cookieName);

  if (hasLock) {
    console.log(`🛡️ [防刷系统] ID: ${promptId} 已锁定，跳过数据库更新`);
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

    console.log(`🚀 [统计系统] ID: ${promptId} 浏览量 +1`);
    return { success: true };
  } catch (error) {
    console.error('统计更新失败:', error);
    return { success: false };
  }
}
