'use server';

import prisma from '@/lib/prisma';

export async function getToolSubmissions() {
  try {
    const data = await prisma.toolSubmission.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error('Error fetching tool submissions:', error);
    return [];
  }
}

export async function getToolDemands() {
  try {
    const data = await prisma.toolDemand.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error('Error fetching tool demands:', error);
    return [];
  }
}

export async function updateSubmissionStatus(id: string, status: string) {
  return await prisma.toolSubmission.update({
    where: { id },
    data: { status },
  });
}

export async function updateDemandStatus(id: string, status: string) {
  return await prisma.toolDemand.update({
    where: { id },
    data: { status },
  });
}

export async function deleteSubmission(id: string) {
  return await prisma.toolSubmission.delete({
    where: { id },
  });
}

export async function deleteDemand(id: string) {
  return await prisma.toolDemand.delete({
    where: { id },
  });
}