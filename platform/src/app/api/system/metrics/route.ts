import { NextResponse } from 'next/server'
import { withMetrics } from '@/app/actions/withMetrics';
import { getSystemMetrics } from '@/app/actions/metricsActions'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const GET = withMetrics(async function GET() {
  const m = await getSystemMetrics()
  if (!m) {
    return NextResponse.json({
      apiSuccess: 0,
      apiFailed: 0,
      aiErrors: 0,
      dbLatency: 0,
      resetAt: null,
      updatedAt: null,
      successRate: 100
    })
  }
  const total = m.apiSuccess + m.apiFailed
  const successRate = total === 0 ? 100 : Math.round((m.apiSuccess / total) * 10000) / 100
  return NextResponse.json({
    apiSuccess: m.apiSuccess,
    apiFailed: m.apiFailed,
    aiErrors: m.aiErrors,
    dbLatency: m.dbLatency,
    resetAt: m.resetAt,
    updatedAt: m.updatedAt,
    successRate
  })
  });

export { GET };
