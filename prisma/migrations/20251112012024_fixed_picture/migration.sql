/*
  Warnings:

  - You are about to drop the column `season` on the `Picture` table. All the data in the column will be lost.
  - Added the required column `date` to the `Picture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileId` to the `Picture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `Picture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Picture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Picture" DROP COLUMN "season",
ADD COLUMN     "date" TEXT NOT NULL,
ADD COLUMN     "fileId" TEXT NOT NULL,
ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL,
ALTER COLUMN "price" DROP NOT NULL;

-- DropEnum
DROP TYPE "public"."Season";

-- AddForeignKey
ALTER TABLE "Picture" ADD CONSTRAINT "Picture_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Picture" ADD CONSTRAINT "Picture_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
