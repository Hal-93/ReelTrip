/*
  Warnings:

  - A unique constraint covering the columns `[reelId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Reel" ADD COLUMN     "caption" TEXT,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "reelId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_reelId_key" ON "User"("reelId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_reelId_fkey" FOREIGN KEY ("reelId") REFERENCES "Reel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
