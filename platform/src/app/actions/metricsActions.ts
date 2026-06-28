import prisma from '@/lib/prisma'

let pendingSuccess = 0
let pendingFailed = 0
let pendingAi = 0
let flushTimer: NodeJS.Timeout | null = null
const MAX_ERRORS = 50

function scheduleFlush() {
  if (flushTimer !== null) return
  flushTimer = setTimeout(async () => {
    flushTimer = null
    const success = pendingSuccess
    const failed = pendingFailed
    const ai = pendingAi
    pendingSuccess = 0
    pendingFailed = 0
    pendingAi = 0
    if (success === 0 && failed === 0 && ai === 0) return
    try {
      await prisma.systemMetrics.update({
        where: { id: 'current' },
        data: {
          apiSuccess: { increment: success },
          apiFailed: { increment: failed },
          aiErrors: { increment: ai }
        }
      })
    } catch {}
  }, 1000)
}

export function recordSuccess() {
  pendingSuccess++
  scheduleFlush()
}

export function recordFailed() {
  pendingFailed++
  scheduleFlush()
}

export function recordAiError() {
  pendingAi++
  scheduleFlush()
}

export function recordDbLatency(ms: number) {
  try {
    prisma.systemMetrics.update({
      where: { id: 'current' },
      data: { dbLatency: ms }
    }).catch(() => {})
  } catch {}
}

function safeString(v: unknown): string {
  try {
    if (typeof v === 'string') return v.slice(0, 500)
    if (v instanceof Error) return v.message.slice(0, 500)
    return String(v).slice(0, 500)
  } catch {
    return ''
  }
}

export async function recordApiError(
  info: {
    message?: string
    status?: number
    path?: string
    method?: string
    detail?: unknown
  } = {}
) {
  try {
    const err = {
      ts: new Date().toISOString(),
      message: safeString(info.message) || 'Unknown API Error',
      status: typeof info.status === 'number' ? info.status : 0,
      path: safeString(info.path) || '',
      method: safeString(info.method) || '',
      detail: safeString(
        typeof info.detail === 'string'
          ? info.detail
          : info.detail instanceof Error
          ? info.detail.stack || info.detail.message
          : JSON.stringify(info.detail).slice(0, 500)
      )
    }
    await prisma.systemMetrics.update({
      where: { id: 'current' },
      data: { errorLogs: { push: err } }
    })
  } catch {}
}

export async function getRecentErrors(limit = 20) {
  try {
    const m = await prisma.systemMetrics.findUnique({
      where: { id: 'current' },
      select: { errorLogs: true }
    })
    const list: any[] = Array.isArray(m?.errorLogs) ? (m.errorLogs as any[]) : []
    return list.slice(0, limit)
  } catch {
    return []
  }
}

export async function trimErrorLogs() {
  try {
    const m = await prisma.systemMetrics.findUnique({
      where: { id: 'current' },
      select: { errorLogs: true }
    })
    const list: any[] = Array.isArray(m?.errorLogs) ? (m.errorLogs as any[]) : []
    if (list.length > MAX_ERRORS) {
      await prisma.systemMetrics.update({
        where: { id: 'current' },
        data: { errorLogs: { set: list.slice(0, MAX_ERRORS) } }
      })
    }
  } catch {}
}

export async function clearErrorLogs() {
  try {
    await prisma.systemMetrics.update({
      where: { id: 'current' },
      data: { errorLogs: [] }
    })
  } catch {}
}

export async function getSystemMetrics() {
  try {
    return await prisma.systemMetrics.findUnique({ where: { id: 'current' } })
  } catch {
    return null
  }
}
