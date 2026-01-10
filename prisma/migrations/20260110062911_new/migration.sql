/*
  Warnings:

  - Added the required column `spotName` to the `Picture` table without a default value. This is not possible if the table is not empty.
  - Made the column `category` on table `Picture` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Picture` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Picture" ADD COLUMN     "spotName" TEXT NOT NULL,
ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;
