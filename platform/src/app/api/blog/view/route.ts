import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const VIEW_WINDOW = 60000;

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const xff = req.headers.get('x-forwarded-for');
    const ip = xff ? xff.split(',')[0].trim() : req.headers.get('x-real-ip') || '127.0.0.1';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');
    
    const now = new Date();
    const windowStart = new Date(now.getTime() - VIEW_WINDOW);

    const result = await prisma.$transaction(async (tx) => {
      const existingLog = await tx.analyticsLog.findFirst({
        where: {
          ipHash,
          resourceId: id,
          resourceType: 'BLOG',
          actionType: 'VIEW',
          timestamp: { gte: windowStart },
        },
      });

      if (existingLog) {
        const blog = await tx.$queryRaw`SELECT views FROM "Blog" WHERE id = ${id}`;
        return { skipped: true, views: (blog as any)[0]?.views || 0 };
      }

      await tx.analyticsLog.create({
        data: {
          ipHash,
          resourceId: id,
          resourceType: 'BLOG',
          actionType: 'VIEW',
          path: `/blog/${id}`,
          userAgent: req.headers.get('user-agent') || null,
        },
      });

      const updatedBlog = await tx.$queryRaw`UPDATE "Blog" SET views = views + 1 WHERE id = ${id} RETURNING views`;
      return { skipped: false, views: (updatedBlog as any)[0]?.views || 0 };
    });

    return NextResponse.json({ success: true, views: result.views, skipped: result.skipped });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}