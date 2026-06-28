-- CreateTable
CREATE TABLE "AnalyticsLog" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actionType" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT,
    "path" TEXT NOT NULL,
    "ipHash" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "AnalyticsLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnalyticsLog_actionType_resourceType_idx" ON "AnalyticsLog"("actionType", "resourceType");

-- CreateIndex
CREATE INDEX "AnalyticsLog_resourceId_idx" ON "AnalyticsLog"("resourceId");

-- CreateIndex
CREATE INDEX "AnalyticsLog_timestamp_idx" ON "AnalyticsLog"("timestamp");
