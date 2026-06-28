import prisma from '@/lib/prisma'

let pendingSuccess = 0
let pendingFailed = 0
let pendingAi = 0
let flushTimer: NodeJS.Timeout | null = null

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

export async function getSystemMetrics() {
  try {
    return await prisma.systemMetrics.findUnique({ where: { id: 'current' } })
  } catch {
    return null
  }
}
