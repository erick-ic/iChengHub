/*
  Warnings:

  - You are about to drop the column `categoryEn` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the column `promptTextEn` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the column `titleEn` on the `Prompt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Prompt" DROP COLUMN "categoryEn",
DROP COLUMN "promptTextEn",
DROP COLUMN "titleEn";
