import { NextResponse } from 'next/server'
import { recordSuccess, recordFailed, recordApiError } from '@/app/actions/metricsActions'

export function withMetrics<T extends (...args: any[]) => Promise<NextResponse>>(handler: T): T {
  return (async function (this: unknown, ...args: Parameters<T>) {
    const req = args?.[0] as Request | undefined
    const path = typeof req?.url === 'string' ? new URL(req.url).pathname : ''
    const method = (req as any)?.method ?? ''
    let status = 500
    try {
      const res = await handler.apply(this, args as any)
      status = res?.status ?? 200
      if (status >= 200 && status < 400) {
        recordSuccess()
      } else {
        recordFailed()
        const text = await res.clone().text().catch(() => '')
        recordApiError({
          message: `API ${status}`,
          status,
          path,
          method,
          detail: text
        }).catch(() => {})
      }
      return res
    } catch (err) {
      recordFailed()
      recordApiError({
        message: err instanceof Error ? err.message : String(err),
        status,
        path,
        method,
        detail: err instanceof Error ? err.stack : String(err)
      }).catch(() => {})
      throw err
    }
  }) as T
}
