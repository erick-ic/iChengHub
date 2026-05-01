"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createPrompt(formData: FormData) {
  const title = formData.get('title') as string
  const titleEn = formData.get('titleEn') as string | null
  const category = formData.get('category') as string
  const categoryEn = formData.get('categoryEn') as string | null
  const toolId = formData.get('toolId') as string
  const imageUrl = formData.get('imageUrl') as string
  const promptText = formData.get('promptText') as string

  const maxSortOrder = await prisma.prompt.aggregate({
    _max: { sortOrder: true },
  })

  const newSortOrder = maxSortOrder._max?.sortOrder !== null 
    ? maxSortOrder._max.sortOrder + 1 
    : 1

  await prisma.prompt.create({
    data: {
      title,
      titleEn: titleEn || null,
      category,
      categoryEn: categoryEn || null,
      toolId,
      imageUrl,
      promptText,
      sortOrder: newSortOrder,
      views: 0,
      likes: 0,
      comments: 0,
      status: 1,
    },
  })

  revalidatePath('/admin/prompts')
  revalidatePath('/')
}

export async function updatePrompt(id: string, formData: FormData) {
  const title = formData.get('title') as string
  const titleEn = formData.get('titleEn') as string | null
  const category = formData.get('category') as string
  const categoryEn = formData.get('categoryEn') as string | null
  const toolId = formData.get('toolId') as string
  const imageUrl = formData.get('imageUrl') as string
  const promptText = formData.get('promptText') as string

  await prisma.prompt.update({
    where: { id },
    data: {
      title,
      titleEn: titleEn || null,
      category,
      categoryEn: categoryEn || null,
      toolId,
      imageUrl,
      promptText,
    },
  })

  revalidatePath('/admin/prompts')
  revalidatePath('/')
}

export async function deletePrompt(id: string) {
  await prisma.prompt.delete({
    where: { id },
  })

  revalidatePath('/admin/prompts')
  revalidatePath('/')
}

export async function togglePromptStatus(id: string) {
  const prompt = await prisma.prompt.findUnique({
    where: { id },
    select: { status: true },
  })

  if (prompt) {
    await prisma.prompt.update({
      where: { id },
      data: { status: prompt.status === 1 ? 0 : 1 },
    })

    revalidatePath('/admin/prompts')
    revalidatePath('/')
  }
}

export async function movePromptToTop(id: string) {
  const allPrompts = await prisma.prompt.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    select: { id: true },
  })

  const currentIndex = allPrompts.findIndex(prompt => prompt.id === id)
  
  if (currentIndex === -1) {
    return
  }

  allPrompts.splice(currentIndex, 1)
  allPrompts.unshift({ id })

  for (let i = 0; i < allPrompts.length; i++) {
    await prisma.prompt.update({
      where: { id: allPrompts[i].id },
      data: { sortOrder: i + 1 },
    })
  }

  revalidatePath('/admin/prompts')
  revalidatePath('/')
}

export async function movePromptUp(id: string) {
  const currentPrompt = await prisma.prompt.findUnique({
    where: { id },
    select: { sortOrder: true },
  })

  if (!currentPrompt) return

  const prevPrompt = await prisma.prompt.findFirst({
    where: { sortOrder: { lt: currentPrompt.sortOrder } },
    orderBy: { sortOrder: 'desc' },
    select: { id: true, sortOrder: true },
  })

  if (prevPrompt) {
    await prisma.$transaction([
      prisma.prompt.update({
        where: { id },
        data: { sortOrder: prevPrompt.sortOrder },
      }),
      prisma.prompt.update({
        where: { id: prevPrompt.id },
        data: { sortOrder: currentPrompt.sortOrder },
      }),
    ])

    revalidatePath('/admin/prompts')
    revalidatePath('/')
  }
}

export async function movePromptDown(id: string) {
  const currentPrompt = await prisma.prompt.findUnique({
    where: { id },
    select: { sortOrder: true },
  })

  if (!currentPrompt) return

  const nextPrompt = await prisma.prompt.findFirst({
    where: { sortOrder: { gt: currentPrompt.sortOrder } },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, sortOrder: true },
  })

  if (nextPrompt) {
    await prisma.$transaction([
      prisma.prompt.update({
        where: { id },
        data: { sortOrder: nextPrompt.sortOrder },
      }),
      prisma.prompt.update({
        where: { id: nextPrompt.id },
        data: { sortOrder: currentPrompt.sortOrder },
      }),
    ])

    revalidatePath('/admin/prompts')
    revalidatePath('/')
  }
}