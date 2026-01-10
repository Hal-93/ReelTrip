/*
  Warnings:

  - You are about to drop the column `reelId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Reel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `videoFileId` to the `Reel` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Reel` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_reelId_fkey";

-- DropIndex
DROP INDEX "User_reelId_key";

-- AlterTable
ALTER TABLE "Reel" ADD COLUMN     "videoFileId" TEXT NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "reelId";

-- CreateIndex
CREATE UNIQUE INDEX "Reel_userId_key" ON "Reel"("userId");

-- AddForeignKey
ALTER TABLE "Reel" ADD CONSTRAINT "Reel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reel" ADD CONSTRAINT "Reel_videoFileId_fkey" FOREIGN KEY ("videoFileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
