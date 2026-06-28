import { NextResponse } from 'next/server'
import { getRecentErrors } from '@/app/actions/metricsActions'

export const dynamic = 'force-dynamic'

export async function GET() {
  const errors = await getRecentErrors(50)
  return NextResponse.json({ errors })
}
