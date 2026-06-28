import { NextResponse } from 'next/server'
import { withMetrics } from '@/app/actions/withMetrics';

const POST = withMetrics(async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 })
  response.cookies.delete('admin_session')
  return response
});
export { POST };
