-- Baseline: Blog & SystemMetrics tables + AnalyticsLog indexes
-- These tables were previously created via `prisma db push`. Idempotent SQL
-- makes it safe to run both on an existing dev DB and a fresh prod DB.

CREATE TABLE IF NOT EXISTS "Blog" (
    "id" TEXT NOT NULL,
    "titleZh" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "excerptZh" TEXT NOT NULL,
    "excerptEn" TEXT NOT NULL,
    "categoryZh" TEXT NOT NULL,
    "categoryEn" TEXT NOT NULL,
    "contentZh" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,
    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SystemMetrics" (
    "id" TEXT NOT NULL,
    "apiSuccess" INTEGER NOT NULL DEFAULT 0,
    "apiFailed" INTEGER NOT NULL DEFAULT 0,
    "dbLatency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "errorLogs" JSONB,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "SystemMetrics_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Blog_status_idx" ON "Blog"("status");
CREATE INDEX IF NOT EXISTS "Blog_createdAt_idx" ON "Blog"("createdAt");
CREATE INDEX IF NOT EXISTS "AnalyticsLog_actionType_resourceType_idx" ON "AnalyticsLog"("actionType", "resourceType");
CREATE INDEX IF NOT EXISTS "AnalyticsLog_resourceId_idx" ON "AnalyticsLog"("resourceId");
CREATE INDEX IF NOT EXISTS "AnalyticsLog_timestamp_idx" ON "AnalyticsLog"("timestamp");
