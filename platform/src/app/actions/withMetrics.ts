import { NextResponse } from 'next/server'
import { recordSuccess, recordFailed } from '@/app/actions/metricsActions'

export function withMetrics<T extends (...args: any[]) => Promise<NextResponse>>(handler: T): T {
  return (async function (this: unknown, ...args: Parameters<T>) {
    try {
      const res = await handler.apply(this, args)
      const status = res?.status ?? 200
      if (status >= 200 && status < 400) {
        recordSuccess()
      } else {
        recordFailed()
      }
      return res
    } catch (err) {
      recordFailed()
      throw err
    }
  }) as T
}
