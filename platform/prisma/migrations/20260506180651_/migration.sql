-- AlterTable
ALTER TABLE "NavLink" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Prompt" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ToolCard" ALTER COLUMN "updatedAt" DROP DEFAULT;
