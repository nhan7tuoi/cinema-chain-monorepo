/*
  Warnings:

  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `employee_roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'LOCKED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "MovieStatus" AS ENUM ('NOW_SHOWING', 'COMING_SOON', 'ENDED');

-- AlterEnum
ALTER TYPE "UserType" ADD VALUE 'MANAGER';

-- DropForeignKey
ALTER TABLE "employee_roles" DROP CONSTRAINT "employee_roles_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "employee_roles" DROP CONSTRAINT "employee_roles_roleId_fkey";

-- AlterTable
ALTER TABLE "branches" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "slug" VARCHAR(255);

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "roleId" TEXT,
ADD COLUMN     "slug" VARCHAR(255);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isActive",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropTable
DROP TABLE "employee_roles";

-- CreateTable
CREATE TABLE "movies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "director" TEXT,
    "cast" TEXT,
    "genre" TEXT,
    "duration" INTEGER NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "format" TEXT NOT NULL DEFAULT '2D',
    "synopsis" TEXT,
    "posterUrl" TEXT,
    "trailerUrl" TEXT,
    "status" "MovieStatus" NOT NULL DEFAULT 'COMING_SOON',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
