-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'HIDDEN');

-- AlterTable
ALTER TABLE "branches"
ADD COLUMN "slug" TEXT,
ADD COLUMN "city" TEXT,
ADD COLUMN "district" TEXT,
ADD COLUMN "latitude" DECIMAL(10,7),
ADD COLUMN "longitude" DECIMAL(10,7),
ADD COLUMN "coverUrl" TEXT,
ADD COLUMN "mapUrl" TEXT,
ADD COLUMN "openingHours" JSONB,
ADD COLUMN "amenities" JSONB;

-- AlterTable
ALTER TABLE "movies"
ADD COLUMN "slug" TEXT,
ADD COLUMN "originalTitle" TEXT,
ADD COLUMN "backdropUrl" TEXT,
ADD COLUMN "ageRating" TEXT,
ADD COLUMN "language" TEXT,
ADD COLUMN "subtitle" TEXT,
ADD COLUMN "country" TEXT,
ADD COLUMN "averageRating" DECIMAL(3,1),
ADD COLUMN "ratingCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "viewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "featuredOrder" INTEGER;

-- CreateTable
CREATE TABLE "promotions" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "summary" TEXT,
  "content" TEXT,
  "imageUrl" TEXT,
  "badge" TEXT,
  "startsAt" TIMESTAMP(3),
  "endsAt" TIMESTAMP(3),
  "terms" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "excerpt" TEXT,
  "content" TEXT,
  "coverUrl" TEXT,
  "category" TEXT,
  "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "branches_slug_key" ON "branches"("slug");

-- CreateIndex
CREATE INDEX "branches_city_district_idx" ON "branches"("city", "district");

-- CreateIndex
CREATE INDEX "branches_isActive_idx" ON "branches"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "movies_slug_key" ON "movies"("slug");

-- CreateIndex
CREATE INDEX "movies_status_releaseDate_idx" ON "movies"("status", "releaseDate");

-- CreateIndex
CREATE INDEX "movies_isFeatured_featuredOrder_idx" ON "movies"("isFeatured", "featuredOrder");

-- CreateIndex
CREATE UNIQUE INDEX "promotions_slug_key" ON "promotions"("slug");

-- CreateIndex
CREATE INDEX "promotions_isActive_startsAt_endsAt_idx" ON "promotions"("isActive", "startsAt", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_status_publishedAt_idx" ON "articles"("status", "publishedAt");
