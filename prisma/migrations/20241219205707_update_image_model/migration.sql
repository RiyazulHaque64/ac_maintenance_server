/*
  Warnings:

  - You are about to drop the column `cloud_id` on the `Image` table. All the data in the column will be lost.
  - Added the required column `bucket_id` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "cloud_id",
ADD COLUMN     "bucket_id" TEXT NOT NULL;
