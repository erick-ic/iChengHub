import { NextRequest, NextResponse } from 'next/server'
import { withMetrics } from '@/app/actions/withMetrics';

const GET = withMetrics(async function GET(request: NextRequest) {
  const adminSession = request.cookies.get('admin_session')

  if (adminSession) {
    return NextResponse.json({ authenticated: true })
  } else {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
});
export { GET };
