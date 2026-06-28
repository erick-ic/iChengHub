import { NextResponse } from 'next/server'
import { getRecentErrors } from '@/app/actions/metricsActions'

export const dynamic = 'force-dynamic'

export async function GET() {
  const errors = await getRecentErrors(50)
  const now = new Date().toISOString().replace(/[:.]/g, '-')
  const body = JSON.stringify({
    generatedAt: new Date().toISOString(),
    count: errors.length,
    errors
  }, null, 2)

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="ichengHub-error-logs-${now}.json"`
    }
  })
}
