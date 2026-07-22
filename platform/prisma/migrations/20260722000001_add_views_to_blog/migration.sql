-- Add views field to Blog table
ALTER TABLE "Blog" ADD COLUMN IF NOT EXISTS "views" INTEGER NOT NULL DEFAULT 0;
