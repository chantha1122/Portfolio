-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('PROJECT', 'CERTIFICATE', 'EDUCATION', 'WORK', 'TEACHING', 'COMPETITION', 'ACHIEVEMENT', 'EVENT', 'PHOTO', 'OTHER');

-- CreateEnum
CREATE TYPE "DatePrecision" AS ENUM ('YEAR', 'MONTH', 'DAY');

-- CreateTable
CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "headlineEn" TEXT,
    "headlineKm" TEXT,
    "bioEn" TEXT,
    "bioKm" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "telegram" TEXT,
    "github" TEXT,
    "linkedin" TEXT,
    "locationEn" TEXT,
    "locationKm" TEXT,
    "profileImage" TEXT,
    "cvFile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleKm" TEXT,
    "summaryEn" TEXT,
    "summaryKm" TEXT,
    "descriptionEn" TEXT,
    "descriptionKm" TEXT,
    "activityDate" TIMESTAMP(3) NOT NULL,
    "datePrecision" "DatePrecision" NOT NULL DEFAULT 'DAY',
    "coverImage" TEXT,
    "locationEn" TEXT,
    "locationKm" TEXT,
    "organizationEn" TEXT,
    "organizationKm" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "activities_slug_key" ON "activities"("slug");

-- CreateIndex
CREATE INDEX "activities_activityDate_idx" ON "activities"("activityDate");

-- CreateIndex
CREATE INDEX "activities_type_idx" ON "activities"("type");

-- CreateIndex
CREATE INDEX "activities_published_idx" ON "activities"("published");
