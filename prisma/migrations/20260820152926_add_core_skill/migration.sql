-- AlterTable
ALTER TABLE "skills" ADD COLUMN     "isCore" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "skills_isCore_idx" ON "skills"("isCore");
