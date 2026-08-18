-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "ToolCategory" AS ENUM ('DEVELOPMENT', 'FRONTEND', 'BACKEND', 'DATABASE', 'AI_ML', 'DESIGN', 'DEVOPS', 'PRODUCTIVITY', 'OTHER');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "ContactMessageStatus" AS ENUM ('NEW', 'READ', 'REPLIED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "credentialId" TEXT,
ADD COLUMN     "demoUrl" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "externalUrl" TEXT,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "isCurrent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "technologies" TEXT;

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "badgeImage" TEXT,
ADD COLUMN     "currentFocusEn" TEXT,
ADD COLUMN     "currentFocusKm" TEXT,
ADD COLUMN     "currentRoleEn" TEXT,
ADD COLUMN     "currentRoleKm" TEXT,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "shortBioEn" TEXT,
ADD COLUMN     "shortBioKm" TEXT,
ADD COLUMN     "yearsExperience" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "youtube" TEXT;

-- CreateTable
CREATE TABLE "activity_media" (
    "id" SERIAL NOT NULL,
    "activityId" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "captionEn" TEXT,
    "captionKm" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryEn" TEXT,
    "categoryKm" TEXT,
    "level" "SkillLevel" NOT NULL DEFAULT 'INTERMEDIATE',
    "icon" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tools" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" "ToolCategory" NOT NULL DEFAULT 'OTHER',
    "icon" TEXT,
    "url" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "status" "ContactMessageStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activity_media_activityId_idx" ON "activity_media"("activityId");

-- CreateIndex
CREATE INDEX "skills_published_idx" ON "skills"("published");

-- CreateIndex
CREATE INDEX "skills_sortOrder_idx" ON "skills"("sortOrder");

-- CreateIndex
CREATE INDEX "tools_category_idx" ON "tools"("category");

-- CreateIndex
CREATE INDEX "tools_published_idx" ON "tools"("published");

-- CreateIndex
CREATE INDEX "tools_sortOrder_idx" ON "tools"("sortOrder");

-- CreateIndex
CREATE INDEX "contact_messages_status_idx" ON "contact_messages"("status");

-- CreateIndex
CREATE INDEX "contact_messages_createdAt_idx" ON "contact_messages"("createdAt");

-- CreateIndex
CREATE INDEX "activities_featured_idx" ON "activities"("featured");

-- AddForeignKey
ALTER TABLE "activity_media" ADD CONSTRAINT "activity_media_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
