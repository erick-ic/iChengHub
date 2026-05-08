'use server';

import prisma from '@/lib/prisma';

interface SubmitState {
  success: boolean;
  error?: string;
}

export async function submitRecommendation(_prevState: SubmitState, formData: FormData): Promise<SubmitState> {
  try {
    const name = formData.get('name') as string;
    const url = formData.get('url') as string;
    const description = formData.get('description') as string;
    const contact = formData.get('contact') as string | null;

    // 验证必填字段
    if (!name?.trim()) {
      return { success: false, error: '请输入工具名称' };
    }
    if (!url?.trim()) {
      return { success: false, error: '请输入官网链接' };
    }
    if (!description?.trim()) {
      return { success: false, error: '请输入推荐理由' };
    }

    await prisma.toolSubmission.create({
      data: {
        name: name.trim(),
        url: url.trim(),
        description: description.trim(),
        contact: contact?.trim() || null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Submit recommendation error:', error);
    return { success: false, error: '提交失败，请稍后重试' };
  }
}

export async function submitDemand(_prevState: SubmitState, formData: FormData): Promise<SubmitState> {
  try {
    const title = formData.get('title') as string;
    const detail = formData.get('detail') as string;
    const referenceUrl = formData.get('referenceUrl') as string | null;
    const contact = formData.get('contact') as string | null;

    // 验证必填字段
    if (!title?.trim()) {
      return { success: false, error: '请输入需求标题' };
    }
    if (!detail?.trim()) {
      return { success: false, error: '请输入详细描述' };
    }

    await prisma.toolDemand.create({
      data: {
        title: title.trim(),
        detail: detail.trim(),
        referenceUrl: referenceUrl?.trim() || null,
        contact: contact?.trim() || null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Submit demand error:', error);
    return { success: false, error: '提交失败，请稍后重试' };
  }
}
