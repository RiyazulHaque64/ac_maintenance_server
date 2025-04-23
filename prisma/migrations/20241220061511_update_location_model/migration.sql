/*
  Warnings:

  - You are about to drop the column `zip` on the `locations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "locations" DROP COLUMN "zip",
ADD COLUMN     "latitude" INTEGER,
ADD COLUMN     "longitude" INTEGER,
ADD COLUMN     "postal_code" TEXT;
