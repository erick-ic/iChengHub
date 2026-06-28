/*
  Warnings:

  - Added the required column `updatedAt` to the `NavLink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Prompt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ToolCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NavLink" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Prompt" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ToolCard" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
