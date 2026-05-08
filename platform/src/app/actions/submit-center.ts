'use server';

import prisma from '@/lib/prisma';

interface SubmitState {
  success: boolean;
}

export async function submitRecommendation(_prevState: SubmitState, formData: FormData): Promise<SubmitState> {
  try {
    const name = formData.get('name') as string;
    const url = formData.get('url') as string;
    const description = formData.get('description') as string;
    const contact = formData.get('contact') as string | null;

    await prisma.toolSubmission.create({
      data: {
        name,
        url,
        description,
        contact: contact || null,
      },
    });

    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function submitDemand(_prevState: SubmitState, formData: FormData): Promise<SubmitState> {
  try {
    const title = formData.get('title') as string;
    const detail = formData.get('detail') as string;
    const referenceUrl = formData.get('referenceUrl') as string | null;
    const contact = formData.get('contact') as string | null;

    await prisma.toolDemand.create({
      data: {
        title,
        detail,
        referenceUrl: referenceUrl || null,
        contact: contact || null,
      },
    });

    return { success: true };
  } catch {
    return { success: false };
  }
}
