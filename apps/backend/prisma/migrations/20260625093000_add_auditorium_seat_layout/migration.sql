-- CreateEnum
CREATE TYPE "SeatType" AS ENUM ('STANDARD', 'VIP', 'COUPLE');

-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('ACTIVE', 'MAINTENANCE', 'INACTIVE');

-- AlterTable
ALTER TABLE "auditoriums"
ADD COLUMN "layoutRows" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "layoutCols" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "seats" (
    "id" TEXT NOT NULL,
    "auditoriumId" TEXT NOT NULL,
    "rowLabel" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "gridRow" INTEGER NOT NULL,
    "gridCol" INTEGER NOT NULL,
    "type" "SeatType" NOT NULL DEFAULT 'STANDARD',
    "status" "SeatStatus" NOT NULL DEFAULT 'ACTIVE',
    "couplePairId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seats_auditoriumId_code_key" ON "seats"("auditoriumId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "seats_auditoriumId_gridRow_gridCol_key" ON "seats"("auditoriumId", "gridRow", "gridCol");

-- CreateIndex
CREATE INDEX "seats_auditoriumId_rowLabel_idx" ON "seats"("auditoriumId", "rowLabel");

-- CreateIndex
CREATE INDEX "seats_auditoriumId_couplePairId_idx" ON "seats"("auditoriumId", "couplePairId");

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_auditoriumId_fkey" FOREIGN KEY ("auditoriumId") REFERENCES "auditoriums"("id") ON DELETE CASCADE ON UPDATE CASCADE;
