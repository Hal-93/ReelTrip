/*
  Warnings:

  - You are about to drop the `Follows` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `price` on table `Picture` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('None', 'Gourmet', 'Sightseeing', 'Activity');

-- DropForeignKey
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_followerId_fkey";

-- DropForeignKey
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_followingId_fkey";

-- AlterTable
ALTER TABLE "Picture" ADD COLUMN     "genre" "Genre" NOT NULL DEFAULT 'None',
ADD COLUMN     "name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "reelId" TEXT,
ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "price" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "favorite" "Genre" NOT NULL DEFAULT 'None';

-- DropTable
DROP TABLE "Follows";

-- CreateTable
CREATE TABLE "Reel" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Picture" ADD CONSTRAINT "Picture_reelId_fkey" FOREIGN KEY ("reelId") REFERENCES "Reel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
