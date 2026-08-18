/*
  Warnings:

  - A unique constraint covering the columns `[profileKey]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "profileKey" TEXT NOT NULL DEFAULT 'main';

-- CreateIndex
CREATE UNIQUE INDEX "profiles_profileKey_key" ON "profiles"("profileKey");
