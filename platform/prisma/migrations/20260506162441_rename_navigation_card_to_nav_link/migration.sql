/*
  Warnings:

  - You are about to drop the `NavigationCard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "NavigationCard";

-- CreateTable
CREATE TABLE "NavLink" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "desc" TEXT NOT NULL,
    "descEn" TEXT,
    "url" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NavLink_pkey" PRIMARY KEY ("id")
);
