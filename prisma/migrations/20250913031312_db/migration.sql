-- CreateEnum
CREATE TYPE "public"."Season" AS ENUM ('SPIRING', 'SUMMER', 'AUTUMN', 'WINTER');

-- CreateEnum
CREATE TYPE "public"."AccountType" AS ENUM ('ADMIN', 'OFFICIAL', 'GENERAL');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "type" "public"."AccountType" NOT NULL DEFAULT 'GENERAL';

-- CreateTable
CREATE TABLE "public"."Picture" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "location" TEXT NOT NULL,
    "season" "public"."Season" NOT NULL,
    "price" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Picture_pkey" PRIMARY KEY ("id")
);
