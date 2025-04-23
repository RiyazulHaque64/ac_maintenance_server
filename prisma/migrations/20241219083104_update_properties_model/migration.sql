/*
  Warnings:

  - You are about to drop the `records` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "feature_image" TEXT NOT NULL DEFAULT 'feature image',
ADD COLUMN     "slug" TEXT NOT NULL DEFAULT 'slug';

-- DropTable
DROP TABLE "records";
